# 🚀 Quick Setup Checklist

## ✅ What's Already Done

- ✅ All code is written and ready
- ✅ Firebase configuration is in place
- ✅ Security rules file created
- ✅ Admin login page created
- ✅ Protected admin route implemented
- ✅ Booking system integrated with Firestore

## ⚠️ What You Need to Do (3 Steps)

### Step 1: Enable Firebase Authentication (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **prestine-apartment-db**
3. Click **Authentication** in left menu
4. Click **Get Started** (if not already enabled)
5. Go to **Sign-in method** tab
6. Click **Email/Password**
7. **Enable** it and click **Save**

**Status:** ⬜ Not Done / ✅ Done

---

### Step 2: Deploy Firestore Security Rules (2 minutes)

**Option A: Using Firebase Console (Easiest)**

1. Go to Firebase Console > **Firestore Database**
2. Click **Rules** tab
3. Copy the contents of `firestore.rules` file from your project
4. Paste into the rules editor
5. Click **Publish**

**Option B: Using Firebase CLI**

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore (if not done)
firebase init firestore
# Select: Use existing Firestore project
# Select: firestore.rules file

# Deploy rules
firebase deploy --only firestore:rules
```

**Status:** ⬜ Not Done / ✅ Done

---

### Step 3: Create Admin User and Set Admin Status (10 minutes)

#### Part A: Create Admin User

1. Go to Firebase Console > **Authentication** > **Users**
2. Click **Add user**
3. Enter your admin email (e.g., `admin@prestineapartments.com`)
4. Enter a secure password
5. Click **Add user**
6. **Copy the User UID** (you'll need it next)

#### Part B: Set Admin Custom Claims

You need to set the admin custom claim. Here's the easiest way:

**Using Firebase Console + Node.js Script:**

1. **Get Service Account Key:**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click **Generate new private key**
   - Save the JSON file (e.g., `serviceAccountKey.json`) - **KEEP THIS SECRET!**

2. **Create a script** `setAdmin.js` in your project root:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   // REPLACE THIS WITH YOUR USER UID FROM STEP A
   const uid = 'PASTE_YOUR_USER_UID_HERE';

   admin.auth().setCustomUserClaims(uid, { admin: true })
     .then(() => {
       console.log('✅ Admin status granted successfully!');
       console.log('Now log out and log back in to the admin panel.');
       process.exit(0);
     })
     .catch((error) => {
       console.error('❌ Error:', error);
       process.exit(1);
     });
   ```

3. **Run the script:**
   ```bash
   npm install firebase-admin
   node setAdmin.js
   ```

4. **Delete the service account key file** after use (for security):
   ```bash
   rm serviceAccountKey.json
   ```

**Status:** ⬜ Not Done / ✅ Done

---

## 🎯 Testing Your Setup

After completing all 3 steps:

1. **Test Guest Booking:**
   - Go to any apartment page
   - Fill out booking form
   - Submit
   - ✅ Should save to Firestore
   - ✅ Should send email

2. **Test Admin Access:**
   - Go to: `http://localhost:5173/#/admin/login`
   - Login with admin email/password
   - ✅ Should see admin dashboard
   - ✅ Should see bookings

3. **Test Status Change:**
   - Click "Confirm Booking" on a booking
   - ✅ Status should change
   - ✅ Email should be sent

---

## 📋 Summary Checklist

- [ ] Step 1: Firebase Authentication enabled
- [ ] Step 2: Firestore security rules deployed
- [ ] Step 3A: Admin user created
- [ ] Step 3B: Admin custom claims set
- [ ] Test: Guest booking works
- [ ] Test: Admin login works
- [ ] Test: Status update works

---

## 🆘 If Something Doesn't Work

### "Permission Denied" Errors
→ Check that security rules are deployed (Step 2)

### "Access Denied" on Admin Dashboard
→ Check that admin custom claims are set (Step 3B)
→ Try logging out and logging back in

### "Cannot read bookings"
→ Check Firestore security rules allow admin read access
→ Verify you're logged in as admin

### Bookings not saving
→ Check Firestore is enabled
→ Check browser console for errors
→ Verify security rules allow create operation

---

## 💡 Quick Reference

- **Admin Login:** `http://localhost:5173/#/admin/login`
- **Admin Dashboard:** `http://localhost:5173/#/admin`
- **Firebase Console:** https://console.firebase.google.com/project/prestine-apartment-db
- **Firestore Rules:** In `firestore.rules` file

---

## ✅ Once All Steps Are Done

Everything will be perfect! The system will:
- ✅ Allow guest bookings (no login required)
- ✅ Save bookings to Firestore
- ✅ Send confirmation emails
- ✅ Allow admin to manage bookings
- ✅ Block dates when bookings are confirmed
- ✅ Secure all admin operations

---

**Total Setup Time: ~15-20 minutes**

