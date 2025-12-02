# 🔐 Complete Admin Panel Setup Guide - Step by Step

Full guide to get your admin panel working on Vercel deployment.

---

## 🎯 **Your Deployed Site**
**URL:** https://prestine-apartments-upgrade.vercel.app/

---

## 📋 **Step 1: Verify Environment Variables on Vercel**

### **Check if variables are set:**

1. Go to: https://vercel.com/dashboard
2. Click on your project: **prestine-apartments-upgrade**
3. Go to **Settings** → **Environment Variables**
4. Verify you have these **12 variables**:

```
✅ VITE_FIREBASE_API_KEY
✅ VITE_FIREBASE_AUTH_DOMAIN
✅ VITE_FIREBASE_PROJECT_ID
✅ VITE_FIREBASE_STORAGE_BUCKET
✅ VITE_FIREBASE_MESSAGING_SENDER_ID
✅ VITE_FIREBASE_APP_ID
✅ VITE_FIREBASE_MEASUREMENT_ID
✅ VITE_EMAILJS_SERVICE_ID
✅ VITE_EMAILJS_TEMPLATE_ID_CLIENT
✅ VITE_EMAILJS_TEMPLATE_ID_COMPANY
✅ VITE_EMAILJS_PUBLIC_KEY
✅ VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION
```

5. **If missing, add them** (see `VERCEL_ENV_VARIABLES_STEPS.md`)

### **After adding/verifying variables:**

1. Go to **Deployments** tab
2. Click **three dots (⋮)** on latest deployment
3. Click **"Redeploy"**
4. **Wait for build to complete** (2-3 minutes)

---

## 👤 **Step 2: Create Admin User in Firebase**

### **Create the user account:**

1. Go to: https://console.firebase.google.com/
2. Select project: **prestine-apartment-db**
3. Go to **Authentication** → **Users** tab
4. Click **"Add user"** button
5. Enter:
   - **Email:** `admin@prestineapartments.com` (or your email)
   - **Password:** Create a strong password
   - **Uncheck:** "Send password reset email"
