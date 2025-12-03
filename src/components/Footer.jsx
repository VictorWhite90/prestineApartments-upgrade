import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/apartments', label: 'Apartments' },
    { path: '/services', label: 'Services' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ]

  const services = [
    'Short-term Rentals',
    'Long-term Rentals',
    'Corporate Housing',
    'Event Accommodation',
    'Airport Transfers',
    'Concierge Services',
  ]

  return (
    <footer className="bg-slate-900 text-gray-300 mt-20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/images/prestine ;ogo.png" 
                alt="Prestine Apartments" 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Experience unparalleled comfort and elegance in the heart of Abuja. 
              Where luxury meets convenience for the discerning traveler.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-400 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 font-serif">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm hover:text-orange-400 transition-colors group"
                  >
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 font-serif">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-sm hover:text-blue-400 transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold text-lg mb-6 font-serif">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white mb-1">Address</p>
                  <p className="text-gray-400">
                    Plot 219, Apo Dutse, Apo,<br />
                    Abuja FCT, Nigeria
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <a
                    href="tel:+2348029823593"
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    (+234) 0802 982 3593
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <a
                    href="mailto:Support@prestineapartment.com"
                    className="text-gray-400 hover:text-blue-400 transition-colors break-all"
                  >
                    Support@prestineapartment.com
                  </a>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              Copyright © {currentYear}{' '}
              <span className="text-white font-semibold">Prestine Apartments</span>. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/policies" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/policies" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
