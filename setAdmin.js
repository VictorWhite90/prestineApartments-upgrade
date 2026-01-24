/**
 * Script to set admin custom claims for a Firebase user
 * 
 * Usage:
 * 1. Get service account key from Firebase Console > Project Settings > Service Accounts
 * 2. Save it as 'serviceAccountKey.json' in project root
 * 3. Replace USER_UID_HERE with your user's UID
 * 4. Run: node setAdmin.js
 * 5. Delete serviceAccountKey.json after use (for security)
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
let serviceAccount;
try {
  const keyPath = join(__dirname, 'serviceAccountKey.json');
  const keyData = readFileSync(keyPath, 'utf8');
  serviceAccount = JSON.parse(keyData);
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.log('\n📝 To get the service account key:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save as "serviceAccountKey.json" in project root\n');
  process.exit(1);
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const USER_UID = '3hmLuD7CBuMbYUIYv7IVh2xhCU13'; 

if (USER_UID === 'USER_UID_HERE') {
  console.error('❌ Error: Please replace USER_UID_HERE with your actual user UID!');
  console.log('\n📝 To get your User UID:');
  console.log('1. Go to Firebase Console > Authentication > Users');
  console.log('2. Find your user');
  console.log('3. Copy the UID');
  console.log('4. Replace USER_UID_HERE in this file\n');
  process.exit(1);
}

// Set admin custom claim
admin.auth().setCustomUserClaims(USER_UID, { admin: true })
  .then(() => {
    console.log('\n✅ SUCCESS! Admin status granted to user:', USER_UID);
    console.log('\n📋 Next Steps:');
    console.log('1. Log out of admin panel (if logged in)');
    console.log('2. Log back in at /admin/login');
    console.log('3. You should now have access to admin dashboard');
    console.log('\n⚠️  Security: Delete serviceAccountKey.json after use!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error setting admin claim:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 Tip: Make sure the User UID is correct.');
      console.log('   Check Firebase Console > Authentication > Users\n');
    }
    process.exit(1);
  });

