"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getAllDays,
  isDayUnlockedAt,
} from "@/lib/api/store";

export default function DayUnlockGate({
  dayNumber,
  isAdminPreview,
  children,
}: {
  dayNumber: number;
  isAdminPreview: boolean;
  children: React.ReactNode;
}) {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const now = Date.now();
      setNowMs(now);
      const next = new Date();
      next.setHours(24, 0, 0, 50);
      const delay = Math.max(1000, next.getTime() - now);
      timeoutId = setTimeout(tick, delay);
    };

    tick();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const unlocked = useMemo(() => {
    if (isAdminPreview) return true;
    return isDayUnlockedAt(dayNumber, new Date(nowMs));
  }, [isAdminPreview, dayNumber, nowMs]);

  const day = useMemo(() => {
    const list = getAllDays(new Date(nowMs));
    return list.find((d) => d.dayNumber === dayNumber);
  }, [dayNumber, nowMs]);

  if (!unlocked) {
    const teaser =
      day?.teaser ??
      "This chapter is still sealed. Come back when the clock strikes midnight.";
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] px-4 py-10 text-stone-800">
        <div className="w-full max-w-xl rounded-[30px] border border-stone-200 bg-white/70 p-8 text-center shadow-[0_25px_60px_rgba(91,62,43,0.10)] backdrop-blur-sm">
          <p className="font-display text-2xl italic text-rose-500">
            day {dayNumber}
          </p>
          <h1 className="mt-4 font-display text-4xl text-stone-800">
            Locked for now
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-600">{teaser}</p>
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
