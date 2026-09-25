export interface Exhibit {
  id: string;
  title: string;
  description: string;
  optionalImageSrc?: string | null;
  label: string;
}

export interface UnnoticedDetail {
  id: string;
  text: string;
  label: string;
}

export interface Award {
  id: string;
  title: string;
  citation: string;
  trophyVariant: "trophy" | "medal" | "crown" | "ribbon" | "laurel" | "star";
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  reason: string;
}

export interface ResearchStat {
  id: string;
  headline: string;
  value: string;
  confidence?: string;
  visual: "chart" | "stamp" | "badge" | "meter";
}

export interface AppreciationLine {
  id: string;
  text: string;
}

export interface HiddenDetail {
  id: string;
  x: number;
  y: number;
  heading: string;
  message: string;
}

export type DayFiveLetterSectionKind =
  | "heading"
  | "body"
  | "highlight-dil"
  | "highlight-moreSpecial"
  | "highlight-matter"
  | "highlight-thankYou"
  | "closing";

export interface DayFiveLetterSection {
  kind: DayFiveLetterSectionKind;
  text: string;
}

export interface DayFiveLetter {
  intro: string;
  pillLines: readonly [string, string, string, string, string, string];
  sections: readonly DayFiveLetterSection[];
}

export const museumExhibits: readonly Exhibit[] = [
  {
    id: "ex-01",
    title: "The way you laugh at things that aren't even that funny.",
    description:
      "You have this little silent-laugh-turned-loud thing that makes literally anything feel ten times funnier just because you're in the room.",
    optionalImageSrc: "/day-1/Memory%20Card%2001%20%E2%80%94%20The%20Beginning%20(1).jpg",
    label: "Acquired permanently",
  },
  {
    id: "ex-02",
    title: "The exact way you say 'acha'.",
    description:
      "There are approximately seven different tones you use for this one word. I have catalogued all seven.",
    optionalImageSrc: "/day-1/Memory%20Card%2001%20%E2%80%94%20The%20Beginning%20(2).jpg",
    label: "On long-term loan from the Universe",
  },
  {
    id: "ex-03",
    title: "Your playlist taste, which is perfect and I will not debate it.",
    description:
      "You don't just listen to music. You feel it. And when it hits, it's almost like you're not even in the same room anymore.",
    optionalImageSrc: "/day-2/WhatsApp%20Image%202026-09-22%20at%202.04.55%20PM.jpeg",
    label: "Rotating display",
  },
  {
    id: "ex-04",
    title: "Your 'I'm thinking' face.",
    description:
      "Little nose scrunch. Eyebrows doing that tiny little furrow thing. Don't worry — it's very cute.",
    optionalImageSrc: null,
    label: "Live observation, 2024—",
  },
  {
    id: "ex-05",
    title: "The way you over-explain a simple story.",
    description:
      "Every parenthetical. Every tiny detail. Every unnecessary flashback. I would listen to the 27-cut extended director's version any day.",
    optionalImageSrc: "/day-1/Memory%20Card%2001%20%E2%80%94%20The%20Beginning%20(4).jpg",
    label: "Documentary-length exhibit",
  },
  {
    id: "ex-06",
    title: "The softness in your voice when you're actually being sweet.",
    description:
      "You don't do it on purpose. That's the best part.",
    optionalImageSrc: "/day-2/WhatsApp%20Image%202026-09-22%20at%203.19.04%20PM.jpeg",
    label: "Audio installation",
  },
  {
    id: "ex-07",
    title: "How you get obsessed with little random things for 3–5 business days.",
    description:
      "A food. A snack. A TikTok sound. A specific scene of a movie. You commit completely and then vanish without a trace.",
    optionalImageSrc: null,
    label: "Semi-permanent installation",
  },
  {
    id: "ex-08",
    title: "The way you text.",
    description:
      "Punctuation choices. Emoji frequency. The specific way you type 'hainnnn'. This museum could curate an entire wing around it.",
    optionalImageSrc: "/day-1/MEMORY%2001%20-%20The%20Beginning.jpg",
    label: "Digital archives",
  },
  {
    id: "ex-09",
    title: "The way you exist.",
    description:
      "Not a single part in particular. The whole. The sum. Everything all at once. Sorry for being dramatic. I'm right though.",
    optionalImageSrc: "/day-3/Myfav.jpeg",
    label: "Hall of Honour",
  },
];

