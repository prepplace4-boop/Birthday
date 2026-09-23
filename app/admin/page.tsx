'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Settings = {
  herName?: string;
  yourName?: string;
  introText?: string;
  finalMessage?: string;
  accessPasswordEnabled?: boolean;
  journeyStatus?: string;
  birthdayDate?: string;
  [key: string]: unknown;
};

type DaySummary = {
  dayNumber: number;
  title: string;
  subtitle?: string;
  teaser?: string;
  isUnlocked: boolean;
};

type EditorItem = {
  id: string;
  title: string;
  description?: string;
  message?: string;
  date?: string;
  content?: string;
  signature?: string;
  name?: string;
  url?: string;
  type?: string;
};

type DayEditor = {
  dayNumber: number;
  title: string;
  subtitle: string;
  teaser: string;
  welcomeMessage: string;
  timeline: EditorItem[];
  memories: EditorItem[];
  envelopes: EditorItem[];
  rooms: EditorItem[];
  finalIntroLines: string[];
  friendMessages: EditorItem[];
  finalLetter: { title: string; content: string; signature: string };
  finalSurprise: { title: string; content: string; url: string; type: string };
};

const defaultSettings: Settings = {
  herName: 'Kesar',
  yourName: 'Hardik',
  introText: 'Hey Kesar 👀 — Someone has prepared something for you. Not just a birthday wish. A 5-day little journey.',
  finalMessage: 'Happy Birthday, Kesar! Thank you for going through this little journey with me. Every moment with you is worth celebrating. ❤️',
  accessPasswordEnabled: false,
  journeyStatus: 'live',
  birthdayDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
};

const emptyEditor = (dayNumber: number): DayEditor => ({
  dayNumber,
  title: `Day ${dayNumber}`,
  subtitle: '',
  teaser: '',
  welcomeMessage: '',
  timeline: [],
  memories: [],
  envelopes: [],
  rooms: [],
  finalIntroLines: [],
  friendMessages: [],
  finalLetter: { title: '', content: '', signature: '' },
  finalSurprise: { title: '', content: '', url: '', type: 'externalLink' },
});

async function fetchJson(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data && typeof data === 'object' && 'error' in data ? String((data as { error?: string }).error) : 'Request failed'));
  }

  return data;
}

function normalizeEditor(dayNumber: number, day: DaySummary | undefined, content: Record<string, unknown> | undefined): DayEditor {
  const editor = emptyEditor(dayNumber);

  editor.title = String(day?.title ?? editor.title);
  editor.subtitle = String(day?.subtitle ?? '');
  editor.teaser = String(day?.teaser ?? '');
  editor.welcomeMessage = String((content as any)?.welcomeMessage ?? '');

  const timeline = Array.isArray((content as any)?.timelineItems) ? (content as any).timelineItems : [];
  editor.timeline = timeline.map((item: any, index: number) => ({
    id: String(item.id ?? `timeline-${index}`),
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
    date: String(item.date ?? ''),
  }));

  const memories = Array.isArray((content as any)?.featuredMemories) ? (content as any).featuredMemories : [];
  editor.memories = memories.map((item: any, index: number) => ({
    id: String(item.id ?? `memory-${index}`),
    title: String(item.title ?? ''),
    description: String(item.description ?? ''),
  }));

  const envelopes = Array.isArray((content as any)?.envelopes) ? (content as any).envelopes : [];
  editor.envelopes = envelopes.map((item: any, index: number) => ({
    id: String(item.id ?? `envelope-${index}`),
    title: String(item.title ?? ''),
    message: String(item.message ?? ''),
  }));

  const rooms = Array.isArray((content as any)?.rooms) ? (content as any).rooms : [];
  editor.rooms = rooms.map((item: any, index: number) => ({
    id: String(item.id ?? `room-${index}`),
    title: String(item.title ?? ''),
    description: String(item.subtitle ?? ''),
    content: JSON.stringify(item.exhibits ?? []).slice(0, 1000),
  }));

  editor.finalIntroLines = Array.isArray((content as any)?.finalIntroLines) ? (content as any).finalIntroLines : [];
  const friendMessages = Array.isArray((content as any)?.friendMessages) ? (content as any).friendMessages : [];
  editor.friendMessages = friendMessages.map((item: any, index: number) => ({
    id: String(item.id ?? `friend-${index}`),
    name: String(item.name ?? ''),
    message: String(item.message ?? ''),
  }));

  editor.finalLetter = {
    title: String((content as any)?.finalLetter?.title ?? ''),
    content: String((content as any)?.finalLetter?.content ?? ''),
    signature: String((content as any)?.finalLetter?.signature ?? ''),
  };

  editor.finalSurprise = {
    title: String((content as any)?.finalSurprise?.title ?? ''),
    content: String((content as any)?.finalSurprise?.content ?? ''),
    url: String((content as any)?.finalSurprise?.url ?? ''),
    type: String((content as any)?.finalSurprise?.type ?? 'externalLink'),
  };

  return editor;
}

