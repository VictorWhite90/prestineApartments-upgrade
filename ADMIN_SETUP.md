# Admin Setup Guide

This guide explains how to set up the first admin user and manage admin access for the Prestine Apartments booking system.

## Prerequisites

- Firebase project with Authentication and Firestore enabled
- Firebase CLI installed (`npm install -g firebase-tools`)
- Access to Firebase Console

## Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **prestine-apartment-db**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

## Step 2: Create Your First Admin User

### Option A: Create User Manually (For Testing)

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter admin email and password
4. Click **Add user**
5. Copy the **User UID** (you'll need this in the next step)

### Option B: Sign Up Through the App

1. Navigate to `/admin/login` in your app
2. Sign up with your email and password
3. Note the User UID from Firebase Console > Authentication > Users

## Step 3: Set Admin Custom Claims

Custom claims must be set server-side using Firebase Functions or Firebase Admin SDK. Here's how:

### Using Firebase Functions (Recommended)

1. **Install Firebase Functions** (if not already installed):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init functions
   ```

2. **Create the function** to set admin claims:

   Create `functions/index.js`:
   ```javascript
   const functions = require('firebase-functions');
   const admin = require('firebase-admin');
   admin.initializeApp();

   // Set admin custom claim
   exports.setAdmin = functions.https.onCall(async (data, context) => {
     // SECURITY: Only existing admins can set new admins
     if (!context.auth || !context.auth.token.admin) {
       throw new functions.https.HttpsError(
         'permission-denied',
         'Only admins can set admin status'
       );
     }

     const uid = data.uid;
     await admin.auth().setCustomUserClaims(uid, { admin: true });
     
     return { success: true, message: `Admin status granted to ${uid}` };
   });
   ```

3. **Deploy the function**:
   ```bash
   firebase deploy --only functions
   ```

4. **Call the function** from Firebase Console > Functions > setAdmin

### Using Firebase Admin SDK (Manual - For Initial Setup)

1. **Create a Node.js script** (`setAdmin.js`):

   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./path-to-service-account-key.json');

   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });

   // Replace with your user's UID
   const uid = 'YOUR_USER_UID_HERE';

   admin.auth().setCustomUserClaims(uid, { admin: true })
     .then(() => {
       console.log('Admin status granted successfully');
       process.exit(0);
     })
     .catch((error) => {
       console.error('Error setting admin claim:', error);
       process.exit(1);
     });
   ```

2. **Get Service Account Key**:
   - Go to Firebase Console > Project Settings > Service Accounts
   - Click **Generate new private key**
   - Save the JSON file securely

3. **Run the script**:
   ```bash
   npm install firebase-admin
   node setAdmin.js
   ```

4. **Delete the service account key file** after use (for security)

## Step 4: Verify Admin Status

1. **Log out** of the admin panel (if logged in)
2. **Log back in** at `/admin/login`
3. You should now have access to the admin dashboard

## Step 5: Deploy Firestore Security Rules

1. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Test the rules** in Firebase Console > Firestore > Rules > Rules Playground

## Troubleshooting

### "Access Denied" Error

- Make sure you've set the admin custom claim
- Log out and log back in (custom claims are cached in the ID token)
- Check Firebase Console > Authentication > Users > Your User > Custom Claims

### Custom Claims Not Updating

- Force token refresh in your app (already implemented in `useAuth` hook)
- Wait a few minutes - custom claims can take time to propagate
- Check that you're using `getIdTokenResult(true)` to force refresh

### Cannot Access Admin Dashboard

1. Verify authentication: Check if you're logged in
2. Verify admin claim: Check Firebase Console for custom claims
3. Check browser console for errors
4. Verify Firestore rules are deployed correctly

## Security Best Practices

1. **Never expose admin credentials** in client code
2. **Set admin claims server-side only** - never from client
3. **Rotate service account keys** regularly
4. **Limit admin access** - only grant to trusted users
5. **Monitor admin actions** - set up Firebase Audit Logs
6. **Use Firebase App Check** for additional security

## Adding More Admin Users

Once you have one admin user set up:

1. Create the new user (through app or Firebase Console)
2. Get their User UID
3. Use the Firebase Function or Admin SDK script to set admin claim
4. They can now log in and access admin dashboard

## Removing Admin Access

To remove admin access from a user:

```javascript
// Using Firebase Admin SDK
admin.auth().setCustomUserClaims(uid, { admin: false })
  .then(() => console.log('Admin access removed'))
  .catch(error => console.error('Error:', error));
```

## Support

For issues or questions:
- Check Firebase Console logs
- Review Firestore security rules
- Verify custom claims are set correctly
- Contact development team


