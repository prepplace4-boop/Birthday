import type {
  Day,
  DayContent,
  JourneySettings,
  Media,
  Progress,
  TimelineItem,
  Memory,
  Envelope,
  MuseumRoom,
  MuseumExhibit,
  PlaylistItem,
  Habit,
  Observation,
  FriendMessage,
  FinalLetter,
  FinalSurprise,
  LockedDayPayload,
  EnvelopeOpen,
  MuseumRoomVisit,
  MediaVisibility,
} from '@/types';
import { buildUnlockSchedule, isUnlockDateReached } from '@/lib/unlock';

const NOW_ISO = () => new Date().toISOString();
const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export interface MysteryQuestionOption {
  id: string;
  label: string;
}
export interface MysteryQuestion {
  id: string;
  question: string;
  options: MysteryQuestionOption[];
}

export interface MuseumRoomWithDetails extends MuseumRoom {
  exhibits?: MuseumExhibit[];
  playlist?: PlaylistItem[];
  chaosEntries?: { id: string; title: string; caption: string; imageUrl?: string }[];
  appreciationCards?: { id: string; title: string; description: string; icon?: string }[];
  habits?: Habit[];
  observations?: Observation[];
}

export interface Day1Extra {
  welcomeMessage: string;
  featuredMemories: Memory[];
  mysteryQuestion: MysteryQuestion;
}
export interface Day2Extra {
  secretMemory: Memory;
  letter: string;
}
export interface Day4Extra {
  rooms: MuseumRoomWithDetails[];
}
export interface Day5Extra {
  finalIntroLines: string[];
  birthdayReveal: { title: string; subtitle?: string };
  finalVideo: { title: string; url: string; thumbnailUrl?: string };
  finalSurprise: FinalSurprise;
}

export type EnsureDayResult =
  | ({ locked: true; teaser: string } & Pick<Day, 'dayNumber'>)
  | ({ locked: false } & { day: DayContent });

interface BirthdayState {
  settings: JourneySettings;
  days: Map<number, DayContent>;
  day1Extra: Day1Extra | null;
  day2Extra: Day2Extra | null;
  day4Extra: Day4Extra | null;
  day5Extra: Day5Extra | null;
  progressEntries: Map<string, Progress>;
  envelopeOpens: EnvelopeOpen[];
  museumRoomVisits: MuseumRoomVisit[];
  journeyOpenedSessions: Set<string>;
  journeyLastActivity: string | null;
  finalSurpriseViewed: Set<string>;
  mediaList: Media[];
  accessPasswordHash: string | null;
  accessGrantedSessions: Set<string>;
  dayCompleted: Map<string, Map<number, boolean>>;
}

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function buildSettings(): JourneySettings {
  const today = new Date();
  return {
    herName: 'Kesar',
    yourName: 'Hardik',
    birthdayDate: addDays(today, 5),
    theme: 'warm',
    background: 'gradient-rose',
    musicUrl: '',
    musicVolume: 0.5,
    musicDay: 5,
    accessPasswordEnabled: false,
    journeyStatus: 'live',
    introText:
      'Hey Kesar 👀 — Someone has prepared something for you. Not just a birthday wish. A 5-day little journey.',
    finalMessage:
      'Happy Birthday, Kesar! Thank you for going through this little journey with me. Every moment with you is worth celebrating. ❤️',
  };
}

function buildTimeline(dayId: string): TimelineItem[] {
  return [
    {
      id: uuid(), day_id: dayId, display_order: 0, date: '6th Class', title: '🌱 The First Time We Met',
      description: "We were in the same class in 6th class, but at that time, I don't think either of us knew that we'd eventually become such an important part of each other's story.\n\nI still remember one lunch break when, for some reason, you got angry with me. I don't even think that moment felt important at the time. I just remember saying sorry...\n\nAnd somehow, that small moment became the beginning of us slowly getting to know each other and eventually becoming friends.\n\nIt's funny how some of the most important chapters of our lives can begin with something so completely ordinary. And that's where our story started. ❤️"
    },
    {
      id: uuid(), day_id: dayId, display_order: 1, date: 'March 2019', title: '💬 Our First Proper Conversation',
      description: "March 2019. One day, I received a WhatsApp message from a number I didn't recognize.\n\nAt first, it was just an unknown number. But somehow, I recognized you almost immediately. And honestly, that was such a great moment for me. There was something special about realizing that it was you on the other side of that screen.\n\nOne unexpected message... from someone I already knew... and suddenly, we were talking again. I don't think either of us knew where that conversation would eventually lead. But looking back now, I'm really glad that message came."
    },
    {
      id: uuid(), day_id: dayId, display_order: 2, date: 'Over Time', title: '🌙 When Distance Was Our Story',
      description: "If I think about our story, I don't actually feel like our fights were the biggest part of it. I think the bigger thing was the distance between us sometimes.\n\nWe would stop talking. Time would pass. Life would continue. And somehow, we'd end up finding our way back to talking again.\n\nSo maybe our story isn't really about how much we fought. Maybe it's more about how often we became distant... and somehow still found our way back.\n\nSome connections are quiet for a while, but that doesn't always mean they're gone."
    },
    {
      id: uuid(), day_id: dayId, display_order: 3, date: 'Late Nights', title: '🌃 The Late-Night Chats',
      description: "Some conversations don't really have a starting time. And they definitely don't have an ending time. Whenever we both wanted to talk, I don't think I ever really thought about whether it was late or whether I should be sleeping.\n\nWe'd just start talking... and then let the conversation go wherever it wanted to. One topic became another. Random things became important conversations. Important conversations somehow became completely stupid ones. 😂\n\nI think those late-night conversations are special because we weren't trying to create a memory. We were just talking. And somehow, those moments became memories anyway."
    },
    {
      id: uuid(), day_id: dayId, display_order: 4, date: 'Recently', title: '🤝 When You Said You Trusted Me',
      description: "Maybe recently, especially over the last year, you've started feeling that I'm someone you can genuinely trust. And honestly, that means more to me than I can properly explain.\n\nBecause I also know that before reaching this point, there were things from my side that weren't always right. Things I may have done or said that could have hurt you. And for all of those moments, I genuinely want to say: I'm sorry.\n\nIf I ever hurt you, disappointed you, or made you feel that I wasn't the person you thought I was, I truly regret that. I don't want to make excuses. I just want you to know that I've thought about them, and I value the trust you have given me now.\n\nBeing trusted by someone is not something I want to take for granted. And if you've reached a point where you feel you can trust me again, I consider that something very precious. ❤️"
    },
  ];
}

