# 🚀 Quick Start Guide - Analytics Tracking

## Verify Installation

### 1. Check Browser Console (Development Mode)
Open browser DevTools console and you should see tracking events logged:
```
📊 Analytics Event: { action: "page_view", category: "engagement", ... }
```

### 2. Check Tracking Scripts Loaded
In browser console:
```javascript
// All should return "function" or "object"
typeof window.gtag          // "function"
typeof window.dataLayer     // "object"
typeof window.clarity       // "function"
```

### 3. View DataLayer
```javascript
console.log(window.dataLayer);
// Should show array of events
```

---

## Test Analytics in Production

### Google Analytics 4
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select property with ID: `G-LQNVEZ2EHE`
3. Navigate to **Reports → Realtime**
4. Perform actions on your site
5. See events appear in real-time (within seconds)

### Google Tag Manager
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Open workspace for container: `GTM-56GNZXS8`
3. Click **Preview** button
4. Enter your website URL
5. Navigate and see events in the Tag Assistant

### Microsoft Clarity
1. Go to [Microsoft Clarity](https://clarity.microsoft.com/)
2. Find project: `w965vibxba`
3. View **Recordings** tab
4. See user sessions (may take a few minutes)

---

## Common Events to Test

### Test Campaign Flow
1. Visit `/campaign`
   - ✅ Should track: `campaign_step_started` (step: verify)
2. Enter phone and send OTP
   - ✅ Should track: `otp_requested`
3. Enter OTP and verify
   - ✅ Should track: `otp_verified`, `campaign_step_completed`
4. Fill profile form
   - ✅ Should track: `form_field_filled` (3 times)
5. Submit profile
   - ✅ Should track: `profile_created`, `campaign_step_completed`
6. Upload photo
   - ✅ Should track: `avatar_upload_started`, `avatar_upload_completed`
7. Answer quiz questions
   - ✅ Should track: `quiz_question_answered` (3 times)
8. Submit quiz
   - ✅ Should track: `quiz_submitted`, `avatar_generation_started`, `campaign_completed`

### Test Voting
1. Visit `/vote`
   - ✅ Should track: `voting_page_viewed`
2. Change filter
   - ✅ Should track: `voting_filter_changed`
3. Search for a post
   - ✅ Should track: `voting_search`
4. Click vote button
   - ✅ Should track: `vote_attempted`, `otp_requested`, etc.

### Test Scroll/Time Tracking
1. Visit any page
2. Scroll to 25% of page
   - ✅ Should track: `scroll_depth` (25)
3. Scroll to 50%
   - ✅ Should track: `scroll_depth` (50)
4. Leave page after 30 seconds
   - ✅ Should track: `time_on_page` (30)

---

## Debugging

### Event Not Showing?

1. **Check Console**
   ```javascript
   // In development, you should see:
   📊 Analytics Event: {...}
   ```

2. **Check DataLayer**
   ```javascript
   console.log(window.dataLayer);
   // Look for your event
   ```

3. **Check GA4 Real-time**
   - May take 5-10 seconds to appear
   - Check correct property ID

4. **Check Ad Blockers**
   - Disable ad blockers
   - Disable privacy extensions

5. **Check Browser Privacy Settings**
   - Allow tracking
   - Clear cache and reload

### Script Not Loading?

1. **Check Network Tab**
   - Look for `gtag/js` request
   - Look for `gtm.js` request
   - Look for `clarity.ms/tag` request

2. **Check Console for Errors**
   - Any JavaScript errors?
   - Any CSP (Content Security Policy) errors?

3. **Verify IDs**
   - GA4: `G-LQNVEZ2EHE`
   - GTM: `GTM-56GNZXS8`
   - Clarity: `w965vibxba`

---

## Manual Testing Commands

### Test Individual Events (Browser Console)

```javascript
// Import is already done, just test directly:

// Test page view
window.gtag('event', 'page_view', { page_path: '/test' });

// Test custom event
window.gtag('event', 'test_event', {
  event_category: 'test',
  event_label: 'manual_test',
  value: 1
});

// Check dataLayer
window.dataLayer.push({
  event: 'test_event',
  customParam: 'test_value'
});

// View all events
console.table(window.dataLayer);
```

---

## Expected Event Flow

### New User Journey
1. `page_view` (home)
2. `scroll_depth` (25, 50, 75, 100)
3. `cta_clicked` ("Get Started" or similar)
4. `page_view` (campaign)
5. `campaign_step_started` (verify)
6. `otp_requested`
7. `otp_verified`
8. `campaign_step_completed` (verify)
9. `campaign_step_started` (profile)
10. `form_field_filled` (x3)
11. `profile_created`
12. `campaign_step_completed` (profile)
13. `campaign_step_started` (upload)
14. `avatar_upload_started`
15. `avatar_upload_completed`
16. `campaign_step_completed` (upload)
17. `campaign_step_started` (quiz)
18. `quiz_started`
19. `quiz_question_answered` (x3)
20. `quiz_submitted`
21. `avatar_generation_started`
22. `avatar_generation_completed`
23. `campaign_completed` ← **CONVERSION**
24. `page_view` (vote)
25. `voting_page_viewed`
26. `post_viewed` (multiple)
27. `vote_attempted`
28. `vote_success` ← **CONVERSION**

### Total Events: ~28+ per complete user journey

---

## Quick Fixes

### Events not tracking in Campaign page?
- Check `/app/campaign/page.tsx` line 1-10
- Verify imports exist:
  ```typescript
  import { trackAuth, trackCampaign, trackAvatar, trackQuiz } from '@/lib/analytics';
  ```

### Events not tracking in Vote page?
- Check `/app/vote/page.tsx` line 1-10
- Verify imports exist:
  ```typescript
  import { trackVoting, trackAuth } from '@/lib/analytics';
  ```

### Page views not tracking?
- Check each page has:
  ```typescript
  "use client";
  import { useAnalytics } from '@/lib/useAnalytics';
  
  export default function Page() {
    useAnalytics('page-name');
    // ...
  }
  ```

---

## Performance Check

### Scripts Should Load After Interactive
- Check Network tab waterfall
- Scripts should load after main content
- Load time: ~200-500ms per script
- Total overhead: <1MB

### No Layout Shift
- Scripts use `strategy="afterInteractive"`
- Should not block rendering
- Core Web Vitals should remain good

---

## Production Checklist

- [ ] GA4 receiving events in real-time
- [ ] GTM dataLayer populating correctly
- [ ] Clarity recording sessions
- [ ] No console errors
- [ ] No ad-blocker warnings to users
- [ ] Privacy policy updated (if needed)
- [ ] Cookie consent implemented (if needed)
- [ ] Custom dimensions configured in GA4
- [ ] Conversion goals set up
- [ ] Funnels created for campaign flow

---

## Support Resources

### Documentation
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete overview
- [ANALYTICS_IMPLEMENTATION.md](./ANALYTICS_IMPLEMENTATION.md) - Detailed guide
- [ANALYTICS_CHECKLIST.md](./ANALYTICS_CHECKLIST.md) - Task checklist
- [SSE_TRACKING_GUIDE.md](./SSE_TRACKING_GUIDE.md) - SSE examples

### External Resources
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GTM Documentation](https://support.google.com/tagmanager)
- [Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)

---

## Emergency Disable

If you need to temporarily disable tracking:

### Option 1: Environment Variable
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Option 2: Comment Out Scripts
In `/app/layout.tsx`, comment out:
```typescript
// <TrackingScripts />
```

### Option 3: Remove from Build
Delete or rename:
- `/app/components/TrackingScripts.tsx`

---

**Quick Start complete!** 🎉

Start testing with `/campaign` page for the full event flow.
