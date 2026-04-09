# Server-Sent Events (SSE) Tracking Example

This guide shows how to implement SSE tracking for real-time avatar generation monitoring.

## Use Case: Avatar Generation with SSE

When users generate their AI avatar, the process can take 30-120 seconds. We use Server-Sent Events to provide real-time updates and track the entire process.

## Implementation Example

### Client-Side: Tracking SSE Connection

```typescript
import { trackSSE, trackAvatar } from '@/lib/analytics';

async function generateAvatarWithSSE(userId: string, gender: string) {
  const eventSource = new EventSource(`/api/avatar/generate-stream?userId=${userId}`);
  
  let messageCount = 0;
  let connStartTime = Date.now();
  
  // Track connection opened
  trackSSE.connectionOpened('/api/avatar/generate-stream', userId);
  trackAvatar.generationStarted(userId, gender);
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    messageCount++;
    
    // Track each message received
    trackSSE.messageReceived(
      '/api/avatar/generate-stream',
      data.type,
      userId,
      messageCount
    );
    
    // Handle different message types
    switch (data.type) {
      case 'progress':
        // Update UI with progress
        console.log(`Progress: ${data.progress}%`);
        break;
        
      case 'complete':
        // Avatar generation complete
        const duration = Math.round((Date.now() - connStartTime) / 1000);
        trackAvatar.generationCompleted(userId, duration);
        
        // Close connection
        eventSource.close();
        trackSSE.connectionClosed(
          '/api/avatar/generate-stream',
          userId,
          duration,
          messageCount
        );
        break;
        
      case 'error':
        trackAvatar.generationFailed(userId, data.message);
        trackSSE.connectionError(
          '/api/avatar/generate-stream',
          userId,
          data.message
        );
        eventSource.close();
        break;
    }
  };
  
  eventSource.onerror = (error) => {
    const duration = Math.round((Date.now() - connStartTime) / 1000);
    
    trackSSE.connectionError(
      '/api/avatar/generate-stream',
      userId,
      'Connection error'
    );
    
    trackSSE.connectionClosed(
      '/api/avatar/generate-stream',
      userId,
      duration,
      messageCount
    );
    
    eventSource.close();
  };
}
```

## Server-Side: SSE Endpoint Example

```typescript
// /api/avatar/generate-stream/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'start', message: 'Starting generation' })}\n\n`)
        );
        
        // Simulate avatar generation steps
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'progress', 
              progress: i,
              message: `Generating avatar... ${i}%`
            })}\n\n`)
          );
        }
        
        // Send completion message
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'complete', 
            avatarUrl: 'https://example.com/avatar.png',
            message: 'Avatar generated successfully'
          })}\n\n`)
        );
        
        controller.close();
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            message: error.message 
          })}\n\n`)
        );
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## React Component Example

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { trackSSE, trackAvatar } from '@/lib/analytics';

export default function AvatarGenerationWithSSE({ userId, gender }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const eventSourceRef = useRef<EventSource | null>(null);
  const messageCountRef = useRef(0);
  const startTimeRef = useRef(0);
  
  useEffect(() => {
    if (status !== 'generating') return;
    
    const eventSource = new EventSource(`/api/avatar/generate-stream?userId=${userId}`);
    eventSourceRef.current = eventSource;
    startTimeRef.current = Date.now();
    messageCountRef.current = 0;
    
    // Track connection opened
    trackSSE.connectionOpened('/api/avatar/generate-stream', userId);
    trackAvatar.generationStarted(userId, gender);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messageCountRef.current++;
      
      // Track each message
      trackSSE.messageReceived(
        '/api/avatar/generate-stream',
        data.type,
        userId,
        messageCountRef.current
      );
      
      if (data.type === 'progress') {
        setProgress(data.progress);
      } else if (data.type === 'complete') {
        setStatus('complete');
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        trackAvatar.generationCompleted(userId, duration);
        trackSSE.connectionClosed(
          '/api/avatar/generate-stream',
          userId,
          duration,
          messageCountRef.current
        );
        
        eventSource.close();
      } else if (data.type === 'error') {
        setStatus('error');
        
        trackAvatar.generationFailed(userId, data.message);
        trackSSE.connectionError('/api/avatar/generate-stream', userId, data.message);
        
        eventSource.close();
      }
    };
    
    eventSource.onerror = () => {
      setStatus('error');
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      
      trackSSE.connectionError('/api/avatar/generate-stream', userId, 'Connection failed');
      trackSSE.connectionClosed(
        '/api/avatar/generate-stream',
        userId,
        duration,
        messageCountRef.current
      );
      
      eventSource.close();
    };
    
    return () => {
      if (eventSource.readyState !== EventSource.CLOSED) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        trackSSE.connectionClosed(
          '/api/avatar/generate-stream',
          userId,
          duration,
          messageCountRef.current
        );
        eventSource.close();
      }
    };
  }, [status, userId, gender]);
  
  return (
    <div>
      {status === 'idle' && (
        <button onClick={() => setStatus('generating')}>
          Generate Avatar
        </button>
      )}
      
      {status === 'generating' && (
        <div>
          <p>Generating... {progress}%</p>
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      
      {status === 'complete' && (
        <p>Avatar generated successfully!</p>
      )}
      
      {status === 'error' && (
        <p>Generation failed. Please try again.</p>
      )}
    </div>
  );
}
```

