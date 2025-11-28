# 🔧 Quick Fix: Access Denied Issue

## The Problem

You've created the admin user and updated the UID, but you're still seeing "Access Denied". This means the **admin custom claims haven't been set yet**.

## ✅ Solution: Run the Script to Set Admin Status

You need to actually RUN the `setAdmin.js` script to set the admin custom claims. Here's how:

### Step 1: Get Service Account Key (2 minutes)

1. Go to: https://console.firebase.google.com/project/prestine-apartment-db/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Click **"Generate key"** (confirm dialog)
4. A JSON file will download - **save it as `serviceAccountKey.json`**
5. Move `serviceAccountKey.json` to your project root folder:
   ```
   C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments\
   ```

### Step 2: Install Firebase Admin (if needed)

Open terminal in your project folder and run:

```bash
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"
npm install firebase-admin
```

### Step 3: Run the Script

```bash
node setAdmin.js
```

You should see:
```
✅ SUCCESS! Admin status granted to user: qi2fV0dH9NbafpA46dMf10AbzqG2
```

### Step 4: Log Out and Log Back In

**IMPORTANT:** Custom claims are cached in your ID token, so you MUST:

1. **Log out** from the admin panel (or clear browser cookies/session)
2. **Log back in** at: `http://localhost:5173/#/admin/login`
3. Now you should have access!

### Step 5: Delete Service Account Key (Security!)

After running the script successfully, delete the file:

```bash
del serviceAccountKey.json
```

Or manually delete it from your project folder.

---

## 🐛 Still Not Working?

### Check 1: Did you run the script?
- Open terminal and run: `node setAdmin.js`
- Did you see "SUCCESS!" message?

### Check 2: Did you log out and log back in?
- Custom claims are cached - you MUST log out and log back in
- Clear browser cookies if needed

### Check 3: Check Browser Console
- Open browser DevTools (F12)
- Go to Console tab
- Look for errors about admin claims
- Check if `isAdmin` is true or false

### Check 4: Verify in Firebase Console
- Go to: Firebase Console > Authentication > Users
- Click on your user
- Scroll down to "Custom claims"
- Should show: `{ "admin": true }`

---

## 🔍 Debug: Check Admin Status

Add this to your browser console after logging in:

```javascript
// In browser console on /admin page
firebase.auth().currentUser.getIdTokenResult(true).then(result => {
  console.log('Custom Claims:', result.claims);
  console.log('Is Admin:', result.claims.admin === true);
});
```

---

## ✅ Quick Checklist

- [ ] Service account key downloaded and saved as `serviceAccountKey.json`
- [ ] File placed in project root folder
- [ ] Ran `npm install firebase-admin`
- [ ] Ran `node setAdmin.js` and saw SUCCESS message
- [ ] Logged out from admin panel
- [ ] Logged back in
- [ ] Can now access admin dashboard

---

## 🆘 Still Having Issues?

If it's still not working after all steps:

1. **Verify UID is correct:**
   - Firebase Console > Authentication > Users
   - Copy the UID exactly
   - Make sure it matches what's in `setAdmin.js`

2. **Check script ran successfully:**
   - No errors when running `node setAdmin.js`
   - Success message displayed

3. **Force refresh token:**
   - Log out completely
   - Clear browser cache/cookies
   - Log back in

4. **Check Firestore rules are deployed:**
   - Firebase Console > Firestore > Rules
   - Rules should be published

