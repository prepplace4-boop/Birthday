"use client";

import { motion } from "framer-motion";
import { Flower2, Heart, Sparkles, Star } from "lucide-react";
import { ImageWithFallback } from "@/components/birthday/image-with-fallback";
import { dayFiveLetter } from "@/lib/museum-data";
import type { DayFiveLetterSection } from "@/lib/museum-data";

function HighlightDil({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-xl text-center font-display italic text-2xl leading-tight text-rose-600 sm:text-3xl"
    >
      {text}
    </motion.p>
  );
}

function HighlightMore({ text }: { text: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto max-w-xl overflow-hidden rounded-[22px] border border-[#c9a25a]/60 bg-[linear-gradient(135deg,#fff5ea,#fde3d0_58%,#f9cfc1)] px-5 py-6 text-center shadow-[0_14px_40px_-20px_rgba(217,36,74,0.3)] sm:px-8 sm:py-7"
    >
      <Heart
        className="mx-auto mb-3 h-7 w-7 text-rose-500 sm:h-8 sm:w-8"
        aria-hidden
      />

      <blockquote className="font-display text-xl leading-tight text-stone-800 sm:text-2xl">
        {text}
      </blockquote>
    </motion.figure>
  );
}

function HighlightMatter({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto max-w-xl text-center font-display text-2xl leading-tight text-stone-800 sm:text-3xl"
    >
      {text}
    </motion.p>
  );
}

function HighlightThankYou({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, scale: 0.99 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center font-display italic text-2xl leading-snug text-[#6d3b2a] sm:text-3xl"
    >
      <Sparkles
        className="mr-1 inline h-5 w-5 text-[#c9a25a] align-middle"
        aria-hidden
      />
      {text}
    </motion.p>
  );
}

function Closing({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.7 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center text-base leading-7 text-stone-700 sm:text-lg sm:leading-8"
    >
      {text}
    </motion.p>
  );
}

function LetterSection({
  section,
  index,
}: {
  section: DayFiveLetterSection;
  index: number;
}) {
  const stagger = Math.min(0.04 * index, 0.3);

  if (section.kind === "heading") {
    return (
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: stagger,
        }}
        className="text-center text-[10px] uppercase tracking-[0.34em] text-rose-500/90 sm:text-xs"
      >
        {section.text}
      </motion.h3>
    );
  }

  if (section.kind === "body") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
          delay: stagger,
        }}
        className="mx-auto max-w-2xl text-center text-[14px] leading-7 text-stone-700 sm:text-[15px] sm:leading-8"
      >
        {section.text}
      </motion.p>
    );
  }

  if (section.kind === "highlight-dil") {
    return <HighlightDil text={section.text} />;
  }

  if (section.kind === "highlight-moreSpecial") {
    return <HighlightMore text={section.text} />;
  }

  if (section.kind === "highlight-matter") {
    return <HighlightMatter text={section.text} />;
  }

  if (section.kind === "highlight-thankYou") {
    return <HighlightThankYou text={section.text} />;
  }

  if (section.kind === "closing") {
    return <Closing text={section.text} />;
  }

  return null;
}

/**
 * Day 5 final letter / scrapbook section.
 *
 * Layout:
 * - Left side: complete letter
 * - Right side: main scrapbook image
 * - Right side lower area: second memory image
 * - No oversized empty section
 * - Second image begins slightly lower to create a natural scrapbook flow
 */
