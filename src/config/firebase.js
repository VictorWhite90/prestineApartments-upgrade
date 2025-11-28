// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase Configuration - Uses environment variables
// For local development: Create .env.local file (not committed to Git)
// For production: Set in Vercel Dashboard -> Environment Variables

// Fallback values for development (remove in production)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAXC5dIeiiVyzU67SOwouiey55oRjNYiXA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prestine-apartment-db.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prestine-apartment-db",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prestine-apartment-db.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "663731777064",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:663731777064:web:dc8af8f7c472d694894f1d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SFKKGNX0QQ"
}

// Validate environment variables
const usingEnvVars = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID
if (!usingEnvVars) {
  console.warn('⚠️ Using fallback Firebase config. For production, set environment variables in Vercel.')
  console.warn('Environment variables detected:', {
    apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
    allVars: Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  })
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Firebase Authentication
export const auth = getAuth(app)

export default app

