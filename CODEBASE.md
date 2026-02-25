# Prestine Apartments — Codebase Reference

> Internal developer reference. Covers architecture, data models, flows, and integration details so you don't need to read through the full codebase each session.

---

## Tech Stack

| Layer | Library / Service | Version |
|---|---|---|
| Framework | React | 19.2.0 |
| Build tool | Vite | 7.2.4 |
| Routing | React Router DOM (HashRouter) | 7.9.6 |
| Styling | Tailwind CSS + PostCSS | 3.4.18 |
| Database | Firebase Firestore | 12.6.0 |
| Auth | Firebase Authentication | 12.6.0 |
| Email | EmailJS | 4.4.1 |
| PDF receipts | jsPDF | 4.2.0 |
| Animations | Framer Motion | 12.23.24 |
| Forms | React Hook Form | 7.66.1 |
| Date picker | React DatePicker | 8.10.0 |
| Icons | Lucide React | 0.554.0 |
| UI components | Shadcn/UI (local copies in /ui) | — |

**Analytics integrations (all in `src/utils/tracking.js`):**
- Facebook Pixel: `3570049643299661`
- Google Analytics: `G-YTY8FXJJJ0`
- Google Ads: `AW-16944698468`
- Microsoft Clarity: `q4i8nxllpb`

---

## Directory Structure

```
src/
├── components/
│   ├── ReservationForm.jsx        ← Main booking form (all apartments use this)
│   ├── Navbar.jsx                 ← Top navigation
│   ├── Footer.jsx                 ← Footer
│   ├── admin/
│   │   └── ProtectedAdminRoute.jsx ← Guards /admin route (checks Firebase custom claim)
│   ├── auth/
│   │   └── Login.jsx              ← Admin login (email/password via Firebase Auth)
│   └── ui/                        ← Shadcn UI primitives (button, card, dialog, etc.)
│
├── config/
│   ├── firebase.js                ← Firebase app init + Firestore + Auth exports
│   └── emailjs.js                 ← EmailJS config (reads from VITE_ env vars)
│
├── data/
│   └── apartments.js              ← Source of truth for all 4 apartment listings
│
├── hooks/
│   └── useAuth.jsx                ← Firebase auth state + admin claim check
│
├── pages/
│   ├── Admin.jsx                  ← Full admin dashboard (~1465 lines)
│   ├── ApartmentDetail.jsx        ← Single apartment page (renders ReservationForm)
│   ├── Apartments.jsx             ← Apartment listing/browse page
│   ├── Confirmation.jsx           ← Post-booking confirmation page
│   ├── BookingError.jsx           ← Booking failure page
│   ├── Contact.jsx                ← Contact form page
│   └── Policies.jsx               ← Booking policies page
│
├── services/
│   └── bookingService.js          ← ALL Firestore read/write operations
│
├── utils/
│   ├── generateReceipt.js         ← jsPDF receipt generator (admin downloads)
│   ├── tracking.js                ← Analytics helpers (Facebook, Google, Clarity)
│   ├── checkAdminStatus.js        ← Helper to verify admin claim
│   └── errorHandler.js            ← Error normalisation
│
├── App.jsx                        ← Route definitions (HashRouter)
└── main.jsx                       ← React entry point
```

**Root-level files of note:**
- `setAdmin.js` — Node script to grant admin Firebase custom claim to a UID
- `TRACKING_TEST_GUIDE.md` — Analytics test instructions (tracked in git, low risk)
- `.env.local` / `.env.production` — NOT tracked (gitignored). Must exist locally for dev and at build time for prod

---

## Apartment Catalog (`src/data/apartments.js`)

| Apartment | ID/Slug | Price/night | Max Guests | Date Blocking |
|---|---|---|---|---|
| Premium Royale 1BR — Apo | `premium-apartment` | ₦89,300 | 2 | **DISABLED** |
| Classic Studio — Apo | `classic-studio` | ₦69,913 | 2 | **DISABLED** |
| Deluxe Royale 4BR — Apo | `delux-royal` | ₦279,650 | 8 | Enabled |
| Prestige-Suite 2BR — Lugbe | `prestige-suite` | ₦74,906 | 3 | Enabled |

