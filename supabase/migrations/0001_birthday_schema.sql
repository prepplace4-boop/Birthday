-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- Core entity tables
-- =====================================================================

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS birthday_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number BETWEEN 1 AND 5),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  teaser TEXT NOT NULL DEFAULT '',
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlock_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  welcome_message TEXT,
  featured_memories UUID[],
  mystery_question TEXT
);

CREATE INDEX IF NOT EXISTS idx_days_day_number ON days (day_number);
CREATE INDEX IF NOT EXISTS idx_days_is_unlocked ON days (is_unlocked);

-- =====================================================================
-- Day 1 & 2: Timeline, Memories, Envelopes
-- =====================================================================

CREATE TABLE IF NOT EXISTS timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_timeline_items_day_id ON timeline_items (day_id);
CREATE INDEX IF NOT EXISTS idx_timeline_items_display_order ON timeline_items (display_order);

CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  is_secret BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_memories_day_id ON memories (day_id);
CREATE INDEX IF NOT EXISTS idx_memories_display_order ON memories (display_order);

CREATE TABLE IF NOT EXISTS envelopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  icon TEXT,
  message TEXT,
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  is_special_locked BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_envelopes_day_id ON envelopes (day_id);
CREATE INDEX IF NOT EXISTS idx_envelopes_display_order ON envelopes (display_order);

-- =====================================================================
-- Day 4: Museum (Rooms, Exhibits, Playlist, Habits, Observations)
-- =====================================================================

CREATE TABLE IF NOT EXISTS museum_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES days(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  is_locked BOOLEAN NOT NULL DEFAULT false,
  teaser TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_museum_rooms_day_id ON museum_rooms (day_id);
CREATE INDEX IF NOT EXISTS idx_museum_rooms_sort_order ON museum_rooms (sort_order);

CREATE TABLE IF NOT EXISTS museum_exhibits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES museum_rooms(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_museum_exhibits_room_id ON museum_exhibits (room_id);
CREATE INDEX IF NOT EXISTS idx_museum_exhibits_display_order ON museum_exhibits (display_order);

CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES museum_rooms(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_playlist_items_room_id ON playlist_items (room_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_display_order ON playlist_items (display_order);

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES museum_rooms(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  statement TEXT NOT NULL,
  revealed_answer TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_habits_room_id ON habits (room_id);
CREATE INDEX IF NOT EXISTS idx_habits_display_order ON habits (display_order);

CREATE TABLE IF NOT EXISTS observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES museum_rooms(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  statement TEXT NOT NULL,
  image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_observations_room_id ON observations (room_id);
CREATE INDEX IF NOT EXISTS idx_observations_display_order ON observations (display_order);

-- =====================================================================
-- Day 3 & 5: Friend Messages, Final Letter, Final Surprises
-- =====================================================================

CREATE TABLE IF NOT EXISTS friend_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_order INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  video_url TEXT,
  photo_url TEXT,
  message TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_friend_messages_display_order ON friend_messages (display_order);

CREATE TABLE IF NOT EXISTS final_letter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  signature TEXT NOT NULL,
  audio_url TEXT
);

CREATE TABLE IF NOT EXISTS final_surprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_order INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('video','gift','playlist','webpage','photoCollection','secretMessage','digitalArt','downloadable','externalLink')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  media_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_final_surprises_display_order ON final_surprises (display_order);

-- =====================================================================
-- Settings, Sessions, Progress
-- =====================================================================

CREATE TABLE IF NOT EXISTS journey_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  her_name TEXT NOT NULL DEFAULT 'Kesar',
  your_name TEXT NOT NULL DEFAULT 'Friend',
  birthday_date TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'default',
  background TEXT NOT NULL DEFAULT '',
  music_url TEXT NOT NULL DEFAULT '',
  music_volume NUMERIC NOT NULL DEFAULT 0.5,
  music_day INTEGER,
  access_password_enabled BOOLEAN NOT NULL DEFAULT false,
  access_password_hash TEXT,
  journey_status TEXT NOT NULL DEFAULT 'draft' CHECK (journey_status IN ('draft','scheduled','live','completed')),
  intro_text TEXT NOT NULL DEFAULT '',
  final_message TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guest_sessions_token ON guest_sessions (token);

CREATE TABLE IF NOT EXISTS progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_session_id UUID NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
  opened_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  completion_percentage NUMERIC NOT NULL DEFAULT 0,
  UNIQUE (guest_session_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_progress_guest_session_id ON progress (guest_session_id);

-- =====================================================================
-- Easter eggs, Media, Tracking (Envelope Opens, Museum Room Visits)
-- =====================================================================

CREATE TABLE IF NOT EXISTS easter_eggs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 5),
  area_id TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('clickN','longPress','secretWord')),
  trigger_count INTEGER,
  secret_word TEXT,
  reveal_message TEXT NOT NULL,
  reveal_media_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_easter_eggs_day_area ON easter_eggs (day, area_id);

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 5),
  section TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','day_locked','admin_only')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_day_section ON media (day_number, section);

CREATE TABLE IF NOT EXISTS envelope_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_session_id UUID NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
  envelope_id UUID NOT NULL REFERENCES envelopes(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_envelope_opens_session_envelope ON envelope_opens (guest_session_id, envelope_id);

CREATE TABLE IF NOT EXISTS museum_room_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_session_id UUID NOT NULL REFERENCES guest_sessions(id) ON DELETE CASCADE,
  museum_room_id UUID NOT NULL REFERENCES museum_rooms(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_museum_room_visits_session_room ON museum_room_visits (guest_session_id, museum_room_id);

-- =====================================================================
-- Seed default days 1-5
-- =====================================================================

INSERT INTO days (day_number, title, subtitle, teaser, is_unlocked, unlock_time)
VALUES
  (1, 'THE BEGINNING', 'Every story has a beginning.', '', true, now()),
  (2, 'THE MEMORY VAULT', 'Some moments deserve to be kept.', 'Tomorrow, we open the memory vault.', false, NULL),
  (3, 'THE THINGS I NEVER SAID', '', 'There are a few things I''ve never actually said.', false, NULL),
  (4, 'THE MUSEUM OF YOU', '', 'Tomorrow is all about you.', false, NULL),
  (5, 'THE FINAL CHAPTER', '', 'The final chapter.', false, NULL)
ON CONFLICT (day_number) DO NOTHING;

-- =====================================================================
-- Seed default JourneySettings row
-- =====================================================================

INSERT INTO journey_settings (her_name, your_name)
VALUES ('Kesar', 'Friend')
ON CONFLICT DO NOTHING;
