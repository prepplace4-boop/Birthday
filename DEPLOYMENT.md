# Birthday Journey App - Deployment Guide

## Environment Variables

Copy and update these variables for your deployment:

```bash
# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-123

# Node environment
NODE_ENV=production

# Next.js
NEXT_PUBLIC_API_URL=https://your-domain.netlify.app
```

### Setting Environment Variables on Netlify:

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Build & deploy** → **Environment**
3. Add the following variables:
   - `ADMIN_EMAIL`: Your admin email
   - `ADMIN_PASSWORD`: A strong admin password
   - `NODE_ENV`: Set to `production`

⚠️ **IMPORTANT**: Change the default admin credentials before deploying to production!

## Deploying to Netlify

### Option 1: Connect Git Repository (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [netlify.com](https://netlify.com)
3. Click **Add new site** → **Import an existing project**
4. Connect your Git repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Add environment variables (see above)
8. Click **Deploy**

### Option 2: Manual Deployment with Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Drag and Drop

1. Run `npm run build`
2. Go to [netlify.com/drop](https://netlify.com/drop)
3. Drag and drop the `.next` folder
4. Set environment variables in site settings

## Features

- ✅ 5-day birthday journey with locked/unlocked content
- ✅ Admin dashboard for managing content
- ✅ Guest access with secure sessions
- ✅ Admin preview mode for locked pages
- ✅ Edge runtime compatible
- ✅ Responsive design with Tailwind CSS
- ✅ Framer Motion animations

## Admin Access

**URL**: `https://your-domain.netlify.app/admin`

**Default Credentials**:
- Email: `admin@example.com`
- Password: `change-me-123`

### Admin Capabilities:

- Unlock/lock individual days
- Edit all day content (titles, stories, memories, letters, etc.)
- Manage journey settings (name, intro text, final message)
- Preview all locked pages by adding `?preview=true` to any day URL
- View guest progress and statistics

### Preview Locked Pages:

Admins can preview any locked day by visiting:
```
https://your-domain.netlify.app/birthday/day/[dayNumber]?preview=true
```

Example: `https://your-domain.netlify.app/birthday/day/2?preview=true`

A banner will appear indicating "Admin Preview Mode" for locked content.

## Troubleshooting

### Build fails with "Node version"
- Check `package.json` for Node version requirement
- Netlify defaults to Node 18. Set to Node 20+ in build settings if needed.

### API routes returning 404
- Ensure `.next` is set as the publish directory
- Check that all API route handlers are properly exported

### Admin login not working
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables are set
- Check browser console for authentication errors
- Clear cookies and try again

### Images not loading
- Verify images are in `/public/day-[1-5]/` folders
- Check file names match exactly in the code
- Ensure public folder is included in deployment

## Support

For issues or questions, check:
- Next.js Documentation: https://nextjs.org/docs
- Netlify Documentation: https://docs.netlify.com
- Framer Motion: https://www.framer.com/motion/
