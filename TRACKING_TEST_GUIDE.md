# 📊 Tracking Testing Guide

## ✅ Will Tracking Work on Localhost/Vercel?

**YES!** All tracking scripts will work on:
- ✅ **Localhost** (http://localhost:5173)
- ✅ **Vercel Preview** (your-preview-url.vercel.app)
- ✅ **Production** (your-live-domain.com)

## 🧪 How to Test Tracking

### 1. **Check Browser Console (Easiest Method)**

When you load any page, you should see console messages like:
```
🚀 Initializing all tracking scripts...
📍 Current URL: http://localhost:5173/
✅ Facebook Pixel initialized and PageView tracked
📊 Facebook Pixel ID: 3570049643299661
✅ Microsoft Clarity initialized
📊 Clarity Project ID: q4i8nxllpb
✅ Google Analytics initialized
📊 Google Analytics ID: G-YTY8FXJJJ0
✅ All tracking scripts initialized
```

### 2. **Check Network Tab**

1. Open **DevTools** (F12)
2. Go to **Network** tab
3. Filter by "facebook" or "clarity" or "google"
4. You should see requests to:
   - `connect.facebook.net` (Facebook Pixel)
   - `clarity.ms` (Microsoft Clarity)
   - `googletagmanager.com` (Google Analytics)

### 3. **Verify Tracking Objects**

Open browser console and type:
```javascript
// Check if tracking is loaded
window.fbq        // Should show function (Facebook Pixel)
window.clarity    // Should show function (Clarity)
window.gtag       // Should show function (Google Analytics & Google Ads)
window.dataLayer  // Should show array (Google Analytics & Google Ads)
```

### 4. **Test Lead Event**

1. Fill out the reservation form
2. Submit it
3. Check console for: `🎯 Facebook Pixel: Lead event tracked`

### 5. **Use Browser Extensions**

Install these browser extensions to verify:
- **Facebook Pixel Helper** (Chrome/Firefox)
- **Google Tag Assistant** (Chrome)
- **Microsoft Clarity** (shows in Clarity dashboard)

## 🔍 What to Look For

### ✅ **Working Correctly:**
- Console shows initialization messages
- Network tab shows tracking requests
- No errors in console
- Tracking objects exist in window

### ⚠️ **Potential Issues:**
- Ad blockers may block tracking (this is normal)
- Some browsers block third-party scripts
- Check if scripts are loading in Network tab

## 📝 Notes

1. **Development Mode**: Console logs are enabled in development mode automatically
2. **Production Mode**: Logs are disabled, but tracking still works
3. **Ad Blockers**: May block tracking - this is expected behavior
4. **Data Collection**: 
   - Facebook Pixel: Check Facebook Events Manager
   - Google Analytics: Check Google Analytics dashboard
   - Google Ads: Check Google Ads conversion tracking
   - Clarity: Check Microsoft Clarity dashboard

## 🚀 Testing on Vercel

1. Push your code to GitHub
2. Vercel will auto-deploy
3. Visit your Vercel preview URL
4. Check console and Network tab (same as localhost)
5. All tracking will work the same way!

## 💡 Quick Verification Script

You can also add this to any page temporarily to verify:

```javascript
// In browser console
import { verifyTracking } from './utils/tracking'
verifyTracking()
```

This will show you the status of all tracking scripts.

