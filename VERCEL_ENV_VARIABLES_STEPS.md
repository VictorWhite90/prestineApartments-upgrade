# 🎯 Vercel Environment Variables - Step-by-Step Guide

Follow these exact steps to add your environment variables in Vercel.

---

## 📋 **Step 1: Select Environment**

1. Look at the **"Environments"** dropdown (it shows "All Environments")
2. **Leave it as "All Environments"** (this applies variables to Production, Preview, and Development)
   - ✅ This ensures variables work everywhere

---

## 📝 **Step 2: Add Firebase Variables**

Add each variable one by one using the **Key** and **Value** fields.

### **Variable 1: Firebase API Key**
- **Key:** `VITE_FIREBASE_API_KEY`
- **Value:** `AIzaSyAXC5dIeiiVyzU67SOwouiey55oRjNYiXA`
- Click anywhere outside the field (it auto-saves to the list)

### **Variable 2: Firebase Auth Domain**
- **Key:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** `prestine-apartment-db.firebaseapp.com`
- Click anywhere outside the field

### **Variable 3: Firebase Project ID**
- **Key:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** `prestine-apartment-db`
- Click anywhere outside the field

### **Variable 4: Firebase Storage Bucket**
- **Key:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** `prestine-apartment-db.firebasestorage.app`
- Click anywhere outside the field

### **Variable 5: Firebase Messaging Sender ID**
- **Key:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** `663731777064`
- Click anywhere outside the field

### **Variable 6: Firebase App ID**
- **Key:** `VITE_FIREBASE_APP_ID`
- **Value:** `1:663731777064:web:dc8af8f7c472d694894f1d`
- Click anywhere outside the field

### **Variable 7: Firebase Measurement ID**
- **Key:** `VITE_FIREBASE_MEASUREMENT_ID`
- **Value:** `G-SFKKGNX0QQ`
- Click anywhere outside the field

---

## 📧 **Step 3: Add EmailJS Variables**

### **Variable 8: EmailJS Service ID**
- **Key:** `VITE_EMAILJS_SERVICE_ID`
- **Value:** `service_p6y1fke`
- Click anywhere outside the field

### **Variable 9: EmailJS Template ID (Client)**
- **Key:** `VITE_EMAILJS_TEMPLATE_ID_CLIENT`
- **Value:** `template_vvm744y`
- Click anywhere outside the field

### **Variable 10: EmailJS Template ID (Company)**
- **Key:** `VITE_EMAILJS_TEMPLATE_ID_COMPANY`
- **Value:** `template_iyygb2u`
- Click anywhere outside the field

### **Variable 11: EmailJS Public Key**
- **Key:** `VITE_EMAILJS_PUBLIC_KEY`
- **Value:** `2ZNOdi6QPItTHItBO`
- Click anywhere outside the field

### **Variable 12: EmailJS Payment Confirmation Template**
- **Key:** `VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION`
- **Value:** `template_vvm744y` (or your actual payment confirmation template ID if different)
- Click anywhere outside the field

---

## ✅ **Step 4: Verify All Variables**

You should now have **12 environment variables** listed. Check that all are present:

1. ✅ `VITE_FIREBASE_API_KEY`
2. ✅ `VITE_FIREBASE_AUTH_DOMAIN`
3. ✅ `VITE_FIREBASE_PROJECT_ID`
4. ✅ `VITE_FIREBASE_STORAGE_BUCKET`
5. ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
6. ✅ `VITE_FIREBASE_APP_ID`
7. ✅ `VITE_FIREBASE_MEASUREMENT_ID`
8. ✅ `VITE_EMAILJS_SERVICE_ID`
9. ✅ `VITE_EMAILJS_TEMPLATE_ID_CLIENT`
10. ✅ `VITE_EMAILJS_TEMPLATE_ID_COMPANY`
11. ✅ `VITE_EMAILJS_PUBLIC_KEY`
12. ✅ `VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION`

---

## 💾 **Step 5: Save**

1. Scroll down to find the **blue "Save" button** (bottom right)
2. Click **"Save"**
3. Wait for confirmation message

---

## 🔄 **Step 6: Redeploy (Important!)**

After saving, you'll see a message: **"A new Deployment is required for your changes to take effect."**

### **To Redeploy:**

1. Go to **"Deployments"** tab (top navigation)
2. Find your latest deployment
3. Click the **three dots (⋮)** menu
4. Click **"Redeploy"**
5. Confirm the redeploy

**OR** make a small code change and push to trigger a new deployment.

---

## 📋 **Quick Copy-Paste Method (Alternative)**

If you prefer, you can use the **"Import .env"** button:

1. Create a temporary file with this content:

```env
VITE_FIREBASE_API_KEY=AIzaSyAXC5dIeiiVyzU67SOwouiey55oRjNYiXA
VITE_FIREBASE_AUTH_DOMAIN=prestine-apartment-db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prestine-apartment-db
VITE_FIREBASE_STORAGE_BUCKET=prestine-apartment-db.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=663731777064
VITE_FIREBASE_APP_ID=1:663731777064:web:dc8af8f7c472d694894f1d
VITE_FIREBASE_MEASUREMENT_ID=G-SFKKGNX0QQ
VITE_EMAILJS_SERVICE_ID=service_p6y1fke
VITE_EMAILJS_TEMPLATE_ID_CLIENT=template_vvm744y
VITE_EMAILJS_TEMPLATE_ID_COMPANY=template_iyygb2u
VITE_EMAILJS_PUBLIC_KEY=2ZNOdi6QPItTHItBO
VITE_EMAILJS_TEMPLATE_ID_PAYMENT_CONFIRMATION=template_vvm744y
```

2. Click **"Import .env"** button
3. Paste the content above
4. Click **"Save"**

---

## ⚠️ **Important Notes**

1. **All keys must start with `VITE_`** - This is required for Vite to expose them to your React app

2. **Environment Selection:**
   - Keep "All Environments" selected (recommended)
   - This applies to Production, Preview, and Development

3. **Sensitive Toggle:**
   - Leave it **Disabled** (off)
   - Firebase keys are meant to be public (see SECURITY_BEST_PRACTICES.md)

4. **After Saving:**
   - You MUST redeploy for changes to take effect
   - Environment variables are only loaded during build time

---

## ✅ **Verification Checklist**

After redeploying, verify:

- [ ] All 12 variables are listed
- [ ] Each variable has the correct value
- [ ] Environment is set to "All Environments"
- [ ] Saved successfully
- [ ] Redeployed the application
- [ ] Test the site - Firebase connection works
- [ ] Test booking form - EmailJS works

---

## 🐛 **Troubleshooting**

### Issue: Variables not working after deploy
- **Fix:** Make sure you redeployed after adding variables
- **Fix:** Verify all keys start with `VITE_`
- **Fix:** Check browser console for errors

### Issue: Can't see the variables I added
- **Fix:** Refresh the page
- **Fix:** Check you're in the right project
- **Fix:** Verify you clicked "Save"

### Issue: Import .env not working
- **Fix:** Make sure format is `KEY=value` (no spaces around `=`)
- **Fix:** One variable per line
- **Fix:** All keys start with `VITE_`

---

## 🎉 **Done!**

Once you've:
1. ✅ Added all 12 variables
2. ✅ Saved
3. ✅ Redeployed

Your app will have access to all environment variables and everything will work! 🚀

