# ✅ Pre-Deployment Checklist

Quick checklist before deploying to Vercel.

---

## 🔒 Security Files Removed

- [x] `serviceAccountKey.json` - **DELETED** ✅
- [x] All `.env` files in `.gitignore` ✅
- [x] No sensitive data in code ✅

---

## 🔗 Links Fixed

- [x] Policy link in ReservationForm uses `Link` component ✅
- [x] Footer policy links use `Link` component ✅
- [x] Terms link redirects to policies page ✅

---

## 📝 Files Ready

- [x] `firestore.rules` - Security rules ready ✅
- [x] `VERCEL_DEPLOYMENT_GUIDE.md` - Deployment guide created ✅
- [x] `ADMIN_PANEL_GUIDE.md` - Admin guide created ✅
- [x] `.gitignore` - Security files ignored ✅

---

## ⚙️ Environment Variables Needed

**Copy these to Vercel Dashboard:**

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID_CLIENT
VITE_EMAILJS_TEMPLATE_ID_COMPANY
VITE_EMAILJS_PUBLIC_KEY
VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION
```

---

## 🚀 Ready to Deploy!

Follow `VERCEL_DEPLOYMENT_GUIDE.md` for step-by-step instructions.

