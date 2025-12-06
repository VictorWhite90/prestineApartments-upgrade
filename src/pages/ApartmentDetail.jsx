import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apartments } from '@/data/apartments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ReservationForm from '@/components/ReservationForm'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ApartmentDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const apartment = apartments.find((apt) => apt.slug === slug)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [starPosition, setStarPosition] = useState({ top: '15%', left: '15%' })
  const [showStar, setShowStar] = useState(true)
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)

  // Get other apartments (excluding current one)
  const otherApartments = apartments.filter((apt) => apt.id !== apartment?.id)

  // Defined positions: top-left, bottom-right, bottom-left, top-center, bottom-center, top-right
  // Positioned at edges to avoid "Book Now" text in center
  const starPositions = [
    { top: '10%', left: '8%' },       // top-left
    { top: '70%', left: '88%' },      // bottom-right
    { top: '70%', left: '8%' },       // bottom-left
    { top: '10%', left: '48%' },      // top-center
    { top: '70%', left: '48%' },      // bottom-center
    { top: '10%', left: '88%' },      // top-right
  ]

  // Sparkling star effect at specific positions
  useEffect(() => {
    const interval = setInterval(() => {
      // Hide star (blink off)
      setShowStar(false)

      setTimeout(() => {
        // Move to next position
        setCurrentPositionIndex((prev) => (prev + 1) % starPositions.length)
        setStarPosition(starPositions[(currentPositionIndex + 1) % starPositions.length])

        // Show star (blink on)
        setShowStar(true)
      }, 300) // Brief delay before appearing at new position
    }, 2500) // Change position every 2.5 seconds (stay visible longer)

    return () => clearInterval(interval)
  }, [currentPositionIndex])

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 font-serif">Apartment Not Found</h1>
          <Link to="/apartments">
            <Button>Back to Apartments</Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartment.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + apartment.images.length) % apartment.images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          src={apartment.images[currentImageIndex]}
          alt={apartment.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Image Navigation */}
        {apartment.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

      </section>

      {/* Apartment Name Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif text-gray-900">{apartment.name}</h1>
        </div>
      </section>

      {/* Price and Book Now Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              {apartment.originalPrice && (
                <div className="relative overflow-hidden bg-gray-500/20 text-gray-900 px-4 py-3 rounded-lg inline-block mb-2 group">
                  <div className="absolute inset-0 bg-blue-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
                  <div className="relative z-10 flex flex-col gap-1 transition-colors duration-300">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base md:text-lg font-bold group-hover:text-white transition-colors duration-300">PROMO: ₦{apartment.price.toLocaleString()}/night</span>
                    </div>
                    <span className="text-xs bg-black/10 group-hover:bg-white/20 px-2 py-1 rounded inline-block group-hover:text-white transition-all duration-300">Promo ends on 2 January</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-baseline gap-2">
                  {apartment.originalPrice ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl md:text-3xl font-bold text-blue-600">
                          ₦{apartment.price.toLocaleString()}/night
                        </p>
                        <p className="text-lg md:text-xl font-bold text-gray-400 line-through">
                          ₦{apartment.originalPrice.toLocaleString()}/night
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl md:text-3xl font-bold text-blue-600">
                        ₦{apartment.price.toLocaleString()}/night
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 text-base sm:px-8 sm:py-6 sm:text-lg"
            >
              Book Now
              {/* Sparkling Star */}
              {showStar && (
                <span
                  className="absolute text-white text-lg pointer-events-none animate-pulse"
                  style={{
                    top: starPosition.top,
                    left: starPosition.left,
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))',
                    textShadow: '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  ✦
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader className="bg-gray-500/20 border-b border-gray-300">
                  <CardTitle className="text-gray-900">About This Apartment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {apartment.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="bg-gray-500/20 border-b border-gray-300">
                  <CardTitle className="text-gray-900">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {apartment.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-gray-700">●</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="bg-gray-500/20 border-b border-gray-300">
                  <CardTitle className="text-gray-900">Apartment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-500/20 border border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Electricity</p>
                      <p className="font-bold text-gray-900">{apartment.details.electricity}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-500/20 border border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Max Guests</p>
                      <p className="font-bold text-gray-900">{apartment.details.maxGuests}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-500/20 border border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Bed Size</p>
                      <p className="font-bold text-gray-900">{apartment.details.bedSize}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-500/20 border border-gray-300 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Bathrooms</p>
                      <p className="font-bold text-gray-900">{apartment.details.bathrooms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-1" id="reservation-form">
            <div className="sticky top-24">
              <ReservationForm apartment={apartment} price={apartment.price} />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-serif flex items-center justify-center gap-2">
              <MapPin className="text-orange-600" size={32} />
              Locate Us on Map
            </h2>
            <p className="text-gray-600">Plot 219, Apo Dutse, Apo, Abuja FCT, Nigeria</p>
          </motion.div>
          <div className="rounded-lg overflow-hidden shadow-lg">
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
        </div>
      </section>

      {/* Check Out Other Apartments Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Check Out Other Apartments
            </h2>
            <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherApartments.map((apt, index) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group rounded-tl-[80px]"
                  onClick={() => navigate(`/apartments/${apt.slug}`)}
                >
                  <div className="relative h-80 md:h-96 overflow-hidden rounded-tl-[80px]">
                    <img
                      src={apt.image}
                      alt={apt.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ₦{apt.price.toLocaleString()}/night
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">{apt.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-orange-600">
                      <MapPin size={16} />
                      {apt.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {apt.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-semibold">{apt.rating}</span>
                        <span className="text-sm text-gray-500">({apt.reviewCount} reviews)</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/apartments/${apt.slug}`)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

