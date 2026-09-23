# Admin Guide - Birthday Journey

## Logging In

1. Navigate to: `/admin` or `/admin/login`
2. Enter credentials:
   - **Email**: `admin@example.com` (or your custom ADMIN_EMAIL)
   - **Password**: `change-me-123` (or your custom ADMIN_PASSWORD)
3. Click **Sign in**

**Important**: Change these default credentials in production by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

---

## Dashboard Overview

The admin dashboard shows:
- **Guest Count**: Total number of guests who've accessed the journey
- **Journey Status**: Current state (draft, scheduled, live, completed)
- **Active Days**: How many of the 5 days are currently unlocked

### All Days Section

Shows all 5 days with:
- Day number and title
- Lock status (Open/Locked badge)
- **Preview** link to view the day as a guest (even if locked)
- Subtitle/teaser text

---

## Editing Day Content

### Step 1: Select a Day

Click on any day in the "All days" section to load its content editor.

### Step 2: Edit Content

Each day has different editable sections:

#### Day 1: The Beginning
- **Title**: Chapter heading
- **Subtitle**: Subheading
- **Teaser**: Text shown before unlock
- **Welcome message**: Greeting for the guest
- **Timeline entries**: 5 major story chapters with date and description
- **Featured memories**: Key memory cards

#### Day 2: Memory Vault
- **Title, Subtitle, Teaser**: Day meta information
- **Memory cards**: Individual memories with title and description

#### Day 3: Letters
- **Title, Subtitle, Teaser**: Day meta information
- **Envelope/Letter entries**: Individual letters with title and message

#### Day 4: Museum
- **Title, Subtitle, Teaser**: Day meta information
- **Museum rooms**: Exhibition rooms with titles and descriptions

#### Day 5: Final Chapter
- **Title, Subtitle, Teaser**: Day meta information
- **Final intro lines**: Opening lines before the finale
- **Final letter**: Title, content, and signature
- **Final surprise**: Title, content, URL, and type

### Step 3: Save

Click **Save content** at the bottom to persist changes.

---

## Managing Days

### Unlock a Day

1. Click on a day in the sidebar
2. Click the **Unlock day** button (if currently locked)
3. The day becomes accessible to guests
4. Guests will see the day in their journey

### Lock a Day

1. Click on a day in the sidebar
2. Click the **Lock day** button (if currently unlocked)
3. Guests cannot access this day until unlocked

---

## Journey Settings

Edit global settings for the entire journey:

- **Her name**: The guest's name (displayed throughout the app)
- **Birthday date**: The actual birthday date
- **Intro text**: Message shown on the landing page
- **Final message**: Message shown after completion
- **Access password**: Enable/disable password protection for the journey

Click **Save journey settings** to apply changes.

---

## Previewing Days

### As a Guest
Visit `/birthday` to see the journey as guests see it.

### As an Admin (Preview Locked Content)

Even if a day is locked, you can preview it:

1. Click the **Preview →** link next to any day in the sidebar
2. OR navigate to: `/birthday/day/[dayNumber]?preview=true`
3. You'll see the content with a yellow "Admin Preview Mode" banner at the top

**Example URLs**:
- Day 1 preview: `/birthday/day/1?preview=true`
- Day 3 preview: `/birthday/day/3?preview=true`
- Day 5 preview: `/birthday/day/5?preview=true`

---

## Best Practices

✅ **DO**:
- Change default admin password before going live
- Save content regularly while editing
- Use preview mode to check how content looks before unlocking
- Test the journey as a guest to verify everything displays correctly
- Unlock days one at a time to control the pacing

❌ **DON'T**:
- Share admin credentials in plain text
- Edit content while guests are viewing (their session won't update)
- Leave content incomplete before unlocking a day
- Rely solely on the preview without checking the guest view

---

## Troubleshooting

### Can't log in?
- Verify email and password are correct
- Check if cookies are enabled in your browser
- Clear browser cache and try again
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables are set (if deployed)

### Content not saving?
- Check browser console for error messages (F12)
- Verify you're still logged in
- Ensure all required fields are filled
- Try saving again

### Preview shows "Unauthorized"?
- Make sure you're logged in (check for admin session cookie)
- Verify the `?preview=true` parameter is in the URL
- Log out and log back in

### Day displays incorrectly?
- Check the content formatting in the editor
- Verify image file names are correct (if using media)
- Use the preview mode to check rendering
- Check browser console for console errors

---

## Advanced Features

### Admin Session
- Admin sessions expire after 7 days of inactivity
- You'll need to log in again if the session expires
- Sessions are secure and HTTPOnly (cannot be accessed by JavaScript)

### Guest Tracking
View guest statistics on the dashboard:
- Total guests who've accessed the journey
- Which days they've visited
- Completion percentage

### Responsive Testing
The journey is fully responsive. Test on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (375px - 480px)

---

## Support

If you encounter issues:
1. Check this guide first
2. Verify all environment variables are set
3. Clear browser cache and cookies
4. Check browser console (F12) for error messages
5. Review deployment logs if on Netlify