function buildPayload(dayNumber: number, editor: DayEditor) {
  const payload: Record<string, unknown> = { dayNumber };

  payload.title = editor.title;
  payload.subtitle = editor.subtitle;
  payload.teaser = editor.teaser;

  if (dayNumber === 1) {
    payload.welcomeMessage = editor.welcomeMessage;
    payload.timeline = editor.timeline.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date,
    }));
    payload.memories = editor.memories.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      isSecret: false,
    }));
  }

  if (dayNumber === 2) {
    payload.memories = editor.memories.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      isSecret: false,
    }));
  }

  if (dayNumber === 3) {
    payload.envelopes = editor.envelopes.map((item) => ({
      id: item.id,
      title: item.title,
      message: item.message,
      isSpecialLocked: false,
    }));
  }

  if (dayNumber === 4) {
    payload.rooms = editor.rooms.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      sortOrder: 0,
      exhibits: [{ id: `${item.id}-exhibit`, title: item.title, description: item.content ?? item.description ?? '' }],
    }));
  }

  if (dayNumber === 5) {
    payload.finalIntroLines = editor.finalIntroLines;
    payload.friendMessages = editor.friendMessages.map((item) => ({
      id: item.id,
      name: item.name,
      message: item.message,
    }));
    payload.letter = {
      title: editor.finalLetter.title,
      content: editor.finalLetter.content,
      signature: editor.finalLetter.signature,
    };
    payload.finalSurprise = {
      type: editor.finalSurprise.type,
      title: editor.finalSurprise.title,
      content: editor.finalSurprise.content,
      url: editor.finalSurprise.url,
    };
  }

  return payload;
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [days, setDays] = useState<DaySummary[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [editor, setEditor] = useState<DayEditor>(emptyEditor(1));
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [credentials, setCredentials] = useState({
    email: 'admin@example.com',
    password: 'change-me-123',
  });
  const [saving, setSaving] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [busyMessage, setBusyMessage] = useState('');

  const loadDayEditor = async (dayNumber: number) => {
    setLoadingDay(true);
    try {
      const response = await fetchJson(`/api/admin/day/${dayNumber}`);
      const normalized = normalizeEditor(dayNumber, days.find((day) => day.dayNumber === dayNumber), response.content ?? {});
      setEditor(normalized);
    } catch (error) {
      setBusyMessage(error instanceof Error ? error.message : 'Could not load day details.');
    } finally {
      setLoadingDay(false);
    }
  };

  const refresh = useCallback(async () => {
    const [settingsResponse, progressResponse, daysResponse] = await Promise.all([
      fetchJson('/api/admin/settings'),
      fetchJson('/api/admin/progress').catch(() => ({ ok: true, totalGuests: 0, completedDays: 0, currentDay: 1 })),
      fetch('/api/birthday/days').then((response) => response.json()),
    ]);

    const normalizedDays = (daysResponse.days ?? []) as DaySummary[];
    setSettings(settingsResponse.settings ?? defaultSettings);
    setStats(progressResponse ?? {});
    setDays(normalizedDays);

    if (normalizedDays.length > 0) {
      const nextDay = normalizedDays.find((day) => day.dayNumber === selectedDay)?.dayNumber ?? normalizedDays[0].dayNumber;
      setSelectedDay(nextDay);
      const response = await fetchJson(`/api/admin/day/${nextDay}`);
      const normalized = normalizeEditor(nextDay, normalizedDays.find((day) => day.dayNumber === nextDay), response.content ?? {});
      setEditor(normalized);
    }

    setLoggedIn(true);
  }, [selectedDay]);

  useEffect(() => {
    refresh().catch(() => {
      setLoggedIn(false);
    });
  }, [refresh]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyMessage('Signing in...');

    try {
      await fetchJson('/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      await refresh();
      setBusyMessage('Signed in.');
    } catch (error) {
      setLoggedIn(false);
      setBusyMessage(error instanceof Error ? error.message : 'Login failed.');
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setBusyMessage('Saving settings...');

    try {
      const response = await fetchJson('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      setSettings(response.settings ?? settings);
      setBusyMessage('Saved.');
    } catch (error) {
      setBusyMessage(error instanceof Error ? error.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = async (dayNumber: number, unlock: boolean) => {
    setBusyMessage(unlock ? `Unlocking day ${dayNumber}...` : `Locking day ${dayNumber}...`);

    try {
      await fetchJson(`/api/admin/day/${dayNumber}/${unlock ? 'unlock' : 'lock'}`, {
        method: 'POST',
      });

      setDays((current) =>
        current.map((day) =>
          day.dayNumber === dayNumber ? { ...day, isUnlocked: unlock } : day,
        ),
      );
      setBusyMessage(unlock ? `Day ${dayNumber} unlocked.` : `Day ${dayNumber} locked.`);
    } catch (error) {
      setBusyMessage(error instanceof Error ? error.message : 'Update failed.');
    }
  };

  const handleSaveDay = async () => {
    setSaving(true);
    setBusyMessage(`Saving day ${selectedDay}...`);

    try {
      const response = await fetchJson(`/api/admin/day/${selectedDay}`, {
        method: 'PUT',
        body: JSON.stringify(buildPayload(selectedDay, editor)),
      });
      if (response.ok) {
        setBusyMessage(`Day ${selectedDay} saved.`);
        await refresh();
      }
    } catch (error) {
      setBusyMessage(error instanceof Error ? error.message : 'Could not save day.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetchJson('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout failures
    }

    setLoggedIn(false);
    setBusyMessage('Logged out.');
  };

  const selectedDayInfo = useMemo(
    () => days.find((day) => day.dayNumber === selectedDay),
    [days, selectedDay],
  );

  if (loggedIn === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
        <div className="rounded-[24px] border border-stone-200 bg-white/80 px-6 py-4 text-sm text-stone-600 shadow-[0_20px_50px_rgba(91,62,43,0.08)]">
          Checking admin session...
        </div>
      </main>
    );
  }

  if (loggedIn === false) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
        <div className="w-full max-w-md rounded-[30px] border border-stone-200 bg-white/80 p-6 shadow-[0_25px_60px_rgba(91,62,43,0.10)] backdrop-blur-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-rose-500">admin</p>
          <h1 className="mt-3 font-display text-4xl text-stone-800">Birthday Studio</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Sign in to unlock days, edit copy, and manage the birthday journey.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
              <input
                value={credentials.email}
                onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-rose-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-rose-300"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Sign in
            </button>
          </form>

          {busyMessage ? <p className="mt-4 text-sm text-stone-600">{busyMessage}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-[30px] border border-rose-200/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(91,62,43,0.08)] backdrop-blur-sm sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-rose-500">admin dashboard</p>
              <h1 className="mt-2 font-display text-4xl text-stone-800">Birthday Studio</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
            >
              Log out
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">guests</p>
              <p className="mt-2 font-display text-3xl text-stone-800">{typeof stats.totalGuests === 'number' ? String(stats.totalGuests) : '0'}</p>
            </div>
            <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">journey status</p>
              <p className="mt-2 font-display text-3xl text-stone-800">{String(settings.journeyStatus ?? 'live')}</p>
            </div>
            <div className="rounded-[22px] border border-stone-200 bg-stone-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">active days</p>
              <p className="mt-2 font-display text-3xl text-stone-800">{days.filter((day) => day.isUnlocked).length}/5</p>
            </div>
          </div>
        </motion.header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-stone-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(91,62,43,0.08)] sm:p-8">
            <h2 className="font-display text-3xl text-stone-800">All days</h2>
            <div className="mt-6 grid gap-3">
              {days.map((day) => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day.dayNumber);
                    loadDayEditor(day.dayNumber);
                  }}
                  className={`rounded-[22px] border p-4 text-left transition ${selectedDay === day.dayNumber ? 'border-rose-300 bg-rose-50 shadow-sm' : 'border-stone-200 bg-stone-50'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">day {day.dayNumber}</p>
                      <h3 className="mt-1 font-display text-2xl text-stone-800">{day.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] ${day.isUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>
                        {day.isUnlocked ? 'open' : 'locked'}
                      </span>
                      <a
                        href={`/birthday/day/${day.dayNumber}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-medium text-rose-600 underline hover:text-rose-700"
                      >
                        Preview →
                      </a>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{day.subtitle || day.teaser || 'Edit this day chapter.'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-stone-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(91,62,43,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 border-b border-stone-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">editing</p>
                <h2 className="mt-1 font-display text-3xl text-stone-800">Day {selectedDay}: {selectedDayInfo?.title ?? editor.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => handleDayToggle(selectedDay, !(selectedDayInfo?.isUnlocked ?? false))}
                className={`rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition ${selectedDayInfo?.isUnlocked ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
              >
                {selectedDayInfo?.isUnlocked ? 'Lock day' : 'Unlock day'}
              </button>
            </div>

            {loadingDay ? (
              <div className="mt-6 text-sm text-stone-600">Loading day content...</div>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Title</label>
                    <input
                      value={editor.title}
                      onChange={(event) => setEditor((current) => ({ ...current, title: event.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Subtitle</label>
                    <input
                      value={editor.subtitle}
                      onChange={(event) => setEditor((current) => ({ ...current, subtitle: event.target.value }))}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">Teaser</label>
                  <input
                    value={editor.teaser}
                    onChange={(event) => setEditor((current) => ({ ...current, teaser: event.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                  />
                </div>

                {selectedDay === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Welcome message</label>
                      <textarea
                        value={editor.welcomeMessage}
                        onChange={(event) => setEditor((current) => ({ ...current, welcomeMessage: event.target.value }))}
                        className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Timeline entries</label>
                      {editor.timeline.map((item, index) => (
                        <div key={item.id || index} className="mb-3 space-y-2 rounded-[18px] border border-stone-200 bg-stone-50 p-3">
                          <input
                            value={item.title}
                            onChange={(event) => setEditor((current) => ({ ...current, timeline: current.timeline.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry) }))}
                            placeholder="Title"
                            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                          />
                          <input
                            value={item.date}
                            onChange={(event) => setEditor((current) => ({ ...current, timeline: current.timeline.map((entry, idx) => idx === index ? { ...entry, date: event.target.value } : entry) }))}
                            placeholder="Date"
                            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                          />
                          <textarea
                            value={item.description}
                            onChange={(event) => setEditor((current) => ({ ...current, timeline: current.timeline.map((entry, idx) => idx === index ? { ...entry, description: event.target.value } : entry) }))}
                            placeholder="Description"
                            className="min-h-[90px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDay === 2 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Memory cards</label>
                    {editor.memories.map((item, index) => (
                      <div key={item.id || index} className="mb-3 rounded-[18px] border border-stone-200 bg-stone-50 p-3">
                        <input
                          value={item.title}
                          onChange={(event) => setEditor((current) => ({ ...current, memories: current.memories.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry) }))}
                          placeholder="Memory title"
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                        <textarea
                          value={item.description}
                          onChange={(event) => setEditor((current) => ({ ...current, memories: current.memories.map((entry, idx) => idx === index ? { ...entry, description: event.target.value } : entry) }))}
                          placeholder="Memory description"
                          className="mt-2 min-h-[90px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedDay === 3 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Letters / envelopes</label>
                    {editor.envelopes.map((item, index) => (
                      <div key={item.id || index} className="mb-3 rounded-[18px] border border-stone-200 bg-stone-50 p-3">
                        <input
                          value={item.title}
                          onChange={(event) => setEditor((current) => ({ ...current, envelopes: current.envelopes.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry) }))}
                          placeholder="Envelope title"
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                        <textarea
                          value={item.message}
                          onChange={(event) => setEditor((current) => ({ ...current, envelopes: current.envelopes.map((entry, idx) => idx === index ? { ...entry, message: event.target.value } : entry) }))}
                          placeholder="Letter text"
                          className="mt-2 min-h-[110px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedDay === 4 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">Museum rooms</label>
                    {editor.rooms.map((item, index) => (
                      <div key={item.id || index} className="mb-3 rounded-[18px] border border-stone-200 bg-stone-50 p-3">
                        <input
                          value={item.title}
                          onChange={(event) => setEditor((current) => ({ ...current, rooms: current.rooms.map((entry, idx) => idx === index ? { ...entry, title: event.target.value } : entry) }))}
                          placeholder="Room title"
                          className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                        <textarea
                          value={item.description}
                          onChange={(event) => setEditor((current) => ({ ...current, rooms: current.rooms.map((entry, idx) => idx === index ? { ...entry, description: event.target.value } : entry) }))}
                          placeholder="Room subtitle"
                          className="mt-2 min-h-[80px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                        <textarea
                          value={item.content}
                          onChange={(event) => setEditor((current) => ({ ...current, rooms: current.rooms.map((entry, idx) => idx === index ? { ...entry, content: event.target.value } : entry) }))}
                          placeholder="Exhibit details"
                          className="mt-2 min-h-[100px] w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {selectedDay === 5 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final intro lines</label>
                      <textarea
                        value={editor.finalIntroLines.join('\n')}
                        onChange={(event) => setEditor((current) => ({ ...current, finalIntroLines: event.target.value.split('\n').filter(Boolean) }))}
                        className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final letter title</label>
                      <input
                        value={editor.finalLetter.title}
                        onChange={(event) => setEditor((current) => ({ ...current, finalLetter: { ...current.finalLetter, title: event.target.value } }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final letter text</label>
                      <textarea
                        value={editor.finalLetter.content}
                        onChange={(event) => setEditor((current) => ({ ...current, finalLetter: { ...current.finalLetter, content: event.target.value } }))}
                        className="min-h-[120px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final signature</label>
                      <input
                        value={editor.finalLetter.signature}
                        onChange={(event) => setEditor((current) => ({ ...current, finalLetter: { ...current.finalLetter, signature: event.target.value } }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final surprise title</label>
                      <input
                        value={editor.finalSurprise.title}
                        onChange={(event) => setEditor((current) => ({ ...current, finalSurprise: { ...current.finalSurprise, title: event.target.value } }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final surprise text</label>
                      <textarea
                        value={editor.finalSurprise.content}
                        onChange={(event) => setEditor((current) => ({ ...current, finalSurprise: { ...current.finalSurprise, content: event.target.value } }))}
                        className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">Final surprise URL</label>
                      <input
                        value={editor.finalSurprise.url}
                        onChange={(event) => setEditor((current) => ({ ...current, finalSurprise: { ...current.finalSurprise, url: event.target.value } }))}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-stone-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-stone-600">{busyMessage}</div>
                  <button
                    type="button"
                    onClick={handleSaveDay}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? 'Saving...' : 'Save content'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[30px] border border-stone-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(91,62,43,0.08)] sm:p-8">
          <h2 className="font-display text-3xl text-stone-800">Journey settings</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Her name</label>
              <input
                value={settings.herName ?? ''}
                onChange={(event) => setSettings((current) => ({ ...current, herName: event.target.value }))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Birthday date</label>
              <input
                type="date"
                value={settings.birthdayDate ? new Date(settings.birthdayDate).toISOString().slice(0, 10) : ''}
                onChange={(event) => setSettings((current) => ({ ...current, birthdayDate: new Date(event.target.value).toISOString() }))}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700">Intro text</label>
              <textarea
                value={settings.introText ?? ''}
                onChange={(event) => setSettings((current) => ({ ...current, introText: event.target.value }))}
                className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-stone-700">Final message</label>
              <textarea
                value={settings.finalMessage ?? ''}
                onChange={(event) => setSettings((current) => ({ ...current, finalMessage: event.target.value }))}
                className="min-h-[110px] w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-rose-300"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 rounded-[20px] border border-stone-200 bg-stone-50 p-3">
            <div>
              <p className="text-sm font-medium text-stone-800">Access password</p>
              <p className="text-xs text-stone-500">Require a password before entering the journey</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings((current) => ({ ...current, accessPasswordEnabled: !current.accessPasswordEnabled }))}
              className={`inline-flex h-7 w-12 items-center rounded-full p-1 transition ${settings.accessPasswordEnabled ? 'bg-rose-500' : 'bg-stone-300'}`}
            >
              <span className={`h-5 w-5 rounded-full bg-white transition ${settings.accessPasswordEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save journey settings'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
