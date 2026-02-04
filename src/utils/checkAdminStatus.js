/**
 * Utility to check admin status for debugging
 * Run this in browser console after logging in
 */
import { auth } from '@/config/firebase'
import { getIdTokenResult } from 'firebase/auth'

export const checkAdminStatus = async () => {
  const user = auth.currentUser
  if (!user) {
    console.log('❌ No user logged in')
    return
  }

  console.log('👤 User:', user.email)
  console.log('🆔 UID:', user.uid)

  try {
    const tokenResult = await getIdTokenResult(user, true)
    console.log('📋 Custom Claims:', tokenResult.claims)
    console.log('✅ Is Admin:', tokenResult.claims.admin === true)
    
    if (!tokenResult.claims.admin) {
      console.log('\n⚠️  Admin claim not found!')
      console.log('📝 You need to:')
      console.log('1. Get service account key from Firebase Console')
      console.log('2. Save as serviceAccountKey.json in project root')
      console.log('3. Run: node setAdmin.js')
      console.log('4. Log out and log back in')
    }
  } catch (error) {
    console.error('❌ Error checking admin status:', error)
  }
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  window.checkAdminStatus = checkAdminStatus
}