function buildFeaturedMemories(dayId: string): Memory[] {
  return [
    { id: uuid(), day_id: dayId, display_order: 0, date: '2024-03-12', title: 'That Sunset By The Lake', description: "We sat there for hours, not saying much of anything, just watching the sky turn pink and orange. That moment of quiet with you — it's one of my happiest memories.", isSecret: false },
  ];
}

function buildMysteryQuestion(): MysteryQuestion {
  return {
    id: uuid(),
    question: "What do you think I've planned for these next few days?",
    options: [
      { id: uuid(), label: 'A bunch of embarrassing old photos 😂' },
      { id: uuid(), label: 'Letters I wrote but never sent 💌' },
      { id: uuid(), label: 'Something weirdly creative but wholesome ✨' },
      { id: uuid(), label: 'All of the above, probably 🫠' },
    ],
  };
}

function buildMemories(dayId: string): Memory[] {
  return [
    {
      id: uuid(),
      day_id: dayId,
      display_order: 0,
      date: '2023',
      title: 'The day everything became chaotic 😂',
      description:
        "That first time we met and went to see your college back in 2023. Your ziddi pana, your unquestionable love for French fries, and those unnecessarily long conversations over chai ☕. Somehow, even the most random day with you turned into a memory I never wanted to forget.",
      isSecret: false,
    },
    {
      id: uuid(),
      day_id: dayId,
      display_order: 1,
      date: '2023',
      title: 'The conversations that made absolutely no sense ☕',
      description:
        "Those little immature debates where neither of us wanted to accept that we were wrong. And then came that legendary conversation — why we even wanted a boyfriend or girlfriend — where you literally searched Google for the disadvantages of having a boyfriend. 😂 Honestly, the research was unnecessary... but very, very you.",
      isSecret: false,
    },
    {
      id: uuid(),
      day_id: dayId,
      display_order: 2,
      date: '2023',
      title: 'My sleepy little panda 🐼🔥',
      description:
        'And then there was you — a permanently sleepy panda, sometimes a polar bear, whose favourite sentence was "neend aa rahi hai." 😭 No matter what we were talking about or how interesting the conversation was, eventually sleep would win. And somehow, even your sleepy "neend aa rahi hai" became one of the cutest things I\'d wait to hear. ❤️',
      isSecret: false,
    },
  ];
}

function buildSecretMemory(dayId: string): Memory {
  return { id: uuid(), day_id: dayId, display_order: 99, date: '2024-09-03', title: '🔐 The memory I almost didn\'t tell you', description: "That evening we were sitting on your balcony, and you were telling me about your dreams — the ones you don't tell anyone else. And in that moment, I realized something. I wasn't just falling for your laugh or your smile or your kindness. I was falling for all of you. The ambitious you, the scared you, the goofy you, the quiet you. Every single version. And I've never felt more certain about anything in my life than this: I want to be there for all of it.", isSecret: true };
}