export function DayFiveScrapbookLetter() {
  const pills = dayFiveLetter.pillLines;

  return (
    <motion.section
      data-testid="day-five-scrapbook"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[30px] border border-rose-200/80 bg-[radial-gradient(circle_at_top_left,#fff9f4_0%,#fff3ea_30%,#fce6e3_72%,#f8d8d3_100%)] px-4 py-6 shadow-[0_20px_70px_-30px_rgba(144,72,56,0.35)] sm:px-7 sm:py-8 lg:px-9 lg:py-9"
    >
      {/* Paper texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.33  0 0 0 0 0.33  0 0 0 0.34 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:gap-10">
        {/* =====================================================
            LEFT — LETTER
        ====================================================== */}
        <div
          data-testid="day5-letter"
          className="relative z-10 order-2 lg:order-1"
        >
          {/* Heading */}
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] uppercase tracking-[0.34em] text-rose-500 sm:text-xs"
            >
              A little something before the final chapter...
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1,
                ease: "easeOut",
              }}
              className="font-display text-4xl leading-[0.98] tracking-tight text-stone-800 sm:text-5xl md:text-6xl"
            >
              The Final Chapter
            </motion.h2>

            {/* Compact pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-1.5 pt-1"
            >
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-rose-300/60 bg-white/65 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.16em] text-stone-600 sm:px-3 sm:py-1.5 sm:text-[9px]"
                >
                  {pill}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Letter */}
          <div className="mt-7 space-y-5 sm:mt-8 sm:space-y-6">
            {dayFiveLetter.sections.map((section, index) => (
              <LetterSection
                key={`${section.kind}-${index}`}
                section={section}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* =====================================================
            RIGHT — MEMORY COLUMN
        ====================================================== */}
        <div
          data-testid="day5-collage"
          className="relative z-10 order-1 flex flex-col items-center lg:order-2"
        >
          {/* =================================================
              FIRST MEMORY — MAIN SCRAPBOOK
          ================================================== */}
          <div className="relative flex w-full justify-center pt-8 sm:pt-10">
            {/* Paper background */}
            <div
              aria-hidden
              className="absolute inset-x-1 bottom-0 top-8 rounded-[26px] border border-rose-200/70 bg-[linear-gradient(155deg,#fffaf5,#f9ddd0_55%,#efc4bb)] shadow-[0_22px_65px_-28px_rgba(144,72,56,0.42)] sm:top-10"
            />

            {/* Dashed inner border */}
            <div
              aria-hidden
              className="absolute inset-x-4 bottom-4 top-12 rounded-[22px] border border-dashed border-white/70 sm:inset-x-6 sm:top-14"
            />

            {/* Top tape */}
            <div
              aria-hidden
              className="absolute left-1/2 top-3 z-30 h-6 w-24 -translate-x-1/2 -rotate-3 bg-[linear-gradient(180deg,rgba(255,232,176,0.94),rgba(246,208,140,0.85))] shadow-[0_4px_14px_-4px_rgba(140,90,40,0.3)]"
            />

            {/* Small label */}
            <div
              aria-hidden
              className="absolute left-3 top-20 z-30 -rotate-12 rounded-full border border-[#c9a25a]/60 bg-[#fff7e6]/90 px-3 py-1 text-[9px] font-display italic text-[#7a4f25] shadow-sm"
            >
              little love letter
            </div>

            {/* Main scrapbook image */}
            <motion.figure
              initial={{
                opacity: 0,
                y: 18,
                rotate: -4,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: -2,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="relative z-20 mt-5 w-[84%] max-w-[390px] overflow-hidden rounded-[18px] border-[7px] border-white bg-white shadow-[0_24px_55px_-20px_rgba(90,55,45,0.48)] sm:mt-7 sm:w-[82%]"
            >
              <div className="relative mx-auto mt-7 w-[92%] overflow-hidden rounded-[20px] border-[5px] border-white bg-stone-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] sm:mt-9">
                <ImageWithFallback
                  src="/day-5/optimized/Scrapbook.webp"
                  alt="A favourite memory"
                  width={720}
                  height={1960}
                  loading="eager"
                  className="block h-auto w-full object-cover"
                />
              </div>

              <figcaption className="bg-white px-3 py-3 text-center font-display text-xs italic text-stone-500">
                a little piece of this journey
              </figcaption>
            </motion.figure>

            {/* Main image decorations */}
            <div
              aria-hidden
              className="absolute bottom-5 left-5 z-30 flex -rotate-6 items-center gap-1.5"
            >
              <Star className="h-4 w-4 fill-[#c9a25a] text-[#c9a25a]" />
              <Star className="h-3 w-3 fill-[#e0b96a] text-[#e0b96a]" />
              <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
            </div>

            <div
              aria-hidden
              className="absolute bottom-9 right-5 z-30"
            >
              <Flower2 className="h-7 w-7 fill-rose-300/40 text-rose-500/80" />
            </div>

            <Sparkles
              aria-hidden
              className="absolute right-5 top-28 z-30 h-5 w-5 text-[#c9a25a]"
            />
          </div>

          {/* =================================================
              SECOND MEMORY — STARTS LOWER ON THE RIGHT
          ================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 45,
              rotate: 2,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="relative mt-20 w-full max-w-[430px] self-end sm:mt-24 lg:mt-28"
          >
            {/* Background paper */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-[28px] border border-rose-200/70 bg-[linear-gradient(145deg,#fff9f5_0%,#fde8e1_48%,#f8d5d0_100%)] shadow-[0_24px_65px_-28px_rgba(144,72,56,0.42)]"
            />

            {/* Dashed border */}
            <div
              aria-hidden
              className="absolute inset-4 rounded-[22px] border border-dashed border-white/80"
            />

            {/* Tape */}
            <div
              aria-hidden
              className="absolute left-1/2 top-[-12px] z-30 h-7 w-28 -translate-x-1/2 -rotate-2 bg-[linear-gradient(180deg,rgba(255,232,176,0.95),rgba(246,208,140,0.85))] shadow-[0_4px_14px_-4px_rgba(140,90,40,0.3)]"
            />

            {/* Heading */}
            <div className="relative z-10 px-5 pb-4 pt-9 text-center sm:px-7">
              <p className="text-[10px] uppercase tracking-[0.38em] text-rose-500 sm:text-xs">
                one more memory
              </p>

              <h3 className="mt-2 font-display text-2xl leading-tight text-stone-800 sm:text-3xl">
                Because one picture
                <br />
                wasn&apos;t enough.
              </h3>
            </div>

            {/* Second image */}
            <motion.figure
              initial={{
                opacity: 0,
                y: 20,
                rotate: -4,
                scale: 0.96,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: -2,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="relative z-10 mx-auto mb-7 w-[82%] overflow-hidden rounded-[18px] border-[8px] border-white bg-white p-1 shadow-[0_28px_65px_-25px_rgba(90,55,45,0.5)] sm:w-[78%]"
            >
               <div className="relative mx-auto mt-7 w-[92%] overflow-hidden rounded-[20px] border-[5px] border-white bg-stone-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] sm:mt-9">
                <ImageWithFallback
                  src="/day-5/optimized/Birthday.webp"
                  alt="A favourite memory"
                  width={720}
                  height={1960}
                  loading="eager"
                  className="block h-auto w-full object-cover"
                />
              </div>

              <figcaption className="px-3 pb-2 pt-4 text-center font-display text-sm italic text-stone-500 sm:text-base">
                one more little piece of this journey
              </figcaption>
            </motion.figure>

            {/* Decorations */}
            <Star
              aria-hidden
              className="absolute bottom-8 left-7 z-20 h-6 w-6 fill-[#c9a25a] text-[#c9a25a]"
            />

            <Heart
              aria-hidden
              className="absolute bottom-9 right-8 z-20 h-6 w-6 fill-rose-400 text-rose-400"
            />

            <Sparkles
              aria-hidden
              className="absolute right-7 top-[42%] z-20 h-6 w-6 text-[#c9a25a]"
            />
          </motion.div>

          {/* Made for you sticker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{
              duration: 0.6,
              delay: 0.9,
              ease: "easeOut",
            }}
            className="relative z-40 -mt-4 mb-2 self-end"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-[linear-gradient(135deg,#ff385c,#e62148)] px-4 py-2 text-white shadow-[0_14px_35px_-16px_rgba(217,36,74,0.65)]">
              <Heart className="h-3.5 w-3.5 fill-current" />

              <span className="text-[10px] font-display italic sm:text-xs">
                made for you.
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}