import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apartments } from '@/data/apartments'
import { ArrowRight, MapPin, Users, Home, Star, Bed, Bath, Wifi, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Apartments() {
  // Reorder apartments: 1-bedroom first, Lugbe last
  const reorderedApartments = [
    apartments.find(apt => apt.id === 'premium-apartment'), // 1 bedroom first
    apartments.find(apt => apt.id === 'classic-studio'),
    apartments.find(apt => apt.id === 'delux-royal'),
    apartments.find(apt => apt.id === 'prestige-suite'), // Lugbe last
  ].filter(Boolean)

  // Hero carousel images - curated selection: exactly 5 images
  const lugbeApartment = apartments.find(apt => apt.id === 'prestige-suite')
  const premiumApartment = apartments.find(apt => apt.id === 'premium-apartment')
  const studioApartment = apartments.find(apt => apt.id === 'classic-studio')
  const deluxApartment = apartments.find(apt => apt.id === 'delux-royal')
  
  // Select specific images: different 1st and last, 1 from Lugbe (skip first 3), others from different apartments
  const heroImages = [
    '/images/prestineAprtFrontdesk.jpg', // 1st image - frontdesk image
    premiumApartment?.image || '/images/prestineAprtLivingRoom.jpg', // 2nd image - Premium apartment
    studioApartment?.image || '/images/prestineAprtBedroomDark.jpg', // 3rd image - Studio apartment
    lugbeApartment?.images?.[3] || '/images/lugbe bedroom 3.webp', // 4th image - Lugbe (1 image, skip first 3)
    '/images/prestineAprtoutside.jpg' // 5th image (last) - different image (not delux living room)
  ].filter(Boolean).slice(0, 5) // Ensure exactly 5 images
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-x-hidden max-w-full w-full">
      {/* Hero Section with Image Carousel */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden max-w-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentHeroSlide]}
              alt={`Apartment slide ${currentHeroSlide + 1}`}
              className="w-full h-full object-cover max-w-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextHeroSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentHeroSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Apartments Listings - Alternating Layout */}
      <section className="py-12 md:py-20 overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl">
          {reorderedApartments.map((apartment, index) => {
            const isEven = index % 2 === 0
            const imageFromLeft = isEven
            const descriptionFromLeft = !isEven
            
            return (
              <motion.div
                key={apartment.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-16 md:mb-24 last:mb-0"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-full overflow-hidden ${
                  !isEven ? 'lg:grid-flow-dense' : ''
                }`}>
                  {/* Image Section */}
                  <motion.div
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: imageFromLeft ? -100 : 100,
                        y: 20
                      },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        y: 0,
                        transition: {
                          duration: 0.8,
                          ease: "easeOut"
                        }
                      }
                    }}
                    className={`relative overflow-hidden rounded-lg shadow-2xl max-w-[95%] md:max-w-[85%] mx-auto ${!isEven ? 'lg:col-start-2' : ''}`}
                    style={{ marginTop: index === 0 ? '2rem' : '1rem' }}
                  >
                    <img
                      src={apartment.image}
                      alt={apartment.name}
                      className="w-full h-[400px] md:h-[500px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{apartment.rating || 4.9}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-full">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold">
                          ₦{apartment.price.toLocaleString()}/night
                        </span>
                        <span className="text-[9px] text-white/80 leading-none">excluding VAT/tax</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description Section */}
                  <motion.div
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: descriptionFromLeft ? -100 : 100,
                        y: 20
                      },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        y: 0,
                        transition: {
                          duration: 0.8,
                          delay: 0.2,
                          ease: "easeOut"
                        }
                      }
                    }}
                    className={`space-y-6 max-w-[95%] md:max-w-[90%] mx-auto ${!isEven ? 'lg:col-start-1' : ''}`}
                  >
                    <div>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 break-words font-serif">
                        {apartment.name}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <span className="text-lg">{apartment.location}</span>
                      </div>
                    </div>

                    <p className="text-base md:text-lg text-gray-700 leading-relaxed break-words">
                      {apartment.description}
                    </p>

                    <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words">
                      {apartment.fullDescription}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Users className="h-5 w-5 text-orange-600" />
                        <span><strong>{apartment.details.maxGuests}</strong> Guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Bed className="h-5 w-5 text-orange-600" />
                        <span>{apartment.details.bedSize}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Bath className="h-5 w-5 text-orange-600" />
                        <span>{apartment.details.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Wifi className="h-5 w-5 text-orange-600" />
                        <span>Free WiFi</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-base font-semibold text-gray-900 mb-3">Key Features:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {apartment.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <Link to={`/apartments/${apartment.slug}`}>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                          View Details & Book Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Contact our team and we'll help you find the perfect apartment for your needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" className="text-lg px-8 h-14 bg-orange-600 hover:bg-orange-700 text-white">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+2348029823593">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-2 border-gray-300 text-gray-900 bg-white hover:bg-white hover:text-gray-900">
                  Call Now: (+234) 0802 982 3593
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
