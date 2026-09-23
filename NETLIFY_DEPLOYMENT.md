# 🚀 Netlify Deployment Guide - Complete Steps

## Step 1️⃣: Prepare Your GitHub Repository

First, make sure your code is pushed to GitHub (or GitLab/Bitbucket):

```bash
# Check git status
git status

# Add all files
git add .

# Commit your changes
git commit -m "Birthday journey app - ready for Netlify deployment"

# Push to GitHub
git push origin main
```

If you haven't initialized git yet:
```bash
git init
git add .
git commit -m "Initial commit - Birthday journey app"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Step 2️⃣: Create Netlify Account & Connect Repository

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up** (free tier is perfect for this)
3. Click **"Add new site"** → **"Import an existing project"**
4. **Select your Git provider**:
   - GitHub (recommended)
   - GitLab
   - Bitbucket
5. **Authorize** Netlify to access your repositories
6. **Select your repository** from the list
7. Click **"Deploy site"** (Netlify will auto-detect build settings)

---

## Step 3️⃣: Configure Build Settings

Netlify should auto-detect these, but verify:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Node version** | 20 (or latest) |

**If you need to change these**:
1. Go to Site settings → Build & deploy → Build settings
2. Edit the build command and publish directory
3. Save

---

## Step 4️⃣: Set Environment Variables

⚠️ **IMPORTANT**: This is where you set your admin credentials!

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **"Add environment variables"**
3. **Add these variables**:

```
ADMIN_EMAIL: your-admin-email@example.com
ADMIN_PASSWORD: your-secure-password-here-change-this!
NODE_ENV: production
```

**Important**: 
- Change the default password! Make it strong and unique
- The email/password will be used to log in to `/admin`
- Save the credentials somewhere secure

---

## Step 5️⃣: Trigger Deployment

After setting environment variables:

1. **Netlify will auto-deploy** (watch the "Deploys" tab)
2. Wait for build to complete (usually 1-2 minutes)
3. You'll see a green checkmark when done
4. Click the **site URL** to visit your live app

Example: `https://your-site-name.netlify.app`

---

## ✅ Verify Deployment

### Test Guest Experience
```
Visit: https://your-site-name.netlify.app/birthday
```

- ✅ Can you see the landing page?
- ✅ Can you click through days?
- ✅ Do images load?
- ✅ Are animations smooth?

### Test Admin Access
```
Visit: https://your-site-name.netlify.app/admin
```

**Login with**:
- Email: (your ADMIN_EMAIL)
- Password: (your ADMIN_PASSWORD)

- ✅ Admin dashboard loads?
- ✅ Can you see all 5 days?
- ✅ Can you lock/unlock days?
- ✅ Can you edit content?

### Test Admin Preview Feature
```
Visit: https://your-site-name.netlify.app/birthday/day/2?preview=true
```

- ✅ Yellow admin banner appears?
- ✅ Can you see locked content?
- ✅ Content displays correctly?

---

## 🔧 After Deployment: Next Steps

### 1. Configure Birthday Date
In admin dashboard (`/admin`):
- Navigate to **Settings**
- Update the actual birthday date
- Set the day unlock schedule

### 2. Upload Guest Photos
Add photos to these folders:
- `public/day-1/` - Already has 4 memory cards
- `public/day-2/` - For Day 2 media
- `public/day-3/` - For Day 3 media
- etc.

Then redeploy (or they'll be available on next push to main)

### 3. Edit Day Content
- Log in to `/admin`
- Click each day to edit stories/memories
- Add more personal details
- Save changes (updates instantly)

### 4. Set Day Unlock Times
Each day has scheduled unlock times:
- Configure in admin settings
- Or manually unlock days early via admin dashboard

### 5. Share with Guest
Send the birthday person:
```
https://your-site-name.netlify.app/birthday
```

They can create their own guest account and enjoy the journey!

---

## 🚨 Common Issues & Fixes

### ❌ Build Failed?

**Check Netlify build logs**:
1. Go to **Deploys** tab
2. Click the failed deployment
3. Scroll to error message
4. Common fixes:
   - Missing environment variables → Add them in Site settings
   - Node version too old → Update to Node 20+
   - Missing dependencies → Run `npm install` locally, commit package-lock.json

**If still failing**:
```bash
# Test locally
npm install
npm run build
npm run dev

# If works locally, issue is Netlify config
# Check netlify.toml file exists at project root
```

### ❌ Admin Login Not Working?

- ✅ Verify email/password in Netlify environment variables
- ✅ Clear browser cookies (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- ✅ Try incognito/private window
- ✅ Check console (F12) for error messages
- ✅ Make sure HTTPOnly cookie isn't being blocked

### ❌ Images Not Loading?

- ✅ Verify files are in `public/day-1/`, `public/day-2/`, etc.
- ✅ Check file names match exactly (case-sensitive on Linux)
- ✅ Redeploy if you added files after initial deployment
- ✅ Check browser console for 404 errors

### ❌ Preview Mode Not Working?

- ✅ Make sure you're logged in to `/admin` first
- ✅ Add exact parameter: `?preview=true` (lowercase, no spaces)
- ✅ Clear cache: Ctrl+Shift+Delete
- ✅ Verify session cookie exists (F12 → Application → Cookies)

### ❌ Site Takes Long to Load?

- ✅ Normal for first load after deployment
- ✅ Netlify is building Edge Functions
- ✅ Subsequent visits will be faster
- ✅ First Load JS is ~100KB (optimized)

---

## 📱 Enable Custom Domain (Optional)

If you want to use your own domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `birthday.example.com`)
4. Follow DNS configuration steps
5. Usually takes 24-48 hours to activate

---

## 📊 Monitor Your Site

After deployment, you can:

1. **Check build history**: Deploys tab
2. **View analytics**: Analytics tab (free)
3. **Monitor performance**: Speed Insights tab
4. **Check logs**: Deploy logs when needed

---

## 🔐 Security Notes

✅ **What's Protected**:
- Admin routes require valid session
- Passwords are hashed (Web Crypto)
- Sessions use HTTPOnly cookies
- Edge runtime (no Node.js secrets exposed)

⚠️ **What You Should Do**:
- Change default admin password before sharing
- Keep environment variables secure
- Don't share admin credentials publicly
- Regularly update content through admin panel

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub repository connected to Netlify
- [ ] Build command set to: `npm run build`
- [ ] Publish directory set to: `.next`
- [ ] Environment variables set (ADMIN_EMAIL, ADMIN_PASSWORD)
- [ ] Build completed successfully
- [ ] Guest page loads at `/birthday`
- [ ] Admin dashboard loads at `/admin`
- [ ] Admin can log in with credentials
- [ ] Admin preview works with `?preview=true`
- [ ] Images load correctly
- [ ] Animations are smooth
- [ ] Day content displays properly
- [ ] Share link is ready for birthday person!

---

## 📞 Get Help

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://support.netlify.com
- **GitHub Issues**: Create an issue in your repo
- **Check Console**: F12 → Console tab for error messages

---

## 🎉 You're Live!

Your birthday journey app is now deployed! 

**Share this link**:
```
https://your-site-name.netlify.app/birthday
```

The birthday person can enjoy the journey, and you can manage everything from `/admin`. 

**Happy Birthday! 🎂✨**
