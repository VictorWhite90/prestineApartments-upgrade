# Deploy Firestore Security Rules - QUICK FIX

## 🚨 Problem
Booking creation is failing with "Missing or insufficient permissions" error.

## ✅ Solution
The security rules have been fixed. Now we need to deploy them to Firebase.

---

## **OPTION 1: Firebase Console (EASIEST - 2 minutes)**

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/
   - Select your project: `prestine-apartment-db`

2. **Navigate to Firestore Rules:**
   - Click **"Firestore Database"** in the left sidebar
   - Click the **"Rules"** tab at the top

3. **Copy and Paste the Rules:**
   - Open the file: `firestore.rules` in your project
   - Copy ALL the contents
   - Paste into the Firebase Console Rules editor
   - Click **"Publish"** button

4. **Done!** Try booking again - it should work now.

---

## **OPTION 2: Firebase CLI (If you prefer command line)**

1. **Open terminal in your project folder:**
   ```powershell
   cd "prestine-apartments\react-prestine-apartments"
   ```

2. **Deploy the rules:**
   ```powershell
   firebase deploy --only firestore:rules
   ```

3. **Done!** Rules are deployed.

---

## 📋 What Was Fixed?

The security rule for creating bookings was updated to properly allow:
- ✅ Guest bookings (not logged in) with `userId = null`
- ✅ Authenticated user bookings with `userId = null` or their own `userId`
- ✅ Always requires `status = "pending_payment"`

---

## 🔍 Verify It's Working

After deploying, try booking an apartment again. You should see:
- ✅ No permission errors
- ✅ Booking saved successfully
- ✅ Redirect to confirmation page