export const museumUnnoticedDetails: readonly UnnoticedDetail[] = [
  { id: "un-01", label: "Observation #01", text: "The little expressions you make when you're thinking." },
  { id: "un-02", label: "Observation #02", text: "The way your entire mood changes when your favourite song starts." },
  { id: "un-03", label: "Observation #03", text: "The tiny little nod you give yourself when you think you're right. You are usually right." },
  { id: "un-04", label: "Observation #04", text: "How you start a sentence twice because you got excited mid-sentence." },
  { id: "un-05", label: "Observation #05", text: "The way your hands move when you're telling a story." },
  { id: "un-06", label: "Observation #06", text: "How you listen. Not just wait to speak. Actually listen." },
  { id: "un-07", label: "Observation #07", text: "The little exhale-laugh you do when you're trying not to actually laugh." },
  { id: "un-08", label: "Observation #08", text: "The things you do without realising anyone is paying attention." },
];

export const museumAwards: readonly Award[] = [
  {
    id: "aw-01",
    title: "BEST RANDOM REACTION",
    citation:
      "Presented for the specific one-liner you said in the car that one time. I still think about it. Category is single-elimination. You are defending champion forever.",
    trophyVariant: "trophy",
  },
  {
    id: "aw-02",
    title: "MOST ICONIC FACIAL EXPRESSION",
    citation:
      "For the raised-eyebrow + tilted-head combination you pull when something is either extremely funny or extremely suspicious. Jury cannot tell which. It's perfect either way.",
    trophyVariant: "medal",
  },
  {
    id: "aw-03",
    title: "PROFESSIONAL OVERTHINKER",
    citation:
      "For turning a simple two-option decision into a 90-minute philosophy seminar. Commendations for thoroughness. Remainder of jury had to go home and sleep on it.",
    trophyVariant: "ribbon",
  },
];


export const museumResearch: readonly ResearchStat[] = [
  {
    id: "rs-01",
    headline: "Probability of stealing the last bite",
    value: "97.4%",
    confidence: "Confidence interval: ± 2.0%",
    visual: "meter",
  },
  {
    id: "rs-02",
    headline: "Average number of unnecessary thoughts per hour",
    value: "Classified",
    confidence: "Data sealed. You don't need to know. We know. We're fine.",
    visual: "stamp",
  },
  {
    id: "rs-03",
    headline: "Ability to make ordinary moments memorable",
    value: "Extremely high",
    confidence: "95th percentile among all known human subjects.",
    visual: "chart",
  },
  {
    id: "rs-04",
    headline: "Chance of making me smile for no reason",
    value: "100%",
    confidence: "Sample size = every time I think about you. Error bar = zero.",
    visual: "badge",
  },
  {
    id: "rs-05",
    headline: "Level of overthinking required before a single reply",
    value: "Severe",
    confidence: "Symptoms include: deleting 4 drafts, sighing, then sending a meme instead.",
    visual: "chart",
  },
  {
    id: "rs-06",
    headline: "Rarity Index: composite score",
    value: "One of one",
    confidence: "Researchers recommend archival status. Please do not fold, spindle, or mutilate.",
    visual: "stamp",
  },
];

export const museumAppreciation: readonly AppreciationLine[] = [
  { id: "ap-01", text: "I like the way you make ordinary days feel less ordinary." },
  { id: "ap-02", text: "I like the little things you probably don't realise I remember." },
  { id: "ap-03", text: "I like who I am when I'm around you." },
  { id: "ap-04", text: "I like how safe it feels to just be quiet with you." },
  { id: "ap-05", text: "I like the way you care. Fully. A little too much sometimes. It's my favourite thing." },
  { id: "ap-06", text: "I like that even when you're being annoying you're still my favourite kind of annoying." },
  { id: "ap-07", text: "I like how I never run out of small things to notice about you." },
  { id: "ap-08", text: "I like that you don't always have the perfect words, because your perfect silence does more." },
  { id: "ap-09", text: "I just like you. A lot. More than this little card can probably hold." },
];

