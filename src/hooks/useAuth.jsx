import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdTokenResult,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/config/firebase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        
        // Check for admin custom claim
        try {
          const tokenResult = await getIdTokenResult(firebaseUser, true) // Force refresh to get latest claims
          setIsAdmin(tokenResult.claims.admin === true)
        } catch (error) {
          console.error('Error checking admin claim:', error)
          setIsAdmin(false)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Force refresh token to get latest claims
      await userCredential.user.getIdToken(true)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setIsAdmin(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const refreshAdminStatus = async () => {
    if (user) {
      try {
        const tokenResult = await getIdTokenResult(user, true)
        setIsAdmin(tokenResult.claims.admin === true)
      } catch (error) {
        console.error('Error refreshing admin status:', error)
        setIsAdmin(false)
      }
    }
  }

  return {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    refreshAdminStatus
  }
}

