# 🎂 Birthday Journey — Final Master Project Prompt

> **Purpose:** This document is the complete implementation brief for the multi-day online birthday surprise website. It consolidates the final decisions, day-wise concepts, personal content, UX, backend requirements, admin controls, security requirements, media requirements, and implementation constraints discussed for the project.

---

# 1. PROJECT OVERVIEW

Build a **fully online, premium, cinematic, personal birthday journey website** consisting of five manually unlocked days.

The experience should feel like a private digital storybook created specifically for one person — not like a generic birthday template.

The guest enters through a QR code that opens:

```text
/birthday
```

Admin controls are available at:

```text
/admin
```

The five-day journey is:

| Day | Title | Core Feeling |
|---|---|---|
| 🌸 Day 1 | The Beginning | Curiosity |
| 📸 Day 2 | The Memory Vault | Nostalgia |
| 💌 Day 3 | The Things I Never Said | Emotional connection |
| ✨ Day 4 | The Museum of You | Personal observation + playfulness |
| 🎂 Day 5 | The Final Chapter | Final reveal |

### Emotional progression

```text
Day 1
"I wonder what this is."

        ↓

Day 2
"These memories are really sweet."

        ↓

Day 3
"I didn't know you noticed/thought all these things."

        ↓

Day 4
"Wow, you actually noticed all these little things about me."

        ↓

Day 5
"Wow, you actually planned all of this."
```

The progression should be intentional.

Do not make every day equally emotional.

---

# 2. CORE PRODUCT REQUIREMENTS

## Guest Experience

The guest should be able to:

- Open the birthday journey from QR code.
- See the currently unlocked day.
- Complete each day's experience.
- Have progress persist across refreshes/devices where the backend session permits.
- Return later and continue from where they stopped.
- View only content belonging to unlocked days.
- See upcoming days as locked.
- Receive subtle previews/teasers of future days without exposing their actual locked content.

## Admin Experience

Admin must be able to:

- Log into `/admin`.
- Lock/unlock Day 1–Day 5 manually.
- Edit all day content.
- Add/edit/delete photos.
- Add/edit/delete videos.
- Add/edit timeline items.
- Add/edit memory cards.
- Add/edit letters.
- Add/edit museum exhibits.
- Add/edit habits and observations.
- Add/edit friend messages/videos.
- Configure final surprise.
- Manage guest progress.
- View completion status.
- Manage journey settings.
- Upload and manage media.
- Preview content before publishing.

---

# 3. CRITICAL SECURITY REQUIREMENT

## NEVER SEND LOCKED CONTENT TO THE FRONTEND

Do not implement locking using:

```css
display:none
visibility:hidden
opacity:0
```

or frontend-only JavaScript checks.

If Day 4 is locked, the API must not return Day 4 content.

For example:

```text
GET /api/birthday/day/4
```

must return an appropriate locked response if Day 4 is not unlocked.

The frontend must never receive:

- locked letters
- locked photos
- locked videos
- locked messages
- locked museum data
- locked final content
- hidden JSON containing future-day content

Security must be enforced server-side.

---

# 4. ROUTES

## Guest

```text
/birthday
/birthday/day/1
/birthday/day/2
/birthday/day/3
/birthday/day/4
/birthday/day/5
```

## Admin

```text
/admin
/admin/login
/admin/birthday
/admin/birthday/days
/admin/birthday/media
/admin/birthday/progress
/admin/birthday/settings
```

---

# 5. API STRUCTURE

Suggested APIs:

```text
GET  /api/birthday
GET  /api/birthday/days
GET  /api/birthday/day/{dayNumber}

POST /api/birthday/start
POST /api/birthday/progress
POST /api/birthday/day/{dayNumber}/complete

GET  /api/birthday/day/1
GET  /api/birthday/day/2
GET  /api/birthday/day/3
GET  /api/birthday/day/4
GET  /api/birthday/day/5

POST /api/admin/birthday/day/{dayNumber}/unlock
POST /api/admin/birthday/day/{dayNumber}/lock

POST /api/admin/birthday/media
PUT  /api/admin/birthday/media/{id}
DELETE /api/admin/birthday/media/{id}

PUT /api/admin/birthday/content
GET /api/admin/birthday/progress
```

Adapt naming to the existing backend conventions.

---

# 6. SUGGESTED DATA MODEL

Use proper backend entities/models instead of hardcoding birthday content into React/Next.js.

Suggested entities:

```text
Admin
BirthdayJourney
Day
TimelineItem
Memory
MemoryCard
Envelope
EnvelopeMessage
DayLetter
DayLetterProgress
MuseumRoom
MuseumExhibit
PlaylistItem
Habit
Observation
Media
FriendMessage
FinalLetter
FinalSurprise
JourneySettings
GuestSession
Progress
EasterEgg
```

The exact schema can be simplified if the existing project already has an appropriate architecture.

---

# 7. GENERAL DESIGN LANGUAGE

The whole website should be:

- Mobile-first
- Responsive
- Premium
- Warm
- Cinematic
- Personal
- Elegant
- Slightly playful
- Emotional without being overly dramatic
- Smooth
- Fast
- Accessible

