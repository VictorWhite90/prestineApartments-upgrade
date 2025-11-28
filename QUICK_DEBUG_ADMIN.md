# 🔍 Quick Debug: Admin Login Not Working

Fast troubleshooting steps for your specific issue.

---

## 🎯 **Your Issue:**
- Site deployed: ✅ https://prestine-apartments-upgrade.vercel.app/
- Environment variables set: ✅
- Login not working: ❌
- No console errors: ❌
- Shows home page instead of admin: ❌

---

## ⚡ **Quick Checks (Do These First!)**

### **1. Check if Firebase is Actually Connecting**

Open your site and browser console (F12), then run:

```javascript
// In browser console, type this:
console.log('Env vars:', {
  hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasProjectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
  allVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
})
```

**What you should see:**
- `hasApiKey: true`
- `hasProjectId: true`
- `allVars: ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', ...]` (12 variables)

**If you see:**
- `hasApiKey: false` → Environment variables not loading (redeploy needed)
- `allVars: []` → No variables detected (check Vercel settings)

### **2. Test Direct Login URL**

Try accessing the login page directly:

```
https://prestine-apartments-upgrade.vercel.app/#/admin/login
```

**Does it show:**
- ✅ Login form? → Good, routing works
- ❌ Home page? → Routing issue
- ❌ Blank page? → Build/loading issue

### **3. Check if You Have an Admin User**

1. Go to: https://console.firebase.google.com/
2. Project: `prestine-apartment-db`
3. Authentication → Users
4. **Do you see a user listed?**
   - ✅ Yes → Good, go to Step 4
   - ❌ No → Create one first (see COMPLETE_ADMIN_SETUP_GUIDE.md Step 2)

### **4. Check Admin Custom Claims**

In Firebase Console:
1. Authentication → Users
2. Click on your admin user
3. Scroll to "Custom claims"
4. **What does it show?**
   - ✅ `{ "admin": true }` → Good!
   - ❌ Empty or missing → Run `setAdmin.js` script

---

## 🚀 **Most Likely Fix (Try This First!)**

### **Scenario: Login works but shows home page**

**This means:**
- Firebase is connecting ✅
- User exists ✅
- But admin claims not set ❌

**Fix:**

1. **Get your User UID:**
   - Firebase Console → Authentication → Users
   - Click on your user
   - Copy the "User UID"

2. **Run setAdmin.js:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   # Download serviceAccountKey.json from Firebase Console
   # Update USER_UID in setAdmin.js
   node setAdmin.js
   ```

3. **Clear browser and login again:**
   - Clear cookies for vercel.app
   - Go to: `/#/admin/login`
   - Log in again
   - Should now work!

---

## 🔍 **Debug: What's Happening When You Login?**

### **Add This to Check:**

1. Open: https://prestine-apartments-upgrade.vercel.app/#/admin/login
2. Open Console (F12)
3. Before logging in, type this in console:

```javascript
// Monitor auth state changes
import('@/config/firebase').then(f => {
  f.auth.onAuthStateChanged(user => {
    console.log('Auth State Changed:', {
      user: user ? user.email : 'None',
      uid: user ? user.uid : 'None'
    })
    
    if (user) {
      user.getIdTokenResult(true).then(token => {
        console.log('Token Claims:', token.claims)
        console.log('Is Admin:', token.claims.admin === true)
      })
    }
  })
})
```

4. Now try to log in
5. Watch console output

**What you'll see:**
- User email after login
- User UID
- Token claims (should show `admin: true`)
- Is Admin status

---

## ✅ **Step-by-Step: Set Up Admin (If Not Done)**

### **If you haven't set up admin yet:**

1. **Create User:**
   - Firebase Console → Authentication → Add user
   - Email + Password
   - Copy User UID

2. **Set Admin Claims:**
   - Download `serviceAccountKey.json` from Firebase
   - Place in project root
   - Update `setAdmin.js` with your UID
   - Run: `node setAdmin.js`
   - Delete `serviceAccountKey.json`

3. **Test Login:**
   - Go to: `/#/admin/login`
   - Enter credentials
   - Should redirect to dashboard

---

## 🐛 **If Still Not Working**

### **Check These in Order:**

1. **Environment Variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Count them - should be 12
   - All start with `VITE_`
   - Values are correct

2. **Redeployment:**
   - Did you redeploy after adding env vars?
   - Go to Deployments → Redeploy latest

3. **Firebase Connection:**
   - Browser console → Any Firebase errors?
   - Network tab → Firebase requests failing?

4. **User & Claims:**
   - User exists in Firebase? ✅
   - Admin claims set? ✅ (Check Firebase Console)

5. **Browser Cache:**
   - Clear all cache
   - Try incognito mode
   - Hard refresh (Ctrl+Shift+R)

---

## 📝 **Share This Info for Help:**

If still not working, share:

1. **Console output** (F12 → Console tab)
2. **Network tab errors** (F12 → Network → Filter "firebase")
3. **Firebase Console screenshot** (Authentication → Users → Your user)
4. **Vercel env vars screenshot** (Settings → Environment Variables)

This will help diagnose the exact issue!

