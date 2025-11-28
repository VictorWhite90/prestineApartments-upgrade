# 🚀 Simple Fix for "Access Denied" - 3 Steps

## What You've Done ✅
- ✅ Created admin user
- ✅ Updated UID in setAdmin.js

## What's Missing ⚠️
- ❌ Haven't run the script to set admin privileges yet

---

## Step 1: Get Service Account Key (2 min)

1. **Open this link:** https://console.firebase.google.com/project/prestine-apartment-db/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"** button
3. Click **"Generate key"** (confirm the dialog)
4. A file downloads - **rename it to `serviceAccountKey.json`**
5. **Move it here:**
   ```
   C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments\serviceAccountKey.json
   ```

---

## Step 2: Run These Commands (2 min)

Open PowerShell in your project folder and run:

```powershell
# Navigate to project
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"

# Install Firebase Admin
npm install firebase-admin

# Run the script to set admin status
node setAdmin.js
```

**You should see:**
```
✅ SUCCESS! Admin status granted to user: qi2fV0dH9NbafpA46dMf10AbzqG2
```

---

## Step 3: Log Out and Log Back In (1 min)

**CRITICAL:** Custom claims are cached. You MUST:

1. **Log out** from admin panel (or clear cookies)
2. **Close the browser tab**
3. **Open new tab**
4. Go to: `http://localhost:5173/#/admin/login`
5. **Log in again** with your admin email/password

**Now you should have access!** ✅

---

## That's It! 🎉

After these 3 steps, you'll be able to access the admin dashboard.

---

## Still Not Working?

Check browser console (F12) and look for errors. Also verify:
- Script ran successfully (saw "SUCCESS!" message)
- Logged out completely
- Logged back in with same email/password

