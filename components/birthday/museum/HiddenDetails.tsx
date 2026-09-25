"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Sparkles } from "lucide-react";
import { ImageWithFallback } from "@/components/birthday/image-with-fallback";
import { museumHiddenDetails } from "@/lib/museum-data";
import { MuseumProgress } from "./MuseumProgress";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "museum-of-you:hidden-details:v1";

interface HiddenDetailsProps {
  onAllFound?: () => void;
  allowReveal?: boolean;
  onSkipToFinal?: () => void;
}

function PortraitPlaceholder() {
  return (
    <div className="relative flex h-full min-h-[460px] w-full items-center justify-center overflow-hidden rounded-[24px] border border-stone-200/80 bg-[radial-gradient(circle_at_top,_#fff2e3,_#f6cfa8_58%,_#e8a496)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.44  0 0 0 0 0.29  0 0 0 0 0.22  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div
        aria-hidden
        className="absolute inset-8 rounded-[26px] border border-dashed border-white/60"
      />

      <div className="relative z-10 max-w-md px-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-[#6d3b2a]">
          Gallery Portrait
        </p>

        <p className="mt-4 font-display text-3xl leading-tight text-stone-800 sm:text-4xl">
          A picture of you that I carry in my head.
        </p>

        <p className="mt-4 text-sm leading-7 text-[#5a3325]">
          There is no file here yet — the real one only exists in person.
          Click the dots around this frame to find every little thing I notice.
        </p>
      </div>
    </div>
  );
}

