"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface FinalExhibitProps {
  forceOpen?: boolean;
}

export function FinalExhibit({ forceOpen = false }: FinalExhibitProps) {
  return (
    <AnimatePresence mode="wait">
      {forceOpen ? (
        <motion.section
          key="final-exhibit"
          data-testid="final-exhibit"
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.95, ease: "easeOut" }}
          className="relative isolate overflow-hidden rounded-[32px] border border-[#c9a25a]/40 bg-[radial-gradient(circle_at_top,_#fff4de_0%,_#f8d4bb_34%,_#f1b8a8_66%,_#e59f9b_100%)] px-5 py-20 shadow-[0_30px_90px_-28px_rgba(144,72,56,0.45)] sm:px-10 sm:py-28"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.36  0 0 0 0 0.22  0 0 0 0 0.22  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: "multiply",
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/3 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[#ff385c]/20 blur-3xl"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-10 h-[360px] w-[360px] rounded-full bg-[#c9a25a]/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: "easeOut" }}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a25a]/60 bg-white/65 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.32em] text-[#7a4f25] shadow-[0_10px_30px_-16px_rgba(201,162,90,0.7)] backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              End of Exhibition
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18, ease: "easeOut" }}
              className="mt-6 text-[11px] font-medium uppercase tracking-[0.55em] text-stone-700 sm:text-xs"
            >
              The Most Valuable Exhibit
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
              className="mt-6 flex flex-col items-center gap-3"
            >
              <Sparkles className="h-10 w-10 text-rose-600 sm:h-12 sm:w-12" />

              <p className="font-display text-7xl leading-none tracking-tight text-stone-800 drop-shadow-[0_2px_24px_rgba(255,255,255,0.35)] sm:text-8xl md:text-[9rem]">
                You.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
              className="mx-auto mt-10 max-w-2xl space-y-5 font-display text-xl leading-relaxed text-stone-800 sm:text-2xl sm:leading-relaxed"
            >
              <p>Some things belong in museums because they&apos;re rare.</p>

              <p>Some because they&apos;re beautiful.</p>

              <p>
                And some because they&apos;re impossible to replace.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.45 }}
              className="mt-10 text-sm uppercase tracking-[0.35em] text-stone-700 sm:text-base"
            >
              Exhibition complete.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.7,
                ease: "easeOut",
              }}
              className="mt-10 flex justify-center"
            >
              <Link
                href="/birthday/day/5"
                className="group/final inline-flex items-center gap-3 rounded-full border border-rose-300/70 bg-[linear-gradient(135deg,#ff385c,#d9244a)] px-8 py-3.5 text-sm font-medium text-white shadow-[0_22px_60px_-18px_rgba(217,36,74,0.7)] sm:px-10 sm:py-4 sm:text-base"
              >
                Continue To Day 5

                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover/final:translate-x-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}