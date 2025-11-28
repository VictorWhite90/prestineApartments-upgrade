# 🔧 Environment Variable Troubleshooting

If you see "Missing Firebase environment variables" or "invalid-api-key" errors, follow these steps.

---

## 🚨 **Error: "Missing Firebase environment variables!"**

### **If Testing Locally:**

1. **Create `.env.local` file** in project root:
   ```
   prestine-apartments/react-prestine-apartments/.env.local
   ```

2. **Add these values:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyAXC5dIeiiVyzU67SOwouiey55oRjNYiXA
   VITE_FIREBASE_AUTH_DOMAIN=prestine-apartment-db.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=prestine-apartment-db
   VITE_FIREBASE_STORAGE_BUCKET=prestine-apartment-db.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=663731777064
   VITE_FIREBASE_APP_ID=1:663731777064:web:dc8af8f7c472d694894f1d
   VITE_FIREBASE_MEASUREMENT_ID=G-SFKKGNX0QQ
   ```

3. **Restart dev server:**
   ```powershell
   # Stop server (Ctrl+C)
   npm run dev
   ```
   ⚠️ **Important:** Environment variables are only loaded when the server starts!

---

## 🌐 **If Testing on Vercel (Production):**

### **Step 1: Verify Variables Are Set**

1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Check that all 12 variables are listed
4. Verify each has correct value

### **Step 2: Check Variable Names**

Make sure ALL keys start with `VITE_`:
- ✅ `VITE_FIREBASE_API_KEY` (correct)
- ❌ `FIREBASE_API_KEY` (wrong - missing VITE_)

### **Step 3: Redeploy After Adding Variables**

**This is the most common issue!**

Environment variables are only loaded during build time. After adding/changing variables:

1. Go to **Deployments** tab
2. Click **three dots (⋮)** on latest deployment
3. Click **"Redeploy"**
4. Wait for build to complete

**OR** make a small code change and push:
```powershell
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

---

## 🔍 **How to Check If Variables Are Loading**

### **Method 1: Check Browser Console**

1. Open your site
2. Press `F12` (Developer Tools)
3. Go to **Console** tab
4. Look for warnings about environment variables
5. The code now shows which variables are detected

### **Method 2: Check Network Tab**

1. Open Developer Tools
2. Go to **Network** tab
3. Refresh page
4. Look for Firebase initialization requests
5. Check if they succeed or fail

### **Method 3: Check Build Logs (Vercel)**

1. Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check **Build Logs**
4. Look for environment variable warnings

---

## ✅ **Quick Fix Checklist**

- [ ] Created `.env.local` file (for local development)
- [ ] Added all 12 variables to Vercel (for production)
- [ ] All variable names start with `VITE_`
- [ ] Restarted dev server after creating `.env.local`
- [ ] Redeployed on Vercel after adding variables
- [ ] Checked browser console for errors
- [ ] Verified values are correct (no typos)

---

## 🐛 **Common Issues**

### **Issue 1: Variables work locally but not on Vercel**

**Cause:** Variables not set in Vercel OR not redeployed

**Fix:**
1. Double-check all variables in Vercel Dashboard
2. Make sure all keys start with `VITE_`
3. Redeploy (most important!)

### **Issue 2: "Invalid API Key" error**

**Cause:** 
- Variable is `undefined` or empty
- Wrong API key value
- Variable not loaded

**Fix:**
1. Check if variable value is correct in Vercel
2. Make sure no extra spaces in value
3. Redeploy after fixing

### **Issue 3: Variables set but still undefined**

**Cause:** 
- Dev server not restarted (local)
- Not redeployed (Vercel)
- Variable name typo

**Fix:**
1. Restart dev server (local)
2. Redeploy (Vercel)
3. Check for typos in variable names

---

## 🔄 **Current Status**

The code now has **fallback values** built-in. This means:
- ✅ App will work even if env vars aren't set (uses fallbacks)
- ⚠️ You'll see a warning in console
- ✅ Production should still use Vercel env vars (after redeploy)

---

## 📝 **Testing After Fix**

1. **Local:** Restart server and check console
2. **Vercel:** Redeploy and test live site
3. Check browser console - should NOT see warnings if env vars are loaded

---

## 🆘 **Still Not Working?**

If variables still don't work:

1. **Check Vercel Build Logs:**
   - Look for environment variable output
   - Check if build is using env vars

2. **Verify Vercel Settings:**
   - Settings → Environment Variables
   - Check "Environments" dropdown is "All Environments"

3. **Clear Cache:**
   - Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear browser cache
   - Test in incognito mode

---

## ✅ **Once Fixed**

After environment variables are working:
- Console should show no warnings
- Firebase should initialize successfully
- Booking form should work
- Admin panel should connect to Firestore

