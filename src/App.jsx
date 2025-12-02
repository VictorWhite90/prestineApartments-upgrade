import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Apartments from './pages/Apartments'
import ApartmentDetail from './pages/ApartmentDetail'
import Confirmation from './pages/Confirmation'
import BookingError from './pages/BookingError'
import Policies from './pages/Policies'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './components/auth/Login'
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute'

function App() {
  return (
    <Router>
      <ScrollToTop />
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
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
