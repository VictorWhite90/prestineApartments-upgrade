import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Collection name for bookings
const BOOKINGS_COLLECTION = 'bookings'

/**
 * Save a temporary booking to Firestore
 * @param {Object} bookingData - Booking data (userId is optional for guest bookings)
 * @returns {Promise<{success: boolean, bookingId?: string, error?: string}>}
 */
export const createTemporaryBooking = async (bookingData) => {
  try {
    // userId is optional - allows guest bookings
    // Security rules will handle authentication checks

    const bookingRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      status: 'pending_payment', // Match security rules requirement
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      paymentDate: null, // Will be set when status changes to booking_successful
    })
    
    return {
      success: true,
      bookingId: bookingRef.id
    }
  } catch (error) {
    console.error('Error creating temporary booking:', error)
    return {
      success: false,
      error: error.message || 'Failed to create booking'
    }
  }
}

/**
 * Get all bookings from Firestore
 */
export const getAllBookings = async () => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
}

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching bookings by status:', error)
    throw error
  }
}

/**
 * Update booking status (only admins can do this)
 * @param {string} bookingId - Booking document ID
 * @param {string} newStatus - New status ('booking_successful' or 'cancelled')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateBookingStatus = async (bookingId, newStatus) => {
  try {
    if (!['booking_successful', 'cancelled', 'reservation_failed'].includes(newStatus)) {
      throw new Error('Invalid status value')
    }

    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
    const updateData = {
      status: newStatus,
      updatedAt: Timestamp.now()
    }

    // If status is booking_successful, set payment date
    if (newStatus === 'booking_successful') {
      updateData.paymentDate = Timestamp.now()
    }

    // If booking is cancelled, clear payment info so UI/analytics stay accurate
    if (newStatus === 'cancelled' || newStatus === 'reservation_failed') {
      updateData.paymentDate = null
      updateData.cancellationDate = Timestamp.now()
      updateData.reason = newStatus === 'cancelled' ? 'Cancelled by admin' : 'Payment window elapsed'
    }

    await updateDoc(bookingRef, updateData)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Error updating booking status:', error)
    return {
      success: false,
      error: error.message || 'Failed to update booking status'
    }
  }
}

/**
 * Get all confirmed bookings (for date blocking)
 * Note: Removed orderBy to avoid composite index requirement - we'll sort in code if needed
 * @returns {Promise<Array>}
 */
export const getConfirmedBookings = async () => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('status', '==', 'booking_successful')
    )
    const querySnapshot = await getDocs(q)
    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    // Sort by checkin_date in code (no index required)
    return bookings.sort((a, b) => {
      const dateA = a.checkin_date?.toDate ? a.checkin_date.toDate() : new Date(a.checkin_date)
      const dateB = b.checkin_date?.toDate ? b.checkin_date.toDate() : new Date(b.checkin_date)
      return dateA - dateB
    })
  } catch (error) {
    console.error('Error fetching confirmed bookings:', error)
    // Return empty array instead of throwing to allow bookings to proceed
    return []
  }
}

/**
 * Get booking by ID
 * @param {string} bookingId - Booking document ID
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
    const bookingDoc = await getDoc(bookingRef)
    
    if (!bookingDoc.exists()) {
      return {
        success: false,
        error: 'Booking not found'
      }
    }

    return {
      success: true,
      data: {
        id: bookingDoc.id,
        ...bookingDoc.data()
      }
    }
  } catch (error) {
    console.error('Error fetching booking:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch booking'
    }
  }
}

/**
 * Check if dates are available (not blocked by confirmed bookings)
 */