export const museumHiddenDetails: readonly HiddenDetail[] = [
  { id: "hd-01", x: 12, y: 14, heading: "DETAIL FOUND #01", message: "I notice the way your shoulders relax when you are finally at ease." },
  { id: "hd-02", x: 31, y: 9,  heading: "DETAIL FOUND #02", message: "You probably didn't know I noticed how hard you try on everyone else's behalf." },
  { id: "hd-03", x: 54, y: 13, heading: "DETAIL FOUND #03", message: "You light up a room in a way that you never seem to see yourself." },
  { id: "hd-04", x: 74, y: 19, heading: "DETAIL FOUND #04", message: "Even your worst jokes are funny. Don't tell anyone I said that." },
  { id: "hd-05", x: 88, y: 31, heading: "DETAIL FOUND #05", message: "You are so much stronger than you give yourself credit for." },
  { id: "hd-06", x: 10, y: 35, heading: "DETAIL FOUND #06", message: "I have memorised exactly one specific laugh of yours. The good one." },
  { id: "hd-07", x: 22, y: 50, heading: "DETAIL FOUND #07", message: "You probably didn't know I noticed this." },
  { id: "hd-08", x: 44, y: 42, heading: "DETAIL FOUND #08", message: "Your kindness is not performative. That is the rarest thing in the whole building." },
  { id: "hd-09", x: 60, y: 53, heading: "DETAIL FOUND #09", message: "I still think about the first time you did that one little thing. You know which one." },
  { id: "hd-10", x: 80, y: 47, heading: "DETAIL FOUND #10", message: "Even the parts of you that you find annoying are parts I would miss." },
  { id: "hd-11", x: 91, y: 60, heading: "DETAIL FOUND #11", message: "I would listen to you talk about literally anything, even if I don't understand a word." },
  { id: "hd-12", x: 8,  y: 63, heading: "DETAIL FOUND #12", message: "You try to hide it but you care so deeply. I can always tell." },
  { id: "hd-13", x: 26, y: 72, heading: "DETAIL FOUND #13", message: "There are so many versions of you that I love and haven't even met yet." },
  { id: "hd-14", x: 42, y: 80, heading: "DETAIL FOUND #14", message: "You never run out of ways to surprise me. In the best way." },
  { id: "hd-15", x: 58, y: 74, heading: "DETAIL FOUND #15", message: "I hope one day you see yourself the way I see you." },
  { id: "hd-16", x: 73, y: 82, heading: "DETAIL FOUND #16", message: "You are not 'too much'. You are exactly the right amount. I promise." },
  { id: "hd-17", x: 87, y: 87, heading: "DETAIL FOUND #17", message: "Thank you for every moment you didn't even know you were giving." },
  { id: "hd-18", x: 50, y: 95, heading: "DETAIL FOUND #18", message: "Almost done. Keep going. I'm very proud of you." },
];

export const dayFiveLetter: DayFiveLetter = {
  intro: "A little something before the final chapter…",
  pillLines: [
    "BEFORE YOU CONTINUE...",
    "THANK YOU.",
    "FOR ALL THE RANDOM CONVERSATIONS.",
    "FOR ALL THE MEMORIES.",
    "FOR ALL THE CHAOS.",
    "AND SIMPLY FOR BEING YOU.",
  ],
  sections: [
    { kind: "heading", text: "A little something before the final chapter…" },
    {
      kind: "body",
      text:
        "Before you continue, I just want to say thank you.",
    },
    {
      kind: "body",
      text:
        "Thank you for every single little thing — for the random conversations, the stupid jokes, the unexpected moments, the memories I didn't know would become memories.",
    },
    {
      kind: "body",
      text: "Honestly, I don't even know how to explain what I feel for you.",
    },
    {
      kind: "body",
      text: "There were so many times when my heart simply said,",
    },
    {
      kind: "highlight-dil",
      text: "“Dil ne kaha — kar de.”",
    },
    {
      kind: "body",
      text: "So I did.",
    },
    {
      kind: "body",
      text:
        "I planned this, made this, and put all this together just because you are someone I wanted to make feel special.",
    },
    {
      kind: "body",
      text: "But the truth is…",
    },
    {
      kind: "highlight-moreSpecial",
      text: "“You are much more special than this surprise.”",
    },
    {
      kind: "body",
      text:
        "This isn't meant to define what you mean to me. It's just my little way of making you realise that somewhere in someone's life,",
    },
    {
      kind: "highlight-matter",
      text: "“you matter a lot.”",
    },
    {
      kind: "body",
      text: "Maybe more than you realise. Maybe more than I know how to put into words.",
    },
    {
      kind: "body",
      text:
        "And I really hope that nothing I've written here ever hurts you or makes you uncomfortable.",
    },
    {
      kind: "body",
      text:
        "Everything here came from a good place, with a lot of thought, a lot of effort, and probably an unreasonable amount of overthinking. :)",
    },
    {
      kind: "body",
      text: "So…",
    },
    {
      kind: "highlight-thankYou",
      text: "“thank you for being you.”",
    },
    {
      kind: "closing",
      text: "And thank you for being someone worth doing all of this for. ❤️",
    },
  ],
};