Avoid:

- Generic birthday templates
- Excessive gradients
- Neon colors
- Corporate dashboard aesthetics on guest pages
- Overuse of emojis
- Excessive animations
- Loud music
- Game-like UI everywhere
- Artificially dramatic language

Use:

- Warm cream/paper backgrounds
- Muted rose
- Soft gold
- Dusty pink
- Warm brown
- Handwritten-style accents
- Polaroids
- Paper cards
- Envelopes
- Film strips
- Soft shadows
- Subtle particles
- Gentle page transitions

Respect:

```text
prefers-reduced-motion
```

---

# 8. MEDIA REQUIREMENTS

Supported:

```text
JPG
JPEG
PNG
WEBP
GIF
MP4
WEBM
```

Do not use Day 3 audio recording.

Media should:

- Be lazy loaded where appropriate.
- Have responsive sizing.
- Use thumbnails/posters for videos.
- Avoid aggressive autoplay.
- Be optimized for mobile.
- Be served through secure backend/media routes where appropriate.

---

# 9. DAY 1 — 🌸 THE BEGINNING

## Purpose

Day 1 should introduce the journey.

Emotion:

> "I wonder what this is."

Do not make Day 1 too emotional.

It should create curiosity.

---

## Section 1 — Welcome

Example:

> **Hey.**
>
> You found it.
>
> But this isn't the whole thing.
>
> Not yet. 👀
>
> There are five chapters.
>
> And this is only the beginning.

Then:

```text
CHAPTER 01
THE BEGINNING
```

---

## Section 2 — Friendship Timeline

Create an interactive timeline.

Suggested configurable moments:

- How we met
- Early memories
- School years
- Important conversations
- Distance
- Reconnecting
- Recent memories

Admin must be able to add/edit/delete timeline entries.

Each timeline entry can contain:

```text
date
title
description
image
optional video
```

Do not invent exact dates.

---

## Section 3 — Featured Memory

Allow one featured:

- Photo
- Video

Use a cinematic presentation.

No aggressive autoplay.

---

## Section 4 — Mystery Question

This is NOT a scored quiz.

Example:

> **One question before you continue...**
>
> What do you think the next chapter is about?

Possible playful answers:

```text
A. More memories
B. Something embarrassing
C. Something I probably shouldn't have found 👀
D. I have absolutely no idea
```

After selection, show a playful response.

Do not treat this as a correctness test.

---

## Section 5 — Day Completion

Display:

> **Chapter 01 complete.**
>
> You can come back tomorrow for the next chapter.

Then tease:

> **Tomorrow: The Memory Vault 📸**

---

# 10. DAY 2 — 📸 THE MEMORY VAULT

## Purpose

Day 2 should feel nostalgic, cute and playful.

It should be less emotionally intense than Day 3.

Emotion:

> "These memories are really sweet."

---

# Section 2.1 — Memory Gallery

Show approximately:

```text
15–25 photos
```

Possible styles:

- Polaroid wall
- Scrapbook
- Film strip
- Masonry gallery

Each memory can have:

```text
photo
caption
date
optional location
```

Use real uploaded photos.

Do not invent captions that imply facts not provided.

---

# Section 2.2 — Little Moments

Use:

```text
2–4 short videos
```

Requirements:

- User-controlled playback.
- Lazy loading.
- Video poster image.
- No forced autoplay with sound.

---

# Section 2.3 — Memory Cards

Create short personal memory cards.

Examples:

```text
"Some memories don't need a reason to stay."

"Some of the best moments were completely ordinary."

"Apparently, we were collecting memories without realizing it."
```

Admin-editable.

---

# Section 2.4 — A Memory You Probably Forgot

Create a locked memory card.

Title:

> **A Memory You Probably Forgot 👀**

It should reveal a very specific memory that the creator remembers but she may have forgotten.

The actual memory must be configurable by admin.

Use a reveal animation.

---

# Section 2.5 — Hidden Memory

Create a small exploration experience.

It should NOT be a difficult game.

The hidden memory should eventually lead to:

> **Our old chats.**

---

# Section 2.6 — OLD CHAT ARCHIVE

This section uses the actual uploaded WhatsApp screenshots.

## Intro

Display exactly this concept:

> **I found something else in the vault...**
>
> Not a photo.
>
> Not a video.
>
> **Something much more dangerous. 👀**

Then:

> **Proceed carefully.**
>
> These messages are old.
>
> Some are cute.
>
> Some are completely stupid.
>
> Some should probably have remained buried. 😂

---

## Chat Viewer

Show screenshots:

- One at a time
- Phone/chat UI
- Previous/next
- Swipe support on mobile
- Subtle transitions
- Caption per screenshot if configured

Do NOT modify the actual text in the screenshots.

Do NOT invent conversations.

Use the uploaded screenshots as-is.

---

## After 3–4 screenshots

Display:

> **Okay... enough evidence. 😂**

Then:

