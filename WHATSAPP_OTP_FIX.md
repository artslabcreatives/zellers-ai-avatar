# WhatsApp OTP Integration Fix - April 9, 2026

## Issue Summary

The WhatsApp OTP endpoint was returning **500 errors** with the message: `"WhatsApp API error: 404"`

### Error Details from Frontend:
```
XHR POST https://aiavuruduwithzellers.com/api/auth/send-whatsapp-otp
[HTTP/2 500  912ms]

Response:
success: false
message: "WhatsApp API error: 404"
```

## Root Cause Analysis

After investigating the backend logs and WhatsApp API configuration, three issues were identified:

### 1. **Incorrect Protocol** ❌
- **Before:** `WHATSAPP_BASE_URL=http://whatsapp.artslabcreatives.com/`
- **Issue:** Using HTTP instead of HTTPS
- **Fixed:** `WHATSAPP_BASE_URL=https://whatsapp.artslabcreatives.com`

### 2. **Wrong Instance Name** ❌
- **Before:** `WHATSAPP_INSTANCE=Nyvara`
- **Issue:** "Nyvara" is the profile name, not the instance name
- **Actual Instance:** `ArtslabInternal` (verified via API: `/instance/fetchInstances`)
- **Fixed:** `WHATSAPP_INSTANCE=ArtslabInternal`

### 3. **Double Slash in URL** ❌
- **Before:** `WHATSAPP_BASE_URL=https://whatsapp.artslabcreatives.com/`
- **Issue:** Trailing slash + code adding `/message/...` = `//message/sendText/...`
- **Error:** "Cannot POST //message/sendText/ArtslabInternal"
- **Fixed:** Removed trailing slash: `WHATSAPP_BASE_URL=https://whatsapp.artslabcreatives.com`

## Applied Fixes

### File: `/var/www/zellers-aurudu/.env`

**Changed from:**
```env
# WHATSAPP
WHATSAPP_BASE_URL=http://whatsapp.artslabcreatives.com/
WHATSAPP_INSTANCE=Nyvara
WHATSAPP_API_KEY=E39800C2B728-4D1D-89AD-C2A917F553E5
```

**Changed to:**
```env
# WHATSAPP
WHATSAPP_BASE_URL=https://whatsapp.artslabcreatives.com
WHATSAPP_INSTANCE=ArtslabInternal
WHATSAPP_API_KEY=E39800C2B728-4D1D-89AD-C2A917F553E5
```

### Backend Service Restart
```bash
pm2 restart zellers-aurudu-api
```

## Verification & Testing

### Backend Logs Showing Success:
```
[INFO] Generated new WhatsApp OTP for +94774395913
[INFO] Sending WhatsApp message to +94774395913...
[INFO] WhatsApp message sent successfully to +94774395913.
POST /auth/send-whatsapp-otp 200 1747.116 ms - 64
```

### API Response (Success):
```json
{
  "success": true,
  "message": "OTP sent via WhatsApp successfully."
}
```

### Fallback Mechanism Working:
When a number is not registered on WhatsApp, the system correctly falls back to SMS:
```
[INFO] Fallback: Number +94771234567 not on WhatsApp, sending SMS instead.
[INFO] SMS processed successfully for +94771234567
POST /auth/send-whatsapp-otp 200 1274.403 ms - 349
```

## WhatsApp API Details

- **API Platform:** Evolution API v2.3.7
- **Endpoint:** `https://whatsapp.artslabcreatives.com/message/sendText/{instance}`
- **Instance Status:** `ArtslabInternal` - Connection: Open
- **Profile Name:** Nyvara
- **Connected Number:** +94789210953

## Testing Commands

### Direct Backend API Test:
```bash
curl -X POST "https://api.aiavuruduwithzellers.com/auth/send-whatsapp-otp" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+94774395913"}'
```

### Frontend API Proxy Test:
```bash
curl -X POST "https://aiavuruduwithzellers.com/api/auth/send-whatsapp-otp" \
  -H "Content-Type: application/json" \
  -d '{"phone": "+94774395913"}'
```

### WhatsApp API Direct Test:
```bash
curl -X POST "https://whatsapp.artslabcreatives.com/message/sendText/ArtslabInternal" \
  -H "Content-Type: application/json" \
  -H "apikey: E39800C2B728-4D1D-89AD-C2A917F553E5" \
  -d '{"number": "+94774395913", "text": "Your OTP is 123456"}'
```

## Rate Limiting

The OTP system includes built-in rate limiting:
- **Cooldown Period:** 30 seconds between requests per phone number
- **Response:** HTTP 429 (Too Many Requests)
- **Message:** "Please wait X seconds before requesting a new OTP."

This is working as expected and prevents OTP abuse.

## Integration Status

✅ **WORKING:** WhatsApp OTP endpoint  
✅ **WORKING:** SMS fallback for non-WhatsApp numbers  
✅ **WORKING:** Frontend → Backend API proxy  
✅ **WORKING:** Rate limiting protection  
✅ **WORKING:** OTP verification flow  

## Next Steps

The WhatsApp OTP integration is now fully functional. Users can:

1. Request OTP via WhatsApp on the frontend
2. System automatically sends via WhatsApp if number is registered
3. Falls back to SMS if number is not on WhatsApp
4. OTP can be verified through `/api/auth/verify-otp`
5. Rate limiting protects against abuse

## Additional Notes

- The WhatsApp instance may occasionally disconnect and require re-authentication
- Check instance status: `https://whatsapp.artslabcreatives.com/instance/fetchInstances`
- Monitor logs: `pm2 logs zellers-aurudu-api`
- The system gracefully handles both WhatsApp and SMS delivery

---

**Issue Resolved:** April 9, 2026, 22:15 UTC  
**Services Restarted:** zellers-aurudu-api (PM2)  
**Status:** ✅ Fully Operational