export const checkDateAvailability = async (apartmentId, checkinDate, checkoutDate, options = {}) => {
  try {
    const { excludeBookingId } = options
    const confirmedBookings = await getConfirmedBookings()
    // Normalize dates to start of day for accurate comparison
    const checkin = new Date(checkinDate)
    checkin.setHours(0, 0, 0, 0)
    const checkout = new Date(checkoutDate)
    checkout.setHours(0, 0, 0, 0)
    
    // Check if any confirmed booking overlaps with requested dates
    const hasConflict = confirmedBookings.some(booking => {
      if (excludeBookingId && booking.id === excludeBookingId) return false
      if (booking.apartment_id !== apartmentId) return false
      
      // Handle both Timestamp objects and date strings
      let bookingCheckin, bookingCheckout
      if (booking.checkin_date && booking.checkin_date.toDate) {
        bookingCheckin = booking.checkin_date.toDate()
      } else if (booking.checkin_date) {
        bookingCheckin = new Date(booking.checkin_date)
      } else {
        return false
      }
      
      if (booking.checkout_date && booking.checkout_date.toDate) {
        bookingCheckout = booking.checkout_date.toDate()
      } else if (booking.checkout_date) {
        bookingCheckout = new Date(booking.checkout_date)
      } else {
        return false
      }
      
      // Normalize booking dates to start of day
      bookingCheckin.setHours(0, 0, 0, 0)
      bookingCheckout.setHours(0, 0, 0, 0)
      
      // Check for date overlap (exclusive of checkout date)
      return (
        (checkin >= bookingCheckin && checkin < bookingCheckout) ||
        (checkout > bookingCheckin && checkout <= bookingCheckout) ||
        (checkin <= bookingCheckin && checkout >= bookingCheckout)
      )
    })
    
    return !hasConflict
  } catch (error) {
    console.error('Error checking date availability:', error)
    throw error
  }
}

/**
 * Get blocked dates for an apartment (returns array of Date objects)
 */
export const getBlockedDates = async (apartmentId) => {
  try {
    const confirmedBookings = await getConfirmedBookings()
    const blockedDates = []
    
    confirmedBookings
      .filter(booking => booking.apartment_id === apartmentId)
      .forEach(booking => {
        // Handle both Timestamp objects and date strings
        let checkin, checkout
        if (booking.checkin_date && booking.checkin_date.toDate) {
          checkin = booking.checkin_date.toDate()
        } else if (booking.checkin_date) {
          checkin = new Date(booking.checkin_date)
        } else {
          return
        }
        
        if (booking.checkout_date && booking.checkout_date.toDate) {
          checkout = booking.checkout_date.toDate()
        } else if (booking.checkout_date) {
          checkout = new Date(booking.checkout_date)
        } else {
          return
        }
        
        // Normalize to start of day
        checkin.setHours(0, 0, 0, 0)
        checkout.setHours(0, 0, 0, 0)
        
        // Generate array of all dates in the booking range (exclusive of checkout date)
        const currentDate = new Date(checkin)
        while (currentDate < checkout) {
          blockedDates.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }
      })
    
    return blockedDates
  } catch (error) {
    console.error('Error getting blocked dates:', error)
    return [] // Return empty array on error to allow bookings
  }
}

/**
 * Extend or adjust an existing booking stay
 * @param {string} bookingId
 * @param {Date} newCheckinDate
 * @param {Date} newCheckoutDate
 */
export const extendBookingStay = async (bookingId, newCheckinDate, newCheckoutDate) => {
  try {
    if (!newCheckinDate || !newCheckoutDate) {
      throw new Error('Both check-in and check-out dates are required')
    }
    const checkin = newCheckinDate instanceof Date ? newCheckinDate : new Date(newCheckinDate)
    const checkout = newCheckoutDate instanceof Date ? newCheckoutDate : new Date(newCheckoutDate)
    if (checkout <= checkin) {
      throw new Error('Checkout date must be after check-in date')
    }

    const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
    await updateDoc(bookingRef, {
      checkin_date: Timestamp.fromDate(checkin),
      checkout_date: Timestamp.fromDate(checkout),
      updatedAt: Timestamp.now(),
      extendedAt: Timestamp.now()
    })

    return { success: true }
  } catch (error) {
    console.error('Error extending booking stay:', error)
    return {
      success: false,
      error: error.message || 'Failed to extend booking stay'
    }
  }
}

