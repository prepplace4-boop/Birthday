'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getAllDays, getSettings } from "@/lib/api/store";
import { getBirthdayCountdown } from "@/lib/unlock";

export default function BirthdayHomePage() {
  const settings = getSettings();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const days = useMemo(() => getAllDays(new Date(now)), [now]);
  const firstUnlocked = useMemo(
    () => days.find((d) => d.isUnlocked) ?? days[0],
    [days],
  );

  const countdownRaw = getBirthdayCountdown(settings.birthdayDate, new Date(now));
  const countdown = {
    days: countdownRaw.days,
    hours: countdownRaw.hours,
    minutes: countdownRaw.minutes,
    seconds: countdownRaw.seconds,
    isPast: countdownRaw.isBirthday,
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf3ea_0%,_#f3e6d6_32%,_#e7d8b9_100%)] text-stone-800">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative isolate overflow-hidden rounded-[36px] border border-rose-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(255,247,240,0.92),rgba(249,231,212,0.84))] p-6 shadow-[0_24px_90px_rgba(124,90,72,0.12)] backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute bottom-6 left-8 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute right-10 top-20 h-24 w-24 rounded-full border border-white/60 bg-white/15" />

          <div className="relative">
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08, duration: 0.38 }}
              className="font-display text-lg italic text-rose-500"
            >
              for {settings.herName}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5 }}
              className="mt-4 max-w-3xl font-display text-4xl leading-[0.82] tracking-[-0.06em] text-stone-800 sm:text-5xl lg:text-6xl"
            >
              A little five-day birthday story
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg"
            >
              {settings.introText}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {firstUnlocked ? (
                <Link
                  href={`/birthday/day/${firstUnlocked.dayNumber}`}
                  className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-700"
                >
                  Open {firstUnlocked.title}
                </Link>
              ) : null}
              <span className="rounded-full border border-stone-300 bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-stone-500">
                5 chapters
              </span>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-rose-600">
                personal archive
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 rounded-[28px] border border-white/70 bg-white/55 p-4 shadow-[0_16px_30px_rgba(91,62,43,0.04)] backdrop-blur-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">birthday countdown</p>
                  <p className="mt-2 font-display text-2xl text-stone-800">
                    {countdown.isPast ? 'It’s birthday time ✨' : 'Counting down to the big day'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Min', value: countdown.minutes },
                    { label: 'Sec', value: countdown.seconds },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="min-w-[72px] rounded-[18px] border border-stone-200 bg-stone-50 px-3 py-2 text-center"
                    >
                      <p className="font-display text-2xl leading-none text-stone-800">{String(item.value).padStart(2, '0')}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-stone-500">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {days.map((day, index) => {
            const isUnlocked = day.isUnlocked;
            const cardClasses = isUnlocked
              ? "border-rose-200/80 bg-white/70 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(91,62,43,0.08)]"
              : "border-stone-200 bg-stone-100/65 opacity-80";

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.38 }}
                className={`group relative h-full overflow-hidden rounded-[26px] border p-4 shadow-sm transition-all duration-200 ${cardClasses}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,214,205,0.30),transparent_48%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                      day {day.dayNumber}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.18em] ${isUnlocked ? "text-rose-500" : "text-stone-500"}`}>
                      {isUnlocked ? "unlocked" : "locked"}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl leading-tight text-stone-800">{day.title}</h2>
                  <p className="mt-2 text-sm text-stone-600">{day.subtitle || "A quiet little chapter."}</p>
                  <p className="mt-4 text-sm leading-6 text-stone-500">{day.teaser || "There is something waiting behind this door."}</p>
                </div>
              </motion.div>
            );

            if (!isUnlocked) {
              return <div key={day.id}>{card}</div>;
            }

            return (
              <Link key={day.id} href={`/birthday/day/${day.dayNumber}`} className="block h-full">
                {card}
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
