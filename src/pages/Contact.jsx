import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for any inquiries, bookings, or assistance. We're here to help!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-600">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <MapPin className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        Plot 219, Apo Dutse, Apo, Abuja FCT, Nigeria
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Phone className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a href="tel:+2348029823593" className="text-orange-600 hover:text-orange-700 transition-colors">
                        (+234) 0802 982 3593
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Mail className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href="mailto:Support@prestineapartment.com" className="text-orange-600 hover:text-orange-700 transition-colors">
                        Support@prestineapartment.com
                      </a>
                    </div>
                  </motion.div>

                  {/* Social Media */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-6 border-t border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-orange-100 hover:bg-orange-600 flex items-center justify-center transition-colors group"
                        aria-label="Facebook"
                      >
                        <Facebook className="text-orange-600 group-hover:text-white" size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-orange-100 hover:bg-blue-400 flex items-center justify-center transition-colors group"
                        aria-label="Twitter"
                      >
                        <Twitter className="text-orange-600 group-hover:text-white" size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-orange-100 hover:bg-pink-600 flex items-center justify-center transition-colors group"
                        aria-label="Instagram"
                      >
                        <Instagram className="text-orange-600 group-hover:text-white" size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-orange-100 hover:bg-blue-700 flex items-center justify-center transition-colors group"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="text-orange-600 group-hover:text-white" size={20} />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-orange-100 hover:bg-red-600 flex items-center justify-center transition-colors group"
                        aria-label="YouTube"
                      >
                        <Youtube className="text-orange-600 group-hover:text-white" size={20} />
                      </a>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="bg-orange-50 border-b border-orange-200">
                <CardTitle className="text-orange-600 flex items-center gap-2">
                  <MapPin size={24} />
                  Find Us on Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.8384986523947!2d7.4910934000000005!3d8.987004599999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0d2a678a79e3%3A0x1124c0d588f26144!2sPleasant%20Places%2CApo!5e0!3m2!1sen!2sng!4v1735572037165!5m2!1sen!2sng"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="text-orange-600">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="font-semibold text-gray-900 mb-2 text-xl">Monday - Saturday</p>
                  <p className="text-gray-600">24/7</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2 text-xl">Sunday</p>
                  <p className="text-gray-600">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