> Looking at these again made me realize something.
>
> We didn't always need a reason to talk.
>
> There wasn't always an important topic.
>
> Sometimes it was teasing.
>
> Sometimes random complaints.
>
> Sometimes stupid arguments.
>
> Sometimes completely unnecessary conversations.
>
> And somehow we'd still keep talking.
>
> Those completely ordinary conversations became memories.
>
> **And I think that's what makes them special. ❤️**

---

# Section 2.7 — SEALED ENVELOPE

Display:

```text
FOR YOUR EYES ONLY
```

Message:

> Looking through these old chats made me smile more than I expected.
>
> Not because every conversation was meaningful or every message was perfect.
>
> Most of them were actually pretty stupid. 😂
>
> But they remind me of how naturally we could just talk about anything.
>
> There was no special occasion needed. No important topic required.
>
> We could turn teasing, random complaints, stupid arguments and completely unnecessary conversations into hours of talking.
>
> And I think that's what I like about these memories.
>
> They weren't planned.
>
> They weren't special when they happened.
>
> They just became special because, somewhere along the way, they became ours.
>
> So yes... maybe you forgot some of these conversations.
>
> But I'm glad I still have a few of them.
>
> Because they're little pieces of us that time didn't manage to erase. ❤️

---

# DAY 2 ENDING

Display:

> Some memories are photographs.
>
> Some are places.
>
> Some are conversations you completely forgot about. 😂
>
> And sometimes...
>
> **the most ordinary moments become the ones you want to keep.**

Then:

```text
DAY 2 COMPLETE
```

Teaser:

> **Tomorrow: The Things I Never Said 💌**

---

# 11. DAY 3 — 💌 THE THINGS I NEVER SAID

## Purpose

This is the emotional center of the first part of the journey.

Emotion:

> "I didn't know you noticed/thought all these things."

Day 3 should preserve the warm paper/envelope aesthetic from the provided Day 3 HTML.

Do NOT redesign it into a generic interface.

---

# DAY 3 VISUAL STYLE

Use:

- Warm paper background
- Cream tones
- Muted rose
- Soft gold
- Envelope cards
- Circular seals
- Paper letters
- Subtle particles
- Soft transitions
- Responsive layout
- Reduced-motion support

Original concept:

> **The things I never said**
>
> Ten letters, sealed.
>
> Tap one open when you're ready to read it.

Progress:

```text
0 of 10 opened
```

Do NOT include audio recording.

Do NOT request microphone access.

Do NOT add audio upload/player functionality.

---

# DAY 3 SPECIAL STORY

Before the ten letters, include:

```text
📖 OUR STORY
```

Intro:

> Before you read what I never said...
>
> maybe you should know how all of this started.

The story is divided into chapters.

---

## Chapter 1 — 6th Class

Title:

> **Where It All Started**

Content:

> We were in the same class in 6th.
>
> At that time, you didn't really talk to many people.
>
> You were quiet and mostly kept to yourself.
>
> And then one day, during lunch break, because of the overcrowding or just one of those random situations, there was an unwanted push that made you angry.
>
> I don't think either of us knew at that moment that this completely random incident would become the beginning of knowing each other.
>
> It wasn't some movie-like first meeting.
>
> It was actually quite random.
>
> But somehow...
>
> **that was where our story started.**

Timeline marker:

```text
CLASS 6
```

---

## Chapter 2 — The Two-Year Gap

Title:

> **Then Life Happened**

Content:

> After that, we weren't really in touch for around two years.
>
> Life continued.
>
> Different things happened.
>
> Different people came and went.
>
> And somehow, that small connection from 6th class just became one of those things sitting somewhere in the background.
>
> Neither of us probably knew what it would eventually become.

---

## Chapter 3 — 8th Class

Title:

> **Then Something Changed**

Content:

> In 8th class, somewhere along the way, I started liking you.
>
> I finally said it.
>
> And your first answer was no.
>
> 😂
>
> Which, honestly, was probably not the ending I was hoping for.
>
> But then, completely out of nowhere, around two months later...
>
> you said yes.
>
> And suddenly, we had so much to talk about.

Visual:

```text
ME:
"I like you."

↓

YOU:
"No."

↓

~ 2 MONTHS LATER ~

↓

YOU:
"Yes."
```

---

## Chapter 4 — The Conversations

Title:

> **Then We Started Talking**

Content:

> After that, we talked.
>
> A lot.
>
> Probably much more than either of us expected.
>
> Random conversations.
>
> Long conversations.
>
> Stupid conversations.
>
> Conversations that started with absolutely nothing and somehow lasted forever.
>
> Somewhere in all of those conversations, knowing you became part of my everyday life.

Optional visuals:

- One or two old chat screenshots
- Old photographs

Do not duplicate the full Day 2 chat archive.

---

## Chapter 5 — Relocation

Title:

> **And Then I Had to Leave**

Content:

> Then my family relocated.
>
> And suddenly, the distance changed things.
>
> The conversations slowly became less frequent.
>
> Not because the connection completely disappeared...
>
> life just started moving in different directions.
>
> We weren't completely strangers.
>
> But we weren't talking the way we used to either.

---

## Chapter 6 — The Accident

Title:

> **The Part I Don't Fully Remember**

IMPORTANT:

