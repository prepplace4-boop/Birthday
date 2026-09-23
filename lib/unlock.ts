export type UnlockSchedule = {
  dayNumber: 1 | 2 | 3 | 4 | 5;
  unlockDate: string;
};

/**
 * Fixed offset for the journey's timezone (IST = UTC+5:30), in
 * milliseconds. Every date/time computation in this file is anchored to
 * this fixed offset, never to whatever timezone the executing
 * environment happens to be in.
 *
 * This matters because "local" means something different depending on
 * where the code runs: a browser visiting from India, a serverless
 * function that defaults to UTC, or a laptop set to some other zone.
 * Using ambient-timezone APIs (Date#getFullYear/getMonth/getDate,
 * Date#setHours, `new Date(y, m, d)`, or even Date#setUTCHours after
 * building an already-offset instant) makes the result depend on which
 * of those environments happened to run it — which is exactly how this
 * schedule drifted before. Plain millisecond arithmetic against a fixed
 * offset is immune to that: IST has no DST, so a 24h day is always
 * exactly 86,400,000 ms and nothing here needs the host's calendar.
 */
const OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Parses a "YYYY-MM-DD" string as midnight IST, returned as an absolute
 * UTC instant. This instant is the same moment in time no matter where
 * the code executes.
 *
 * IMPORTANT: do not follow this with setUTCHours(0,0,0,0) or any other
 * "round to midnight" call — that zeroes out the +5:30 offset baked in
 * here and silently pulls the instant back to UTC midnight instead.
 */
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day) - OFFSET_MS);
}

/**
 * Formats a UTC instant as the "YYYY-MM-DD" calendar date it falls on
 * in IST — NOT the executing environment's local calendar.
 *
 * IMPORTANT: do not use Date#getFullYear/getMonth/getDate here. Those
 * read the host's local timezone, so the same instant formats as a
 * different (often one-day-off) string depending on whether it runs in
 * a browser set to IST or a server defaulting to UTC — which then
 * round-trips back through parseLocalDate as the wrong day entirely.
 */
function formatLocalDate(date: Date): string {
  const shifted = new Date(date.getTime() + OFFSET_MS);
  const yyyy = shifted.getUTCFullYear();
  const mm = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(shifted.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Birthday is Day 5.
 *
 * Example:
 * birthday = 2026-09-27
 *
 * Day 1 = Sep 23
 * Day 2 = Sep 24
 * Day 3 = Sep 25
 * Day 4 = Sep 26
 * Day 5 = Sep 27
 */
export function buildUnlockSchedule(
  birthdayDate: string | null | undefined,
): UnlockSchedule[] {
  // Fallback (birthdayDate not set) snaps "now" down to IST midnight of
  // today via the same fixed-offset path, rather than using the host's
  // raw local "now" as an anchor.
  const birthday = birthdayDate
    ? parseLocalDate(birthdayDate)
    : parseLocalDate(formatLocalDate(new Date()));

  const schedule: UnlockSchedule[] = [];

  for (let dayNumber = 1; dayNumber <= 5; dayNumber++) {
    // Day 5 = birthday, Day 4 = birthday - 1, ..., Day 1 = birthday - 4.
    const offsetDays = 5 - dayNumber;
    const unlock = new Date(birthday.getTime() - offsetDays * DAY_MS);

    schedule.push({
      dayNumber: dayNumber as 1 | 2 | 3 | 4 | 5,
      unlockDate: formatLocalDate(unlock),
    });
  }

  return schedule;
}

export function isUnlockDateReached(
  unlockDate: string,
  now: Date = new Date(),
): boolean {
  const unlock = parseLocalDate(unlockDate);
  return now.getTime() >= unlock.getTime();
}

/**
 * Milliseconds until the next IST midnight (not the host's local
 * midnight — see the note on formatLocalDate above for why that
 * distinction matters).
 */
export function msUntilNextMidnight(
  now: Date = new Date(),
): number {
  const todayIso = formatLocalDate(now);
  const todayMidnight = parseLocalDate(todayIso);
  const nextMidnight = new Date(todayMidnight.getTime() + DAY_MS);

  return Math.max(0, nextMidnight.getTime() - now.getTime());
}

/**
 * Milliseconds until a particular unlock date.
 */
export function msUntilUnlock(
  unlockDate: string,
  now: Date = new Date(),
): number {
  const unlock = parseLocalDate(unlockDate);
  return Math.max(0, unlock.getTime() - now.getTime());
}

/**
 * Get the exact birthday midnight timestamp (IST), as a fixed UTC
 * instant — consistent whether evaluated in the browser or on the
 * server, regardless of either one's local timezone.
 *
 * IMPORTANT:
 * Do not use new Date("2026-09-27")
 * because that is interpreted as UTC midnight, not IST midnight.
 */
export function getBirthdayMidnight(
  birthdayDate: string,
): Date {
  return parseLocalDate(birthdayDate);
}

/**
 * Countdown values for the birthday.
 */
export function getBirthdayCountdown(
  birthdayDate: string,
  now: Date = new Date(),
) {
  const target = getBirthdayMidnight(birthdayDate);

  const remaining = Math.max(
    0,
    target.getTime() - now.getTime()
  );

  const totalSeconds = Math.floor(
    remaining / 1000
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds: remaining,
    isBirthday:
      now.getTime() >= target.getTime(),
  };
}