6. Click **"Add user"**
7. **Copy the User UID** (you'll need this next)

---

## 🔑 **Step 3: Set Admin Custom Claims**

You need to run the `setAdmin.js` script locally to grant admin access.

### **Option A: Using setAdmin.js Script (Easiest)**

1. **Download Service Account Key:**

   - Firebase Console → Project Settings (⚙️ icon)
   - Go to **Service Accounts** tab
   - Click **"Generate new private key"**
   - Click **"Generate key"** in popup
   - Save the downloaded JSON file
   - **Rename it to:** `serviceAccountKey.json`

2. **Place the file in your project:**

   ```
   prestine-apartments/react-prestine-apartments/serviceAccountKey.json
   ```

3. **Install Firebase Admin SDK** (if not already installed):

   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   npm install firebase-admin
   ```

4. **Update setAdmin.js with your User UID:**

   - Open `setAdmin.js`
   - Find line: `const USER_UID = 'USER_UID_HERE';`
   - Replace with: `const USER_UID = 'your-actual-uid-from-step-2';`

5. **Run the script:**

   ```powershell
   node setAdmin.js
   ```

6. **You should see:**
   ```
   ✅ SUCCESS! Admin status granted to user: [your-uid]
   ```

7. **Delete the service account key** (for security):

   ```powershell
   del serviceAccountKey.json
   ```

### **Option B: Using Firebase Console (Alternative)**

This method doesn't work directly, but you can verify the claims were set:

1. Firebase Console → Authentication → Users
2. Click on your admin user
3. Check "Custom claims" section
4. Should show: `{ "admin": true }`

---

## 🔍 **Step 4: Verify Firebase Configuration**

### **Check if Firebase is connecting:**

1. Open your deployed site: https://prestine-apartments-upgrade.vercel.app/
2. Press `F12` (open Developer Tools)
3. Go to **Console** tab
4. Look for:
   - ✅ **No errors** about Firebase
   - ✅ **No warnings** about missing environment variables
   - ❌ If you see errors, Firebase isn't connecting

### **If Firebase errors appear:**

1. Check Vercel environment variables are set correctly
2. Make sure you redeployed after adding variables
3. Check browser console for specific error messages

---

## 🔐 **Step 5: Test Admin Login**

### **Login Steps:**

1. Go to: https://prestine-apartments-upgrade.vercel.app/#/admin/login

2. **Enter credentials:**
   - Email: Your admin email (from Step 2)
   - Password: Your admin password

3. **Click "Sign In"**

4. **What should happen:**
   - ✅ Redirects to: `/#/admin`
   - ✅ Shows admin dashboard with bookings
   - ✅ No "Access Denied" message

### **If login fails:**

**Check browser console (F12 → Console) for errors:**

- `auth/user-not-found` → User doesn't exist in Firebase
- `auth/wrong-password` → Wrong password
- `auth/invalid-email` → Email format is wrong
- `auth/network-request-failed` → Firebase not connecting (check env vars)

---

## 🚨 **Step 6: Troubleshooting Common Issues**

### **Issue 1: "Access Denied" After Login**

**Cause:** Admin custom claims not set

**Fix:**
1. Go back to Step 3 and run `setAdmin.js` script
2. Make sure you used the correct User UID
3. Log out completely
4. Log back in at `/#/admin/login`

### **Issue 2: Login Page Shows but Login Doesn't Work**

**Check these:**

1. **Open Browser Console (F12):**
   - Look for Firebase errors
   - Check Network tab → Filter "firebase" → See if requests are failing

2. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure all 12 variables are there
   - Values are correct (no typos)

3. **Test Firebase Connection:**
   - Go to: https://prestine-apartments-upgrade.vercel.app/
   - Open Console
   - Type: `import.meta.env`
   - Press Enter
   - Check if `VITE_FIREBASE_*` variables are listed

### **Issue 3: Shows Home Page Instead of Admin Dashboard**

**This is what you're experiencing!**

**Possible causes:**

1. **Not logged in:**
   - Check if you're actually logged in
   - Try going directly to: `/#/admin/login`
   - Enter credentials and login

2. **Admin claims not set:**
   - Run `setAdmin.js` script (Step 3)
   - Make sure it succeeds
   - Log out and log back in

3. **Firebase not initialized:**
   - Check browser console for errors
   - Verify environment variables in Vercel
   - Redeploy after adding variables

4. **Wrong URL:**
   - Make sure URL is: `/#/admin/login` (with `#`)
   - HashRouter requires the `#` in URL

### **Issue 4: No Errors in Console but Nothing Happens**

**Debug Steps:**

1. **Add console logs** to see what's happening:

   Open browser console and type:
   ```javascript
   // Check Firebase config
   console.log('Firebase Config:', {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'Set' : 'Missing'
   })
   ```

2. **Check if Firebase is loaded:**
   ```javascript
   // In browser console
   import('@/config/firebase').then(f => console.log('Firebase:', f))
   ```

3. **Check authentication state:**
   - After logging in, check console for auth state changes
   - Look for Firebase auth events

---

## 🔄 **Step 7: Complete Reset (If Nothing Works)**

### **Full Reset Steps:**

1. **Clear everything:**
   - Log out of Firebase (if logged in)
   - Clear browser cache
   - Clear cookies for the domain

2. **Verify Firebase User exists:**
   - Firebase Console → Authentication → Users
   - Confirm your admin user is there

3. **Re-run setAdmin.js:**
   - Get fresh service account key
   - Update USER_UID in script
   - Run: `node setAdmin.js`
   - Verify success message

4. **Verify Environment Variables:**
   - Check all 12 variables in Vercel
   - Redeploy if needed

5. **Fresh Login:**
   - Go to: `/#/admin/login`
   - Enter credentials
   - Check console for errors
   - Should redirect to dashboard

---

## ✅ **Step 8: Verify Everything Works**

### **Success Checklist:**

After completing all steps, verify:

- [ ] Can access login page: `/#/admin/login`
- [ ] Can log in with admin credentials
- [ ] Redirects to admin dashboard: `/#/admin`
- [ ] Dashboard shows bookings table
- [ ] No "Access Denied" message
- [ ] No errors in browser console
- [ ] Can see stats cards (Apartments, Pending, Confirmed)
- [ ] Search/filter works
- [ ] Can confirm/cancel bookings

---

## 🌐 **Final Admin URLs**

### **Production URLs:**

- **Main Site:** https://prestine-apartments-upgrade.vercel.app/
- **Admin Login:** https://prestine-apartments-upgrade.vercel.app/#/admin/login
- **Admin Dashboard:** https://prestine-apartments-upgrade.vercel.app/#/admin
- **Policies:** https://prestine-apartments-upgrade.vercel.app/#/policies

---

## 📞 **Still Not Working?**

### **Debug Information to Check:**

1. **Browser Console Errors:**
   - Open F12 → Console
   - Copy all errors
   - Check for Firebase-related errors

2. **Network Tab:**
   - F12 → Network
   - Filter: "firebase"
   - Check if requests are failing
   - Look for 401/403 errors

3. **Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Screenshot or list all variables
   - Verify they all start with `VITE_`

4. **Firebase Console:**
   - Authentication → Users
   - Check if admin user exists
   - Check if custom claims are set

---

## 🎉 **Quick Test**

To quickly test if everything is set up:

1. Go to: https://prestine-apartments-upgrade.vercel.app/#/admin/login
2. Open Browser Console (F12)
3. Enter email and password
4. Click "Sign In"
5. Watch console for any errors
6. Check if you're redirected to dashboard

**If you see errors in console, share them and I'll help fix!**

---

## 📚 **Related Documentation**

- `VERCEL_ENV_VARIABLES_STEPS.md` - How to add env vars
- `ADMIN_SETUP.md` - Admin setup details
- `ENV_VARIABLE_TROUBLESHOOTING.md` - Environment variable issues