Do not invent what happened.

Do not claim she definitely felt betrayed.

Use uncertainty.

Content:

> Then, after my birthday, I had an accident.
>
> There is a part of what happened after that that I don't completely remember or understand.
>
> Sometimes I've wondered whether I unknowingly hurt you or somehow made you feel betrayed.
>
> I don't know exactly what happened.
>
> And maybe that's one of the things I've carried without ever really knowing how to explain it.

---

## Chapter 7 — Finding the Conversation Again

Title:

> **Somehow, We Found Our Way Back**

Content:

> Then, after around two years, we started talking again.
>
> Not exactly like nothing had happened.
>
> Not suddenly like everything was back to the way it was.
>
> Just...
>
> talking again.
>
> And somehow, that was enough to remind me that some connections don't completely disappear.
>
> They can become quiet.
>
> They can become distant.
>
> But sometimes they still remain somewhere.

---

## Chapter 8 — Still Connected

Title:

> **Not Always Close. Never Completely Gone.**

Content:

> Maybe we haven't always talked properly.
>
> Maybe there have been long gaps.
>
> Maybe life has taken us in different directions.
>
> But somehow...
>
> we're still connected.
>
> And when I look at the whole story, that's probably one of the strangest and nicest parts.
>
> We didn't have a perfect story.
>
> We didn't have a straight line.
>
> We had gaps.
>
> Distance.
>
> Confusion.
>
> Random conversations.
>
> And somehow...
>
> we kept finding our way back into each other's lives.
>
> **Maybe that's what makes our story ours. ❤️**

---

# STORY ENDING

Show a photograph.

Text:

> **And that's how we got here.**

Then:

> From a random lunch break in 6th class...
>
> To all the years, conversations, distance, silence, memories and somehow finding our way back.

Then:

> **And I still don't think our story is finished.**

Button:

```text
CONTINUE TO THE LETTERS
```

---

# DAY 3 — TEN LETTERS

After the story:

> **There are still some things I never said.**

Then:

> **10 letters.**
>
> **10 thoughts.**
>
> **No particular order.**

Show 10 sealed envelopes.

---

## Letter 01

### Something I've always appreciated about you

> One of the things I've always appreciated about you is how much your nature has stayed the same.
>
> Over all this time, even with everything that has changed, there has always been something familiar about you.
>
> The same kind of nature.
>
> The same way of caring.
>
> The same person I could trust.
>
> And I think that's something I don't say enough.
>
> People change.
>
> Circumstances change.
>
> Life changes.
>
> But knowing that some parts of you remained the same made it easier to believe that the connection was real.
>
> That's something I've always appreciated about you.

---

## Letter 02

### A memory I never told you was special

> I don't think there is one single memory that I can point to and say,
>
> "This was the most special."
>
> Because honestly...
>
> almost every time I talked to you, it felt special in its own way.
>
> Sometimes it was a completely random conversation.
>
> Sometimes we were talking about nothing.
>
> Sometimes it was just a normal message.
>
> But somehow, talking to you never felt completely ordinary.
>
> I don't think you realized that.
>
> Maybe that's why I remember so many of those seemingly unimportant moments.

---

## Letter 03

### Something about you that always makes me laugh

> Your innocence.
>
> Your cuteness.
>
> And that completely baby-like behaviour sometimes. 😂
>
> There are moments when you react to something in the most innocent way possible, and I genuinely can't help but smile.
>
> Sometimes you don't even realize how cute or funny you're being.
>
> And that's probably what makes it even funnier.
>
> You can be completely serious about something, while I'm sitting there thinking:
>
> "How are you this cute?" 😂

---

## Letter 04

### Something you probably don't realize about yourself

> I don't think you realize how much you do for people.
>
> You don't always announce it.
>
> You don't always tell someone:
>
> "Look, I did this for you."
>
> You just do things.
>
> You care.
>
> You show up.
>
> You make people feel better.
>
> And then you move on like it wasn't anything.
>
> But it is something.
>
> People notice.
>
> I notice.
>
> You probably don't give yourself enough credit for the way you affect the people around you.

---

## Letter 05

### A picture that means more than you think

Use the one meaningful photo of both people.

Display as:

- Polaroid
- Soft shadow
- Paper texture
- Gentle zoom

Message:

> I don't have hundreds of photos of us.
>
> I have this one.
>
> And somehow, this one means more to me than most pictures ever could.
>
> Not because it's perfect.
>
> Not because it's some extraordinary photograph.
>
> But because it's ours.
>
> It's proof that this version of our story happened.
>
> And that's enough to make it special to me.

Do not keep huge base64 images inside the HTML.

Use proper media storage.

---

## Letter 06

### A moment I'd happily relive

> There are probably many moments I'd happily relive.
>
> But one thing I always think about is the way you've forgiven me for my "ulti-jalti harkatein." 😂
>
> I've definitely made mistakes.
>
> I've definitely done stupid things.
>
> And there have been moments where I probably made things harder than they needed to be.
>
> But every time you found a way to forgive me, it meant more than I probably showed.
>
> Maybe that's why those moments stay with me.
>
> Not because I want to relive the mistakes...
>
> but because I would relive the moment where everything became okay again.

