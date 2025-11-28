import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { auth } from '@/config/firebase'

export default function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading, refreshAdminStatus } = useAuth()
  const location = useLocation()
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && !isAdmin) {
        // Force refresh token to get latest claims
        await refreshAdminStatus()
      }
      setCheckingAdmin(false)
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, isAdmin, loading, refreshAdminStatus])

  // Show loading state while checking authentication
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </motion.div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have admin privileges to access this page.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left text-sm">
            <p className="font-semibold text-yellow-800 mb-2">⚠️ Setup Required:</p>
            <ol className="list-decimal list-inside space-y-1 text-yellow-700">
              <li>Get service account key from Firebase Console</li>
              <li>Run: <code className="bg-yellow-100 px-2 py-1 rounded">node setAdmin.js</code></li>
              <li>Log out and log back in</li>
            </ol>
            <p className="mt-3 text-xs text-yellow-600">See QUICK_FIX_ADMIN.md for details</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={async () => {
                if (user) {
                  await auth.signOut()
                  window.location.href = '/#/admin/login'
                }
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Log Out
            </button>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Home
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  // User is authenticated and is admin, render children
  return children
}