function buildEnvelopes(dayId: string): Envelope[] {
  return [
    { id: uuid(), day_id: dayId, display_order: 0, title: '💌 Something I\'ve always appreciated about you', icon: '💌', message: "Kesar, I've always appreciated how you make everyone feel seen. You don't just listen — you remember. You remember that my mom loves gulab jamun. You remember that I hate coriander. You remember the tiny details that no one else bothers to keep track of. The world needs more people like you.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 1, title: '🌸 A memory I never told you about', icon: '🌸', message: "Do you remember our second meet-up? You were wearing a yellow dress and flowers in your hair. I didn't say anything then, but I remember thinking 'wow, she looks like sunshine.' I still think that every time I see you.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 2, title: '✨ The little thing I notice about you', icon: '✨', message: "You bite the corner of your lip when you're concentrating. You scrunch your nose when you laugh really hard. You hum quietly when you're making chai. I notice all of it. And I adore every single tiny thing.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 3, title: '💭 Something I think when you walk in the room', icon: '💭', message: "'Oh. There she is.' That's my first thought, every single time. Not something poetic or clever. Just... relief. Like finding my way home after a long day. You feel like that to me.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 4, title: '🌙 What I wish for you every night', icon: '🌙', message: "I wish for your dreams to be kind to you. I wish you wake up every morning feeling a little more loved than the day before. I wish that the universe gives you everything your heart has been quietly asking for.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 5, title: '💪 The time you inspired me the most', icon: '💪', message: "When you were going through that really tough month last year... and somehow still asked me how MY day was. Still showed up with that soft smile of yours. I don't know how you do it. But you made me realize that strength isn't about not falling — it's about getting up and still choosing to be kind.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 6, title: '🌺 How you changed the way I see things', icon: '🌺', message: "Before I met you, I was so focused on where I was going. You made me fall in love with where I am. Because 'where I am' usually means I'm somewhere with you. Ordinary streets feel like adventures when I'm walking them with you.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 7, title: '🍫 My favorite version of you', icon: '🍫', message: "The 2am version of you — when the filters are off, your hair is a mess, your eyes are sleepy, and you're just saying whatever's on your mind. That's the version I wish I could bottle up and keep forever. But I'll take every version of you, honestly.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 8, title: '💝 An apology', icon: '💝', message: "I'm sorry for the times I haven't been present. For the times I got busy and forgot to reply. For not saying all of this sooner. You deserve someone who shows up 100% — and I want to be that someone. Every single day.", isSpecialLocked: false },
    { id: uuid(), day_id: dayId, display_order: 9, title: '🔒 One more thing... (Locked for now)', icon: '🔒', message: "Nice try 😂 Come back tomorrow for the final chapter.", isSpecialLocked: true },
  ];
}

function buildRooms(dayId: string): MuseumRoomWithDetails[] {
  const r1 = uuid(), r2 = uuid(), r3 = uuid(), r4 = uuid(), r5 = uuid(), r6 = uuid(), r7 = uuid();
  return [
    { id: r1, day_id: dayId, number: 1, title: 'Room 01 — Things That Make You You', subtitle: 'An exhibition of your favorite things & signature traits', isLocked: false, sortOrder: 0,
      exhibits: [
        { id: uuid(), room_id: r1, display_order: 0, title: 'Your Signature Smile', description: "The one that starts slow and then takes over your entire face. I'd recognize it in a crowd of thousands." },
        { id: uuid(), room_id: r1, display_order: 1, title: 'Chai Over Anything', description: "You don't just like chai — you respect it. Your elaborate chai-making ritual is my favorite morning show." },
        { id: uuid(), room_id: r1, display_order: 2, title: 'The Way You Walk', description: "Confident but never arrogant. Like every step is intentional. I could recognize that silhouette from a mile away." },
        { id: uuid(), room_id: r1, display_order: 3, title: 'Love for Old Bollywood Songs', description: "You know every lyric to songs from before you were born. And you sing them with your entire chest. It's adorable." },
        { id: uuid(), room_id: r1, display_order: 4, title: 'Your "Thinking" Face', description: "Eyebrows slightly furrowed, lip a tiny bit tucked in. It's unreasonably cute." },
        { id: uuid(), room_id: r1, display_order: 5, title: 'How You Talk About Your Family', description: "Your entire face lights up. They don't know how lucky they are to have you loving them like that." },
        { id: uuid(), room_id: r1, display_order: 6, title: 'Your Terrible Jokes', description: "They're objectively bad. I laugh every single time. Don't tell anyone." },
        { id: uuid(), room_id: r1, display_order: 7, title: 'The Way You Text', description: "Perfect grammar even when excited. No shortcuts. Zero typos. It's very you." },
      ],
    },
    { id: r2, day_id: dayId, number: 2, title: 'Room 02 — Your Soundtrack', subtitle: '7 songs that remind me of you (with reasons)', isLocked: false, sortOrder: 1,
      playlist: [
        { id: uuid(), room_id: r2, display_order: 0, title: 'Tum Hi Ho', artist: 'Arijit Singh', reason: "Because you walked into my life and suddenly every love song started making sense.", url: "https://open.spotify.com/track/1" },
        { id: uuid(), room_id: r2, display_order: 1, title: 'Main Tenu Samjhawan', artist: 'Arijit Singh & Shreya Ghoshal', reason: "For the nights I just wanted to say 'I'm here for you' but didn't know how.", url: "https://open.spotify.com/track/2" },
        { id: uuid(), room_id: r2, display_order: 2, title: 'Phir Bhi Tumko Chaahunga', artist: 'Arijit Singh', reason: "Even on your worst days, especially on your worst days, I'd choose you.", url: "https://open.spotify.com/track/3" },
        { id: uuid(), room_id: r2, display_order: 3, title: 'Kesariya', artist: 'Arijit Singh', reason: "This was playing in the auto that day we drove past the beach. You looked out the window, hair in the wind. The song was made for you.", url: "https://open.spotify.com/track/4" },
        { id: uuid(), room_id: r2, display_order: 4, title: 'Satranga', artist: 'Arijit Singh', reason: "You're not just one color. You're every color — happy, angry, sleepy, dramatic, quiet, loud. All of them. And every shade is my favorite.", url: "https://open.spotify.com/track/5" },
        { id: uuid(), room_id: r2, display_order: 5, title: 'Tere Hawaale', artist: 'Arijit Singh, Shilpa Rao', reason: "I don't know how else to say this... I'm completely, entirely, helplessly yours.", url: "https://open.spotify.com/track/6" },
        { id: uuid(), room_id: r2, display_order: 6, title: 'Perfect', artist: 'Ed Sheeran', reason: "I know, I know, it's cliché. But I don't care. Dancing with you in the kitchen to this song (badly, off-beat, laughing too much) is on my bucket list.", url: "https://open.spotify.com/track/7" },
      ],
    },
    { id: r3, day_id: dayId, number: 3, title: 'ROOM 3 — The Unofficial Hall of Fame 🏆', subtitle: 'Moments that deserve their own award', isLocked: false, sortOrder: 2,
      chaosEntries: [
        { id: uuid(), title: '🏆 Most likely to say "I\'m right" while being completely wrong', caption: '' },
        { id: uuid(), title: '🏆 Best French Fries Appreciation Award 🍟', caption: '' },
        { id: uuid(), title: '🏆 Most unexpected Google search during a conversation 😂', caption: '' },
      ],
    },
    { id: r4, day_id: dayId, number: 4, title: 'Room 04 — Things I Like About You', subtitle: 'An elegant collection of my favorite things', isLocked: false, sortOrder: 3,
      appreciationCards: [
        { id: uuid(), title: 'Your Laugh', description: 'The kind that starts in your stomach and comes out as this loud, unapologetic, infectious sound. It makes my heart do backflips.', icon: '😂' },
        { id: uuid(), title: 'How You Care', description: 'You care so deeply about everyone — your parents, your friends, even the stray dog near your house. Your capacity for love is limitless.', icon: '💗' },
        { id: uuid(), title: 'Your Ambition', description: 'You dream big. And you work harder than anyone I know to make those dreams real. Watching you chase your goals is the most inspiring thing.', icon: '🌟' },
        { id: uuid(), title: 'Your Humor', description: "You have the most specific, dry, absurd sense of humor. I genuinely think you're the funniest person I've ever met.", icon: '🎭' },
        { id: uuid(), title: 'Your Determination', description: 'Once you set your mind to something, nothing can stop you. Not self-doubt, not tiredness, not literally anything. It\'s so hot.', icon: '🔥' },
        { id: uuid(), title: 'Your Patience', description: 'With me, with others, with yourself (sometimes). You give people so many second chances. The world would be better if everyone was like you.', icon: '🕊️' },
        { id: uuid(), title: 'Your Warmth', description: "You make people feel safe just by existing. Strangers tell you their life stories. Animals walk up to you. You're just a walking hug.", icon: '☀️' },
        { id: uuid(), title: 'Your Intelligence', description: 'The way your mind works. Your perspective on things. Your emotional intelligence. All of it. Everything about the way you think is beautiful.', icon: '🧠' },
      ],
    },
    { id: r5, day_id: dayId, number: 5, title: 'ROOM 5 — Your Little Habits 🌸', subtitle: 'Things you definitely do but deny until proven', isLocked: false, sortOrder: 4,
      habits: [
        { id: uuid(), room_id: r5, display_order: 0, statement: 'HABIT 1 — The daily mandir routine 🛕\n\nYou can have the busiest day, the most random plans, and probably 500 things going on… but somehow mandir is still on the schedule. 😭\n\nThat little daily routine of yours is honestly one of those things that quietly says a lot about you.', revealedAnswer: 'VERY TRUE 🛕❤️' },
        { id: uuid(), room_id: r5, display_order: 1, statement: 'HABIT 2 — "Neend aa rahi hai" — the universal excuse 🐼\n\nNo matter how interesting the conversation is, there eventually comes a moment when you suddenly say:\n\n"Neend aa rahi hai."\n\nAnd that\'s it. Meeting adjourned. Conversation over. Panda mode activated. 😂', revealedAnswer: 'CAUGHT YOU 🐼' },
      ],
    },
    { id: r6, day_id: dayId, number: 6, title: 'Room 06 — Things You Don\'t Notice', subtitle: 'Observations from someone who has been paying attention', isLocked: false, sortOrder: 5,
      observations: [
        { id: uuid(), room_id: r6, display_order: 0, statement: 'People feel comfortable with you within 2 minutes of meeting you. Complete strangers open up to you. It\'s a superpower.' },
        { id: uuid(), room_id: r6, display_order: 1, statement: 'You make people smile without even trying. The barista, the auto-wala, your colleagues. You just lighten every room you enter.' },
        { id: uuid(), room_id: r6, display_order: 2, statement: 'Your hands shake a tiny bit when you\'re nervous. I think about holding them every time I notice.' },
        { id: uuid(), room_id: r6, display_order: 3, statement: 'You\'re way more beautiful than you think you are. On your worst hair day, without any makeup, first thing in the morning. You don\'t believe me, but I\'m telling the truth.' },
        { id: uuid(), room_id: r6, display_order: 4, statement: 'The way you say "sorry" for literally everything — even when it\'s not your fault. Please be kinder to yourself. You deserve it.' },
        { id: uuid(), room_id: r6, display_order: 5, statement: 'How you pretend to be annoyed but you\'re actually blushing when someone compliments you. It\'s the cutest thing ever.' },
      ],
    },
    { id: r7, day_id: dayId, number: 7, title: 'Room 07 — Unknown Exhibit', subtitle: 'This room will open tomorrow.', isLocked: true, teaser: 'Not yet. Tomorrow.', sortOrder: 6 },
  ];
}

function buildFriendMessages(): FriendMessage[] {
  return [
    { id: uuid(), display_order: 0, name: 'Priya', message: "Happiest birthday my Kesss! I still remember the first day we became friends in 8th grade — you lent me your pen and I never gave it back, and somehow that turned into you being stuck with me forever. You're the kindest, most drama-free, genuinely good person I know. Thank you for every sleepover, every samosa run, every late night panic before exams, and every 'YES PIIYUU' you've yelled back at me. I love you more than chaat loves dahi. Have the best year bubs 💗✨" },
    { id: uuid(), display_order: 1, name: 'Rohan', message: "Happy birthday Kesar! From our first day in college when you were the only person who'd actually share their tiffin, to every house party where you'd inevitably fall asleep on the couch at 11pm, you've been the best friend a guy could ask for. Thanks for all the career advice, the tough love when I needed it, and for somehow always knowing exactly what to say. Here's to many more years of your terrible puns and even worse dance moves. Party hard 🎂" },
    { id: uuid(), display_order: 2, name: 'Ananya', message: "KESAR MY DARLING! HAPPY BIRTHDAY TO THE MOST BEAUTIFUL SOUL EVER 💐 You are literally sunshine in human form. I still can't believe we became best friends because you slid into my DMs asking for that skincare product recommendation 😂 You've been my sister ever since. Thank you for every girls trip, every 'aaj kuch toofani karte hain' moment, and every time you've dropped everything to be there for me. You're going to do so many incredible things this year, I just know it. I love you endlessly 💗" },
  ];
}

function buildFinalLetter(): FinalLetter {
  return {
    title: 'One last thing...',
    content: "Dear Kesar,\n\nBy the time you read this, we will have made it through all 5 days together. I want you to take a moment and really let it sink in — you are loved. Deeply, truly, unconditionally loved. By me, by your friends, by everyone who has ever had the privilege of knowing you.\n\nI'm not good with words when I have to say them out loud. I stutter, I get nervous, I say the wrong thing. But writing them down? I can finally tell you exactly what you deserve to hear.\n\nYou are not 'too much.' You are not 'a handful.' You are perfectly, beautifully, unapologetically YOU. And that version of you? It's my favorite person in the entire world. Your flaws are not flaws. They're the things that make you real. Your overthinking, your stubbornness, the way you cry at dog videos — all of it. I'd take the package deal every single time.\n\nOn your birthday, I don't wish you expensive gifts or grand surprises. I wish you the kind of happiness that wraps itself around you like a blanket on a cold night. I wish you mornings that feel soft, afternoons that feel full, and nights that feel peaceful. I wish you small wins that make you grin to yourself. I wish you laughter that makes your stomach hurt. I wish you love — the kind that doesn't ask for anything in return, the kind that stays even when things get hard.\n\nAnd if there's one thing I want you to carry with you from all of this, it's this: the world is a better place because you are in it. Not because of anything you do or achieve. Just because you exist. Just because you are you.\n\nHappy Birthday, my Kesar.\n\nWith everything I have,\nHardik 💗",
    signature: 'Hardik',
  };
}

function buildDays(): Map<number, DayContent> {
  const map = new Map<number, DayContent>();
  const now = NOW_ISO();
  const base = (n: number, overrides: Partial<DayContent>): DayContent => ({
    id: uuid(), dayNumber: n, title: '', subtitle: '', description: '', teaser: '',
    isUnlocked: false, unlockTime: null, createdAt: now, updatedAt: now, ...overrides,
  });

  const d1Id = uuid();
  map.set(1, {
    ...base(1, {
      id: d1Id, title: '🌸 THE BEGINNING', subtitle: 'Every story has a beginning.',
      isUnlocked: true, unlockTime: now,
      welcomeMessage: "Welcome to Day 1, Kesar. I've been planning this for a while now. Every story has a beginning, and ours started the day we first met — though I'm pretty sure you were completely oblivious to how nervous I was. Anyway, I wanted this first day to feel warm, like a sunrise. Like the start of something nice. So take your time, scroll through, and let's begin our little 5-day adventure. 💗",
      timelineItems: buildTimeline(d1Id),
      memories: buildFeaturedMemories(d1Id),
    }),
  });

  const d2Id = uuid();
  map.set(2, {
    ...base(2, {
      id: d2Id, title: '📸 THE MEMORY VAULT', subtitle: 'Some moments deserve to be kept.',
      teaser: 'Tomorrow, we open the memory vault.',
      memories: buildMemories(d2Id),
    }),
  });

  const d3Id = uuid();
  map.set(3, {
    ...base(3, {
      id: d3Id, title: '💌 THE THINGS I NEVER SAID', subtitle: '',
      teaser: "There are a few things I've never actually said.",
      envelopes: buildEnvelopes(d3Id),
      friendMessages: [],
    }),
  });

  const d4Id = uuid();
  map.set(4, {
    ...base(4, {
      id: d4Id, title: '✨ THE MUSEUM OF YOU', subtitle: '',
      teaser: 'Tomorrow is all about you.',
      museumRooms: buildRooms(d4Id).map(({ exhibits, playlist, chaosEntries, appreciationCards, habits, observations, ...r }) => r),
    }),
  });

  const d5Id = uuid();
  map.set(5, {
    ...base(5, {
      id: d5Id, title: '🎂 THE FINAL CHAPTER', subtitle: '',
      teaser: 'The final chapter.',
      friendMessages: buildFriendMessages(),
      finalLetter: buildFinalLetter(),
      finalSurprises: [],
    }),
  });

  return map;
}

const state: BirthdayState = {
  settings: buildSettings(),
  days: buildDays(),
  day1Extra: null,
  day2Extra: null,
  day4Extra: null,
  day5Extra: null,
  progressEntries: new Map(),
  envelopeOpens: [],
  museumRoomVisits: [],
  journeyOpenedSessions: new Set(),
  journeyLastActivity: null,
  finalSurpriseViewed: new Set(),
  mediaList: [],
  accessPasswordHash: null,
  accessGrantedSessions: new Set(),
  dayCompleted: new Map(),
};

const d1 = state.days.get(1)!;
state.day1Extra = {
  welcomeMessage: d1.welcomeMessage ?? '',
  featuredMemories: d1.memories ?? [],
  mysteryQuestion: buildMysteryQuestion(),
};

const d2 = state.days.get(2)!;
const d2Mem = d2.memories ?? [];
state.day2Extra = {
  secretMemory: d2Mem.find((m) => m.isSecret) ?? buildSecretMemory(d2.id),
  letter: "One thing I wanted you to know, and I mean really know, deep down, is that you are enough. Exactly as you are. Not when you lose those 5 kgs, not when you get that promotion, not when you have it all figured out. Right now. Today. In this messy, chaotic, perfectly-imperfect version of yourself. You are so incredibly enough. And anyone who makes you feel otherwise — they don't deserve a single second of your time. I see you. I see how hard you try. I see how much you care. I see the girl who stays up worrying about whether she was too much or not enough. Let me tell you something: to me, you are exactly enough. Actually, you're more than enough. You're everything. 💗",
};

state.day4Extra = { rooms: buildRooms(state.days.get(4)!.id) };

state.day5Extra = {
  finalIntroLines: ['Before you continue...', 'Thank you.', 'For all the random conversations.', 'For all the memories.', 'For all the chaos.', 'And simply for being you.'],
  birthdayReveal: { title: 'HAPPY BIRTHDAY, KESAR ❤️', subtitle: 'I hope today is the start of everything beautiful you deserve.' },
  finalVideo: { title: 'A LITTLE FILM FOR YOU', url: '/day-5/IMG_5894%20(1).MP4', thumbnailUrl: '/day-2/Scrapbook%20Photo%20Dump%20Collage%20Your%20Story.jpg' },
  finalSurprise: { type: 'externalLink', title: 'Your final surprise', content: 'Click below to open the last little gift I prepared for you.', url: 'https://example.com' },
};

function progressKey(sessionId: string, dayNumber: number) {
  return `${sessionId}__${dayNumber}`;
}

function touchActivity() {
  state.journeyLastActivity = NOW_ISO();
}

function ensureCompletedMap(sessionId: string): Map<number, boolean> {
  let m = state.dayCompleted.get(sessionId);
  if (!m) { m = new Map(); state.dayCompleted.set(sessionId, m); }
  return m;
}

export function getSettings(): JourneySettings {
  return { ...state.settings };
}

export function setSettings(patch: Partial<JourneySettings>): JourneySettings {
  state.settings = { ...state.settings, ...patch };
  touchActivity();
  return { ...state.settings };
}

export const patchSettings = setSettings;

function computeUnlockDateForDay(dayNumber: 1 | 2 | 3 | 4 | 5): string {
  const schedule = buildUnlockSchedule(null);
  const match = schedule.find((s) => s.dayNumber === dayNumber);
  return match?.unlockDate ?? buildUnlockSchedule(null)[dayNumber - 1]?.unlockDate ?? new Date().toISOString().split('T')[0];
}

function isDayUnlockedAt(dayNumber: number, at: Date): boolean {
  if (dayNumber < 1 || dayNumber > 5) return false;
  const unlockDate = computeUnlockDateForDay(dayNumber as 1 | 2 | 3 | 4 | 5);
  return isUnlockDateReached(unlockDate, at);
}

export function getDayStatus(dayNumber: number, at: Date = new Date()): Day | undefined {
  const d = state.days.get(dayNumber);
  if (!d) return undefined;
  const unlocked = isDayUnlockedAt(dayNumber, at);
  const unlockDate = computeUnlockDateForDay(dayNumber as 1 | 2 | 3 | 4 | 5);
  return {
    id: d.id, dayNumber: d.dayNumber, title: d.title, subtitle: d.subtitle,
    description: d.description, teaser: d.teaser,
    isUnlocked: unlocked,
    unlockTime: unlocked ? `${unlockDate}T00:00:00` : null,
    createdAt: d.createdAt, updatedAt: d.updatedAt,
  };
}

export function getAllDays(at: Date = new Date()): Day[] {
  return Array.from(state.days.values())
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((d) => {
      const unlocked = isDayUnlockedAt(d.dayNumber, at);
      const unlockDate = computeUnlockDateForDay(d.dayNumber as 1 | 2 | 3 | 4 | 5);
      return {
        id: d.id, dayNumber: d.dayNumber, title: d.title, subtitle: d.subtitle,
        description: d.description, teaser: d.teaser,
        isUnlocked: unlocked,
        unlockTime: unlocked ? `${unlockDate}T00:00:00` : null,
        createdAt: d.createdAt, updatedAt: d.updatedAt,
      };
    });
}

export function setDayUnlocked(dayNumber: number, unlocked: boolean): Day | undefined {
  const day = state.days.get(dayNumber);
  if (!day) return undefined;
  const updated: DayContent = {
    ...day, isUnlocked: unlocked,
    unlockTime: unlocked ? NOW_ISO() : day.unlockTime,
    updatedAt: NOW_ISO(),
  };
  state.days.set(dayNumber, updated);
  return {
    id: updated.id, dayNumber: updated.dayNumber, title: updated.title,
    subtitle: updated.subtitle, description: updated.description, teaser: updated.teaser,
    isUnlocked: updated.isUnlocked, unlockTime: updated.unlockTime,
    createdAt: updated.createdAt, updatedAt: updated.updatedAt,
  };
}

export function patchDay(dayNumber: number, patch: Partial<DayContent>): DayContent | undefined {
  const existing = state.days.get(dayNumber);
  if (!existing) return undefined;
  const updated: DayContent = { ...existing, ...patch, updatedAt: NOW_ISO() };
  state.days.set(dayNumber, updated);
  return updated;
}

export function ensureDayUnlocked(dayNumber: number, at: Date = new Date()): EnsureDayResult {
  const day = state.days.get(dayNumber);
  if (!day) {
    return {
      locked: true, teaser: 'This day does not exist.',
      dayNumber: Math.min(Math.max(dayNumber, 1), 5),
    };
  }
  const unlocked = isDayUnlockedAt(dayNumber, at);
  if (!unlocked) {
    return { locked: true, teaser: day.teaser, dayNumber: day.dayNumber };
  }
  return { locked: false, day: { ...day, isUnlocked: true } };
}

export { computeUnlockDateForDay, isDayUnlockedAt };

export function toLockedPayload(dayNumber: number, teaser: string): LockedDayPayload {
  return { day: dayNumber, locked: true, teaser };
}

export interface Day1Full {
  welcomeMessage: string;
  timelineItems: TimelineItem[];
  featuredMemories: Memory[];
  mysteryQuestion: MysteryQuestion;
}
export interface Day2Full {
  memories: Memory[];
  secretMemory: Memory;
  letter: string;
}
export interface Day3Full {
  envelopes: Envelope[];
}
export interface Day4Full {
  rooms: MuseumRoomWithDetails[];
}
export interface Day5Full {
  finalIntroLines: string[];
  birthdayReveal: { title: string; subtitle?: string };
  finalVideo: { title: string; url: string; thumbnailUrl?: string };
  friendMessages: FriendMessage[];
  finalLetter: FinalLetter;
  finalSurprise: FinalSurprise;
}

export function getDayContent(dayNumber: 1): Day1Full | undefined;
export function getDayContent(dayNumber: 2): Day2Full | undefined;
export function getDayContent(dayNumber: 3): Day3Full | undefined;
export function getDayContent(dayNumber: 4): Day4Full | undefined;
export function getDayContent(dayNumber: 5): Day5Full | undefined;
export function getDayContent(dayNumber: number): Day1Full | Day2Full | Day3Full | Day4Full | Day5Full | undefined;
export function getDayContent(dayNumber: number): unknown {
  const d = state.days.get(dayNumber);
  if (!d) return undefined;
  if (dayNumber === 1) {
    return {
      welcomeMessage: d.welcomeMessage ?? state.day1Extra?.welcomeMessage ?? '',
      timelineItems: d.timelineItems ?? [],
      featuredMemories: state.day1Extra?.featuredMemories ?? [],
      mysteryQuestion: state.day1Extra?.mysteryQuestion ?? { id: uuid(), question: '', options: [] },
    };
  }
  if (dayNumber === 2) {
    return {
      memories: d.memories ?? [],
      secretMemory: state.day2Extra?.secretMemory ?? { id: uuid(), day_id: d.id, display_order: 99, date: '', title: '', description: '', isSecret: true },
      letter: state.day2Extra?.letter ?? '',
    };
  }
  if (dayNumber === 3) {
    return { envelopes: d.envelopes ?? [] };
  }
  if (dayNumber === 4) {
    return { rooms: state.day4Extra?.rooms ?? [] };
  }
  if (dayNumber === 5) {
    return {
      finalIntroLines: state.day5Extra?.finalIntroLines ?? [],
      birthdayReveal: state.day5Extra?.birthdayReveal ?? { title: '' },
      finalVideo: state.day5Extra?.finalVideo ?? { title: '', url: '' },
      friendMessages: d.friendMessages ?? [],
      finalLetter: d.finalLetter ?? { title: '', content: '', signature: '' },
      finalSurprise: state.day5Extra?.finalSurprise ?? { type: 'externalLink', title: '', content: '' },
    };
  }
  return undefined;
}

export function setDayContent<D extends 1 | 2 | 3 | 4 | 5>(dayNumber: D, patch: unknown): void {
  if (dayNumber === 1) state.day1Extra = { ...state.day1Extra!, ...(patch as Partial<Day1Extra>) };
  if (dayNumber === 2) state.day2Extra = { ...state.day2Extra!, ...(patch as Partial<Day2Extra>) };
  if (dayNumber === 4) state.day4Extra = { ...state.day4Extra!, ...(patch as Partial<Day4Extra>) };
  if (dayNumber === 5) state.day5Extra = { ...state.day5Extra!, ...(patch as Partial<Day5Extra>) };
  touchActivity();
}

export function upsertEnvelopes(day: 3, list: Envelope[]): void {
  const d = state.days.get(3);
  if (!d) return;
  const byId = new Map<string, Envelope>((d.envelopes ?? []).map((e) => [e.id, e]));
  for (const item of list) byId.set(item.id, item);
  d.envelopes = Array.from(byId.values()).sort((a, b) => a.display_order - b.display_order);
  d.updatedAt = NOW_ISO();
  touchActivity();
}

export function upsertMemories(day: 2, list: Memory[], secretMemory?: Memory): void {
  const d = state.days.get(day);
  if (!d) return;
  const byId = new Map<string, Memory>((d.memories ?? []).map((m) => [m.id, m]));
  for (const item of list) byId.set(item.id, item);
  d.memories = Array.from(byId.values()).sort((a, b) => a.display_order - b.display_order);
  if (secretMemory && state.day2Extra) state.day2Extra.secretMemory = secretMemory;
  d.updatedAt = NOW_ISO();
  touchActivity();
}

export function updateDay5FinalSurprise(surprise: FinalSurprise): void {
  if (state.day5Extra) state.day5Extra.finalSurprise = surprise;
  const d = state.days.get(5);
  if (d) d.finalSurprises = [surprise];
  touchActivity();
}

export function addMedia(m: Media): Media {
  state.mediaList.push(m);
  touchActivity();
  return m;
}

export function getMediaList(filters?: {
  dayNumber?: number;
  section?: string;
  visibility?: MediaVisibility;
}): Media[] {
  const list = [...state.mediaList];
  if (!filters) return list;

  return list.filter((media) => {
    if (filters.dayNumber !== undefined && media.dayNumber !== filters.dayNumber) return false;
    if (filters.section !== undefined && media.section !== filters.section) return false;
    if (filters.visibility !== undefined && media.visibility !== filters.visibility) return false;
    return true;
  });
}

export function deleteMedia(mediaId: string): boolean {
  const idx = state.mediaList.findIndex((m) => m.id === mediaId);
  if (idx >= 0) { state.mediaList.splice(idx, 1); touchActivity(); return true; }
  return false;
}

export function getDay5FinalSurprise(): FinalSurprise | undefined {
  const d = state.days.get(5);
  const fromState = state.day5Extra?.finalSurprise;
  if (fromState) return { ...fromState };
  if (!d || !d.finalSurprises || d.finalSurprises.length === 0) return undefined;
  return { ...d.finalSurprises[0] };
}

export function setAccessPasswordHash(hash: string | null): void {
  state.accessPasswordHash = hash;
}
export function getAccessPasswordHash(): string | null {
  return state.accessPasswordHash;
}
export function grantAccess(sessionId: string): void {
  state.accessGrantedSessions.add(sessionId);
}
export function hasAccess(sessionId: string): boolean {
  if (!state.settings.accessPasswordEnabled) return true;
  return state.accessGrantedSessions.has(sessionId);
}

export function markDayOpened(sessionId: string, dayNumber: number): void {
  state.journeyOpenedSessions.add(sessionId);
  const key = progressKey(sessionId, dayNumber);
  const existing = state.progressEntries.get(key);
  if (!existing) {
    state.progressEntries.set(key, {
      id: uuid(), guestSessionId: sessionId, dayNumber,
      openedAt: NOW_ISO(), completedAt: null, completionPercentage: 0,
    });
  } else if (!existing.openedAt) {
    state.progressEntries.set(key, { ...existing, openedAt: NOW_ISO() });
  }
  touchActivity();
}

export function markDayCompleted(sessionId: string, dayNumber: number): void {
  state.journeyOpenedSessions.add(sessionId);
  const key = progressKey(sessionId, dayNumber);
  const existing = state.progressEntries.get(key);
  if (existing) {
    state.progressEntries.set(key, {
      ...existing, completedAt: NOW_ISO(), completionPercentage: 100,
    });
  } else {
    state.progressEntries.set(key, {
      id: uuid(), guestSessionId: sessionId, dayNumber,
      openedAt: NOW_ISO(), completedAt: NOW_ISO(), completionPercentage: 100,
    });
  }
  ensureCompletedMap(sessionId).set(dayNumber, true);
  touchActivity();
}

export function markEnvelopeOpened(sessionId: string, envelopeId: string): void {
  if (!state.envelopeOpens.find((e) => e.envelopeId === envelopeId)) {
    state.envelopeOpens.push({ id: uuid(), guestSessionId: sessionId, envelopeId, openedAt: NOW_ISO() });
  }
  touchActivity();
}

export function markRoomVisited(sessionId: string, museumRoomId: string): void {
  if (!state.museumRoomVisits.find((r) => r.museumRoomId === museumRoomId)) {
    state.museumRoomVisits.push({ id: uuid(), guestSessionId: sessionId, museumRoomId, visitedAt: NOW_ISO() });
  }
  touchActivity();
}

export function markFinalSurpriseViewed(sessionId: string): void {
  state.finalSurpriseViewed.add(sessionId);
  touchActivity();
}

export function hasReturned(sessionId: string): boolean {
  const completed = state.dayCompleted.get(sessionId);
  if (completed && completed.size > 0) return true;
  for (const entry of state.progressEntries.values()) {
    if (entry.guestSessionId === sessionId && (entry.openedAt || entry.completedAt)) return true;
  }
  if (state.envelopeOpens.some((e) => e.guestSessionId === sessionId)) return true;
  if (state.museumRoomVisits.some((r) => r.guestSessionId === sessionId)) return true;
  if (state.finalSurpriseViewed.has(sessionId)) return true;
  return false;
}

export function computeAggregateProgress(sessionId: string): number {
  const completed = ensureCompletedMap(sessionId);
  const perDay = 100 / 5;
  let p = Array.from(completed.keys()).filter((k) => completed.get(k)).length * perDay;

  if (!completed.get(3)) {
    const d3 = state.days.get(3);
    const total = (d3?.envelopes ?? []).filter((e) => !e.isSpecialLocked).length;
    const opened = state.envelopeOpens.filter((e) => e.guestSessionId === sessionId).length;
    if (total > 0) p += (opened / total) * (perDay * 0.5);
  }
  if (!completed.get(4)) {
    const d4 = state.day4Extra?.rooms ?? [];
    const total = d4.filter((r) => !r.isLocked).length;
    const visited = state.museumRoomVisits.filter((r) => r.guestSessionId === sessionId).length;
    if (total > 0) p += (visited / total) * (perDay * 0.5);
  }
  return Math.min(100, Math.round(p));
}

export function getProgressSummary(sessionId: string) {
  const completed = ensureCompletedMap(sessionId);
  const completedDays: number[] = [];
  const openedDays: number[] = [];
  completed.forEach((v, k) => { if (v) completedDays.push(k); });
  for (const entry of state.progressEntries.values()) {
    if (entry.guestSessionId === sessionId && entry.openedAt) openedDays.push(entry.dayNumber);
  }
  return {
    percent: computeAggregateProgress(sessionId),
    completedDays,
    openedDays: Array.from(new Set(openedDays)),
    envelopeOpens: state.envelopeOpens.filter((e) => e.guestSessionId === sessionId).length,
    museumRoomVisits: state.museumRoomVisits.filter((r) => r.guestSessionId === sessionId).length,
    finalSurpriseViewed: state.finalSurpriseViewed.has(sessionId),
  };
}

export function getProgressStats() {
  const perDay: { day: number; openedCount: number; completedCount: number }[] = [];
  for (let d = 1; d <= 5; d++) {
    const entries = Array.from(state.progressEntries.values()).filter((p) => p.dayNumber === d);
    perDay.push({
      day: d,
      openedCount: entries.filter((p) => p.openedAt !== null).length,
      completedCount: entries.filter((p) => p.completedAt !== null).length,
    });
  }
  const d3EnvIds = new Set((state.days.get(3)?.envelopes ?? []).map((e) => e.id));
  const d3Envelopes = state.envelopeOpens.filter((eo) => d3EnvIds.has(eo.envelopeId)).length;
  const roomStats: Record<string, number> = {};
  const d4Rooms = state.days.get(4)?.museumRooms ?? [];
  for (const visit of state.museumRoomVisits) {
    if (d4Rooms.some((r) => r.id === visit.museumRoomId)) {
      roomStats[visit.museumRoomId] = (roomStats[visit.museumRoomId] ?? 0) + 1;
    }
  }
  const day5Opened = Array.from(state.progressEntries.values()).filter(
    (p) => p.dayNumber === 5 && p.openedAt !== null,
  ).length;
  return {
    journeyOpenedCount: state.journeyOpenedSessions.size,
    lastActivity: state.journeyLastActivity,
    perDayStats: perDay,
    day3EnvelopeOpenCount: d3Envelopes,
    day4RoomVisitStats: roomStats,
    day5Opened,
    finalSurpriseViewed: state.finalSurpriseViewed.size,
  };
}

export const birthdayStore = {
  getAllDays,
  getDayStatus,
  setDayUnlocked,
  ensureDayUnlocked,
  toLockedPayload,
  getDayContent,
  getSettings,
  setSettings,
  getProgressSummary,
  computeAggregateProgress,
  markDayOpened,
  markDayCompleted,
  addMedia,
  getMediaList,
};
