# 🔐 How to Add Another Admin User - Firebase Guide

## 📋 Overview

This guide explains how to grant admin access to additional users in Firebase. Admin users can access the admin dashboard to manage bookings, confirm payments, and view all reservations.

---

## ✅ Prerequisites

- Firebase project set up
- Node.js installed on your computer
- Access to Firebase Console

---

## 🚀 Step-by-Step Guide

### **Step 1: Get User's Firebase UID**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find the user you want to make admin (or create a new user)
5. Click on the user to view details
6. **Copy the UID** (it looks like: `qi2fV0dH9NbafpA46dMf10AbzqG2`)

**Note:** If the user doesn't exist yet:
- Click **"Add user"** in Authentication
- Enter their email and set a temporary password
- Copy their UID after creation

---

### **Step 2: Get Firebase Service Account Key**

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. A JSON file will download - **save it as `serviceAccountKey.json`**
6. **Move this file** to your project root directory:
   ```
   prestine-apartments/react-prestine-apartments/serviceAccountKey.json
   ```

---

### **Step 3: Update setAdmin.js Script**

1. Open `setAdmin.js` file in your project root
2. Find this line:
   ```javascript
   const USER_UID = 'USER_UID_HERE'; // <-- REPLACE THIS!
   ```
3. Replace `'USER_UID_HERE'` with the UID you copied in Step 1:
   ```javascript
   const USER_UID = 'qi2fV0dH9NbafpA46dMf10AbzqG2'; // Your actual UID
   ```

---

### **Step 4: Run the Script**

Open terminal/PowerShell in your project directory and run:

```bash
cd "prestine-apartments/react-prestine-apartments"
node setAdmin.js
```

**Expected Output:**
```
✅ SUCCESS! Admin status granted to user: qi2fV0dH9NbafpA46dMf10AbzqG2

📋 Next Steps:
1. Log out of admin panel (if logged in)
2. Log back in at /admin/login
3. You should now have access to admin dashboard

⚠️  Security: Delete serviceAccountKey.json after use!
```

---

### **Step 5: Test Admin Access**

1. Have the new admin user go to: `yourwebsite.com/#/admin/login`
2. They should log in with their Firebase email and password
3. They should now have access to the admin dashboard

---

### **Step 6: Clean Up (IMPORTANT!)**

**⚠️ SECURITY:** Delete the service account key file after use:

```bash
# Delete the service account key
rm serviceAccountKey.json
```

**Or manually delete:** `serviceAccountKey.json` file from project root

**Why?** This file has full admin access to your Firebase project. Never commit it to Git!

---

## 🔄 Adding Multiple Admins

To add more admins, repeat Steps 1-6 for each user:
1. Get their UID
2. Update `USER_UID` in `setAdmin.js`
3. Run `node setAdmin.js`
4. Delete `serviceAccountKey.json` after each use

---

## ❌ Troubleshooting

### **Error: "serviceAccountKey.json not found"**
- Make sure the file is in the project root directory
- Check the filename is exactly `serviceAccountKey.json`

### **Error: "auth/user-not-found"**
- Verify the UID is correct
- Make sure the user exists in Firebase Authentication

### **Error: "Cannot find module 'firebase-admin'"**
- Install dependencies: `npm install`

### **User can't access admin panel**
- Make sure they log out and log back in
- Check browser console for errors
- Verify the custom claim was set correctly

---

## 🔒 Security Best Practices

1. ✅ **Always delete** `serviceAccountKey.json` after use
2. ✅ **Never commit** `serviceAccountKey.json` to Git (already in .gitignore)
3. ✅ **Only grant admin** to trusted users
4. ✅ **Use strong passwords** for admin accounts
5. ✅ **Monitor admin activity** in Firebase Console

---

## 📝 Quick Reference

**File Location:** `setAdmin.js` (project root)

**Script Command:** `node setAdmin.js`

**Admin Login URL:** `/admin/login` or `/#/admin/login`

**Firebase Console:** https://console.firebase.google.com/

---

## ✅ Checklist

- [ ] User exists in Firebase Authentication
- [ ] User UID copied
- [ ] Service account key downloaded
- [ ] `serviceAccountKey.json` placed in project root
- [ ] `USER_UID` updated in `setAdmin.js`
- [ ] Script run successfully
- [ ] Admin can log in and access dashboard
- [ ] `serviceAccountKey.json` deleted

---

**Need Help?** Check Firebase Console → Authentication → Users to verify admin status.