---

## Letter 07

### Something I've wanted to say

> You are genuinely one of the best people I've ever met.
>
> And I hope you never forget that.
>
> Stay the way you are.
>
> Keep your kindness.
>
> Keep your innocence.
>
> Keep your weirdness.
>
> Keep your cuteness.
>
> Don't let the world make you feel like you need to become someone else.
>
> **You are already enough as you are. ❤️**

---

## Letter 08

### A random thought I've never told you

> Sometimes I randomly think:
>
> **What if we had never met?**
>
> And honestly...
>
> I don't really like imagining that version of my life.
>
> Because whatever life would have looked like, it wouldn't have had this friendship in it.
>
> I wouldn't have had these conversations.
>
> These memories.
>
> This history.
>
> This completely random story.
>
> And I don't think I could have simply replaced it with another person.
>
> Some people just become part of your story in a way that nobody else can really copy.
>
> You're one of those people for me.

---

## Letter 09

### Why this friendship matters to me

> Because it isn't a friendship based on "matlab."
>
> It isn't about what one person can get from the other.
>
> It isn't about talking every single day.
>
> It isn't about always being around.
>
> We've had gaps.
>
> We've had distance.
>
> We've had periods where we barely talked.
>
> And somehow...
>
> the connection was still there.
>
> That's why this friendship matters to me.
>
> It's old.
>
> It's real.
>
> And it survived time without needing something in return.
>
> I think that's rare.

---

## Letter 10

### One last message

> I don't know what the future looks like.
>
> I don't know where life takes either of us.
>
> I don't know how many things will change.
>
> But there is one thing I genuinely hope for.
>
> I just want and pray to God that you stay somewhere in my life always.
>
> Maybe close.
>
> Maybe far.
>
> Maybe through random conversations.
>
> Maybe through years of silence and then one completely normal message.
>
> I don't know.
>
> I just hope you're still somewhere in the story.
>
> **Always. ❤️**

---

# DAY 3 BONUS ENVELOPE

After all ten letters are opened:

```text
10 / 10 LETTERS OPENED
```

Unlock:

> **Not on the list. Just because.**

This is the bonus envelope.

Its content must be admin-editable.

It can contain:

- One additional photo
- One short personal message
- A tiny secret
- A hidden memory

Do not automatically create additional personal facts.

---

# DAY 3 COMPLETION

Show:

> You opened all ten.
>
> But somehow...
>
> I still feel like there are things I haven't said.

Then:

```text
DAY 3 COMPLETE
```

Teaser:

> **Tomorrow: The Museum of You ✨**

---

# 12. DAY 4 — ✨ THE MUSEUM OF YOU

## Purpose

Day 4 should be unique and personal.

Emotion:

> "Wow, you actually noticed all these little things about me."

It should be playful and observational.

Do NOT make it a difficult game.

---

# DAY 4 ROOMS

Create:

1. Things That Make You, You
2. Your Soundtrack
3. The Chaos Archive
4. Things I Like About You
5. Your Little Habits
6. The Things You Don't Notice
7. Unknown Exhibit

---

# PERSONAL DETAILS TO USE

These are the personal observations to seed into the museum:

- Very cute
- Loves sleeping
- Loves coffee
- Loves clicking photos
- Loves soft toys
- Loves chocolates
- Loves waffles
- Gets excited about food
- Says: **"neend aari hai"**
- Takes forever to reply
- Sends 20 messages together
- Always changes her mind about food
- Makes a particular expression
- Laughs at random things

Personality words:

```text
Cute
Funny
Kind
Caring
Chaotic
Emotional
Thoughtful
Comforting
Unpredictable
```

All should be editable from admin.

---

# DAY 4 — HIDDEN OBJECT MINI GAME

Create ONE visual scene.

Hide exactly:

```text
☕ Coffee
🧸 Soft Toy
🍫 Chocolate
🧇 Waffle
📸 Camera
🔑 Key
```

The image must have enough visual space for the objects to be discoverable.

The interaction should be:

```text
Find 6 objects
```

Show progress:

```text
0 / 6
```

Each found item gets marked.

After all six are found:

```text
You found everything.
```

Then unlock:

# THE LITTLE THINGS

---

# THE LITTLE THINGS — SECRET ROOM

Use the following observations:

### Coffee

> Somehow coffee is not just a drink.
>
> It is practically part of your personality.

### Sleeping

> If sleeping were a competitive sport,
> I have a feeling you'd be undefeated.

### Photos

> You somehow manage to turn ordinary moments
> into photographs.

### Soft Toys

> There is always room for one more soft toy.

### Chocolates

> Chocolate appears to have its own special category.

### Waffles

> And then there are waffles.
>
> Enough said. 😂

### Food

> Watching you get excited about food
> is honestly its own experience.

### Neend Aari Hai

Display as a quote:

> **"Neend aari hai."**

Then:

> The sentence that somehow appears
> at exactly the right time. 😂

### 20 Messages

Display:

```text
1 message
2 messages
5 messages
10 messages
20 messages
```

