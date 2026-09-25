"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MuseumEntrance } from "./MuseumEntrance";
import { MuseumMap } from "./MuseumMap";
import { MuseumRoom } from "./MuseumRoom";
import { PortraitGallery } from "./PortraitGallery";
import { HallOfFame } from "./HallOfFame";
import { ResearchDepartment } from "./ResearchDepartment";
import { AppreciationGallery } from "./AppreciationGallery";
import { HiddenDetails } from "./HiddenDetails";
import { FinalExhibit } from "./FinalExhibit";
import { Sparkles } from "lucide-react";
import {
  museumHiddenDetails,
  museumUnnoticedDetails,
} from "@/lib/museum-data";

interface MuseumOfYouProps {
  preview?: boolean;
}

export function MuseumOfYou({ preview = false }: MuseumOfYouProps) {
  const [entered, setEntered] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showRevealBanner, setShowRevealBanner] = useState(false);

  useEffect(() => {
    if (preview) {
      setShowRevealBanner(true);
    }
  }, [preview]);

  const allHiddenFound = showFinal;

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* MUSEUM ENTRANCE */}
      <MuseumEntrance
        entered={entered}
        onEnter={() => {
          setEntered(true);

          requestAnimationFrame(() => {
            const next = document.getElementById("museum-map-anchor");

            if (next) {
              next.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          });
        }}
      />

      <AnimatePresence mode="wait">
        {entered ? (
          <motion.div
            key="museum-body"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-10 sm:space-y-14"
          >
            <div id="museum-map-anchor" />

            {/* MUSEUM MAP */}
            <MuseumMap />

            {/* ROOM 01 */}
            <MuseumRoom
              id="room-01"
              roomNumber={1}
              title="The Things That Make You, You"
              subtitle="Nine little fragments. No photographs. Just the tiny things that somehow add up to you."
            >
              <PortraitGallery />
            </MuseumRoom>

            {/* ROOM 02 */}
            <MuseumRoom
              id="room-02"
              roomNumber={2}
              title="Things You Don't Notice"
              subtitle="An observational archive of tiny details. Things I notice, even when you think no one is looking."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {museumUnnoticedDetails.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: (idx % 3) * 0.1,
                    }}
                    className="relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[linear-gradient(155deg,#fffdf7,#f9e9c9)] px-5 py-5 shadow-[0_14px_40px_-24px_rgba(124,90,72,0.35)] sm:px-6 sm:py-6"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.15]"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.44  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.34 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                        mixBlendMode: "multiply",
                      }}
                    />

                    <p className="relative text-[10px] uppercase tracking-[0.28em] text-rose-500/80">
                      {item.label}
                    </p>

                    <p className="relative mt-3 font-display text-xl leading-snug text-stone-800 sm:text-[1.35rem]">
                      {item.text}
                    </p>
                  </motion.article>
                ))}
              </div>
            </MuseumRoom>

            {/* ROOM 03 */}
            <MuseumRoom
              id="room-03"
              roomNumber={3}
              title="The Unofficial Hall of Fame"
              subtitle="An affectionate awards ceremony. No actual trophies were made. All of them were won."
            >
              <HallOfFame />
            </MuseumRoom>

            {/* ROOM 04 */}
            <MuseumRoom
              id="room-04"
              roomNumber={4}
              title="The Kesar Research Department"
              subtitle="Classified, extensive, and at least 97.4% accurate according to science (sort of)."
            >
              <ResearchDepartment />
            </MuseumRoom>

            {/* ROOM 05 */}
            <MuseumRoom
              id="room-05"
              roomNumber={5}
              title="Things I Like About You"
              subtitle="Quietly. In no particular order. In roughly the order I thought of them."
            >
              <AppreciationGallery />
            </MuseumRoom>

            {/* ROOM 06 — ONLY IMAGE IN THE ENTIRE MUSEUM */}
            <MuseumRoom
              id="room-06"
              roomNumber={6}
              title="The Final Portrait"
              subtitle={`The last room is different. Find every glowing detail in the picture. There are ${museumHiddenDetails.length}.`}
            >
              <HiddenDetails
                onAllFound={() => setShowFinal(true)}
                allowReveal={showRevealBanner}
                onSkipToFinal={() => setShowFinal(true)}
              />
            </MuseumRoom>

            {/* FINAL EXHIBIT */}
            <AnimatePresence>
              {allHiddenFound ? (
                <FinalExhibit forceOpen />
              ) : null}
            </AnimatePresence>

            {/* ADMIN PREVIEW */}
            <AnimatePresence>
              {preview && !allHiddenFound ? (
                <motion.div
                  key="admin-footer"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="sticky bottom-4 z-40 mx-auto max-w-3xl px-2"
                >
                  <div className="flex items-center justify-between gap-3 rounded-full border border-[#c9a25a]/60 bg-[linear-gradient(135deg,#fff7e6,#fbe1b0)] px-4 py-3 shadow-[0_16px_40px_-20px_rgba(201,162,90,0.7)] sm:px-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#8a6233]" />

                      <p className="text-xs text-stone-700 sm:text-sm">
                        Admin preview mode. You can jump straight to the final
                        room.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowFinal(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-300/70 bg-[linear-gradient(135deg,#ff385c,#d9244a)] px-4 py-2 text-xs font-medium text-white shadow-[0_12px_28px_-16px_rgba(217,36,74,0.7)] sm:text-sm"
                    >
                      Skip to Final
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}