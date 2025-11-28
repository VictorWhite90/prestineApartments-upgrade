# 🔐 Admin Login Fix - Exact Steps

Your site is deployed but login isn't working. Follow these exact steps.

---

## 📍 **Your Deployed Site**
**URL:** https://prestine-apartments-upgrade.vercel.app/

---

## 🎯 **Step-by-Step Fix**

### **STEP 1: Verify Environment Variables (2 minutes)**

1. Go to: https://vercel.com/dashboard
2. Click project: **prestine-apartments-upgrade**
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)

**Check if you have these 12 variables:**

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN  
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID_CLIENT
VITE_EMAILJS_TEMPLATE_ID_COMPANY
VITE_EMAILJS_PUBLIC_KEY
VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION
```

**If missing any:**
- Click **"Create new"** or **"+ Add"**
- Add each missing variable
- Click **"Save"** at bottom

**After saving:**
- Go to **Deployments** tab
- Click **three dots (⋮)** on latest deployment
- Click **"Redeploy"**
- Wait 2-3 minutes for build

---

### **STEP 2: Create Admin User in Firebase (3 minutes)**

1. Go to: https://console.firebase.google.com/
2. Select project: **prestine-apartment-db**
3. Click **Authentication** (left sidebar)
4. Click **Users** tab
5. Click **"Add user"** button (top)

**Fill in:**
- **Email:** `admin@prestineapartments.com` (or your email)
- **Password:** Create strong password (save it!)
- **Uncheck:** "Send password reset email"
- Click **"Add user"**

6. **IMPORTANT:** After user is created, click on the user row
7. **Copy the User UID** (long string like: `qi2fV0dH9NbafpA46dMf10AbzqG2`)
8. **Save this UID somewhere** - you need it next!

---

### **STEP 3: Download Service Account Key (2 minutes)**

1. Still in Firebase Console
2. Click **⚙️ Settings** icon (top left)
3. Click **Project settings**
4. Click **Service accounts** tab
5. Click **"Generate new private key"** button
6. In popup, click **"Generate key"**
7. JSON file downloads automatically
8. **Rename downloaded file to:** `serviceAccountKey.json`

---

### **STEP 4: Set Admin Custom Claims (3 minutes)**

1. **Move `serviceAccountKey.json` to your project:**
   ```
   C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments\serviceAccountKey.json
   ```

2. **Open `setAdmin.js` file in your project**

3. **Find this line:**
   ```javascript
   const USER_UID = 'USER_UID_HERE';
   ```

4. **Replace with your User UID from Step 2:**
   ```javascript
   const USER_UID = 'qi2fV0dH9NbafpA46dMf10AbzqG2'; // Your actual UID
   ```

5. **Open terminal/PowerShell:**
   ```powershell
   cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"
   ```

6. **Install firebase-admin (if needed):**
   ```powershell
   npm install firebase-admin
   ```

7. **Run the script:**
   ```powershell
   node setAdmin.js
   ```

8. **You should see:**
   ```
   ✅ SUCCESS! Admin status granted to user: [your-uid]
   ```

9. **Delete the service account key:**
   ```powershell
   del serviceAccountKey.json
   ```
   ⚠️ **Important:** Delete it for security!

---

### **STEP 5: Test Admin Login (2 minutes)**

1. **Open your site:**
   ```
   https://prestine-apartments-upgrade.vercel.app/#/admin/login
   ```
   ⚠️ **Note:** Must include `/#/admin/login` (with the `#`)

2. **Enter login credentials:**
   - Email: The email you used in Step 2
   - Password: The password you created

3. **Click "Sign In"**

4. **What should happen:**
   - ✅ Redirects to: `/#/admin`
   - ✅ Shows admin dashboard
   - ✅ Shows bookings table

5. **If you see "Access Denied":**
   - Log out (if logged in)
   - Clear browser cache
   - Log back in

---

### **STEP 6: Verify It's Working**

**Check these:**

- [ ] Can access login page at `/#/admin/login`
- [ ] Can enter email and password
- [ ] Clicking "Sign In" redirects
- [ ] See admin dashboard (not home page)
- [ ] Dashboard shows "Recent Bookings" table
- [ ] No errors in browser console (F12)

---

## 🐛 **If Still Not Working**

### **Check Browser Console:**

1. Open: https://prestine-apartments-upgrade.vercel.app/#/admin/login
2. Press `F12` (Developer Tools)
3. Click **Console** tab
4. **Copy any errors you see**

### **Common Issues:**

**Issue: "Missing Firebase environment variables"**
- **Fix:** Redeploy on Vercel after adding env vars (Step 1)

**Issue: "Access Denied" after login**
- **Fix:** Run setAdmin.js script again (Step 4)
- Make sure User UID is correct

**Issue: Shows home page instead of admin**
- **Fix:** You're not logged in or admin claims not set
- Complete Steps 2-4 again

**Issue: Login button does nothing**
- **Fix:** Check browser console for errors
- Verify Firebase is connecting
- Check environment variables are loaded

---

## 📝 **Quick Checklist**

Before testing login, make sure:

- [ ] ✅ 12 environment variables set in Vercel
- [ ] ✅ Redeployed after adding variables
- [ ] ✅ Admin user created in Firebase
- [ ] ✅ User UID copied
- [ ] ✅ serviceAccountKey.json downloaded
- [ ] ✅ setAdmin.js updated with UID
- [ ] ✅ `node setAdmin.js` ran successfully
- [ ] ✅ serviceAccountKey.json deleted

---

## 🎯 **Direct Links to Check**

### **Test These URLs:**

1. **Login Page:**
   ```
   https://prestine-apartments-upgrade.vercel.app/#/admin/login
   ```

2. **Admin Dashboard (after login):**
   ```
   https://prestine-apartments-upgrade.vercel.app/#/admin
   ```

3. **Home Page:**
   ```
   https://prestine-apartments-upgrade.vercel.app/
   ```

---

## 🔍 **Debug: Check What's Happening**

### **Test 1: Check Environment Variables**

Open browser console on your site and run:

```javascript
console.log('Firebase Env:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  allVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).length
})
```

**Expected:** `apiKey: ✅ Set`, `projectId: ✅ Set`, `allVars: 12`

### **Test 2: Check Firebase Connection**

In browser console:

```javascript
import('@/config/firebase').then(f => {
  console.log('Firebase initialized:', !!f.auth)
})
```

**Expected:** `Firebase initialized: true`

---

## ✅ **Success Indicators**

You'll know it's working when:

1. ✅ Can access login page
2. ✅ Can enter credentials
3. ✅ Redirects to dashboard (not home page)
4. ✅ Dashboard shows bookings
5. ✅ No console errors
6. ✅ Can see stats cards at top

---

## 📞 **Need More Help?**

If you complete all steps and it still doesn't work:

1. Open browser console (F12)
2. Go to Console tab
3. Try to log in
4. **Copy all error messages**
5. Share them with me

Or check:
- `COMPLETE_ADMIN_SETUP_GUIDE.md` - Full detailed guide
- `QUICK_DEBUG_ADMIN.md` - Quick troubleshooting

---

## 🎉 **You're Done!**

Once login works, you can:
- ✅ View all bookings
- ✅ Confirm payments
- ✅ Cancel bookings
- ✅ Search/filter bookings
- ✅ Extend stays
- ✅ Manage everything!