Then:

> Why send one message when twenty will do?

### Replying

> You can take forever to reply...
>
> and then suddenly send 20 messages together.

### Food Decisions

> "What do you want to eat?"
>
> "Anything."
>
> "Pizza?"
>
> "No."
>
> "Waffles?"
>
> "Maybe."
>
> "Then what?"
>
> "I don't know." 😂

### Random Laughing

> Sometimes you laugh at things
> that absolutely nobody else would find funny.
>
> And somehow that's what makes it funny.

---

# DAY 4 LETTER

Use:

> I know I joke about noticing small things,
> but somewhere along the way I started remembering them.
>
> The things you say without thinking.
>
> The expressions you make.
>
> The little habits.
>
> The random things you like.
>
> Maybe you don't notice most of them.
>
> I do.
>
> And that's probably what this whole museum is about.
>
> **Welcome to the museum of you. ❤️**

---

# DAY 4 COMPLETION

Show:

> **EXHIBIT COMPLETE**
>
> You have officially been documented. 😂

Then:

> Tomorrow is the final chapter.

Teaser:

> **🎂 The Final Chapter**

---

# 13. DAY 5 — 🎂 THE FINAL CHAPTER

## Purpose

Day 5 is the final reveal.

Emotion:

> "Wow, you actually planned all of this."

This is the culmination.

IMPORTANT:

Do NOT create the actual Netflix-style cinematic video in this implementation.

Instead, create a configurable video placeholder/player if the user later provides the video.

---

# DAY 5 STRUCTURE

Suggested sections:

1. Final reveal
2. Friend video messages
3. Final letter
4. Things I hope never change
5. Future memory capsule
6. Candle interaction
7. Final digital surprise
8. Closing screen

---

# FINAL REVEAL

Display:

> **You made it to the final chapter.**

Then:

> Five days.
>
> Five chapters.
>
> A ridiculous amount of memories.
>
> And a lot of things I probably should have said earlier.

Then:

> **Happy Birthday. ❤️**

---

# FRIEND VIDEO MESSAGES

Allow:

```text
5–10 short vertical videos
```

Recommended:

```text
10–20 seconds each
```

Admin can:

- Upload video
- Set friend's name
- Set caption
- Reorder videos
- Delete video

Display them as a personal video wall.

---

# CINEMATIC VIDEO PLACEHOLDER

Create an optional configurable video component.

Supported:

```text
MP4
WEBM
```

Admin can upload the final cinematic video later.

Do not hardcode or generate a Netflix-style video.

---

# FINAL LETTER

Create an editable final letter.

Target:

```text
700–1200 words
```

The admin must be able to edit the complete letter.

Use a beautiful letter/paper presentation.

The final letter should feel like the conclusion of the five-day story.

Do not automatically invent personal facts.

---

# LITTLE THINGS I HOPE NEVER CHANGE

Create a visual list of small things.

Examples based on established content:

- Your cuteness
- Your random laughter
- Your "neend aari hai"
- Your food excitement
- Your 20-message conversations
- Your love for coffee
- Your love for photos
- Your kindness
- Your caring nature
- Your unpredictability
- Your ability to make ordinary conversations memorable

Admin editable.

---

# FUTURE MEMORY CAPSULE

Create a section:

> **For the future...**

Allow the guest to see/write a digital future memory.

Possible UI:

```text
Dear Future Us,

I hope when you read this...
```

Admin can configure the prompt.

Optional guest-written response can be saved.

---

# CANDLE INTERACTION

Create a simple candle interaction.

Example:

```text
🕯️
Make a wish.
```

Interaction:

- Tap/click candle
- Flame animates
- Wish screen appears
- Gentle particle effect
- Continue button

Do not require microphone.

Do not require real-world camera access.

---

# FINAL DIGITAL SURPRISE

Make the final surprise configurable.

Possible options:

```text
Photo collection
Secret webpage
Digital scrapbook
Playlist
Gift reveal
Downloadable memory book
Custom message
Secret link
```

Admin chooses/configures the final surprise.

---

# FINAL SCREEN

Suggested:

> **And that's the end of the five chapters.**
>
> Or maybe...
>
> just the end of this little website.
>
> Because the real story is everything
> that comes after this.
>
> **Happy Birthday. ❤️**
>
> Always.

Then subtle final animation.

---

# 14. ADMIN PANEL

Admin dashboard should contain:

## Journey

```text
Journey status
Current unlocked day
Guest progress
Completion percentage
```

## Day Management

For each day:

```text
Lock
Unlock
Preview
Edit
Publish
```

## Content Management

Admin can edit:

```text
Titles
Descriptions
Letters
Timeline
Photos
Videos
Captions
Memory cards
Museum rooms
Museum exhibits
Habits
Observations
Friend messages
Final letter
Final surprise
```

## Media Management

Allow:

```text
Upload
Preview
Replace
Delete
Reorder
Set cover
```

## Progress

Show:

```text
Day 1 started/completed
Day 2 started/completed
Day 3 letters opened
Day 4 objects found
Day 5 completed
Overall progress
```

---

# 15. PROGRESS TRACKING

