# Analytics & Tracking Implementation Guide

## Overview
This document provides a complete guide to the analytics and tracking implementation for the Zellers AI Avatar campaign website. We've integrated **Google Analytics 4**, **Google Tag Manager**, and **Microsoft Clarity** to track all user interactions, conversions, and behavior patterns.

## Table of Contents
1. [Tracking Scripts](#tracking-scripts)
2. [Analytics Events](#analytics-events)
3. [Implementation Details](#implementation-details)
4. [Testing & Verification](#testing--verification)
5. [Event Reference](#event-reference)

---

## Tracking Scripts

### Installed Services
- **Google Analytics 4** - ID: `G-LQNVEZ2EHE`
- **Google Tag Manager** - ID: `GTM-56GNZXS8`
- **Microsoft Clarity** - ID: `w965vibxba`

All tracking scripts are loaded in `/app/layout.tsx` via the `TrackingScripts` component with optimal loading strategy:
- Scripts use `strategy="afterInteractive"` for non-blocking page load
- GTM noscript fallback in `<body>` tag
- All scripts properly integrated with Next.js Script component

---

## Analytics Events

### Event Categories
We track events across 11 categories:

1. **authentication** - User login, OTP verification
2. **campaign** - Campaign flow progression  
3. **avatar** - Avatar upload & generation
4. **quiz** - Quiz interactions
5. **voting** - Voting actions
6. **navigation** - Page navigation & menu interactions
7. **engagement** - Scroll depth, time on page
8. **upload** - File upload events
9. **social** - Social sharing
10. **error** - Errors and failures
11. **conversion** - Conversion milestones

---

## Implementation Details

### Core Files

#### `/lib/analytics.ts`
Main analytics utility with all tracking functions:
- `trackEvent()` - Generic event tracker
- `trackPageView()` - Page view tracking
- Category-specific trackers:
  - `trackAuth` - Authentication events
  - `trackCampaign` - Campaign flow events
  - `trackAvatar` - Avatar generation events
  - `trackQuiz` - Quiz interactions
  - `trackVoting` - Voting events
  - `trackNavigation` - Navigation events
  - `trackError` - Error tracking
  - `trackConversion` - Conversion tracking
  - `trackSSE` - Server-Sent Events tracking

#### `/lib/useAnalytics.ts`
React hooks for automatic tracking:
- `usePageTracking()` - Auto-track route changes
- `useScrollTracking()` - Track scroll depth (25%, 50%, 75%, 100%)
- `useVisibilityTracking()` - Track active tab time
- `useAnalytics()` - Combined hook for all tracking

#### `/app/components/TrackingScripts.tsx`
Next.js component containing all tracking scripts

---

## Tracked Events by Page

### Home Page (`/`)
- ✅ Page views
- ✅ Scroll depth (25%, 50%, 75%, 100%)
- ✅ Time on page
- ✅ Visibility tracking (active tab time)

### Campaign Page (`/campaign`)

#### Step 1: Verify (OTP)
- ✅ Step started
- ✅ OTP requested (WhatsApp/SMS)
- ✅ OTP verified
- ✅ OTP failed (with reason)
- ✅ Step completed
- ✅ Step abandoned (with time spent)

#### Step 2: Profile
- ✅ Step started
- ✅ Form field filled (name, displayName, gender)
- ✅ Profile created (with metadata)
- ✅ Step completed
- ✅ API errors

#### Step 3: Upload Photo
- ✅ Step started
- ✅ Upload started (with file size)
- ✅ Upload completed (with duration)
- ✅ Upload failed (with error)
- ✅ Step completed

#### Step 4: Quiz
- ✅ Quiz started
- ✅ Question answered (with question ID, answer, number)
- ✅ Quiz completed
- ✅ Quiz submitted (with selected flavor)
- ✅ Step completed

#### Avatar Generation
- ✅ Generation started (with gender)
- ✅ Generation completed (with duration)
- ✅ Generation failed (with error)
- ✅ Campaign completed (conversion event)

### Vote Page (`/vote`)
- ✅ Page viewed (with filter and page number)
- ✅ Filter changed
- ✅ Search performed (with query and results count)
- ✅ Post viewed (individual post impressions)
- ✅ Vote attempted
- ✅ Vote success (conversion event)
- ✅ Vote failed (with reason)
- ✅ OTP events (requested, verified, failed)

---

## Event Reference

### Authentication Events

```typescript
// OTP requested
trackAuth.otpRequested(phone, method: 'sms' | 'whatsapp')

// OTP verified
trackAuth.otpVerified(phone, method: 'sms' | 'whatsapp')

// OTP failed
trackAuth.otpFailed(phone, reason)

// Registration complete
trackAuth.registrationComplete(userId)
```

### Campaign Events

```typescript
// Step lifecycle
trackCampaign.stepStarted(step, userId?)
trackCampaign.stepCompleted(step, userId?)
trackCampaign.stepAbandoned(step, timeSpent, userId?)

// Form interactions
trackCampaign.formFieldFilled(field, step)

// Profile created
trackCampaign.profileCreated(userId, gender, name)
```

### Avatar Events

```typescript
// Upload tracking
trackAvatar.uploadStarted(userId, fileSize)
trackAvatar.uploadCompleted(userId, fileSize, duration)
trackAvatar.uploadFailed(userId, error)

// Generation tracking
trackAvatar.generationStarted(userId, gender)
trackAvatar.generationCompleted(userId, duration)
trackAvatar.generationFailed(userId, error)

// Status polling
trackAvatar.statusPolled(userId, attemptNumber)
```

### Quiz Events

```typescript
trackQuiz.started(userId)
trackQuiz.questionAnswered(userId, questionId, answerId, questionNumber)
trackQuiz.completed(userId, answers)
trackQuiz.submitted(userId, flavor)
```

### Voting Events

```typescript
trackVoting.pageViewed(filter, page)
trackVoting.filterChanged(filter)
trackVoting.searchPerformed(query, resultsCount)
trackVoting.postViewed(postId, postNumber)
trackVoting.voteAttempted(userId, targetPostId)
trackVoting.voteSuccess(userId, targetPostId) // Conversion
trackVoting.voteFailed(userId, targetPostId, reason)
```

### Navigation Events

```typescript
trackNavigation.menuOpened()
trackNavigation.linkClicked(linkText, href)
trackNavigation.ctaClicked(ctaText, location)
trackNavigation.scrollDepth(percentage, page)
trackNavigation.timeOnPage(seconds, page)
```

### Error Events

```typescript
trackError.apiError(endpoint, status, message)
trackError.clientError(errorType, message, stack?)
trackError.networkError(endpoint)
```

### Conversion Events

```typescript
trackConversion.campaignCompleted(userId, totalTime)
trackConversion.firstVoteCast(userId)
```

### SSE (Server-Sent Events) Tracking

```typescript
trackSSE.connectionOpened(endpoint, userId)
trackSSE.messageReceived(endpoint, messageType, userId, sequenceNumber)
trackSSE.connectionClosed(endpoint, userId, duration, messagesReceived)
trackSSE.connectionError(endpoint, userId, error)
```

---

## Testing & Verification

### Development Testing
All tracking events log to console in development mode:
```javascript
if (process.env.NODE_ENV === "development") {
  console.log("📊 Analytics Event:", { action, category, label, value, userId, metadata });
}
```

### Production Verification

#### Google Analytics 4
1. Visit [Google Analytics](https://analytics.google.com/)
2. Navigate to Reports → Realtime
3. Perform actions on the site
4. Verify events appear in real-time

#### Google Tag Manager
1. Visit [Google Tag Manager](https://tagmanager.google.com/)
2. Use Preview mode
3. Navigate through the site
4. Verify dataLayer pushes in the debugger

#### Microsoft Clarity
1. Visit [Microsoft Clarity](https://clarity.microsoft.com/)
2. View recordings and heatmaps
3. Verify user interactions are captured

### Browser DevTools Testing
```javascript
// Check if tracking is loaded
console.log(window.gtag); // Should be a function
console.log(window.dataLayer); // Should be an array
console.log(window.clarity); // Should be defined

// Manually trigger a test event
window.gtag('event', 'test_event', { test_param: 'test_value' });

// Check dataLayer contents
console.log(window.dataLayer);
```

---

## Data Structure

### Standard Event Format
```typescript
{
  action: string,           // Event name (e.g., "otp_verified")
  category: EventCategory,  // Event category
  label?: string,          // Optional label for grouping
  value?: number,          // Optional numeric value
  userId?: string,         // User identifier
  metadata?: {             // Additional custom data
    // Any relevant data
  }
}
```

### Google Analytics 4 Format
```javascript
gtag('event', action, {
  event_category: category,
  event_label: label,
  value: value,
  user_id: userId,
  ...metadata
});
```

### Google Tag Manager Format
```javascript
dataLayer.push({
  event: action,
  eventCategory: category,
  eventLabel: label,
  eventValue: value,
  userId: userId,
  timestamp: new Date().toISOString(),
  ...metadata
});
```

---

## Custom Metrics & Dimensions

### Recommended Custom Dimensions (GA4)
1. `user_id` - Unique user identifier
2. `campaign_step` - Current campaign step
3. `avatar_gender` - Selected avatar gender
4. `chocolate_flavor` - Selected chocolate flavor
5. `otp_method` - OTP delivery method (WhatsApp/SMS)
6. `post_number` - Voted post number
7. `filter_type` - Active filter on vote page

### Recommended Custom Metrics (GA4)
1. `upload_duration_ms` - Photo upload duration
2. `generation_duration_seconds` - Avatar generation time
3. `step_time_spent_seconds` - Time spent on each step
4. `file_size_kb` - Uploaded file size

---

## Best Practices

### Do's ✅
- Track all user interactions
- Include meaningful labels and metadata
- Track both success and failure states
- Use consistent naming conventions
- Track conversion events
- Monitor SSE connections for long-running operations

### Don'ts ❌
- Don't track sensitive personal information
- Don't track passwords or full phone numbers
- Don't send large objects in metadata
- Don't create duplicate events
- Don't track PII without consent

---

## Troubleshooting

### Events not appearing in GA4?
1. Check browser console for errors
2. Verify `window.gtag` is defined
3. Check GA4 real-time reports (data can take 24-48 hours for standard reports)
4. Verify the measurement ID is correct

### GTM not loading?
1. Check browser ad-blockers
2. Verify GTM container ID
3. Check browser console for script errors
4. Verify GTM container is published

### Clarity not recording?
1. Check if Clarity script loaded: `console.log(window.clarity)`
2. Verify project ID is correct
3. Check browser privacy settings
4. Sessions may take a few minutes to appear

---

## Maintenance & Updates

### Adding New Events
1. Define the event in `/lib/analytics.ts`
2. Add the tracking call at the appropriate location
3. Document the event in this file
4. Test in development mode
5. Verify in production

### Modifying Existing Events
1. Update the tracking call
2. Update this documentation
3. Test thoroughly
4. Consider backward compatibility

---

## Contact & Support

For questions or issues with analytics tracking:
- Check browser console for debug logs (development mode)
- Review this documentation
- Test in GA4 real-time reports
- Verify GTM preview mode

---

## Appendix: Full Event List

| Event Name | Category | Triggers When | Key Metadata |
|------------|----------|---------------|--------------|
| `otp_requested` | authentication | OTP sent | phone_partial, method |
| `otp_verified` | authentication | OTP verified | phone_partial, method |
| `otp_failed` | authentication | OTP verification failed | phone_partial, reason |
| `registration_complete` | authentication | User registered | userId, conversion |
| `campaign_step_started` | campaign | Step begins | step, userId |
| `campaign_step_completed` | campaign | Step finished | step, userId |
| `campaign_step_abandoned` | campaign | User leaves step | step, time_spent, userId |
| `form_field_filled` | campaign | Form field completed | field, step |
| `profile_created` | campaign | Profile saved | userId, gender, name_length |
| `avatar_upload_started` | avatar | Upload begins | userId, file_size_kb |
| `avatar_upload_completed` | avatar | Upload finishes | userId, file_size_kb, duration_ms |
| `avatar_upload_failed` | avatar | Upload fails | userId, error |
| `avatar_generation_started` | avatar | Generation begins | userId, gender |
| `avatar_generation_completed` | avatar | Generation finishes | userId, duration_seconds |
| `avatar_generation_failed` | avatar | Generation fails | userId, error |
| `avatar_status_polled` | avatar | Status checked | userId, poll_attempt |
| `quiz_started` | quiz | Quiz begins | userId |
| `quiz_question_answered` | quiz | Question answered | userId, question_id, answer_id, question_number |
| `quiz_completed` | quiz | All questions done | userId, answers |
| `quiz_submitted` | quiz | Quiz submitted | userId, selected_flavor |
| `voting_page_viewed` | voting | Vote page loaded | filter, page_number |
| `voting_filter_changed` | voting | Filter changed | filter |
| `voting_search` | voting | Search performed | query_length, results_count |
| `post_viewed` | voting | Post card visible | post_id, post_number |
| `vote_attempted` | voting | Vote button clicked | userId, target_post_id |
| `vote_success` | voting | Vote successful | userId, target_post_id, conversion |
| `vote_failed` | voting | Vote failed | userId, target_post_id, reason |
| `menu_opened` | navigation | Navigation menu opened | - |
| `link_clicked` | navigation | Link clicked | link_text, href |
| `cta_clicked` | engagement | CTA button clicked | cta_text, location |
| `scroll_depth` | engagement | Scroll milestone reached | depth_percentage, page |
| `time_on_page` | engagement | Page unload | duration_seconds, page |
| `share_attempted` | social | Share initiated | platform, content_type |
| `share_completed` | social | Share completed | platform, content_type |
| `api_error` | error | API request failed | endpoint, status_code, error_message |
| `client_error` | error | JavaScript error | error_type, error_message, stack_trace |
| `network_error` | error | Network failure | endpoint |
| `campaign_completed` | conversion | All steps done | userId, total_time_seconds |
| `first_vote_cast` | conversion | First vote milestone | userId |
| `sse_connection_opened` | engagement | SSE connection starts | endpoint, userId |
| `sse_message_received` | engagement | SSE message arrives | endpoint, message_type, sequence |
| `sse_connection_closed` | engagement | SSE connection ends | endpoint, duration_seconds, total_messages |
| `sse_connection_error` | error | SSE connection fails | endpoint, error_message |

---

**Last Updated:** April 9, 2026  
**Version:** 1.0.0
