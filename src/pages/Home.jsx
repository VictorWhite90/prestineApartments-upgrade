import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { apartments } from '@/data/apartments'
import { ArrowRight, Star, MapPin, Wifi, Car, Shield, Users, HomeIcon, UtensilsCrossed, Dumbbell, Coffee, Sparkles, Award, Clock, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

export default function Home() {
  // Exclude Prestige-Suite-2-Bedroom-Apartment-Lugbe and show other 3 apartments
  const featuredApartments = apartments.filter(apt => apt.id !== 'prestige-suite').slice(0, 3)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const [hoveredApartment, setHoveredApartment] = useState(null)
  const [clickedApartment, setClickedApartment] = useState(null) // Track which apartment overlay is currently active
  const [mobileShowOverlay, setMobileShowOverlay] = useState(null) // Track which apartment shows overlay on mobile (single value)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle click to show overlay with smooth transitions
  const handleApartmentClick = (index) => {
    if (!isMobile) {
      // Desktop behavior: if clicking the same apartment, close it; otherwise, switch to the new one
      if (clickedApartment === index) {
        setClickedApartment(null)
      } else {
        // Fade out current overlay first, then fade in new one
        setClickedApartment(null)
        setTimeout(() => {
          setClickedApartment(index)
        }, 300) // Half of the transition duration for smooth overlap
      }
      return
    }

    // Mobile behavior: if clicking the same apartment, close it; otherwise, switch to the new one
    if (mobileShowOverlay === index) {
      setMobileShowOverlay(null)
    } else {
      // Fade out current overlay first, then fade in new one
      setMobileShowOverlay(null)
      setTimeout(() => {
        setMobileShowOverlay(index)
      }, 300) // Half of the transition duration for smooth overlap
    }
  }

  const heroImages = [
    {
      image: '/images/prestineAprtLivingRoom.jpg',
      text: { position: 'left', main: 'Exclusive', sub: 'Environment', tagline: 'Where luxury meets convenience for the discerning traveler' }
    },
    {
      image: '/images/prestineAprtoutside.jpg',
      text: { position: 'right', main: 'Prime', sub: 'Location', tagline: 'Located in the heart of Abuja, minutes from the airport' }
    },
    {
      image: '/images/prestineAprtBedroom.jpg',
      text: { position: 'center', main: 'Luxury', sub: 'Bedrooms', tagline: 'Rest in comfort with our elegantly designed bedrooms' }
    },
    {
      image: '/images/delux-outsideview.jpg',
      text: { position: 'left', main: 'Modern', sub: 'Architecture', tagline: 'Contemporary design meets timeless elegance' }
    },
    {
      image: '/images/prestineAprtKitchen.jpg',
      text: { position: 'right', main: 'Fully', sub: 'Equipped', tagline: 'Complete kitchen facilities for your convenience' }
    },
    {
      image: '/images/prestineAprtoutside2.jpg',
      text: { position: 'center', main: 'Spacious', sub: 'Living', tagline: 'Experience comfort in our well-appointed spaces' }
    },
    {
      image: '/images/delux4bedromlivingRoom.jpg',
      text: { position: 'left', main: 'Premium', sub: 'Comfort', tagline: 'Unwind in style with our premium amenities' }
    },
    {
      image: '/images/prestineAprtBedroom2.jpg',
      text: { position: 'right', main: 'Elegant', sub: 'Design', tagline: 'Every detail crafted for your ultimate comfort' }
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const getTextPosition = (position) => {
    switch (position) {
      case 'center':
        return 'items-center justify-center text-center px-8 md:px-16'
      case 'left':
        return 'items-start justify-start text-left px-8 md:px-16'
      case 'right':
        return 'items-end justify-end text-right px-8 md:px-16'
      default:
        return 'items-center justify-center text-center px-8 md:px-16'
    }
  }

  const testimonials = [
    {
      name: "Chioma Okonkwo",
      location: "Lagos, Nigeria",
      rating: 5,
      text: "Exceptional service and beautiful apartments. The location is perfect and the staff went above and beyond to ensure our comfort.",
      image: "/images/prestineAprtLivingRoom.jpg"
    },
    {
      name: "Adebayo Adeyemi",
      location: "Abuja, Nigeria",
      rating: 5,
      text: "Modern amenities and impeccable cleanliness. Highly recommend for both business and leisure travelers.",
      image: "/images/prestineAprtBedroom.jpg"
    },
    {
      name: "Amina Ibrahim",
      location: "Kano, Nigeria",
      rating: 5,
      text: "The apartment exceeded our expectations. Spacious, well-equipped, and in a prime location. Will definitely return!",
      image: "/images/living room lugbe.webp"
    }
  ]

  const amenities = [
    { icon: Wifi, title: "High-Speed WiFi", description: "Free high-speed internet access" },
    { icon: Car, title: "Parking Available", description: "Secure parking facilities" },
    { icon: Shield, title: "24/7 Security", description: "Round-the-clock security service" },
    { icon: Users, title: "Concierge Service", description: "Dedicated concierge support" },
    { icon: HomeIcon, title: "Fully Furnished", description: "Modern furniture and appliances" },
    { icon: UtensilsCrossed, title: "Fully Equipped Kitchen", description: "Complete kitchen facilities" },
    { icon: Dumbbell, title: "Fitness Facilities", description: "Access to fitness centers" },
    { icon: Coffee, title: "Refreshments", description: "Complimentary tea and coffee" },
  ]

  const whyChooseUs = [
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Strategically located near major attractions, airports, and business districts"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Luxury apartments with top-tier amenities and modern design"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service to assist you anytime"
    },
    {
      icon: Sparkles,
      title: "Flexible Stays",
      description: "Short-term and long-term rental options to suit your needs"
    }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full w-full">
      {/* Hero Section with Image Slider */}
      <section 
        className="relative h-[60vh] md:h-screen flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentSlide].image}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>

        {/* Text Overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`absolute inset-0 flex ${getTextPosition(heroImages[currentSlide].text.position)}`}
          >
            <div className="text-white z-10 max-w-4xl px-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light mb-2 tracking-tight"
              >
                {heroImages[currentSlide].text.main}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light mb-4 tracking-tight"
              >
                {heroImages[currentSlide].text.sub}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs sm:text-sm md:text-base text-white/90 font-light max-w-xl mt-4 md:mt-6"
              >
                {heroImages[currentSlide].text.tagline}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows - Show on Hover (Desktop Only) */}
        <div className="hidden md:block">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: showArrows ? 1 : 0, x: showArrows ? 0 : -20 }}
            transition={{ duration: 0.3 }}
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: showArrows ? 1 : 0, x: showArrows ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Exclusive Environment Section */}
      <section ref={sectionRef} className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4 md:space-y-6"
            >
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 uppercase tracking-wider mb-2 md:mb-4">
                EXCLUSIVE ENVIRONMENT
              </h3>
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-4 md:mb-6 leading-tight">
                Discover our rooms and apartments
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Welcome to Prestine Apartments, where comfort meets convenience in the heart of Apo. 
                Experience unparalleled comfort and elegance in the heart of Abuja. Where luxury meets 
                convenience for the discerning traveler.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Located just minutes from the Nnamdi Azikiwe International Airport and major business 
                districts, our premium apartments offer the perfect blend of sophisticated living and 
                strategic accessibility.
              </p>
              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-4 md:pt-6 border-t border-gray-200">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">{apartments.length}+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Premium Apartments</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">500+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Guests</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                    {(apartments.reduce((sum, apt) => sum + (apt.rating || 4.9), 0) / apartments.length).toFixed(1)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <Link to="/apartments" className="w-full sm:w-auto">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 md:px-8 w-full sm:w-auto">
                    Explore Apartments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-6 md:px-8 w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/images/prestineAprtLivingRoom.jpg"
                  alt="Prestine Apartments"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Listings Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-3 md:mb-4">
              Featured Apartments
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Explore our premium collection of carefully curated apartments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {featuredApartments.map((apartment, index) => {
              const isHovered = hoveredApartment === index
              const isClicked = clickedApartment === index
              const isMobileOverlayShown = mobileShowOverlay === index
              
              // Desktop: show on hover or click | Mobile: show only on click
              // Only show overlay if this is the active one
              const showOverlay = isMobile 
                ? isMobileOverlayShown
                : (isHovered || isClicked)
              
              // Show "Check Apartment Details" text when overlay is not shown
              const showCheckText = !showOverlay

              return (
                <motion.div
                  key={apartment.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg group h-80 md:h-96 cursor-pointer"
                    onMouseEnter={() => !isMobile && setHoveredApartment(index)}
                    onMouseLeave={() => !isMobile && setHoveredApartment(null)}
                  >
                    <img
                      src={apartment.image}
                      alt={apartment.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Promo Sales Banner */}
                    {apartment.originalPrice && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg transform -rotate-3 z-10">
                        <span className="text-sm md:text-base font-bold uppercase tracking-wide">Promo Sales</span>
                      </div>
                    )}
                    
                    {/* Apartment Name Centered Overlay - Shows when full overlay is hidden */}
                    {showCheckText && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-center p-6 cursor-pointer"
                        onClick={() => handleApartmentClick(index)}
                      >
                        {/* Apartment Name at Center */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-center"
                        >
                          <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-2">
                            {apartment.name}
                          </h3>
                          <p className="text-white/90 text-sm md:text-base">
                            View Apartment Details
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {/* Desktop/Mobile Full Overlay - Shows on hover/click (desktop) or click (mobile) */}
                    <AnimatePresence mode="wait">
                      {showOverlay && (
                        <motion.div
                          key={`overlay-${index}`}
                          initial={{ 
                            opacity: 0, 
                            clipPath: index === 0 || index === 2 
                              ? 'ellipse(0% 100% at 0% 50%)' 
                              : 'ellipse(0% 100% at 100% 50%)'
                          }}
                          animate={{
                            opacity: 1,
                            clipPath: 'ellipse(100% 100% at 50% 50%)'
                          }}
                          exit={{
                            opacity: 0,
                            clipPath: index === 0 || index === 2 
                              ? 'ellipse(0% 100% at 0% 50%)' 
                              : 'ellipse(0% 100% at 100% 50%)'
                          }}
                          transition={{ 
                            duration: 0.6, 
                            ease: "easeInOut" 
                          }}
                          className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col justify-end p-6 md:p-8 text-white cursor-pointer"
                          onClick={() => handleApartmentClick(index)}
                        >
                      <div className="space-y-3 md:space-y-4">
                        {/* Location */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="flex items-center gap-2 text-sm md:text-base text-white/95 text-left"
                        >
                          <MapPin className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                          <span className="font-medium">{apartment.location}</span>
                        </motion.div>

                        {/* Rating */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="flex items-center gap-1.5 text-left"
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm md:text-base font-semibold ml-1">{apartment.rating || 4.9}</span>
                          <span className="text-xs md:text-sm text-white/80">({apartment.reviewCount || 128} reviews)</span>
                        </motion.div>

                        {/* Apartment Name */}
                        <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-lg md:text-xl font-bold leading-tight text-left"
                        >
                          {apartment.name}
                        </motion.h3>
                      </div>

                      {/* Check Now Button - Bottom Left */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-4"
                      >
                        <Link to={`/apartments/${apartment.slug}`} onClick={(e) => e.stopPropagation()}>
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-5 md:px-8 md:py-6 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                            Check Now
                            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                          </Button>
                        </Link>
                      </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link to="/apartments">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-12">
                View All Apartments
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-3 md:mb-4">
              Why Choose Prestine Apartments?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We combine luxury, comfort, and convenience to create an exceptional living experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${index % 2 === 0 ? 'bg-orange-100' : 'bg-gray-900'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`h-8 w-8 ${index % 2 === 0 ? 'text-orange-600' : 'text-white'}`} />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-3 md:mb-4">
              Premium Amenities
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need for a comfortable and convenient stay
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                  <CardHeader>
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${index % 2 === 0 ? 'bg-orange-100' : 'bg-gray-900'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <amenity.icon className={`h-7 w-7 ${index % 2 === 0 ? 'text-orange-600' : 'text-white'}`} />
                    </div>
                    <CardTitle className="text-base md:text-lg">{amenity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{amenity.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12 lg:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-3 md:mb-4">
              What Our Guests Say
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Don't just take our word for it - hear from our satisfied guests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-50 border-0 shadow-lg h-full">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  </CardHeader>
                  <CardFooter className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-black text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-4 md:mb-6">
              Ready to Experience Luxury Living?
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-white/90 px-4">
              Book your stay today and discover why Prestine Apartments is the preferred choice 
              for travelers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4">
              <Link to="/apartments" className="w-full sm:w-auto">
                <Button size="lg" className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto">
                  Browse Apartments
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              <a href="tel:+2348029823593" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white w-full sm:w-auto">
                  <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Call Us Now
                </Button>
              </a>
              <a href="mailto:Support@prestineapartment.com" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Send Email
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
