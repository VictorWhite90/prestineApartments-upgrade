# 🔐 Environment Variables Setup

Quick guide to set up environment variables for local development.

---

## 📝 **Create `.env.local` File**

### **Step 1: Create the file**

In your project root (`prestine-apartments/react-prestine-apartments/`), create a file named `.env.local`

### **Step 2: Add these values**

Copy and paste this into `.env.local`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyAXC5dIeiiVyzU67SOwouiey55oRjNYiXA
VITE_FIREBASE_AUTH_DOMAIN=prestine-apartment-db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prestine-apartment-db
VITE_FIREBASE_STORAGE_BUCKET=prestine-apartment-db.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=663731777064
VITE_FIREBASE_APP_ID=1:663731777064:web:dc8af8f7c472d694894f1d
VITE_FIREBASE_MEASUREMENT_ID=G-SFKKGNX0QQ

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_p6y1fke
VITE_EMAILJS_TEMPLATE_ID_CLIENT=template_vvm744y
VITE_EMAILJS_TEMPLATE_ID_COMPANY=template_iyygb2u
VITE_EMAILJS_PUBLIC_KEY=2ZNOdi6QPItTHItBO
VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION=template_vvm744y
```

### **Step 3: Verify**

- ✅ File is named exactly `.env.local` (with the dot)
- ✅ File is in the project root directory
- ✅ File is NOT committed to Git (already in `.gitignore`)

---

## ⚠️ **Important Notes**

1. **`.env.local` is already in `.gitignore`** ✅
   - This file will NOT be committed to Git
   - Safe to store actual values

2. **Never commit `.env.local`**
   - Already protected by `.gitignore`
   - Double-check before `git add`

3. **For Production (Vercel):**
   - Use Vercel Dashboard Environment Variables
   - Don't rely on `.env.local` for production

---

## 🔄 **For Vercel Production**

Set the same variables in:
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Add all `VITE_*` variables there

See `VERCEL_DEPLOYMENT_GUIDE.md` for details.

---

## ✅ **Testing**

After creating `.env.local`:

1. Restart your dev server:
   ```powershell
   npm run dev
   ```

2. Check browser console - should NOT see warnings about missing variables

3. Test Firebase connection - should work normally

---

## 📚 **See Also**

- `SECURITY_BEST_PRACTICES.md` - Why Firebase keys are safe to be public
- `VERCEL_DEPLOYMENT_GUIDE.md` - Production deployment guide

