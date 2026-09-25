"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface MuseumEntranceProps {
  onEnter: () => void;
  entered: boolean;
}

function useTodayLong() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = window.setTimeout(() => setNow(new Date()), 1000);
    return () => window.clearTimeout(t);
  }, []);

  return useMemo(
    () =>
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [now],
  );
}

export function MuseumEntrance({
  onEnter,
  entered,
}: MuseumEntranceProps) {
  const today = useTodayLong();

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: `${(i * 53) % 100}%`,
        top: `${(i * 29 + 11) % 100}%`,
        size: (i % 3) + 2,
        delay: (i * 0.23) % 4,
        duration: 5 + (i % 5),
        drift: (i % 2 === 0 ? -1 : 1) * (6 + (i % 4) * 2),
      })),
    [],
  );

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <motion.section
          key="entrance"
          data-testid="museum-entrance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative isolate flex min-h-[100dvh] items-center overflow-hidden rounded-[32px] border border-rose-200/60 bg-[radial-gradient(circle_at_top,_#fff4e8_0%,_#f9e6cf_32%,_#f1d1cc_68%,_#eccfc6_100%)] px-5 py-16 shadow-[0_28px_90px_-30px_rgba(124,90,72,0.3)] sm:px-10 sm:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.38 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: "multiply",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/4 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[#f6b9a8]/30 blur-3xl"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-full bg-[#e0b27a]/25 blur-3xl"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute block rounded-full bg-[#c9a25a]"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  opacity: 0.55,
                  boxShadow: "0 0 10px rgba(201,162,90,0.55)",
                }}
                animate={{
                  y: [0, p.drift, 0],
                  opacity: [0.18, 0.6, 0.18],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a25a]/50 bg-white/60 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#8a6233] shadow-[0_10px_30px_-16px_rgba(201,162,90,0.7)] backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Day 04 · Presented by Hardik
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="mt-8 text-[10px] font-medium uppercase tracking-[0.5em] text-stone-600 sm:text-xs"
            >
              Welcome To
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.22,
                ease: "easeOut",
              }}
              className="mt-2 font-display text-5xl leading-[0.95] tracking-tight text-stone-800 sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The Museum of
              <span className="relative mx-2 inline-block text-rose-600">
                <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-[#c9a25a]" />
                You
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.5,
                ease: "easeOut",
              }}
              className="mt-6 max-w-2xl font-display text-xl italic text-stone-700 sm:text-2xl"
            >
              A collection of the little things that make you, you.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="mt-3 text-sm tracking-wide text-stone-600 sm:text-base"
            >
              Curated with an unreasonable amount of love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                ease: "easeOut",
              }}
              className="mt-10 w-full max-w-xl"
            >
              <div className="group relative overflow-hidden rounded-[22px] border border-[#c9a25a]/60 bg-[linear-gradient(135deg,#fffdf6,#fdf0d5_58%,#fbe0aa)] p-5 shadow-[0_18px_60px_-26px_rgba(201,162,90,0.6)] sm:p-6">
                <div className="absolute -left-3 top-6 h-8 w-8 rounded-full border border-rose-200/60 bg-[#fff7f0] shadow-inner" />
                <div className="absolute -right-3 top-6 h-8 w-8 rounded-full border border-rose-200/60 bg-[#fff7f0] shadow-inner" />

                <div className="mx-5 flex items-center gap-3">
                  <Ticket className="h-6 w-6 text-rose-600/80" />

                  <p className="text-[10px] uppercase tracking-[0.32em] text-stone-600">
                    Museum Admission · One Time Use
                  </p>
                </div>

                <dl className="mx-5 mt-4 grid grid-cols-2 gap-y-3 text-left text-sm">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                      Visitor
                    </dt>
                    <dd className="mt-0.5 font-display text-lg text-stone-800">
                      You
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                      Exhibition
                    </dt>
                    <dd className="mt-0.5 font-display text-lg text-stone-800">
                      The Museum of You
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                      Curator
                    </dt>
                    <dd className="mt-0.5 font-display text-lg text-stone-800">
                      Me
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                      Date
                    </dt>
                    <dd className="mt-0.5 truncate font-display text-lg text-stone-800">
                      {today}
                    </dd>
                  </div>
                </dl>

                <div
                  aria-hidden
                  className="mx-5 mt-4 h-px w-[calc(100%-40px)] bg-gradient-to-r from-transparent via-stone-400/40 to-transparent"
                />

                <p className="mx-5 mt-3 text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  Admit One · No Re-entry Required · You are always welcome
                  here.
                </p>
              </div>
            </motion.div>

            <motion.button
              type="button"
              onClick={onEnter}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{
                duration: 0.7,
                delay: 1.15,
                ease: "easeOut",
              }}
              className={cn(
                "group/btn mt-10 inline-flex items-center gap-3 rounded-full border border-rose-300/60 bg-[linear-gradient(135deg,#ff385c,#e62148)] px-8 py-3.5 text-sm font-medium text-white shadow-[0_20px_45px_-18px_rgba(230,33,72,0.55)]",
                "sm:px-10 sm:py-4 sm:text-base",
              )}
            >
              Enter The Museum

              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-1">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </motion.button>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}