Track progress server-side.

Example:

```text
GuestSession
    ↓
DayProgress
    ↓
SectionProgress
    ↓
ItemProgress
```

Day 3 should track:

```text
openedLetters
```

Day 4 should track:

```text
foundObjects
```

Day completion should be stored server-side.

Refreshing the browser must not reset progress.

---

# 16. OPTIONAL ACCESS PROTECTION

If enabled by admin, support:

```text
birthday access password
```

Do not expose the password in frontend JavaScript.

---

# 17. MUSIC

Music is optional.

Requirements:

- User-controlled toggle.
- No aggressive autoplay.
- Respect browser autoplay restrictions.
- Allow mute/unmute.
- Remember preference if appropriate.

Do not use audio recording on Day 3.

---

# 18. PERFORMANCE

Implement:

- Lazy image loading
- Responsive images
- Video poster frames
- Code splitting
- Route-level loading
- Optimized API responses
- Pagination where needed
- Media compression
- Caching where appropriate

Do not preload the entire five-day journey.

Only request the currently accessible content.

---

# 19. RESPONSIVE REQUIREMENTS

Must work on:

```text
Mobile
Tablet
Laptop
Desktop
```

Primary design target:

```text
Mobile
```

Touch interactions must be comfortable.

Hidden-object game must be usable on touch screens.

Envelope opening must work with:

```text
tap
click
keyboard
```

where appropriate.

---

# 20. ACCESSIBILITY

Include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Alt text for images
- Captions where appropriate
- Reduced-motion support
- Accessible buttons
- Proper contrast
- Screen-reader-friendly labels

---

# 21. DO NOT HARDCODE PERSONAL CONTENT INTO UI COMPONENTS

Personal content should come from backend data.

For example:

BAD:

```tsx
<p>You love coffee.</p>
```

GOOD:

```tsx
<MuseumExhibit content={exhibit.content} />
```

The admin should be able to change:

```text
"coffee"
```

without modifying frontend code.

---

# 22. FRONTEND COMPONENT ARCHITECTURE

Create reusable components such as:

```text
BirthdayShell
DayNavigation
DayLock
ProgressIndicator
Timeline
TimelineItem
MemoryGallery
MemoryCard
VideoMemory
ChatArchive
ChatViewer
EnvelopeGrid
Envelope
LetterViewer
Museum
MuseumRoom
MuseumExhibit
HiddenObjectScene
HiddenObject
FinalLetter
FriendVideo
CandleInteraction
FinalSurprise
CompletionScreen
```

Keep components modular.

---

# 23. BACKEND ARCHITECTURE

Use the project's existing backend architecture.

Recommended separation:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Do not put business logic directly into controllers.

Validate:

- day number
- access permissions
- progress ownership
- media type
- upload size
- admin permissions

---

# 24. SECURITY

Implement:

- Admin authentication
- Authorization
- Server-side day locking
- Secure media access
- Input validation
- Upload validation
- File size limits
- MIME validation
- No executable uploads
- No sensitive content in frontend bundles
- No hidden future-day JSON
- No client-side-only access checks

---

# 25. ERROR STATES

Create polished states for:

```text
Day locked
Content unavailable
Network error
Media loading
Video error
Upload error
Invalid access
Unauthorized admin
Progress save failure
```

Do not show raw backend stack traces to users.

---

# 26. TESTING REQUIREMENTS

Test:

## Frontend

- Mobile
- Tablet
- Desktop
- Navigation
- Animations
- Envelope opening
- Hidden-object interaction
- Video playback
- Progress UI

## Backend

- Day locking
- Day unlocking
- Progress persistence
- Admin authorization
- Media upload
- Content editing
- Guest access

## Security

Verify that a guest cannot access locked content by:

```text
Direct URL
API request
Browser devtools
Changing day number
Refreshing
Inspecting page source
Inspecting network responses
```

Locked content must remain unavailable.

---

# 27. IMPORTANT CONTENT RULES

Do not:

- Invent memories
- Invent conversations
- Invent dates
- Invent what happened during the accident
- Claim the other person felt something unless explicitly provided
- Modify uploaded WhatsApp screenshots
- Add audio recording to Day 3
- Replace the personal letters with generic AI-generated birthday messages
- Replace the personal story with generic relationship copy

Where content is marked editable/configurable, use placeholder data only until the admin provides the final asset.

---

# 28. CREATIVE ASSET CHECKLIST

## Day 1

```text
5–8 photos
5–7 timeline moments
1 featured video/photo
```

## Day 2

```text
15–25 photos
2–4 videos
1 secret memory
Old WhatsApp screenshots
Memory cards
```

## Day 3

```text
1 meaningful photo for Letter 5
Optional supporting photos
Optional supporting chat screenshots
10 written letters
How-we-met story
1 bonus envelope
NO AUDIO
```

## Day 4

```text
1 hidden-object scene
30–50 total observations/items if desired
5–8 songs/links
5–10 chaos items
8–12 appreciation cards
8–10 habits
5–8 observations
1 unknown exhibit
```

## Day 5

