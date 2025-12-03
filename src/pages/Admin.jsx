import { useState, useEffect, useRef } from 'react'
import { apartments } from '@/data/apartments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ClipboardList, Home, Users, Phone, RefreshCw, Search, Filter, XCircle } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getAllBookings, updateBookingStatus, extendBookingStay, checkDateAvailability } from '@/services/bookingService'
import { Timestamp } from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '@/config/emailjs'

const statusBadgeStyle = {
  pending_payment: 'bg-orange-100 text-orange-700',
  temporary: 'bg-orange-100 text-orange-700', // Support old status for backward compatibility
  booking_successful: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  reservation_failed: 'bg-gray-200 text-gray-700',
}

const statusLabels = {
  pending_payment: 'Pending Payment',
  temporary: 'Temporary Booked', // Support old status
  booking_successful: 'Booking Successful',
  cancelled: 'Cancelled',
  reservation_failed: 'Reservation Not Successful',
}

export default function Admin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' })
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [extendBooking, setExtendBooking] = useState(null)
  const [extendDates, setExtendDates] = useState({ checkin: null, checkout: null })
  const [extendError, setExtendError] = useState('')
  const [extending, setExtending] = useState(false)
  const processedAutoCancelRef = useRef(new Set())
  const applyLocalBookingUpdate = (bookingId, updates) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              ...updates,
            }
          : booking
      )
    )
  }

  useEffect(() => {
    emailjs.init(emailjsConfig.publicKey)
    fetchBookings()
  }, [])

  useEffect(() => {
    if (!loading && bookings.length > 0) {
      autoCancelStaleBookings()
    }
  }, [loading, bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const allBookings = await getAllBookings()
      setBookings(allBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumberWithCommas = (amount) => {
    return amount ? amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'
  }

  const getDateValue = (timestamp) => {
    if (!timestamp) return null
    if (timestamp.toDate) return timestamp.toDate()
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000)
    try {
      return new Date(timestamp)
    } catch {
      return null
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const startDate = dateFilter.start ? new Date(dateFilter.start) : null
  const endDate = dateFilter.end ? new Date(dateFilter.end) : null
  if (startDate) startDate.setHours(0, 0, 0, 0)
  if (endDate) endDate.setHours(23, 59, 59, 999)

  const filteredBookings = bookings.filter((booking) => {
    const fullName = `${booking.first_name || ''} ${booking.last_name || ''}`.trim()
    const matchesSearch =
      !normalizedSearch ||
      [
        fullName,
        booking.first_name,
        booking.last_name,
        booking.user_email,
        booking.user_phone,
        booking.apartment_name,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedSearch))

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending_payment'
          ? booking.status === 'pending_payment' || booking.status === 'temporary'
          : booking.status === statusFilter

    let matchesDate = true
    const bookingCheckin = getDateValue(booking.checkin_date)
    if (startDate && bookingCheckin) {
      matchesDate = matchesDate && bookingCheckin >= startDate
    }
    if (endDate && bookingCheckin) {
      matchesDate = matchesDate && bookingCheckin <= endDate
    }
    if ((startDate || endDate) && !bookingCheckin) {
      matchesDate = false
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const filtersActive =
    normalizedSearch.length > 0 || statusFilter !== 'all' || dateFilter.start || dateFilter.end

  const handleStatusChange = async (bookingId, newStatus, options = {}) => {
    const { silent = false, statusMessage } = options
    try {
      setUpdatingId(bookingId)
      
      // Get the booking details before updating
      const booking = bookings.find(b => b.id === bookingId)
      
      // Update status in Firestore
      await updateBookingStatus(bookingId, newStatus)
      
      // If status changed to booking_successful, send confirmation email via EmailJS
      if (newStatus === 'booking_successful' && booking) {
        try {
          // Format dates
          const checkinDate = booking.checkin_date?.toDate ? 
            booking.checkin_date.toDate().toISOString().split('T')[0] : 
            booking.checkin_date
          const checkoutDate = booking.checkout_date?.toDate ? 
            booking.checkout_date.toDate().toISOString().split('T')[0] : 
            booking.checkout_date

          // Format payment date (use current date/time since payment is being confirmed now)
          const paymentDate = new Date()
          const formattedPaymentDate = paymentDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })

          // Prepare email template parameters
          const templateParams = {
            user_title: booking.user_title || '',
            first_name: booking.first_name || '',
            last_name: booking.last_name || '',
            user_email: booking.user_email || '',
            user_phone: booking.user_phone || '',
            checkin_date: checkinDate,
            checkout_date: checkoutDate,
            payment_date: formattedPaymentDate,
            guest_number: booking.guest_number || '',
            apartment_name: booking.apartment_name || '',
            room_rate: `₦${formatNumberWithCommas(booking.room_rate || booking.price_per_night || 0)}`,
            price_per_night: `₦${formatNumberWithCommas(booking.price_per_night || booking.room_rate || 0)}/night`,
            subtotal: `₦${formatNumberWithCommas(booking.subtotal || 0)}`,
            vat_amount: `₦${formatNumberWithCommas(booking.vat_amount || 0)}`,
            service_charge: `₦${formatNumberWithCommas(booking.service_charge || 0)}`,
            grand_total: `₦${formatNumberWithCommas(booking.grand_total || 0)}`,
            total_nights: booking.total_nights || 0,
            booking_status: 'Booking Confirmed - Payment Received',
          }

          // Send payment confirmation email to client using templateIdCompany
          // This is the template that tells the client their booking has been confirmed
          await emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateIdCompany,
            templateParams
          )
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError)
          // Don't block status update if email fails
          alert('Booking confirmed successfully, but email notification failed. Please notify the guest manually.')
        }
      }

      if ((newStatus === 'cancelled' || newStatus === 'reservation_failed') && booking) {
        try {
          const checkinDate = booking.checkin_date?.toDate ? 
            booking.checkin_date.toDate().toISOString().split('T')[0] : 
            booking.checkin_date
          const checkoutDate = booking.checkout_date?.toDate ? 
            booking.checkout_date.toDate().toISOString().split('T')[0] : 
            booking.checkout_date

          const message =
            statusMessage ||
            (newStatus === 'cancelled'
              ? 'Booking cancelled - please contact support for more details.'
              : 'Reservation not successful - payment window (48 hours) elapsed.')

          const templateParams = {
            user_title: booking.user_title || '',
            first_name: booking.first_name || '',
            last_name: booking.last_name || '',
            user_email: booking.user_email || '',
            user_phone: booking.user_phone || '',
            checkin_date: checkinDate,
            checkout_date: checkoutDate,
            guest_number: booking.guest_number || '',
            apartment_name: booking.apartment_name || '',
            room_rate: `₦${formatNumberWithCommas(booking.room_rate || booking.price_per_night || 0)}`,
            price_per_night: `₦${formatNumberWithCommas(booking.price_per_night || booking.room_rate || 0)}/night`,
            booking_status: message,
          }

          await emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateIdClient,
            templateParams
          )

          await emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateIdCompany,
            templateParams
          )
        } catch (emailError) {
          console.error('Error sending cancellation email:', emailError)
          if (!silent) {
            alert('Status updated, but notification email failed. Please follow up manually.')
          }
        }
      }
      
      const localUpdate = { status: newStatus, updatedAt: new Date() }
      if (newStatus === 'booking_successful') {
        localUpdate.paymentDate = new Date()
      }
      if (newStatus === 'cancelled' || newStatus === 'reservation_failed') {
        localUpdate.paymentDate = null
        localUpdate.cancellationDate = new Date()
      }
      applyLocalBookingUpdate(bookingId, localUpdate)

      // Refresh bookings after update (ensures sync with Firestore)
      await fetchBookings()
      
      if (!silent) {
        if (newStatus === 'booking_successful') {
          alert('Booking confirmed! Confirmation email has been sent to the guest.')
        } else if (newStatus === 'cancelled') {
          alert('Booking cancelled. Guest has been notified.')
        } else if (newStatus === 'reservation_failed') {
          alert('Reservation marked as not successful.')
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      if (!silent) {
        alert('Failed to update booking status. Please try again.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancelBooking = async (booking) => {
    if (!booking) return
    const guestName = `${booking.first_name || ''} ${booking.last_name || ''}`.trim() || 'this guest'
    const shouldCancel = window.confirm(
      `Cancel booking for ${guestName}? This will free up the reserved dates.`
    )
    if (!shouldCancel) return
    await handleStatusChange(booking.id, 'cancelled')
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter({ start: '', end: '' })
  }

  const autoCancelStaleBookings = async () => {
    const now = new Date()
    const staleBookings = bookings.filter((booking) => {
      if (!(booking.status === 'pending_payment' || booking.status === 'temporary')) return false
      if (processedAutoCancelRef.current.has(booking.id)) return false
      const createdAt = getDateValue(booking.createdAt)
      if (!createdAt) return false
      const hoursDiff = (now - createdAt) / (1000 * 60 * 60)
      return hoursDiff >= 48
    })

    if (staleBookings.length === 0) return

    for (const booking of staleBookings) {
      processedAutoCancelRef.current.add(booking.id)
      await handleStatusChange(booking.id, 'reservation_failed', {
        silent: true,
        statusMessage: 'Reservation not successful - payment was not received within 48 hours.',
      })
    }
  }

  const openExtendModal = (booking) => {
    const existingCheckin = getDateValue(booking.checkin_date)
    const existingCheckout = getDateValue(booking.checkout_date)
    setExtendBooking(booking)
    setExtendDates({
      checkin: existingCheckin || new Date(),
      checkout: existingCheckout || new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    setExtendError('')
    setExtendModalOpen(true)
  }

  const closeExtendModal = () => {
    setExtendModalOpen(false)
    setExtendBooking(null)
    setExtendError('')
    setExtending(false)
  }

  const handleExtendStaySubmit = async () => {
    if (!extendBooking) return
    const { checkin, checkout } = extendDates
    if (!checkin || !checkout) {
      setExtendError('Please select both check-in and check-out dates.')
      return
    }
    if (checkout <= checkin) {
      setExtendError('Check-out date must be after check-in date.')
      return
    }

    setExtending(true)
    setExtendError('')

    try {
      const isAvailable = await checkDateAvailability(
        extendBooking.apartment_id,
        checkin,
        checkout,
        { excludeBookingId: extendBooking.id }
      )

      if (!isAvailable) {
        setExtendError('These dates conflict with another confirmed booking. Please choose different dates.')
        setExtending(false)
        return
      }

      const result = await extendBookingStay(extendBooking.id, checkin, checkout)
      if (!result.success) {
        throw new Error(result.error || 'Failed to extend stay.')
      }

      const formattedCheckin = checkin.toISOString().split('T')[0]
      const formattedCheckout = checkout.toISOString().split('T')[0]

      const templateParams = {
        user_title: extendBooking.user_title || '',
        first_name: extendBooking.first_name || '',
        last_name: extendBooking.last_name || '',
        user_email: extendBooking.user_email || '',
        user_phone: extendBooking.user_phone || '',
        checkin_date: formattedCheckin,
        checkout_date: formattedCheckout,
        guest_number: extendBooking.guest_number || '',
        apartment_name: extendBooking.apartment_name || '',
        booking_status: 'Stay extended successfully. New dates have been confirmed.',
      }

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateIdClient,
        templateParams
      )

      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateIdCompany,
        templateParams
      )

      await fetchBookings()
      closeExtendModal()
      alert('Stay extended successfully. Guest has been notified.')
    } catch (error) {
      console.error('Error extending stay:', error)
      setExtendError(error.message || 'Failed to extend stay. Please try again.')
    } finally {
      setExtending(false)
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    return 'N/A'
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    return 'N/A'
  }
  const totalGuestsCapacity = apartments.reduce((sum, apt) => sum + apt.details.maxGuests, 0)
  const averageRating = (apartments.reduce((sum, apt) => sum + (apt.rating || 0), 0) / apartments.length).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-sm uppercase tracking-[4px] text-orange-600 font-semibold">Admin Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-3">Prestine Apartments Control Center</h1>
          <p className="text-gray-600 mt-4 max-w-2xl">
            Monitor bookings, manage apartments, and keep track of guest activities seamlessly. This dashboard gives
            you a quick overview of business performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Apartments</CardTitle>
                  <CardDescription>Total active listings</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-900">{apartments.length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Pending</CardTitle>
                  <CardDescription>Temporary bookings</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-orange-600">
                  {bookings.filter(b => b.status === 'temporary' || b.status === 'pending_payment').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Confirmed</CardTitle>
                  <CardDescription>Successful bookings</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'booking_successful').length}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">Avg. Rating</CardTitle>
                  <CardDescription>Across all apartments</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="border border-orange-200 shadow-lg">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif text-gray-900">Recent Bookings</CardTitle>
                  <CardDescription>Latest guest activities</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={fetchBookings}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-orange-700 font-semibold mb-4">
                    <Filter className="h-4 w-4" />
                    Smart Filters
                  </div>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Search guest / email / phone
                      </label>
                      <div className="relative mt-1">
                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Type a guest name, email, phone or apartment"
                          className="w-full pl-9 pr-3 py-2 border border-orange-200 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full mt-1 border border-orange-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="all">All statuses</option>
                        <option value="pending_payment">Pending / Temporary</option>
                        <option value="booking_successful">Booking Successful</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="reservation_failed">Reservation Not Successful</option>
                      </select>
                    </div>
                    <div className="grid gap-3">
                      <div>
                        <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          Check-In from
                        </label>
                        <input
                          type="date"
                          value={dateFilter.start}
                          onChange={(e) => setDateFilter((prev) => ({ ...prev, start: e.target.value }))}
                          className="w-full mt-1 border border-orange-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          Check-In to
                        </label>
                        <input
                          type="date"
                          value={dateFilter.end}
                          onChange={(e) => setDateFilter((prev) => ({ ...prev, end: e.target.value }))}
                          className="w-full mt-1 border border-orange-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mt-4">
                    <p className="text-sm text-orange-700">
                      Showing <span className="font-semibold">{filteredBookings.length}</span> booking
                      {filteredBookings.length === 1 ? '' : 's'} out of {bookings.length}
                    </p>
                    {filtersActive && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-orange-700 hover:bg-orange-100 w-full md:w-auto"
                        onClick={resetFilters}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading bookings...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No bookings yet</div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No bookings match your filters. Try adjusting the search.
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-gray-500 uppercase tracking-wide text-xs border-b">
                          <th className="py-3">Guest</th>
                          <th className="py-3">Apartment</th>
                          <th className="py-3">Check-In</th>
                          <th className="py-3">Check-Out</th>
                          <th className="py-3">Booking Date</th>
                          <th className="py-3">Status</th>
                          <th className="py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking.id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-4">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {booking.user_title} {booking.first_name} {booking.last_name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Phone className="h-3 w-3 text-gray-400" />
                                  <a href={`tel:${booking.user_phone}`} className="text-xs text-gray-500 hover:text-orange-600">
                                    {booking.user_phone}
                                  </a>
                                </div>
                                <p className="text-xs text-gray-500">{booking.user_email}</p>
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="font-medium">{booking.apartment_name}</p>
                              <p className="text-xs text-gray-500">{booking.guest_number} Guest{booking.guest_number > 1 ? 's' : ''}</p>
                            </td>
                            <td className="py-4 text-gray-700">{formatDate(booking.checkin_date)}</td>
                            <td className="py-4 text-gray-700">{formatDate(booking.checkout_date)}</td>
                            <td className="py-4 text-gray-700">
                              <p className="text-sm">{formatDate(booking.createdAt)}</p>
                              <p className="text-xs text-gray-400">{formatDateTime(booking.createdAt)}</p>
                            </td>
                            <td className="py-4">
                              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadgeStyle[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                                {statusLabels[booking.status] || booking.status}
                              </span>
                            </td>
                            <td className="py-4 space-y-2">
                              {(booking.status === 'temporary' || booking.status === 'pending_payment') && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                                  onClick={() => handleStatusChange(booking.id, 'booking_successful')}
                                  disabled={updatingId === booking.id}
                                >
                                  {updatingId === booking.id ? 'Updating…' : 'Confirm Booking'}
                                </Button>
                              )}
                              {booking.status === 'booking_successful' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-200 text-green-700 hover:bg-green-50 w-full"
                                    onClick={() => openExtendModal(booking)}
                                  >
                                    Extend Stay
                                  </Button>
                                  <span className="text-xs text-green-600 font-semibold block text-center">
                                    Confirmed
                                  </span>
                                </>
                              )}
                              {booking.status === 'cancelled' && (
                                <span className="text-xs text-red-600 font-semibold block">Cancelled</span>
                              )}

                              {booking.status !== 'cancelled' && booking.status !== 'reservation_failed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 w-full"
                                  onClick={() => handleCancelBooking(booking)}
                                  disabled={updatingId === booking.id}
                                >
                                  {updatingId === booking.id ? 'Updating…' : 'Cancel Booking'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Quick Actions</CardTitle>
                <CardDescription className="text-gray-300">Manage site content in seconds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/apartments">
                  <Button className="w-full bg-white text-slate-900 hover:bg-gray-100">View Apartments</Button>
                </Link>
                <Link to="/policies">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    Update Policies
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    Contact Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border border-orange-200 shadow-lg">
              <CardHeader className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">System Notes</CardTitle>
                  <CardDescription>Latest maintenance updates</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">Firestore</p>
                  <p>Bookings are now saved to Firestore database.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Date Blocking</p>
                  <p>Confirmed bookings automatically block dates.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">EmailJS</p>
                  <p>Reservation notifications are running normally.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {extendModalOpen && extendBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div>
              <h3 className="text-2xl font-serif font-semibold text-gray-900">Extend Stay</h3>
              <p className="text-sm text-gray-500 mt-1">
                Updating booking for {extendBooking.first_name} {extendBooking.last_name} in{' '}
                {extendBooking.apartment_name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  New Check-In Date
                </label>
                <DatePicker
                  selected={extendDates.checkin}
                  onChange={(date) => setExtendDates((prev) => ({ ...prev, checkin: date }))}
                  selectsStart
                  startDate={extendDates.checkin}
                  endDate={extendDates.checkout}
                  maxDate={extendDates.checkout || null}
                  className="w-full mt-1 border border-orange-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                  New Check-Out Date
                </label>
                <DatePicker
                  selected={extendDates.checkout}
                  onChange={(date) => setExtendDates((prev) => ({ ...prev, checkout: date }))}
                  selectsEnd
                  startDate={extendDates.checkin}
                  endDate={extendDates.checkout}
                  minDate={
                    extendDates.checkin
                      ? new Date(extendDates.checkin.getTime() + 24 * 60 * 60 * 1000)
                      : new Date()
                  }
                  className="w-full mt-1 border border-orange-200 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>
                Selected stay: <span className="font-semibold">
                  {extendDates.checkin
                    ? extendDates.checkin.toLocaleDateString()
                    : '—'}{' '}
                  to{' '}
                  {extendDates.checkout
                    ? extendDates.checkout.toLocaleDateString()
                    : '—'}
                </span>
              </p>
              <p className="mt-2">
                Once saved, the calendar will block these new dates immediately so no other guest
                can book them.
              </p>
            </div>

            {extendError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {extendError}
              </div>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
                onClick={closeExtendModal}
                disabled={extending}
              >
                Close
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleExtendStaySubmit}
                disabled={extending}
              >
                {extending ? 'Saving...' : 'Save Extension'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}