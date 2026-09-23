export type UnlockSchedule = { dayNumber: 1 | 2 | 3 | 4 | 5; unlockDate: string };

export function buildUnlockSchedule(
  reference: string | null | undefined,
): UnlockSchedule[] {
  const start = reference ? new Date(reference + "T00:00:00") : new Date();
  start.setHours(0, 0, 0, 0);
  const ms = start.getTime();
  const day = (offset: number) => {
    const d = new Date(ms + offset * 86400000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  return [
    { dayNumber: 1, unlockDate: day(0) },
    { dayNumber: 2, unlockDate: day(1) },
    { dayNumber: 3, unlockDate: day(2) },
    { dayNumber: 4, unlockDate: day(3) },
    { dayNumber: 5, unlockDate: day(4) },
  ];
}

export function isUnlockDateReached(
  unlockDate: string,
  now: Date = new Date(),
): boolean {
  const [y, m, d] = unlockDate.split("-").map((n) => parseInt(n, 10));
  const unlock = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  unlock.setHours(0, 0, 0, 0);
  return now.getTime() >= unlock.getTime();
}

export function msUntilNextMidnight(now: Date = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function msUntilUnlock(
  unlockDate: string,
  now: Date = new Date(),
): number {
  const [y, m, d] = unlockDate.split("-").map((n) => parseInt(n, 10));
  const unlock = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  unlock.setHours(0, 0, 0, 0);
  return Math.max(0, unlock.getTime() - now.getTime());
}