**`disableDateBlocking: true`** means that apartment skips all availability checks — it can be double-booked. Used for apartments with multiple physical units (Premium 1BR has 24 units, Classic Studio has multiple).

Each apartment object shape:
```js
{
  id, slug, name, location,
  price,           // Current/promo price per night
  originalPrice,   // Strikethrough price
  promoEndDate,    // '2025-01-02'
  images: [],      // Array of image paths
  description,
  features: [],    // Bullet list of amenities
  details: { electricity, maxGuests, bedSize, bathrooms },
  rating, reviewCount,
  disableDateBlocking: boolean
}
```

---

## Firestore Data Model

**Collection:** `bookings`

```js
{
  // IDs
  id,                    // Auto Firestore doc ID
  group_booking_id,      // Shared ID for multi-unit group bookings (null for single)
  unit_index,            // Which unit this is in a group (1, 2, 3...) — null for single
  unit_count,            // Total units in the group — 1 for single bookings

  // Guest info
  user_title,            // 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Other'
  first_name,
  last_name,
  user_email,
  user_phone,
  userId,                // Firebase Auth UID or null (guest checkout allowed)

  // Apartment
  apartment_id,          // Matches apartments.js id field
  apartment_name,
  apartment_slug,

  // Dates (Firestore Timestamps)
  checkin_date,
  checkout_date,

  // Guests
  guest_number,          // Number of guests (1 to maxGuests)

  // Pricing
  room_rate,             // Price per night
  price_per_night,       // Same as room_rate
  subtotal,              // nights × price_per_night (per unit)
  vat_amount,            // Always 0 (included in price)
  service_charge,        // Always 0 (included in price)
  grand_total,           // Final amount due (per unit; multiply by unit_count for group total)
  total_nights,

  // Payment tracking
  amount_paid,           // Set when admin confirms payment
  balance,               // grand_total - amount_paid
  negotiated_price,      // null unless admin applied discount
  paymentDate,           // Timestamp of confirmation

  // Status
  status,                // See lifecycle below
  createdAt,
  updatedAt,
  extendedAt,            // Set when admin extends stay
  cancellationDate,
  reason,                // Cancellation reason string

  // Multi-unit / group booking fields (added for Premium 1BR multi-unit feature)
  group_booking_id,      // 'GRP-timestamp-XXXXXX' shared across all units; null for single bookings
  unit_count,            // 1 for single bookings; N for group bookings
  unit_index             // null for single; 1..N for group (which unit this doc represents)
}
```

**Status lifecycle:**
```
Form submit → pending_payment
  ├─→ Admin confirms payment → booking_successful
  ├─→ No payment 48hrs → reservation_failed  (manual, no automation)
  └─→ Admin cancels → cancelled
```

---

## Booking Flow (End to End)

```
1. User visits /apartments/:slug (ApartmentDetail.jsx)
   └─→ Renders ReservationForm with apartment prop

2. ReservationForm mounts
   ├─→ EmailJS.init()
   └─→ If disableDateBlocking = false:
       └─→ getBlockedDates(apartmentId) → gray out booked dates in calendar

3. User fills form and selects dates
   └─→ useEffect: subtotal = nights × pricePerNight [× unitCount for multi-unit]

4. User submits
   ├─→ react-hook-form validation
   ├─→ If disableDateBlocking = false: checkDateAvailability() final check
   ├─→ If unitCount = 1: createTemporaryBooking(bookingData) → single Firestore doc
   └─→ If unitCount > 1: createGroupBooking(bookingData, unitCount) → N Firestore docs
       (all share same group_booking_id, each has unit_index 1..N)

5. On success
   ├─→ Send ONE EmailJS confirmation to guest (templateIdClient)
   ├─→ trackFacebookLead()
   ├─→ trackGoogleAdsConversion()
   └─→ Navigate to /confirmation

6. On failure → navigate to /booking-error
```

