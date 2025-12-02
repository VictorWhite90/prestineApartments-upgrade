# Security Setup Guide

This document provides complete instructions for setting up the secure admin booking management system.

## Quick Start Checklist

- [ ] Firebase Authentication enabled
- [ ] Firestore Database created
- [ ] Firestore security rules deployed
- [ ] First admin user created and custom claims set
- [ ] Environment variables configured
- [ ] Admin can access dashboard at `/admin/login`

## Detailed Setup Steps

### 1. Firebase Authentication Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **prestine-apartment-db**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password**
5. Click **Save**

### 2. Firestore Security Rules Deployment

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firestore** (if not done):
   ```bash
   firebase init firestore
   ```
   - Select existing Firestore project
   - Use `firestore.rules` file from project root

4. **Deploy Security Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Verify Rules**:
   - Go to Firebase Console > Firestore > Rules
   - Check that rules match `firestore.rules` file
   - Test rules using Rules Playground

### 3. Admin Custom Claims Setup

See `ADMIN_SETUP.md` for detailed instructions on setting admin custom claims.

**Quick Method (Manual)**:

1. Create admin user in Firebase Console > Authentication
2. Copy User UID
3. Use Firebase Admin SDK script to set custom claim:
   ```javascript
   admin.auth().setCustomUserClaims(uid, { admin: true })
   ```

### 4. Environment Variables

Create `.env.local` file in project root (copy from `.env.example` if it exists):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=prestine-apartment-db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prestine-apartment-db
VITE_FIREBASE_STORAGE_BUCKET=prestine-apartment-db.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=663731777064
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: `.env.local` is git-ignored. Never commit actual API keys to version control.

### 5. Testing Security

#### Test Admin Access

1. Create admin user and set custom claims
2. Log in at `/admin/login`
3. Should access admin dashboard
4. Log out and log in as non-admin user
5. Should see "Access Denied" message

#### Test Booking Creation

1. Create booking as guest (no login)
2. Check Firestore - booking should have `userId: null`
3. Create booking while logged in
4. Check Firestore - booking should have `userId: <user_uid>`

#### Test Firestore Rules

Use Firebase Console > Firestore > Rules > Rules Playground:

- Test: User reads own booking → Should allow
- Test: User reads other's booking → Should deny
- Test: Admin reads any booking → Should allow
- Test: Non-admin updates booking → Should deny
- Test: Admin updates booking → Should allow

## Security Rules Explained

### Bookings Collection Rules

```javascript
// READ: Users can read own bookings, admins can read all
allow read: if isAuthenticated() && 
               (resource.data.userId == request.auth.uid || isAdmin());

// CREATE: Anyone can create, but if userId provided, must match auth
allow create: if !isAuthenticated() || 
                 (resource.data.userId == null || resource.data.userId == request.auth.uid) &&
                 resource.data.status == "pending_payment";

// UPDATE: Only admins, only specific fields
allow update: if isAdmin() && 
                 request.resource.data.userId == resource.data.userId &&
                 // Only allow status, updatedAt, paymentDate to change
                 request.resource.data.diff(resource.data).affectedKeys()
                   .hasOnly(['status', 'updatedAt', 'paymentDate']);
```

## Security Best Practices

1. **Never expose sensitive data** in client code
2. **Always validate on server** (Firestore rules)
3. **Use environment variables** for API keys
4. **Regular security audits** of Firestore rules
5. **Monitor Firebase Audit Logs** for suspicious activity
6. **Enable Firebase App Check** for additional protection
7. **Set up rate limiting** for API calls (Firebase Functions)
8. **Regular backups** of Firestore data

## Troubleshooting

### "Permission Denied" Errors

- Check Firestore rules are deployed
- Verify user authentication status
- Check custom claims are set correctly
- Review browser console for specific error codes

### Custom Claims Not Working

- Force token refresh: `user.getIdToken(true)`
- Log out and log back in
- Check Firebase Console > Authentication > Users > Custom Claims
- Verify claims set server-side only

### Admin Dashboard Not Accessible

- Check admin custom claim is set
- Verify ProtectedAdminRoute is wrapping Admin component
- Check browser console for errors
- Verify Firestore rules allow admin access

## Additional Security Features

### Firebase App Check (Recommended)

1. Go to Firebase Console > App Check
2. Enable App Check for Web
3. Register reCAPTCHA v3 site key
4. Add App Check to your app

### Firebase Audit Logs

1. Enable Firebase Audit Logs
2. Monitor admin actions
3. Set up alerts for suspicious activity

### Rate Limiting

Consider implementing rate limiting using Firebase Functions:
- Limit booking creation per user
- Limit email sending
- Prevent abuse

## Support

For security issues:
1. Check Firebase Console logs
2. Review Firestore rules in Rules Playground
3. Verify authentication and custom claims
4. Contact development team


