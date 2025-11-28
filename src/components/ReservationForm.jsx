import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { emailjsConfig } from '@/config/emailjs'
import { motion } from 'framer-motion'
import { createTemporaryBooking, checkDateAvailability, getBlockedDates } from '@/services/bookingService'
import { apartments } from '@/data/apartments'
import { Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

export default function ReservationForm({ apartment, price }) {
  const { user } = useAuth() // Get current user if logged in
  const navigate = useNavigate()
  const [subtotal, setSubtotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateError, setDateError] = useState(null)
  const [blockedDates, setBlockedDates] = useState([])
  const [loadingDates, setLoadingDates] = useState(true)
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm()

  const checkinDate = watch('checkin_date')
  const checkoutDate = watch('checkout_date')

  useEffect(() => {
    emailjs.init(emailjsConfig.publicKey)
  }, [])

  // Fetch blocked dates when apartment changes
  useEffect(() => {
    const fetchBlockedDates = async () => {
      if (apartment?.id) {
        setLoadingDates(true)
        try {
          const blocked = await getBlockedDates(apartment.id)
          setBlockedDates(blocked)
        } catch (error) {
          console.error('Error fetching blocked dates:', error)
          setBlockedDates([])
        } finally {
          setLoadingDates(false)
        }
      }
    }
    fetchBlockedDates()
  }, [apartment?.id])

  useEffect(() => {
    if (checkinDate && checkoutDate) {
      const checkin = checkinDate instanceof Date ? checkinDate : new Date(checkinDate)
      const checkout = checkoutDate instanceof Date ? checkoutDate : new Date(checkoutDate)
      const diffTime = Math.abs(checkout - checkin)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays > 0 && !isNaN(diffDays)) {
        setSubtotal(diffDays * price)
      } else {
        setSubtotal(0)
      }
    } else {
      setSubtotal(0)
    }
  }, [checkinDate, checkoutDate, price])

  const formatNumberWithCommas = (amount) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
  }

  const calculateCharges = () => {
    const vatAmount = subtotal * 0.075
    const serviceCharge = subtotal * 0.1
    const grandTotal = subtotal + vatAmount + serviceCharge
    return { vatAmount, serviceCharge, grandTotal }
  }

  const onSubmit = async (data) => {
    if (!apartment || !apartment.id) {
      setDateError('Please select an apartment')
      return
    }

    setIsSubmitting(true)
    setDateError(null)
    
    const { vatAmount, serviceCharge, grandTotal } = calculateCharges()
    const checkin = data.checkin_date instanceof Date ? data.checkin_date : new Date(data.checkin_date)
    const checkout = data.checkout_date instanceof Date ? data.checkout_date : new Date(data.checkout_date)
    const totalNights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24))

    try {
      // Double-check date availability (dates are already blocked in calendar, but this is a safety check)
      try {
        const checkinStr = checkin instanceof Date ? checkin.toISOString().split('T')[0] : checkin
        const checkoutStr = checkout instanceof Date ? checkout.toISOString().split('T')[0] : checkout
        const isAvailable = await checkDateAvailability(
          apartment.id,
          checkinStr,
          checkoutStr
        )
        
        if (!isAvailable) {
          setDateError('❌ These dates are not available. This apartment is already booked for the selected dates. Please choose different dates.')
          setIsSubmitting(false)
          return // Block the booking
        }
      } catch (availabilityError) {
        console.error('Date availability check failed:', availabilityError)
        setDateError('Unable to verify date availability. Please try again or contact us.')
        setIsSubmitting(false)
        return // Block booking if we can't verify dates
      }

      // Prepare booking data for Firestore (only if dates are available)
      const bookingData = {
        apartment_id: apartment.id,
        apartment_name: apartment.name,
        apartment_slug: apartment.slug,
        user_title: data.user_title,
        first_name: data.first_name,
        last_name: data.last_name,
        user_email: data.user_email,
        user_phone: data.user_phone,
        // Include userId if user is logged in (optional - allows guest bookings)
        userId: user?.uid || null,
        userName: `${data.first_name} ${data.last_name}`,
        phoneNumber: data.user_phone,
        checkin_date: Timestamp.fromDate(data.checkin_date instanceof Date ? data.checkin_date : new Date(data.checkin_date)),
        checkout_date: Timestamp.fromDate(data.checkout_date instanceof Date ? data.checkout_date : new Date(data.checkout_date)),
        guest_number: parseInt(data.guest_number),
        totalPrice: grandTotal,
        room_rate: price,
        price_per_night: price,
        subtotal: subtotal,
        vat_amount: vatAmount,
        service_charge: serviceCharge,
        grand_total: grandTotal,
        total_nights: totalNights,
      }

      // Save to Firestore as pending_payment booking
      const result = await createTemporaryBooking(bookingData)
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create booking')
      }
      
      console.log('Booking saved to Firestore with ID:', result.bookingId)

      // Prepare EmailJS template parameters
      const templateParams = {
        user_title: data.user_title,
        first_name: data.first_name,
        last_name: data.last_name,
        user_email: data.user_email,
        user_phone: data.user_phone,
        checkin_date: data.checkin_date instanceof Date ? data.checkin_date.toISOString().split('T')[0] : data.checkin_date,
        checkout_date: data.checkout_date instanceof Date ? data.checkout_date.toISOString().split('T')[0] : data.checkout_date,
        guest_number: data.guest_number,
        apartment_name: apartment.name,
        room_rate: `₦${formatNumberWithCommas(price)}`,
        price_per_night: `₦${formatNumberWithCommas(price)}/night`,
        subtotal: `₦${formatNumberWithCommas(subtotal)}`,
        vat_amount: `₦${formatNumberWithCommas(vatAmount)}`,
        service_charge: `₦${formatNumberWithCommas(serviceCharge)}`,
        grand_total: `₦${formatNumberWithCommas(grandTotal)}`,
        total_nights: totalNights,
      }

      // Send emails via EmailJS
      try {
        // Send to client
        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateIdClient,
          templateParams
        )
        
        // Send to company
        await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateIdCompany,
          templateParams
        )
      } catch (emailError) {
        console.error('EmailJS Error (booking still saved):', emailError)
        // Continue even if email fails - booking is saved to Firestore
      }

      // Redirect to confirmation page on success
      navigate('/confirmation')
    } catch (error) {
      console.error('Booking Error:', error)
      setDateError(error.message || 'An error occurred. Please try again.')
      // Redirect to booking error page on failure
      navigate('/booking-error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const { vatAmount, serviceCharge, grandTotal } = calculateCharges()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Check Available Dates</CardTitle>
          <CardDescription>Select your dates to see availability and book this apartment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="user_title">Title</Label>
              <Select id="user_title" {...register('user_title', { required: 'Title is required' })}>
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Other">Other</option>
              </Select>
              {errors.user_title && (
                <p className="text-red-500 text-sm mt-1">{errors.user_title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...register('first_name', { required: 'First name is required' })}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...register('last_name', { required: 'Last name is required' })}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="user_email">Email Address</Label>
              <Input
                id="user_email"
                type="email"
                {...register('user_email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your email"
              />
              {errors.user_email && (
                <p className="text-red-500 text-sm mt-1">{errors.user_email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="user_phone">Phone Number</Label>
              <Input
                id="user_phone"
                type="tel"
                {...register('user_phone', { required: 'Phone number is required' })}
                placeholder="Enter your phone number"
              />
              {errors.user_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.user_phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="checkin_date">Check-In Date</Label>
              <Controller
                name="checkin_date"
                control={control}
                rules={{ required: 'Check-in date is required' }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        setDateError(null) // Clear any previous errors
                      }}
                      selectsStart
                      startDate={checkinDate}
                      endDate={checkoutDate}
                      minDate={new Date()}
                      excludeDates={blockedDates}
                      placeholderText="Select check-in date"
                      dateFormat="MM/dd/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={loadingDates}
                      wrapperClassName="w-full"
                      calendarClassName="shadow-xl"
                      filterDate={(date) => {
                        // Disable past dates
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const checkDate = new Date(date)
                        checkDate.setHours(0, 0, 0, 0)
                        if (checkDate < today) return false
                        return true
                      }}
                    />
                  </div>
                )}
              />
              {errors.checkin_date && (
                <p className="text-red-500 text-sm mt-1">{errors.checkin_date.message}</p>
              )}
              {loadingDates && (
                <p className="text-gray-500 text-xs mt-1">Loading available dates...</p>
              )}
            </div>

            <div>
              <Label htmlFor="checkout_date">Check-Out Date</Label>
              <Controller
                name="checkout_date"
                control={control}
                rules={{ 
                  required: 'Check-out date is required',
                  validate: (value) => {
                    if (checkinDate && value && value <= checkinDate) {
                      return 'Check-out date must be after check-in date'
                    }
                    return true
                  }
                }}
                render={({ field }) => (
                  <div className="relative">
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date)
                        setDateError(null) // Clear any previous errors
                      }}
                      selectsEnd
                      startDate={checkinDate}
                      endDate={checkoutDate}
                      minDate={checkinDate ? new Date(checkinDate.getTime() + 86400000) : new Date()}
                      excludeDates={blockedDates}
                      placeholderText="Select check-out date"
                      dateFormat="MM/dd/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={loadingDates || !checkinDate}
                      wrapperClassName="w-full"
                      calendarClassName="shadow-xl"
                      filterDate={(date) => {
                        // Disable dates before or equal to check-in
                        if (checkinDate) {
                          const checkin = new Date(checkinDate)
                          checkin.setHours(0, 0, 0, 0)
                          const checkDate = new Date(date)
                          checkDate.setHours(0, 0, 0, 0)
                          if (checkDate <= checkin) return false
                        }
                        // Disable past dates
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const checkDate = new Date(date)
                        checkDate.setHours(0, 0, 0, 0)
                        if (checkDate < today) return false
                        return true
                      }}
                    />
                  </div>
                )}
              />
              {errors.checkout_date && (
                <p className="text-red-500 text-sm mt-1">{errors.checkout_date.message}</p>
              )}
            </div>

            {dateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{dateError}</p>
              </div>
            )}
            
            {blockedDates.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <p>ℹ️ Unavailable dates are automatically grayed out in the calendar</p>
              </div>
            )}

            <div>
              <Label htmlFor="guest_number">Number of Guests</Label>
              <Select
                id="guest_number"
                {...register('guest_number', { 
                  required: 'Number of guests is required',
                  min: { value: 1, message: 'At least 1 guest is required' }
                })}
              >
                <option value="">Select number of guests</option>
                {apartment?.details?.maxGuests && Array.from({ length: apartment.details.maxGuests }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </Select>
              {errors.guest_number && (
                <p className="text-red-500 text-sm mt-1">{errors.guest_number.message}</p>
              )}
            </div>

            {subtotal > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal (Excluding VAT):</span>
                  <span className="font-bold">₦{formatNumberWithCommas(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>VAT (7.5%):</span>
                  <span>₦{formatNumberWithCommas(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Service Charge (10%):</span>
                  <span>₦{formatNumberWithCommas(serviceCharge)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Grand Total:</span>
                  <span>₦{formatNumberWithCommas(grandTotal)}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="policyCheck"
                {...register('policyCheck', { required: 'You must agree to the policies' })}
                className="mt-1"
              />
              <label htmlFor="policyCheck" className="text-sm">
                By clicking on the submit button, I agree to{' '}
                <Link to="/policies" target="_blank" className="text-primary hover:underline">
                  Prestine Apartment policies
                </Link>.
              </label>
            </div>
            {errors.policyCheck && (
              <p className="text-red-500 text-sm">{errors.policyCheck.message}</p>
            )}

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

