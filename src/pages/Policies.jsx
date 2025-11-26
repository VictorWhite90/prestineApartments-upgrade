import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { X } from 'lucide-react'
import ReservationForm from '@/components/ReservationForm'
import { apartments } from '@/data/apartments'

export default function Policies() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApartment, setSelectedApartment] = useState(apartments[0])
  const policies = [
    {
      number: 1,
      text: "Check-out time is 12 noon prompt. Extension will attract the appropriate night rate."
    },
    {
      number: 2,
      text: "Booking is confirmed only when payment has been received by the Management and a Booking Confirmation Advice is sent."
    },
    {
      number: 3,
      text: "Refund of payment is made if booking is cancelled within 48 hours to check-in date."
    },
    {
      number: 4,
      text: "A valid means of identification is required to be presented on arrival for checking in."
    },
    {
      number: 5,
      text: "The apartment is provided with cooking and laundry appliances. Any special requests concerning laundry and cooking should be made in advance."
    },
    {
      number: 6,
      text: "Smoking is not allowed in the apartment or in any part of the facility."
    },
    {
      number: 7,
      text: "The occupant will not do anything that will create inconvenience to other apartment users."
    },
    {
      number: 8,
      text: "The occupant will not use the apartment for any illicit or illegal activities or any activity of a criminal nature. The Management of the apartment facility is under obligation to report any activity of a suspicious criminal nature to the security agencies."
    },
    {
      number: 9,
      text: "The facilities and appliances provided in the apartment are for use solely within the apartment."
    },
    {
      number: 10,
      text: "The facilities and appliances in the apartment are for the convenience and comfort of the occupant and are to be used responsibly and without damages to avoid a surcharge."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl">
            <CardHeader className="bg-orange-600 text-white">
              <CardTitle className="text-3xl md:text-4xl font-bold text-center">
                Booking Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg text-gray-700 mb-8 leading-relaxed"
              >
                Welcome to Prestine Apartments. To ensure a comfortable and secure stay for all our guests, please take a moment to read through our policies before proceeding with your booking.
              </motion.p>

              <div className="space-y-6 mb-8">
                {policies.map((policy, index) => (
                  <motion.div
                    key={policy.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                      {policy.number}
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1 pt-1">
                      {policy.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="bg-gray-100 p-6 rounded-lg mb-6"
              >
                <p className="text-gray-900 font-semibold text-center">
                  By proceeding with the booking, you accept the above policies.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg"
                >
                  Book Reservation
                </Button>
                <Link to="/">
                  <Button variant="outline" className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-6 text-lg">
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold font-serif text-gray-900">Make a Reservation</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {/* Apartment Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Apartment
                    </label>
                    <select
                      value={selectedApartment?.id || ''}
                      onChange={(e) => {
                        const apt = apartments.find(a => a.id === e.target.value)
                        if (apt) setSelectedApartment(apt)
                      }}
                      className="w-full rounded-md border border-input bg-white text-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                    >
                      {apartments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          {apt.name} - ₦{apt.price.toLocaleString()}/night
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reservation Form */}
                  {selectedApartment && (
                    <ReservationForm apartment={selectedApartment} price={selectedApartment.price} />
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}