---

## Availability Checking (`bookingService.js`)

| Function | Purpose |
|---|---|
| `getConfirmedBookings()` | Fetches all `booking_successful` docs |
| `getBlockedDates(apartmentId)` | Returns array of Date objects that are booked for a given apartment (used by date picker) |
| `checkDateAvailability(apartmentId, checkin, checkout)` | Returns bool — checks for overlapping confirmed bookings |
| `createTemporaryBooking(data)` | Creates a single `pending_payment` Firestore doc |
| `createGroupBooking(data, unitCount)` | Creates N docs with shared `group_booking_id` (for multi-unit) |
| `updateBooking(id, data)` | Generic field update |
| `deleteBooking(id)` | Deletes a booking doc (function exists, no UI button) |
| `getAllBookings()` | Fetches all bookings (used by admin panel) |

**Overlap logic** (for apartments with date blocking enabled):
```
A booking conflicts if ANY of:
  - checkin falls inside [bookingCheckin, bookingCheckout)
  - checkout falls inside (bookingCheckin, bookingCheckout]
  - [checkin, checkout] fully contains [bookingCheckin, bookingCheckout]
```

**Note:** Apartments with `disableDateBlocking: true` skip ALL availability checks. Multiple bookings on same dates are allowed.

---

## Admin Panel (`src/pages/Admin.jsx`)

**URL:** `/#/admin` (protected by ProtectedAdminRoute)

**Stats shown:** Total apartments | Pending payments | Confirmed bookings | Avg rating

**Booking filters:** Search (name/email/phone/apartment) | Status filter | Date range

**Actions per booking status:**

| Status | Available Actions |
|---|---|
| `pending_payment` | Confirm Payment, Cancel Booking |
| `booking_successful` | Update Payment (if balance > 0), Extend Stay, Download Receipt, Cancel Booking |
| `cancelled` | (hidden by default) |
| `reservation_failed` | (hidden by default) |

**Confirm Payment modal:**
- Enter `amount_paid`
- Optional: toggle negotiated price + enter discounted amount
- Validates: negotiated ≤ grand_total, amount_paid ≤ effective total
- On confirm: status → `booking_successful`, sends EmailJS to guest, blocks dates

**Group bookings (multi-unit):**
- Bookings sharing `group_booking_id` are visually grouped
- "Confirm All" confirms payment for the entire group at once (distributes amount equally)
- Per-unit actions (Extend Stay, Cancel) work independently on each unit

**Extend Stay modal:**
- Checks for date conflicts with other confirmed bookings
- Updates `checkin_date`, `checkout_date`, `extendedAt`
- Sends EmailJS notification to guest

**Auto-hidden:** cancelled, reservation_failed, and bookings past checkout date

---

## Email System (EmailJS)

**Service:** EmailJS — all client-side, no backend needed

**Config:** `src/config/emailjs.js` (reads VITE_ env vars at build time)

**Templates:**

| Template var | Used for |
|---|---|
| `templateIdClient` | Initial booking confirmation to guest |
| `templateIdCompany` | Payment confirmed / extension / update notifications |

**Email is sent from:** `src/components/ReservationForm.jsx` (on booking) and `src/pages/Admin.jsx` (on payment confirm / extend / fail)

**Template variables sent (key ones):**
```
user_title, first_name, last_name, user_email, user_phone
checkin_date, checkout_date, total_nights, guest_number, apartment_name
room_rate, price_per_night, subtotal, grand_total
amount_paid, balance, payment_date, booking_status
unit_count (for multi-unit bookings)
```

---

## PDF Receipt (`src/utils/generateReceipt.js`)

