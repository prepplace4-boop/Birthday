import { z } from 'zod';

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

export const DayUnlockSchema = z.object({
  dayNumber: z.coerce.number().int().min(1).max(5),
});

export type DayUnlockInput = z.infer<typeof DayUnlockSchema>;

const TimelineItemPatchSchema = z.object({
  id: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
  date: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  audioUrl: z.string().optional().nullable(),
});

const MemoryPatchSchema = z.object({
  id: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
  date: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  audioUrl: z.string().optional().nullable(),
  isSecret: z.boolean().optional(),
});

const EnvelopePatchSchema = z.object({
  id: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
  title: z.string().optional(),
  icon: z.string().optional().nullable(),
  message: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  audioUrl: z.string().optional().nullable(),
  isSpecialLocked: z.boolean().optional(),
});

const MuseumRoomPatchSchema = z.object({
  id: z.string().optional(),
  number: z.number().int().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  isLocked: z.boolean().optional(),
  teaser: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const FriendMessagePatchSchema = z.object({
  id: z.string().optional(),
  display_order: z.number().int().min(0).optional(),
  name: z.string().optional(),
  videoUrl: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  message: z.string().optional(),
});

const FinalLetterPatchSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  signature: z.string().optional(),
  audioUrl: z.string().optional().nullable(),
});

const FinalSurpriseTypeSchema = z.enum([
  'video',
  'gift',
  'playlist',
  'webpage',
  'photoCollection',
  'secretMessage',
  'digitalArt',
  'downloadable',
  'externalLink',
]);

const FinalSurprisePatchSchema = z.object({
  type: FinalSurpriseTypeSchema.optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  url: z.string().optional().nullable(),
  mediaUrl: z.string().optional().nullable(),
});

const DayContentBaseSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  teaser: z.string().optional(),
  isUnlocked: z.boolean().optional(),
  unlockTime: z.string().nullable().optional(),
  welcomeMessage: z.string().optional(),
  featuredMemories: z.array(z.string()).optional(),
  mysteryQuestion: z.string().optional(),
});

export const DayContentUpdateSchema = DayContentBaseSchema.extend({
  dayNumber: z.coerce.number().int().min(1).max(5),
  timeline: z.array(TimelineItemPatchSchema).optional(),
  memories: z.array(MemoryPatchSchema).optional(),
  envelopes: z.array(EnvelopePatchSchema).optional(),
  rooms: z.array(MuseumRoomPatchSchema).optional(),
  letter: FinalLetterPatchSchema.optional(),
  friendMessages: z.array(FriendMessagePatchSchema).optional(),
  finalSurprise: FinalSurprisePatchSchema.optional(),
});

export type DayContentUpdateInput = z.infer<typeof DayContentUpdateSchema>;

export const SettingsUpdateSchema = z.object({
  herName: z.string().optional(),
  yourName: z.string().optional(),
  birthdayDate: z.string().optional(),
  theme: z.string().optional(),
  background: z.string().optional(),
  musicUrl: z.string().optional(),
  musicVolume: z.coerce.number().min(0).max(1).optional(),
  musicDay: z.coerce.number().int().min(1).max(5).optional().nullable(),
  accessPasswordEnabled: z.boolean().optional(),
  accessPasswordHash: z.string().optional().nullable(),
  journeyStatus: z.enum(['draft', 'scheduled', 'live', 'completed']).optional(),
  introText: z.string().optional(),
  finalMessage: z.string().optional(),
});

export type SettingsUpdateInput = z.infer<typeof SettingsUpdateSchema>;

export const ProgressUpdateSchema = z.object({
  dayNumber: z.coerce.number().int().min(1).max(5).optional(),
  dayOpened: z.coerce.number().int().min(1).max(5).optional(),
  envelopeId: z.string().optional(),
  envelopeOpened: z.string().optional(),
  museumRoomId: z.string().optional(),
  museumRoomVisited: z.string().optional(),
  finalSurpriseViewed: z.boolean().optional(),
  completionPercentage: z.coerce.number().min(0).max(100).optional(),
});

export type ProgressUpdateInput = z.infer<typeof ProgressUpdateSchema>;

export const AccessPasswordSchema = z.object({
  password: z.string().min(1),
});

export type AccessPasswordInput = z.infer<typeof AccessPasswordSchema>;

const MEDIA_VISIBILITY = ['public', 'day_locked', 'admin_only'] as const;

export const MediaUploadMetaSchema = z.object({
  title: z.string().min(1),
  dayNumber: z.coerce.number().int().min(1).max(5),
  section: z.string().min(1),
  displayOrder: z.coerce.number().int().min(0).default(0),
  visibility: z.enum(MEDIA_VISIBILITY).default('public'),
  description: z.string().optional(),
});

export type MediaUploadMetaInput = z.infer<typeof MediaUploadMetaSchema>;

export const FinalSurpriseUpdateSchema = FinalSurprisePatchSchema;
export type FinalSurpriseUpdateInput = z.infer<typeof FinalSurpriseUpdateSchema>;
