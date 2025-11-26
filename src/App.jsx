import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Apartments from './pages/Apartments'
import ApartmentDetail from './pages/ApartmentDetail'
import Confirmation from './pages/Confirmation'
import BookingError from './pages/BookingError'
import Policies from './pages/Policies'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full">
        <Navbar />
        <main className="flex-grow overflow-x-hidden max-w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/apartments/:slug" element={<ApartmentDetail />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/booking-error" element={<BookingError />} />
            <Route path="/services" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">Services</h1></div>} />
            <Route path="/reviews" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">Reviews</h1></div>} />
            <Route path="/gallery" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">Gallery</h1></div>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<Policies />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
