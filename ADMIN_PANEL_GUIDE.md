# 👨‍💼 Admin Panel User Guide

Complete guide on how to use the Prestine Apartments Admin Dashboard after deployment.

---

## 🔐 **Accessing the Admin Panel**

### URL:
```
https://your-vercel-domain.vercel.app/#/admin/login
```

### First Time Setup:
1. Make sure you have an admin account set up (follow VERCEL_DEPLOYMENT_GUIDE.md Step 5)
2. Log in with your Firebase Admin email and password
3. You'll be redirected to the dashboard

---

## 📊 **Dashboard Overview**

### Stats Cards:
- **Apartments:** Total number of apartments listed
- **Pending:** Bookings awaiting payment confirmation
- **Confirmed:** Successfully paid bookings
- **Avg. Rating:** Average rating across all apartments

---

## 🔍 **Search & Filter Features**

### Search Bar:
- Search by guest name (first or last)
- Search by email address
- Search by phone number
- Search by apartment name

**Example:** Type "Victor" or "victorwhite590@gmail.com" or "Premium" to filter results

### Status Filter:
- **All statuses:** Shows everything
- **Pending / Temporary:** Unpaid bookings
- **Booking Successful:** Confirmed paid bookings
- **Cancelled:** Cancelled bookings
- **Reservation Not Successful:** Auto-expired bookings (48h without payment)

### Date Range Filter:
- **Check-In from:** Filter bookings from a specific date
- **Check-In to:** Filter bookings up to a specific date

**Tip:** Leave fields empty to see all bookings

### Clear Filters:
- Click "Clear Filters" button to reset all filters

---

## ✅ **Managing Bookings**

### Confirm Payment:
1. Find booking with status "Pending Payment"
2. Click **"Confirm Booking"** button (green)
3. System will:
   - Update status to "Booking Successful"
   - Set payment date
   - Send confirmation email to guest
   - Block those dates on calendar

### Cancel Booking:
1. Find any booking (pending or confirmed)
2. Click **"Cancel Booking"** button (red outline)
3. Confirm the cancellation in popup
4. System will:
   - Update status to "Cancelled"
   - Free up the reserved dates
   - Send cancellation email to guest
   - Remove from active bookings

**Note:** Cancelled bookings remain in database for record-keeping but dates become available again.

---

## 🔄 **Extend Stay Feature**

For guests who want to extend their confirmed booking:

1. Find a booking with status "Booking Successful"
2. Check if checkout date has passed (guests can extend after checkout)
3. Click **"Extend Stay"** button
4. Enter new dates:
   - **New Check-In Date:** Start of extended period
   - **New Check-Out Date:** End of extended period
5. Click **"Confirm Extension"**
6. System will:
   - Update booking dates in Firestore
   - Block new dates on calendar
   - Send extension confirmation email
   - Free up old dates if different

**Important:** 
- Only works for confirmed bookings (`booking_successful`)
- Dates must not conflict with existing bookings
- Old dates are automatically freed if extension starts later

---

## ⚠️ **Auto-Expiration System**

### How It Works:
- Bookings with status "pending_payment" or "temporary"
- Automatically checked when admin opens dashboard
- If booking is older than 48 hours without payment
- Status changes to "Reservation Not Successful"
- Dates are automatically freed
- Guest receives email notification

### Manual Check:
- Refresh the dashboard to trigger auto-check
- System runs automatically on page load

---

## 📧 **Email Notifications**

The system automatically sends emails for:

1. **Booking Confirmation:**
   - Sent when guest submits booking form
   - Sent to guest and company

2. **Payment Confirmation:**
   - Sent when admin confirms payment
   - Sent to guest only

3. **Cancellation:**
   - Sent when admin cancels booking
   - Sent to guest and company

4. **Extension:**
   - Sent when admin extends stay
   - Sent to guest and company

5. **Expiration Warning:**
   - Sent 24h before auto-expiration (if implemented)
   - Sent when booking expires (48h)

---

## 📱 **Quick Actions Panel**

### View Apartments:
- Links to public apartments page
- Check how listings appear to guests

### Update Policies:
- Links to policies page
- View/edit booking policies

### Contact Requests:
- Links to contact page
- View contact information

---

## 🔄 **Refreshing Data**

### Manual Refresh:
- Click **"Refresh"** button (top right of bookings table)
- Updates all booking data from Firestore

### Auto Refresh:
- Dashboard fetches fresh data on page load
- Real-time updates via Firestore listeners (if implemented)

---

## 💡 **Tips & Best Practices**

### Daily Workflow:
1. Check **Pending** bookings count
2. Review bookings that need confirmation
3. Confirm payments promptly
4. Check for expired bookings (auto-handled)
5. Monitor confirmed bookings for extensions

### Weekly Tasks:
1. Review cancelled bookings
2. Check booking trends
3. Verify email notifications are working
4. Test search/filter functionality

### Monthly Tasks:
1. Review booking statistics
2. Check Firestore usage
3. Update policies if needed
4. Verify admin access security

---

## 🐛 **Common Issues & Solutions**

### Issue: Can't see bookings
- **Solution:** Check if you're logged in as admin
- **Solution:** Verify Firestore rules are deployed
- **Solution:** Check browser console for errors

### Issue: Cancel button not working
- **Solution:** Check Firestore security rules are deployed
- **Solution:** Verify admin custom claims are set
- **Solution:** Clear browser cache and reload

### Issue: Email not sending
- **Solution:** Check EmailJS configuration in environment variables
- **Solution:** Verify EmailJS template IDs are correct
- **Solution:** Check EmailJS dashboard for errors

### Issue: Search not working
- **Solution:** Clear filters and try again
- **Solution:** Check if bookings exist in database
- **Solution:** Try searching by exact name/email

### Issue: Extend stay not available
- **Solution:** Only works for "Booking Successful" status
- **Solution:** Check if dates are available (not conflicting)
- **Solution:** Verify checkout date has passed (for same-day extensions)

---

## 🔒 **Security Reminders**

- ✅ Always log out when done
- ✅ Never share admin credentials
- ✅ Use strong passwords
- ✅ Keep Firebase rules up to date
- ✅ Monitor for unauthorized access

---

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Check Firebase Console for errors
3. Review browser console
4. Verify all environment variables are set

---

## 📖 **Related Documentation**

- `VERCEL_DEPLOYMENT_GUIDE.md` - How to deploy to Vercel
- `DEPLOY_FIRESTORE_RULES.md` - How to deploy security rules
- `SETUP_CHECKLIST.md` - Initial setup steps