- Triggered by admin "Download Receipt" button (only on `booking_successful` bookings)
- Uses jsPDF (client-side, no server needed)
- Output filename: `Receipt-{firstName}-{lastName}-PRA-{first8charsOfId}.pdf`
- Currency: uses `NGN ` prefix (NOT ₦ — Helvetica font doesn't support Unicode ₦)
- Sections: Header (orange band + logo) → Receipt meta → Guest info → Booking details → Payment breakdown → Footer
- Shows negotiated price with strikethrough of original if applicable
- Shows unit count and unit index for group bookings

---

## Authentication & Admin Access

**Login:** Firebase Email/Password (`/#/admin/login`)

**Admin check:** Firebase custom claim `admin === true` on the user token

**To grant admin access:**
1. Get the user's Firebase Auth UID (from Firebase Console → Authentication)
2. Run `node setAdmin.js` (update the UID in the file first)
3. User must log out and log back in to get refreshed token

**Guard:** `ProtectedAdminRoute.jsx` wraps `/admin` — redirects to login if not authenticated or not admin

---

## Environment Variables

All variables use `VITE_` prefix (Vite requirement). They are baked into the bundle at `npm run build` time — not needed at runtime on Hostinger.

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# EmailJS
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID_CLIENT=
VITE_EMAILJS_TEMPLATE_ID_COMPANY=
VITE_EMAILJS_PUBLIC_KEY=
```

**.env.local** → development
**.env.production** → used when running `npm run build` for Hostinger deployment

---

## Routing (`src/App.jsx`)

Uses **HashRouter** (URLs use `#` — required for static file hosting on Hostinger)

| Route | Component |
|---|---|
| `/` | Home |
| `/apartments` | Apartments listing |
| `/apartments/:slug` | ApartmentDetail (booking form) |
| `/confirmation` | Confirmation page |
| `/booking-error` | Error page |
| `/contact` | Contact |
| `/policies` | Policies |
| `/admin/login` | Login |
| `/admin` | Admin dashboard (protected) |

---

## Deployment

**Host:** Hostinger (static file upload)

**Process:**
1. Ensure `.env.production` is correct (all VITE_ vars set)
2. Run `npm run build` → generates `/dist` folder
3. Upload contents of `/dist` to Hostinger public_html
4. No server config needed — HashRouter handles all routing client-side

**dist/ is gitignored** — never committed

---

## Firebase Setup Notes

- **Project ID:** `prestine-apartment-db`
- **Firestore rules:** Configured to allow public reads/writes on `bookings` (for guest bookings) with admin-level operations via Firebase CLI or Admin SDK
- **Authorized domains:** Firebase Console → Authentication → Settings → Authorized Domains
  - Must include your Hostinger domain for auth to work in production
- **Admin SDK:** `serviceAccountKey.json` — NEVER committed, gitignored

---

## Key Patterns & Gotchas

1. **Date normalization:** All date comparisons use `setHours(0,0,0,0)` to avoid timezone drift. Always normalize dates before comparing.

2. **Firestore Timestamps vs Date strings:** `getConfirmedBookings()` handles both formats (legacy bookings may use string dates). Always check before `.toDate()` calls.

3. **₦ naira symbol:** jsPDF Helvetica does NOT render ₦. Always use `'NGN '` string prefix in any PDF generation code.

4. **`nul` file issue (Windows):** Never use `git add .` in this project on Windows — the OS reserved name `nul` can appear as an untracked file. Always stage specific files: `git add src/pages/Admin.jsx src/components/ReservationForm.jsx`

5. **EmailJS is client-side:** No backend. Email templates are configured in the EmailJS dashboard. The public key is exposed (intentional by EmailJS design — protected by domain restrictions in EmailJS settings).

6. **Firebase API key is public:** Intentional. Firebase API keys are client-side identifiers, not secrets. Security is enforced by Firestore security rules and authorized domains.

7. **No auto-expiry:** The 48-hour `reservation_failed` status must be set manually by admin. No cron or cloud function handles it automatically.

8. **Payment is manual:** No payment gateway. Admin receives payment offline (transfer/cash) and manually confirms in the dashboard.

9. **`disableDateBlocking: true` apartments:** These skip availability checks entirely. Multiple bookings on same dates are intentional (multiple physical units exist). Availability management for these is manual.

10. **`deleteBooking` function exists in bookingService.js** but has no UI button — intentionally kept for Firebase CLI/script use only.
