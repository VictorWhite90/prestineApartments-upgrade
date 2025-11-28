# 🔧 Fix "Access Denied" Error

## The Problem

You're seeing "Access Denied" because the **admin custom claims haven't been set yet**. Just creating a user isn't enough - you need to run a script to give them admin privileges.

---

## ✅ Step-by-Step Fix (10 minutes)

### Step 1: Get Service Account Key (3 minutes)

1. Go to: https://console.firebase.google.com/project/prestine-apartment-db/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"** button
3. Click **"Generate key"** in the confirmation dialog
4. A JSON file downloads - **rename it to `serviceAccountKey.json`**
5. **Move this file** to your project root:
   ```
   C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments\serviceAccountKey.json
   ```

### Step 2: Install Firebase Admin (1 minute)

Open PowerShell or Command Prompt in your project folder:

```powershell
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"
npm install firebase-admin
```

### Step 3: Run the Script (1 minute)

Your UID is already set in `setAdmin.js` (`qi2fV0dH9NbafpA46dMf10AbzqG2`). Now run:

```powershell
node setAdmin.js
```

**Expected output:**
```
✅ SUCCESS! Admin status granted to user: qi2fV0dH9NbafpA46dMf10AbzqG2

📋 Next Steps:
1. Log out of admin panel (if logged in)
2. Log back in at /admin/login
3. You should now have access to admin dashboard
```

### Step 4: Log Out and Log Back In (CRITICAL!)

**IMPORTANT:** Custom claims are cached in your ID token. You MUST:

1. **Go to:** `http://localhost:5173/#/admin/login`
2. **Click the "Log Out" button** (if there is one) OR
3. **Clear your browser cookies/session** for localhost
4. **Close the browser tab completely**
5. **Open a new tab** and go to: `http://localhost:5173/#/admin/login`
6. **Log in again** with your admin email and password

### Step 5: Delete Service Account Key (Security!)

After everything works, delete the service account key:

```powershell
del serviceAccountKey.json
```

Or manually delete it from your project folder.

---

## 🐛 Still Not Working?

### Check 1: Did the script run successfully?

Open PowerShell and run:
```powershell
node setAdmin.js
```

**If you see an error:**
- ❌ "serviceAccountKey.json not found" → File not in project root, move it there
- ❌ "User not found" → Check the UID is correct in setAdmin.js
- ✅ "SUCCESS!" → Script worked, proceed to Step 4

### Check 2: Did you log out completely?

Custom claims are cached. You MUST:
- Log out completely
- Close browser tab
- Open new tab
- Log in again

### Check 3: Verify Admin Status in Browser Console

1. Go to admin page while logged in
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type:
   ```javascript
   firebase.auth().currentUser.getIdTokenResult(true).then(result => {
     console.log('Custom Claims:', result.claims);
     console.log('Is Admin:', result.claims.admin === true);
   });
   ```

**Expected output:**
```
Custom Claims: { admin: true, ... }
Is Admin: true
```

**If you see:**
```
Custom Claims: {}
Is Admin: false
```
→ Admin claims not set. Run `node setAdmin.js` again.

### Check 4: Verify in Firebase Console

1. Go to: Firebase Console > Authentication > Users
2. Click on your user (with email you use to login)
3. Scroll down to see **"Custom claims"**
4. Should show: `{ "admin": true }`

**If it's empty:** Run `node setAdmin.js` again.

---

## 🎯 Quick Verification Checklist

- [ ] `serviceAccountKey.json` file exists in project root
- [ ] Ran `npm install firebase-admin` successfully
- [ ] Ran `node setAdmin.js` and saw "SUCCESS!" message
- [ ] Logged out completely from admin panel
- [ ] Closed browser tab
- [ ] Opened new tab and logged in again
- [ ] Can now access admin dashboard

---

## 📝 File Locations

Your project root is:
```
C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments\
```

Make sure `serviceAccountKey.json` is in this folder.

---

## 🆘 Common Issues

### "Cannot find module 'firebase-admin'"
**Fix:** Run `npm install firebase-admin` first

### "serviceAccountKey.json not found"
**Fix:** Make sure the file is in the project root folder (not in a subfolder)

### "User not found"
**Fix:** Double-check the UID in `setAdmin.js` matches Firebase Console

### Still "Access Denied" after all steps
**Fix:** 
1. Check browser console for errors (F12)
2. Verify custom claims in Firebase Console
3. Try clearing all browser data/cookies for localhost
4. Try incognito/private browsing window

---

## ✅ Success Looks Like This

After completing all steps:
- ✅ Login page accepts your credentials
- ✅ Redirects to admin dashboard (not "Access Denied")
- ✅ Can see bookings table
- ✅ Can update booking status

---

**Follow these steps exactly and you'll have admin access!** 🎉