export function HiddenDetails({
  onAllFound,
  allowReveal,
  onSkipToFinal,
}: HiddenDetailsProps) {
  const total = museumHiddenDetails.length;

  const [discovered, setDiscovered] = useState<ReadonlySet<string>>(() => {
    if (typeof window === "undefined") return new Set();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) return new Set();

      const parsed = JSON.parse(raw) as unknown;

      if (Array.isArray(parsed)) {
        return new Set(parsed.map((x) => String(x)));
      }
    } catch {
      /* ignore */
    }

    return new Set();
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(discovered)),
      );
    } catch {
      /* ignore */
    }
  }, [discovered]);

  const foundCount = discovered.size;
  const allFound = foundCount >= total;

  useEffect(() => {
    if (allFound && onAllFound) {
      const t = window.setTimeout(() => onAllFound(), 900);

      return () => window.clearTimeout(t);
    }
  }, [allFound, onAllFound]);

  const toggle = useCallback((id: string) => {
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;

      const next = new Set(prev);
      next.add(id);

      return next;
    });

    setActiveTooltip((current) => (current === id ? null : id));
  }, []);

  const progressLabel = useMemo(
    () => `${foundCount} / ${total} DETAILS DISCOVERED`,
    [foundCount, total],
  );

  void progressLabel;

  return (
    <div data-testid="hidden-details" className="space-y-6">
      <MuseumProgress found={foundCount} total={total} />

      <div className="relative overflow-visible rounded-[28px] border border-stone-200/80 bg-[linear-gradient(155deg,#fffaf1_0%,#fbe9cc_50%,_#f3d5bb_100%)] p-4 shadow-[0_20px_70px_-28px_rgba(124,90,72,0.35)] sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-white/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.28em] text-rose-500 shadow-[0_8px_24px_-18px_rgba(217,36,74,0.45)]">
              <Eye className="h-3.5 w-3.5" />
              Interactive Portrait
            </span>

            <p className="text-xs leading-6 text-stone-600 sm:text-sm">
              Tap every little glowing dot. There are {total}.
            </p>
          </div>

          {allowReveal && !allFound ? (
            <button
              type="button"
              onClick={onSkipToFinal}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9a25a]/50 bg-white/70 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[#8a6233] hover:bg-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Admin · Skip to Final
            </button>
          ) : null}
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-4xl overflow-visible sm:aspect-[16/10]">
          {/* Portrait */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-[#c9a25a]/50 shadow-[0_22px_70px_-24px_rgba(124,90,72,0.5)] ring-4 ring-white/70">
            <ImageWithFallback
              src="/day-4/finalimg.jpg"
              alt="A portrait from the museum"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />

            <noscript>
              <PortraitPlaceholder />
            </noscript>
          </div>

          {/* Portrait vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[24px]"
            style={{
              boxShadow:
                "inset 0 0 120px 20px rgba(60, 30, 20, 0.18)",
            }}
          />

          {museumHiddenDetails.map((detail, idx) => {
            const found = discovered.has(detail.id);
            const isActive = activeTooltip === detail.id;

            /*
             * Keep tooltip cards inside the portrait.
             *
             * Left-side hotspots:
             *   tooltip starts from the hotspot.
             *
             * Right-side hotspots:
             *   tooltip is anchored to the right of the hotspot.
             *
             * Middle hotspots:
             *   tooltip stays centered.
             */
            const tooltipPosition =
              detail.x >= 75
                ? "right-0"
                : detail.x <= 25
                  ? "left-0"
                  : "left-1/2 -translate-x-1/2";

            const verticalPosition =
              detail.y > 68
                ? "bottom-full mb-4"
                : "top-full mt-4";

            return (
              <div
                key={detail.id}
                className="absolute z-30"
                style={{
                  left: `${detail.x}%`,
                  top: `${detail.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Hotspot */}
                <button
                  type="button"
                  onClick={() => toggle(detail.id)}
                  aria-label={`Discover detail number ${idx + 1}`}
                  aria-expanded={isActive}
                  className={cn(
                    "group/hot grid relative h-10 w-10 place-items-center rounded-full border transition-all",
                    "sm:h-11 sm:w-11",
                    found
                      ? "border-rose-400 bg-rose-500/15 shadow-[0_0_16px_-4px_rgba(217,36,74,0.55)]"
                      : "border-white bg-white/25 shadow-[0_0_24px_-6px_rgba(255,255,255,0.7),0_0_0_2px_rgba(217,36,74,0.12)_inset]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3d5bb]",
                  )}
                >
                  {!found ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-rose-500/35"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.55, 0.05, 0.55],
                      }}
                      transition={{
                        duration: 2.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (idx % 7) * 0.18,
                      }}
                    />
                  ) : null}

                  <span className="relative grid h-4 w-4 place-items-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
                    {found ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-rose-600" />
                    ) : (
                      <span className="block h-2 w-2 rounded-full bg-rose-500" />
                    )}
                  </span>
                </button>

                {/* Detail message */}
                <AnimatePresence>
                  {isActive ? (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.28,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "pointer-events-auto absolute z-[100]",
                        "w-[220px] max-w-[calc(100vw-32px)]",
                        "sm:w-[270px]",
                        tooltipPosition,
                        verticalPosition,
                      )}
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[linear-gradient(160deg,#fffdf7,#fce9cf)] px-4 py-3 shadow-[0_18px_50px_-20px_rgba(124,90,72,0.45)]">
                        {/* Paper texture */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-[0.12]"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.92' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0.36 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                            mixBlendMode: "multiply",
                          }}
                        />

                        <p className="relative whitespace-normal break-words text-[10px] uppercase tracking-[0.26em] text-rose-500">
                          {detail.heading}
                        </p>

                        <p className="relative mt-2 whitespace-normal break-words text-sm leading-6 text-stone-800">
                          {detail.message}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Final curator message */}
        <AnimatePresence>
          {allFound ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-[22px] border border-[#c9a25a]/50 bg-[linear-gradient(135deg,#fff7e6,#fae1b3)] p-5 text-center shadow-[0_14px_40px_-18px_rgba(201,162,90,0.7)] sm:p-6"
            >
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a5a2a]">
                Curator&apos;s note
              </p>

              <p className="mx-auto mt-3 max-w-2xl font-display text-2xl leading-tight text-stone-800 sm:text-3xl">
                You found every single one. I know. I noticed. I always do.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}