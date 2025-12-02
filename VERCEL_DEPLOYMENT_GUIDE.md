# 🚀 Vercel Deployment Guide - Prestine Apartments

Complete guide to deploy your React booking system to Vercel and configure everything securely.

---

## 📋 **Pre-Deployment Checklist**

### ✅ 1. Security Files Removed
- ✅ `serviceAccountKey.json` - **DELETED** (Never commit this!)
- ✅ `.env` files - Already in `.gitignore`

### ✅ 2. Policy Links Fixed
- ✅ Changed `/policies` links to use React Router `Link` component
- ✅ All policy links now work with HashRouter

---

## 🔐 **Step 1: Environment Variables Setup**

You need to set these in Vercel Dashboard. **DO NOT commit them to Git!**

### Required Environment Variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=prestine-apartment-db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prestine-apartment-db
VITE_FIREBASE_STORAGE_BUCKET=prestine-apartment-db.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=663731777064
VITE_FIREBASE_APP_ID=1:663731777064:web:dc8af8f7c472d694894f1d
VITE_FIREBASE_MEASUREMENT_ID=G-SFKKGNX0QQ

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_p6y1fke
VITE_EMAILJS_TEMPLATE_ID_CLIENT=template_vvm744y
VITE_EMAILJS_TEMPLATE_ID_COMPANY=template_iyygb2u
VITE_EMAILJS_PUBLIC_KEY=2ZNOdi6QPItTHItBO
VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION=your_payment_template_id
```

**Where to find these values:**
- Firebase: Project Settings → General → Your apps
- EmailJS: Dashboard → Email Templates → Template ID

---

## 🚀 **Step 2: Deploy to Vercel**

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Prepare your code:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign up/Login with GitHub

3. **Import Project:**
   - Click **"Add New..."** → **"Project"**
   - Import your GitHub repository
   - Select the `prestine-apartments/react-prestine-apartments` folder

4. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `prestine-apartments/react-prestine-apartments`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   - In the project settings, go to **"Environment Variables"**
   - Add ALL the variables listed above
   - Make sure to add them for **Production**, **Preview**, and **Development**

6. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (2-3 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   vercel
   ```
   - Follow prompts
   - Add environment variables when asked

4. **Production Deploy:**
   ```powershell
   vercel --prod
   ```

---

## ⚙️ **Step 3: Firebase Security Rules Deployment**

Your Firestore rules need to be deployed separately:

1. **Install Firebase CLI** (if not installed):
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```powershell
   firebase login
   ```

3. **Deploy Rules:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   firebase deploy --only firestore:rules
   ```

**OR** use Firebase Console:
- Go to: https://console.firebase.google.com/
- Select project: `prestine-apartment-db`
- Firestore Database → Rules
- Copy contents from `firestore.rules` → Paste → Publish

---

## 🔧 **Step 4: Post-Deployment Configuration**

### A. Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domain: `your-project.vercel.app`

### B. Update EmailJS Domains (if required)

1. Go to EmailJS Dashboard → Account → Security
2. Add your Vercel domain to allowed domains

---

## 👨‍💼 **Step 5: Admin Panel Setup (IMPORTANT!)**

### Setting Up Admin Access on Production:

Since `serviceAccountKey.json` is deleted (for security), you have 2 options:

#### **Option 1: Use Firebase Functions (Recommended for Production)**

This is the secure way to set admin claims in production.

1. **Create Firebase Function:**
   ```javascript
   // functions/index.js
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   
   admin.initializeApp();
   
   exports.setAdmin = functions.https.onCall(async (data, context) => {
     if (!context.auth) {
       throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
     }
     
     // Only allow if user is already admin (recursive protection)
     const userRecord = await admin.auth().getUser(context.auth.uid);
     if (!userRecord.customClaims || !userRecord.customClaims.admin) {
       throw new functions.https.HttpsError('permission-denied', 'Only admins can call this');
     }
     
     const targetUid = data.uid;
     await admin.auth().setCustomUserClaims(targetUid, { admin: true });
     
     return { success: true };
   });
   ```

2. **Deploy Function:**
   ```powershell
   firebase deploy --only functions
   ```

#### **Option 2: Use setAdmin.js Script Locally (Development)**

For initial admin setup, you can temporarily download the service account key:

1. **Get Service Account Key** (Firebase Console):
   - Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` (locally, NOT in project)

2. **Run Script:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   node setAdmin.js
   ```

3. **Delete Key Immediately:**
   ```powershell
   del serviceAccountKey.json
   ```

---

## 📱 **Step 6: Accessing Admin Panel After Deployment**

### Admin Login URL:
```
https://your-project.vercel.app/#/admin/login
```

### Steps:
1. Go to the admin login URL
2. Sign in with your Firebase Admin account email/password
3. You'll be redirected to the admin dashboard

### If "Access Denied" Error:
1. Make sure admin custom claims are set (use Option 1 or 2 above)
2. Log out and log back in to refresh your token
3. Clear browser cache/cookies if needed

---

## 🔍 **Step 7: Testing After Deployment**

### Checklist:

- [ ] Homepage loads correctly
- [ ] Apartments page displays all listings
- [ ] Booking form works
- [ ] Email notifications sent successfully
- [ ] Admin login works at `/#/admin/login`
- [ ] Admin dashboard loads bookings
- [ ] Search/filter works in admin panel
- [ ] Cancel booking works
- [ ] Extend stay works
- [ ] Policy links redirect correctly
- [ ] All images load properly

---

## 🐛 **Troubleshooting**

### Issue: "Missing or insufficient permissions"
- **Fix:** Deploy Firestore security rules (Step 3)

### Issue: Environment variables not working
- **Fix:** Make sure all variables start with `VITE_` prefix
- **Fix:** Redeploy after adding environment variables

### Issue: Admin access denied
- **Fix:** Set admin custom claims (Step 5)
- **Fix:** Log out and log back in

### Issue: Images not loading
- **Fix:** Check image paths in `public/images`
- **Fix:** Ensure all images are committed to Git

### Issue: EmailJS not working
- **Fix:** Verify EmailJS service/template IDs in environment variables
- **Fix:** Check EmailJS dashboard for errors

---

## 🔒 **Security Best Practices**

### ✅ DO:
- ✅ Use environment variables for all secrets
- ✅ Keep Firestore rules strict
- ✅ Use Firebase Admin SDK server-side only
- ✅ Regularly update dependencies
- ✅ Monitor Firebase usage/quota

### ❌ DON'T:
- ❌ Commit `serviceAccountKey.json` to Git
- ❌ Expose Firebase API keys in client code (they're safe if rules are strict)
- ❌ Share admin credentials
- ❌ Deploy without security rules

---

## 📊 **Monitoring & Maintenance**

### Firebase Console:
- Monitor Firestore usage
- Check Authentication logs
- Review security rules

### Vercel Dashboard:
- Monitor deployments
- Check build logs
- View analytics

### EmailJS Dashboard:
- Monitor email delivery
- Check template usage

---

## 🎉 **You're Done!**

Your Prestine Apartments booking system is now live on Vercel!

**Admin Dashboard:** `https://your-project.vercel.app/#/admin/login`  
**Public Site:** `https://your-project.vercel.app/`

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Vercel build logs
2. Check Firebase Console for errors
3. Review browser console for client-side errors
4. Verify all environment variables are set correctly


