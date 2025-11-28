# 🚀 GitHub Push Guide - Complete Commands

Full guide to push your code to GitHub so Vercel can deploy it.

---

## 📋 **Prerequisites**

1. **GitHub account** (create at: https://github.com)
2. **Git installed** on your computer

---

## 🔍 **Step 1: Check if Git is Initialized**

Open PowerShell/Terminal in your project folder:

```powershell
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"
```

Check if Git is initialized:

```powershell
git status
```

**If you see:**
- ✅ "On branch main" or similar → Git is initialized, skip to Step 3
- ❌ "not a git repository" → Continue to Step 2

---

## 🔧 **Step 2: Initialize Git (If Not Done)**

```powershell
# Make sure you're in the project folder
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"

# Initialize Git
git init

# Set default branch name (if needed)
git branch -M main
```

---

## 📦 **Step 3: Create GitHub Repository**

1. Go to: https://github.com
2. Click **"+"** icon (top right) → **"New repository"**
3. **Repository name:** `prestine-apartments` (or any name you like)
4. **Description:** (optional) "Prestine Apartments Booking System"
5. **Visibility:** Choose **Public** or **Private**
6. **DO NOT** check "Initialize with README" (you already have code)
7. Click **"Create repository"**

**After creating, GitHub will show you commands - DON'T use them yet, use the ones below!**

---

## 🔗 **Step 4: Add All Files and Commit**

```powershell
# Make sure you're in the project folder
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"

# First, make sure .gitignore is added (it protects sensitive files)
git add .gitignore

# Then add all other files (respects .gitignore rules)
git add .

# Verify .gitignore is included and sensitive files are excluded
git status

# Check that sensitive files are NOT listed (serviceAccountKey.json, .env.local, etc.)
# If you see them, they're already in .gitignore, which is good!

# Commit with a message
git commit -m "Initial commit - Prestine Apartments booking system"
```

**Important:** `.gitignore` is already in your project and will automatically exclude:
- ✅ `serviceAccountKey.json` (already deleted, but protected)
- ✅ `.env.local` files
- ✅ `node_modules/`
- ✅ `dist/`
- ✅ All sensitive files

---

## 🌐 **Step 5: Connect to GitHub and Push**

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```powershell
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/prestine-apartments.git

# Verify remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

**If this is your first time pushing, Git will ask for credentials:**
- **Username:** Your GitHub username
- **Password:** Use a **Personal Access Token** (NOT your GitHub password)

---

## 🔑 **Step 6: Create Personal Access Token (If Needed)**

If Git asks for password, you need a token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** "Vercel Deployment"
4. **Expiration:** Choose duration (90 days or custom)
5. **Select scopes:** Check `repo` (full control of private repositories)
6. Click **"Generate token"** at bottom
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when Git asks

---

## ✅ **Complete Command Sequence (Copy-Paste)**

Here's the complete sequence. **Replace `YOUR_USERNAME`** with your GitHub username:

```powershell
# Navigate to project folder
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"

# Initialize Git (if not already done)
git init
git branch -M main

# Add all files
git add .

# Commit
git commit -m "Initial commit - Prestine Apartments booking system"

# Add GitHub remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/prestine-apartments.git

# Push to GitHub
git push -u origin main
```

---

## 🔄 **Step 7: Connect Vercel to GitHub**

Now that code is on GitHub:

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select **GitHub** as provider
5. Authorize Vercel (if first time)
6. Find your repository: **`prestine-apartments`**
7. Click **"Import"**

### **Configure Project:**

1. **Project Name:** `prestine-apartments-upgrade` (or keep default)
2. **Root Directory:** `prestine-apartments/react-prestine-apartments`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

7. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add all 12 variables (see `VERCEL_ENV_VARIABLES_STEPS.md`)
   - Set for: Production, Preview, Development

8. Click **"Deploy"**

---

## 🐛 **Troubleshooting**

### **Error: "fatal: not a git repository"**

**Fix:**
```powershell
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"
git init
```

### **Error: "remote origin already exists"**

**Fix:**
```powershell
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/prestine-apartments.git
```

### **Error: "Authentication failed"**

**Fix:**
- Use Personal Access Token instead of password
- See Step 6 above

### **Error: "failed to push some refs"**

**Fix:**
```powershell
# Pull first (if repository has content)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

---

## 📝 **Future Updates**

After initial push, to update GitHub:

```powershell
# Navigate to project
cd "C:\Users\Victor\Desktop\Hosted folder prstine apart\prestine-apartments\react-prestine-apartments"

# Add changes
git add .

# Commit
git commit -m "Your commit message here"

# Push
git push
```

Vercel will automatically deploy when you push to GitHub!

---

## ✅ **Verification Checklist**

After pushing:

- [ ] Code is on GitHub (check https://github.com/YOUR_USERNAME/prestine-apartments)
- [ ] Vercel project is connected to GitHub repo
- [ ] Environment variables are set in Vercel
- [ ] Deployment succeeded
- [ ] Site is accessible at Vercel URL

---

## 🎯 **Quick Reference**

### **Your GitHub Repository URL:**
```
https://github.com/YOUR_USERNAME/prestine-apartments
```

### **Your Vercel Site:**
```
https://prestine-apartments-upgrade.vercel.app/
```

---

## 🚀 **Next Steps After Pushing**

1. ✅ Connect Vercel to GitHub (Step 7)
2. ✅ Add environment variables in Vercel
3. ✅ Deploy
4. ✅ Set up admin access (see `ADMIN_LOGIN_FIX_STEPS.md`)

---

## 💡 **Pro Tip**

Set up Vercel to auto-deploy:
- Every push to `main` branch = automatic production deploy
- Every pull request = preview deployment

This way, you just push code and Vercel handles the rest!

