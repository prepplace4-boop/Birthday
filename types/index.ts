export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface BirthdayJourney {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  title: string;
  subtitle: string;
  description: string;
  teaser: string;
  isUnlocked: boolean;
  unlockTime: string | null;
  createdAt: string;
  updatedAt: string;
  welcomeMessage?: string;
  featuredMemories?: string[];
  mysteryQuestion?: string;
  finalSurprises?: FinalSurprise[];
}

export interface TimelineItem {
  id: string;
  day_id: string;
  display_order: number;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface Memory {
  id: string;
  day_id: string;
  display_order: number;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isSecret: boolean;
}

export interface Envelope {
  id: string;
  day_id: string;
  display_order: number;
  title: string;
  icon?: string;
  message?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isSpecialLocked: boolean;
}

export interface MuseumRoom {
  id: string;
  day_id: string;
  number: number;
  title: string;
  subtitle: string;
  isLocked?: boolean;
  teaser?: string;
  sortOrder: number;
}

export interface MuseumExhibit {
  id: string;
  room_id: string;
  display_order: number;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface PlaylistItem {
  id: string;
  room_id: string;
  display_order: number;
  title: string;
  artist: string;
  reason: string;
  url: string;
}

export interface Habit {
  id: string;
  room_id: string;
  display_order: number;
  statement: string;
  revealedAnswer: string;
}

export interface Observation {
  id: string;
  room_id: string;
  display_order: number;
  statement: string;
  imageUrl?: string;
}

export interface FriendMessage {
  id: string;
  display_order: number;
  name: string;
  videoUrl?: string;
  photoUrl?: string;
  message: string;
}

export interface FinalLetter {
  title: string;
  content: string;
  signature: string;
  audioUrl?: string;
}

export type FinalSurpriseType =
  | 'video'
  | 'gift'
  | 'playlist'
  | 'webpage'
  | 'photoCollection'
  | 'secretMessage'
  | 'digitalArt'
  | 'downloadable'
  | 'externalLink';

export interface FinalSurprise {
  type: FinalSurpriseType;
  title: string;
  content: string;
  url?: string;
  mediaUrl?: string;
}

export interface JourneySettings {
  herName: string;
  yourName: string;
  birthdayDate: string;
  theme: string;
  background: string;
  musicUrl: string;
  musicVolume: number;
  musicDay?: number;
  accessPasswordEnabled: boolean;
  accessPasswordHash?: string;
  journeyStatus: 'draft' | 'scheduled' | 'live' | 'completed';
  introText: string;
  finalMessage: string;
}

export interface GuestSession {
  id: string;
  token: string;
  createdAt: string;
}

export interface Progress {
  id: string;
  guestSessionId: string;
  dayNumber: number;
  openedAt: string | null;
  completedAt: string | null;
  completionPercentage: number;
}

export type EasterEggTriggerType = 'clickN' | 'longPress' | 'secretWord';

export interface EasterEgg {
  id: string;
  day: number;
  areaId: string;
  triggerType: EasterEggTriggerType;
  triggerCount?: number;
  secretWord?: string;
  revealMessage: string;
  revealMediaUrl?: string;
}

export type MediaVisibility = 'public' | 'day_locked' | 'admin_only';

export interface Media {
  id: string;
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  title: string;
  description?: string;
  dayNumber: number;
  section: string;
  displayOrder: number;
  visibility: MediaVisibility;
  createdAt: string;
}

export interface EnvelopeOpen {
  id: string;
  guestSessionId: string;
  envelopeId: string;
  openedAt: string;
}

export interface MuseumRoomVisit {
  id: string;
  guestSessionId: string;
  museumRoomId: string;
  visitedAt: string;
}

export type DayContent = Day & {
  timelineItems?: TimelineItem[];
  memories?: Memory[];
  envelopes?: Envelope[];
  museumRooms?: MuseumRoom[];
  friendMessages?: FriendMessage[];
  finalLetter?: FinalLetter;
  finalSurprises?: FinalSurprise[];
};

export interface LockedDayPayload {
  day: number;
  locked: true;
  teaser: string;
}

export interface UnlockedDay1Payload {
  day: 1;
  locked: false;
  data: DayContent;
  timelineItems: TimelineItem[];
  memories: Memory[];
  envelopes: Envelope[];
}

export interface UnlockedDay2Payload {
  day: 2;
  locked: false;
  data: DayContent;
  timelineItems: TimelineItem[];
  memories: Memory[];
  envelopes: Envelope[];
}

export interface UnlockedDay3Payload {
  day: 3;
  locked: false;
  data: DayContent;
  envelopes: Envelope[];
  friendMessages: FriendMessage[];
}

export interface UnlockedDay4Payload {
  day: 4;
  locked: false;
  data: DayContent;
  museumRooms: (MuseumRoom & {
    exhibits: MuseumExhibit[];
    playlist: PlaylistItem[];
    habits: Habit[];
    observations: Observation[];
  })[];
}

export interface UnlockedDay5Payload {
  day: 5;
  locked: false;
  data: DayContent;
  finalLetter: FinalLetter;
  finalSurprises: FinalSurprise[];
}

export type DayPayload =
  | LockedDayPayload
  | UnlockedDay1Payload
  | UnlockedDay2Payload
  | UnlockedDay3Payload
  | UnlockedDay4Payload
  | UnlockedDay5Payload;
