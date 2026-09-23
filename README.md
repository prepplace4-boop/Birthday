# Plan5days Birthday Journey

A romantic five-day birthday experience built with Next.js, TypeScript, and Tailwind CSS. The app includes a gated guest flow, a warm cinematic landing page, daily story pages, and an admin dashboard for managing unlock states and content.

## Features

- ✨ Premium five-day birthday journey experience
- 🔐 Locked/unlocked daily chapters with teasers
- 👥 Guest session logic and protected birthday routes
- 🎛️ Admin login and dashboard to manage all content
- ⏱️ Countdown timer on the home screen
- 🎨 Flexible in-memory content store for customisation
- 👓 Admin preview mode to view locked pages before guests see them
- 📱 Fully responsive design (mobile, tablet, desktop)
- ✨ Smooth animations with Framer Motion
- 🚀 Production-ready with Edge runtime support

## Tech Stack

- **Next.js 15** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zod** - Schema validation

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```

### 3. Open in browser
Visit `http://localhost:3000`

## Guest Experience

1. Visit `/birthday` to start the journey
2. Guest receives a unique session cookie
3. Locked days show teasers
4. Unlock days from the admin panel
5. Guests see unlocked chapters with photos, stories, memories, and letters
6. Day 5 is the finale with birthday message and friend greetings

## Admin Dashboard

### Access
- **URL**: `/admin`
- **Default Email**: admin@example.com
- **Default Password**: change-me-123

### Capabilities
- ✅ View all 5 days and their lock status
- ✅ Edit day content (titles, stories, memories, letters)
- ✅ Unlock/lock individual days
- ✅ Manage global journey settings
- ✅ Preview any day with `?preview=true` parameter (even if locked)
- ✅ View guest statistics and progress

### Preview Locked Pages
Admins can preview any locked day:
```
/birthday/day/1?preview=true
/birthday/day/2?preview=true
/birthday/day/5?preview=true
```

A yellow banner appears indicating "Admin Preview Mode" for locked content.

## Deployment

### Deploy to Netlify

**Option 1: Git-based deployment (Recommended)**
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables in Site Settings
6. Deploy

**Option 2: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Environment Variables
Set these in your deployment platform:
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
NODE_ENV=production
```

**⚠️ IMPORTANT**: Change default credentials before going live!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Admin Guide

For complete admin documentation including:
- Managing day content
- Unlocking/locking days
- Previewing locked pages
- Best practices
- Troubleshooting

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── admin/           # Admin APIs (settings, days, auth)
│   │   └── birthday/        # Guest APIs (access, progress)
│   ├── admin/               # Admin pages (dashboard, login)
│   ├── birthday/            # Guest pages (landing, days)
│   └── layout.tsx
├── components/              # Reusable React components
├── lib/
│   ├── api/                 # Core logic (store, session, guards)
│   └── cn.ts                # Utility functions
├── public/
│   └── day-[1-5]/           # Media assets
├── types/                   # TypeScript interfaces
├── middleware.ts            # Route protection & session
├── netlify.toml             # Netlify configuration
└── package.json
```

## Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm start              # Start production server

# Linting & Type Checking
npm run lint           # Run ESLint
npm run typecheck      # TypeScript check
```

## Environment Setup

Create a `.env.local` file (copy from `.env.example`):
```bash
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
NODE_ENV=development
```

## Architecture

### Guest Flow
1. Guest visits `/birthday` → gets session cookie
2. Views landing page with day previews
3. Clicks on unlocked day → views full chapter
4. Locked days show teasers only
5. Admin can unlock days → guests see new content

### Admin Flow
1. Admin visits `/admin/login` → authenticates
2. Gets admin session cookie (HTTPOnly, 7-day TTL)
3. Accesses dashboard with all days visible
4. Can preview locked days with `?preview=true`
5. Edits content and unlocks days
6. Changes persist across all sessions

### Session Management
- **Guest**: UUID-based, 30 days
- **Admin**: JWT-signed, 7 days, HTTPOnly
- Edge runtime compatible (Web Crypto only)

## Customization

Edit the in-memory store in `lib/api/store.ts` to:
- Change default content for each day
- Add new timeline entries or memories
- Customize settings and messages
- Add friend messages or special content

## Troubleshooting

**Admin login not working?**
- Verify credentials in `.env.local`
- Clear browser cookies
- Check console for error messages

**Images not loading?**
- Place images in `public/day-[1-5]/` folders
- Use exact file names in code
- Check file is actually present

**Deployment failing?**
- Verify Node version (18+)
- Check build logs for errors
- Ensure `.next` is publish directory
- Confirm all env vars are set

## Support

- Next.js Docs: https://nextjs.org/docs
- Netlify Docs: https://docs.netlify.com
- Framer Motion: https://www.framer.com/motion
- Tailwind CSS: https://tailwindcss.com

## License

Created with ❤️ for birthdays.

## Project structure

- `app/` – routes and page UI
- `lib/api/` – store, session, guards, validators
- `middleware.ts` – guest/admin route protection
- `public/` – media assets for the journey
- `types/` – shared TypeScript interfaces

## Notes

- The current content store is in-memory and intended for local demo/customisation use.
- For a production deployment, replace the in-memory store with a persistent database or CMS-backed source.
# Birthday
# Birthday
