import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { emailjsConfig } from '@/config/emailjs'
import { motion } from 'framer-motion'

export default function ReservationForm({ apartment, price }) {
  const navigate = useNavigate()
  const [subtotal, setSubtotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const checkinDate = watch('checkin_date')
  const checkoutDate = watch('checkout_date')

  useEffect(() => {
    emailjs.init(emailjsConfig.publicKey)
  }, [])

  useEffect(() => {
    if (checkinDate && checkoutDate) {
      const checkin = new Date(checkinDate)
      const checkout = new Date(checkoutDate)
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
    setIsSubmitting(true)
    
    const { vatAmount, serviceCharge, grandTotal } = calculateCharges()
    const checkin = new Date(data.checkin_date)
    const checkout = new Date(data.checkout_date)
    const totalNights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24))

    const templateParams = {
      user_title: data.user_title,
      first_name: data.first_name,
      last_name: data.last_name,
      user_email: data.user_email,
      user_phone: data.user_phone,
      checkin_date: data.checkin_date,
      checkout_date: data.checkout_date,
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

      // Redirect to confirmation page on success (no popup)
      navigate('/confirmation')
    } catch (error) {
      console.error('EmailJS Error:', error)
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
          <CardTitle>Make a Reservation</CardTitle>
          <CardDescription>Fill out the form below to book this apartment</CardDescription>
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
              <Input
                id="checkin_date"
                type="date"
                {...register('checkin_date', { required: 'Check-in date is required' })}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.checkin_date && (
                <p className="text-red-500 text-sm mt-1">{errors.checkin_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="checkout_date">Check-Out Date</Label>
              <Input
                id="checkout_date"
                type="date"
                {...register('checkout_date', { required: 'Check-out date is required' })}
                min={checkinDate || new Date().toISOString().split('T')[0]}
              />
              {errors.checkout_date && (
                <p className="text-red-500 text-sm mt-1">{errors.checkout_date.message}</p>
              )}
            </div>

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
                <a href="/policies" target="_blank" className="text-primary hover:underline">
                  Prestine Apartment policies
                </a>.
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