```text
5–10 friend videos
700–1200 word final letter
Optional cinematic video
Final digital surprise
Candle interaction assets
```

---

# 29. PROJECT FILE ORGANIZATION

Suggested creative asset folder:

```text
BIRTHDAY_PROJECT/
│
├── 00_CANVA/
│
├── 01_DAY_1/
│   ├── photos/
│   ├── videos/
│   └── timeline/
│
├── 02_DAY_2/
│   ├── photos/
│   ├── videos/
│   ├── chat-screenshots/
│   └── memories/
│
├── 03_DAY_3/
│   ├── photos/
│   ├── story/
│   ├── letters/
│   └── screenshots/
│
├── 04_DAY_4/
│   ├── museum/
│   ├── hidden-object/
│   ├── habits/
│   └── observations/
│
└── 05_DAY_5/
    ├── friend-videos/
    ├── final-letter/
    ├── final-video/
    └── final-surprise/
```

---

# 30. QR CARD COPY

Use this copy for the physical/Canva QR card:

> **I made something for you.**
>
> But you can't see everything yet. 👀
>
> **5 days. 5 chapters.**
>
> Scan when you're ready.
>
> Keep this card.
> You'll need it again. ❤️

QR should point to:

```text
/birthday
```

Do not combine the QR card design with the memory cards.

---

# 31. FINAL UX FLOW

The complete experience should feel like:

```text
QR
 ↓
Birthday Landing
 ↓
DAY 1
The Beginning
 ↓
Timeline
 ↓
Memory
 ↓
Mystery Question
 ↓
Day 1 Complete
 ↓
DAY 2
The Memory Vault
 ↓
Photos
 ↓
Videos
 ↓
Memory Cards
 ↓
Forgotten Memory
 ↓
Hidden Memory
 ↓
Old Chats
 ↓
Sealed Envelope
 ↓
Day 2 Complete
 ↓
DAY 3
The Things I Never Said
 ↓
Our Story
 ↓
6th Class
 ↓
2 Year Gap
 ↓
8th Class
 ↓
Conversations
 ↓
Relocation
 ↓
Accident
 ↓
Finding Our Way Back
 ↓
Still Connected
 ↓
10 Letters
 ↓
Bonus Envelope
 ↓
Day 3 Complete
 ↓
DAY 4
The Museum of You
 ↓
Museum Rooms
 ↓
Hidden Object Scene
 ↓
6 Objects
 ↓
The Little Things
 ↓
Day 4 Complete
 ↓
DAY 5
The Final Chapter
 ↓
Friend Videos
 ↓
Final Letter
 ↓
Things I Hope Never Change
 ↓
Future Memory Capsule
 ↓
Candle Wish
 ↓
Final Digital Surprise
 ↓
Final Birthday Message
```

---

# 32. FINAL IMPLEMENTATION INSTRUCTION

Build this as a **real production-quality application**, not a static mockup.

The implementation must have:

- Real frontend
- Real backend
- Real database persistence
- Real admin panel
- Real authentication
- Real media upload
- Real progress tracking
- Real server-side day locking
- Real content management
- Responsive UI
- Error handling
- Security validation
- Performance optimization

The five-day content above is the **default seed content**.

All personal content must remain editable through admin.

Do not remove the emotional progression.

Do not flatten the experience into a normal dashboard.

Do not replace the personal story with generic copy.

Do not expose future-day content.

Do not add Day 3 audio recording.

Do not create the actual final Netflix-style video.

The result should feel like a **private digital birthday storybook that gradually reveals itself over five days.**

---

# 33. DEFINITION OF DONE

The project is considered complete only when:

- [ ] QR opens `/birthday`
- [ ] Guest can start journey
- [ ] Day 1 works
- [ ] Day 2 works
- [ ] Old chat archive works
- [ ] Day 3 story works
- [ ] All 10 Day 3 letters work
- [ ] Day 3 bonus envelope works
- [ ] Day 3 has NO audio recording
- [ ] Day 4 museum works
- [ ] Hidden-object scene contains exactly six required objects
- [ ] Secret room unlocks after all six objects
- [ ] Day 5 works
- [ ] Friend videos work
- [ ] Final letter works
- [ ] Candle interaction works
- [ ] Final digital surprise works
- [ ] Admin can lock/unlock days
- [ ] Admin can edit content
- [ ] Admin can upload media
- [ ] Progress persists
- [ ] Locked content is not returned by API
- [ ] Direct locked URLs are protected
- [ ] Admin authentication works
- [ ] Mobile UI works
- [ ] Desktop UI works
- [ ] Reduced-motion mode works
- [ ] Media is optimized
- [ ] Error states work
- [ ] No personal content is hardcoded unnecessarily
- [ ] No invented memories or conversations are introduced

---

# FINAL CREATIVE PRINCIPLE

The website should not feel like:

> "Here is a birthday website."

It should feel like:

> **"Someone spent days remembering the little things about me."**

Every interaction should support that feeling.

The journey should begin with curiosity, move through nostalgia, become personal and emotional, turn playful and observant, and finally reveal the amount of thought that went into the entire experience.

**Five days. Five chapters. One story. ❤️**
