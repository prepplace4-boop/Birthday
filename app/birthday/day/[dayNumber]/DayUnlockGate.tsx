"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAllDays } from "@/lib/api/store";

export default function DayUnlockGate({
  dayNumber,
  isAdminPreview,
  children,
}: {
  dayNumber: number;
  isAdminPreview: boolean;
  children: React.ReactNode;
}) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    // Just poll periodically rather than trying to schedule an update for
    // "the next local midnight". The real unlock instant is midnight IST
    // (see lib/unlock.ts), which does not line up with the visitor's own
    // browser-local midnight — a visitor in another timezone would get an
    // update scheduled for the wrong moment. Polling every 30s is simpler
    // and can't drift out of sync with the server's schedule; the actual
    // unlock decision below is delegated to the store either way.
    const intervalId = setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);

    return () => clearInterval(intervalId);
  }, []);

  const now = useMemo(() => new Date(nowMs), [nowMs]);

  // Single source of truth: the same birthdayDate-anchored, IST-pinned
  // schedule the server uses in ensureDayUnlocked (via store.ts / unlock.ts).
  // Do NOT recompute unlock timing independently here — a second, separate
  // definition of "unlocked" is exactly how this component ended up
  // disagreeing with the server-rendered gate and with the homepage list.
  const day = useMemo(() => {
    const list = getAllDays(now);
    return list.find((d) => d.dayNumber === dayNumber);
  }, [dayNumber, now]);

  const unlocked = isAdminPreview || Boolean(day?.isUnlocked);

  if (!unlocked) {
    const teaser =
      day?.teaser ?? "This chapter is still sealed. Come back soon.";

    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
        <div className="w-full max-w-xl rounded-[30px] border border-stone-200 bg-white/70 p-8 text-center shadow-[0_25px_60px_rgba(91,62,43,0.10)] backdrop-blur-sm">
          <p className="font-display text-2xl italic text-rose-500">
            day {dayNumber}
          </p>

          <h1 className="mt-4 font-display text-4xl text-stone-800">
            Locked for now
          </h1>

          <p className="mt-4 text-base leading-7 text-stone-600">
            {teaser}
          </p>

          <Link
            href="/birthday"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Back to the journey
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}