/**
 * Centralized error handling utilities
 */

export const handleFirebaseError = (error) => {
  if (!error || !error.code) {
    return 'An unexpected error occurred. Please try again.'
  }

  const errorMap = {
    // Authentication errors
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'This email address is already registered.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    
    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'unauthenticated': 'Please log in to continue.',
    'failed-precondition': 'The operation was rejected due to a precondition failure.',
    'aborted': 'The operation was aborted.',
    'out-of-range': 'The operation was attempted past the valid range.',
    'unimplemented': 'The operation is not implemented or not supported.',
    'internal': 'Internal error. Please try again later.',
    'unavailable': 'Service is currently unavailable. Please try again later.',
    'deadline-exceeded': 'The operation timed out. Please try again.',
    'cancelled': 'The operation was cancelled.',
    'data-loss': 'Unrecoverable data loss or corruption.',
    'unauthenticated': 'User is not authenticated.',
    'resource-exhausted': 'Resource has been exhausted (e.g., quota exceeded).',
    'invalid-argument': 'Invalid argument provided.',
  }

  return errorMap[error.code] || error.message || 'An unexpected error occurred. Please try again.'
}

export const handleEmailJSError = (error) => {
  if (!error || !error.text) {
    return 'Failed to send email. Please try again.'
  }

  const errorMap = {
    'Invalid service ID': 'Email service is not configured correctly.',
    'Invalid template ID': 'Email template is not configured correctly.',
    'Invalid public key': 'Email service key is invalid.',
    'Network Error': 'Network error. Please check your connection.',
  }

  // Check if error text matches any known errors
  for (const [key, value] of Object.entries(errorMap)) {
    if (error.text.includes(key)) {
      return value
    }
  }

  return 'Failed to send email. Please try again later.'
}

export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error:`, error)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }
  // In production, you might want to send this to an error tracking service
  // e.g., Sentry, Firebase Crashlytics, etc.
}

export const createErrorResponse = (error, context = '') => {
  logError(error, context)
  
  if (error.code) {
    return {
      success: false,
      error: handleFirebaseError(error),
      code: error.code
    }
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred. Please try again.'
  }
}