## Analytics Data Captured

### Connection Lifecycle
1. **Connection Opened**
   - Endpoint: `/api/avatar/generate-stream`
   - User ID
   - Timestamp

2. **Messages Received**
   - Message type (progress, complete, error)
   - Sequence number (1, 2, 3...)
   - User ID
   - Metadata per message type

3. **Connection Closed**
   - Total duration (seconds)
   - Total messages received
   - User ID
   - Reason (complete, error, or cleanup)

### Example GA4 Events

```javascript
// Connection opened
{
  event: 'sse_connection_opened',
  eventCategory: 'engagement',
  eventLabel: '/api/avatar/generate-stream',
  userId: 'user_123',
  metadata: {
    connection_type: 'sse',
    timestamp: '2026-04-09T10:30:00.000Z'
  }
}

// Progress message received
{
  event: 'sse_message_received',
  eventCategory: 'engagement',
  eventLabel: '/api/avatar/generate-stream_progress',
  userId: 'user_123',
  metadata: {
    message_type: 'progress',
    sequence: 5,
    connection_type: 'sse',
    progress: 50
  }
}

// Connection closed
{
  event: 'sse_connection_closed',
  eventCategory: 'engagement',
  eventLabel: '/api/avatar/generate-stream',
  userId: 'user_123',
  value: 45, // duration in seconds
  metadata: {
    duration_seconds: 45,
    total_messages: 12,
    connection_type: 'sse'
  }
}
```

## Using SSE Tracking for Other Features

### Real-time Voting Updates
```typescript
trackSSE.connectionOpened('/api/votes/live-updates', userId);
// ... handle vote count updates
trackSSE.messageReceived('/api/votes/live-updates', 'vote_update', userId, msgNum);
```

### Live Leaderboard
```typescript
trackSSE.connectionOpened('/api/leaderboard/stream', userId);
// ... handle leaderboard changes
trackSSE.messageReceived('/api/leaderboard/stream', 'rank_change', userId, msgNum);
```

### Admin Dashboard Real-time Stats
```typescript
trackSSE.connectionOpened('/api/admin/stats-stream', adminUserId);
// ... handle stat updates
trackSSE.messageReceived('/api/admin/stats-stream', 'stats_update', adminUserId, msgNum);
```

## Benefits of SSE Tracking

1. **User Experience Insights**
   - Average generation time
   - Success vs failure rates
   - Connection stability

2. **Technical Monitoring**
   - Server performance
   - Connection duration patterns
   - Error frequency and types

3. **Performance Optimization**
   - Identify slow generation steps
   - Detect connection issues
   - Monitor message throughput

4. **Business Metrics**
   - Completion rates
   - User engagement during waits
   - Impact on conversions

## Analyzing SSE Data in GA4

### Custom Reports
1. **Generation Performance**
   - Average duration by user segment
   - Success rate over time
   - Message count distribution

2. **Connection Quality**
   - Error rate trends
   - Connection drop patterns
   - Reconnection attempts

3. **User Behavior**
   - Engagement during generation
   - Abandonment at different progress points
   - Retry patterns after failures

---

**Note:** All SSE tracking is already implemented in `/lib/analytics.ts`. Simply import and use as shown in the examples above.
