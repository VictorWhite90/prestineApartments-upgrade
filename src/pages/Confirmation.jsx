import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function Confirmation() {
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
            <CheckCircle className="h-20 w-20 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
            Reservation Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your reservation. We've sent a confirmation email to your inbox.
            Our team will contact you shortly to finalize the details.
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
            <Link to="/apartments">
              <Button variant="outline" className="w-full">
                View More Apartments
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


