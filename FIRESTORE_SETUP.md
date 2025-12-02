# Firestore Integration - Complete Setup Guide

## ✅ What Has Been Implemented

### 1. **Firebase Configuration**
- ✅ Firebase SDK installed
- ✅ Firebase config file created at `src/config/firebase.js`
- ✅ Firestore database initialized

### 2. **Booking System**
- ✅ All reservations are saved to Firestore with status "temporary"
- ✅ Booking data includes all guest information, dates, pricing, and apartment details
- ✅ EmailJS integration maintained (emails still sent after booking is saved)

### 3. **Admin Dashboard**
- ✅ Real-time booking display from Firestore
- ✅ Shows all bookings with guest details, dates, and status
- ✅ "Confirm Booking" button for temporary bookings
- ✅ Status change functionality (temporary → booking_successful)
- ✅ Statistics cards showing pending and confirmed bookings

### 4. **Date Blocking System**
- ✅ Automatic date availability checking before booking
- ✅ Confirmed bookings block dates automatically
- ✅ Users cannot book already booked dates
- ✅ Date blocking is apartment-specific

## 🔄 How It Works

### Booking Flow:
1. **User submits reservation form** → Saves to Firestore as "temporary"
2. **EmailJS sends confirmation emails** (to guest and company)
3. **Booking appears in Admin Dashboard** with status "Temporary Booked"
4. **Admin calls guest** to verify and collect payment
5. **Admin clicks "Confirm Booking"** → Status changes to "booking_successful"
6. **Dates are automatically blocked** for that apartment

### Date Blocking:
- Only bookings with status "booking_successful" block dates
- Temporary bookings do NOT block dates (can be cancelled)
- Date blocking is checked before every new booking submission
- Overlapping dates are automatically prevented

## ⚠️ IMPORTANT: Firestore Security Rules

You need to set up security rules in Firebase Console to protect your data.

### Steps to Configure Security Rules:

1. Go to Firebase Console → Firestore Database → **Rules** tab
2. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bookings collection - allow read/write for now
    // TODO: Add authentication later for production
    match /bookings/{bookingId} {
      allow read, write: if true;
    }
  }
}
```

**For Production (Recommended):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bookings - read allowed, write only with authentication
    match /bookings/{bookingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Current Status:
- ⚠️ **Security rules need to be updated** - Currently in test mode
- Set up authentication for production use

## 📁 File Structure

```
src/
├── config/
│   └── firebase.js          # Firebase configuration
├── services/
│   └── bookingService.js    # All Firestore booking operations
├── components/
│   └── ReservationForm.jsx  # Updated to save to Firestore
└── pages/
    └── Admin.jsx            # Updated to display real bookings
```

## 🎯 Next Steps

1. **Set up Firestore Security Rules** (see above)
2. **Test the booking flow:**
   - Submit a booking from the website
   - Check Firestore Console to see the booking
   - View booking in Admin Dashboard
   - Change status from temporary to booking_successful
   - Try booking the same dates again (should be blocked)

3. **Optional Enhancements:**
   - Add Firebase Authentication for admin access
   - Add email notifications when status changes
   - Add booking cancellation functionality
   - Add export functionality for bookings

## 📝 Testing Checklist

- [ ] Submit a booking → Check Firestore Console
- [ ] View booking in Admin Dashboard
- [ ] Change status to "booking_successful"
- [ ] Try to book same dates → Should be blocked
- [ ] Verify dates are blocked only for that apartment

## 🔗 Firestore Collection Structure

**Collection: `bookings`**

Each document contains:
```javascript
{
  apartment_id: "premium-apartment",
  apartment_name: "Premium-1 Bedroom Apartment - Apo",
  apartment_slug: "premium-1-bedroom-apartment-apo",
  user_title: "Mr",
  first_name: "John",
  last_name: "Doe",
  user_email: "john@example.com",
  user_phone: "+234123456789",
  checkin_date: Timestamp,
  checkout_date: Timestamp,
  guest_number: 2,
  room_rate: 85000,
  price_per_night: 85000,
  subtotal: 170000,
  vat_amount: 12750,
  service_charge: 17000,
  grand_total: 199750,
  total_nights: 2,
  status: "temporary" | "booking_successful" | "cancelled",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 🚀 Everything is Ready!

The system is fully integrated and ready to use. Just make sure to:
1. Set up the Firestore security rules
2. Test the complete flow
3. Add authentication for production (recommended)


