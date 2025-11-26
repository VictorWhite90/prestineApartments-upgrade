import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { XCircle, MessageCircle } from 'lucide-react'

export default function BookingError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <XCircle className="h-20 w-20 text-orange-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
            Booking Not Successful
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but your booking request could not be processed at this time.
            Please try again shortly or contact us via WhatsApp for immediate assistance.
          </p>
          <div className="space-y-4">
            <a
              href="https://wa.me/2348029823593"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Us via WhatsApp
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link to="/apartments">
              <Button variant="outline" className="w-full">
                Try Booking Again
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

