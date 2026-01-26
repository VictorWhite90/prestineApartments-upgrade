// Tracking utilities for Facebook Pixel, Google Analytics, and Microsoft Clarity

// Enable debug mode in development (set to false in production)
const DEBUG_TRACKING = import.meta.env.DEV || import.meta.env.MODE === 'development'

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window === 'undefined') return

  // Check if already initialized
  if (window.fbq) {
    if (DEBUG_TRACKING) console.log('✅ Facebook Pixel already initialized')
    return
  }

  !function(f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

  window.fbq('init', '3570049643299661')
  window.fbq('track', 'PageView')
  
  if (DEBUG_TRACKING) {
    console.log('✅ Facebook Pixel initialized and PageView tracked')
    console.log('📊 Facebook Pixel ID: 3570049643299661')
  }
}

// Track Facebook Pixel PageView
export const trackFacebookPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
    if (DEBUG_TRACKING) console.log('📊 Facebook Pixel: PageView tracked')
  } else if (DEBUG_TRACKING) {
    console.warn('⚠️ Facebook Pixel not initialized yet')
  }
}

// Track Facebook Pixel Lead
export const trackFacebookLead = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead')
    if (DEBUG_TRACKING) console.log('🎯 Facebook Pixel: Lead event tracked')
  } else if (DEBUG_TRACKING) {
    console.warn('⚠️ Facebook Pixel not initialized - Lead event not tracked')
  }
}

// Initialize Microsoft Clarity
export const initClarity = () => {
  if (typeof window === 'undefined') return

  // Check if already initialized
  if (window.clarity) {
    if (DEBUG_TRACKING) console.log('✅ Microsoft Clarity already initialized')
    return
  }

  // Microsoft Clarity tracking code
  ;(function(c, l, a, r, i, t, y) {
    c[a] = c[a] || function() {
      (c[a].q = c[a].q || []).push(arguments)
    }
    t = l.createElement(r)
    t.async = 1
    t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]
    y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', 'q4i8nxllpb')
  
  if (DEBUG_TRACKING) {
    console.log('✅ Microsoft Clarity initialized')
    console.log('📊 Clarity Project ID: q4i8nxllpb')
  }
}

// Initialize Google Analytics
export const initGoogleAnalytics = () => {
  if (typeof window === 'undefined') return

  // Check if already initialized
  if (window.dataLayer && window.gtag) {
    if (DEBUG_TRACKING) console.log('✅ Google Analytics already initialized')
    return
  }

  // Load Google tag (gtag.js)
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YTY8FXJJJ0'
  document.head.appendChild(script)

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', 'G-YTY8FXJJJ0')
  gtag('config', 'AW-16944698468') // Google Ads conversion tracking
  
  if (DEBUG_TRACKING) {
    console.log('✅ Google Analytics initialized')
    console.log('📊 Google Analytics ID: G-YTY8FXJJJ0')
    console.log('📊 Google Ads ID: AW-16944698468')
  }
}

// Track Google Analytics PageView
export const trackGooglePageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-YTY8FXJJJ0', {
      page_path: path
    })
    if (DEBUG_TRACKING) console.log(`📊 Google Analytics: PageView tracked for ${path}`)
  } else if (DEBUG_TRACKING) {
    console.warn('⚠️ Google Analytics not initialized yet')
  }
}

// Track Google Ads Conversion
export const trackGoogleAdsConversion = (conversionId) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `AW-16944698468/${conversionId}`
    })
    if (DEBUG_TRACKING) console.log(`🎯 Google Ads: Conversion tracked - ${conversionId}`)
  } else if (DEBUG_TRACKING) {
    console.warn('⚠️ Google Ads not initialized yet')
  }
}

// Initialize all tracking scripts
export const initAllTracking = () => {
  if (DEBUG_TRACKING) {
    console.log('🚀 Initializing all tracking scripts...')
    console.log('📍 Current URL:', window.location.href)
  }
  
  initFacebookPixel()
  initClarity()
  initGoogleAnalytics()
  
  if (DEBUG_TRACKING) {
    console.log('✅ All tracking scripts initialized')
    console.log('💡 Tip: Check Network tab in DevTools to verify tracking requests')
  }
}

// Verify tracking is working (useful for testing)
export const verifyTracking = () => {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Cannot verify tracking: window is undefined')
    return
  }

  const status = {
    facebookPixel: !!window.fbq,
    clarity: !!window.clarity,
    googleAnalytics: !!(window.gtag && window.dataLayer)
  }

  console.log('📊 Tracking Status:', status)
  
  if (status.facebookPixel && status.clarity && status.googleAnalytics) {
    console.log('✅ All tracking scripts are loaded and ready!')
    console.log('📊 Includes: Facebook Pixel, Microsoft Clarity, Google Analytics & Google Ads')
  } else {
    console.warn('⚠️ Some tracking scripts may not be loaded:', status)
  }

  return status
}

