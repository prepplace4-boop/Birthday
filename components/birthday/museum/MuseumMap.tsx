"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type MuseumRoomMeta = {
  number: number;
  id: string;
  title: string;
  tagline: string;
};

const ROOMS: readonly MuseumRoomMeta[] = [
  {
    number: 1,
    id: "room-01",
    title: "The Things That Make You, You",
    tagline: "Portrait gallery · little fragments of a person",
  },
  {
    number: 2,
    id: "room-02",
    title: "Things You Don't Notice",
    tagline: "An intimate observation archive",
  },
  {
    number: 3,
    id: "room-03",
    title: "The Unofficial Hall of Fame",
    tagline: "Awards · Commendations · With love",
  },
  {
    number: 4,
    id: "room-04",
    title: "The Kesar Research Department",
    tagline: "Classified findings · Highly recommended",
  },
  {
    number: 5,
    id: "room-05",
    title: "Things I Like About You",
    tagline: "Quiet appreciation wing",
  },
  {
    number: 6,
    id: "room-06",
    title: "The Final Portrait",
    tagline: "Interactive portrait · Find every little thing",
  },
];

function scrollToRoom(id: string) {
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

export function MuseumMap() {
  return (
    <motion.section
      data-testid="museum-map"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-[linear-gradient(135deg,#fff8ed_0%,#fbead0_42%,#f7dcc3_100%)] px-5 py-10 shadow-[0_18px_60px_-30px_rgba(124,90,72,0.25)] sm:px-10 sm:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.31  0 0 0 0 0.22  0 0 0 0.34 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />

      <header className="relative mx-auto max-w-3xl text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-rose-500/80">
          Floor · Plan
        </p>

        <h2 className="mt-2 font-display text-4xl leading-tight text-stone-800 sm:text-5xl md:text-6xl">
          Your Exhibition Awaits
        </h2>

        <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
          Six little rooms. A whole lot of thought. Walk through them in any
          order you like — Room 06 saves something special for the end.
        </p>
      </header>

      <div className="relative mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room, idx) => {
          const padded = String(room.number).padStart(2, "0");

          return (
            <motion.a
              key={room.id}
              data-testid="museum-plaque"
              href={`#${room.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToRoom(room.id);
              }}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: Math.min(idx * 0.07, 0.42),
              }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "group/plaque relative block overflow-hidden rounded-2xl border border-stone-200/80 bg-[linear-gradient(160deg,#fffdf7,#fdeed5_68%,#f9e3c0)] p-5 shadow-[0_12px_40px_-22px_rgba(124,90,72,0.4)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbead0]",
              )}
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#c9a25a]/15 blur-2xl" />

              <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[#ff385c]/10 blur-2xl" />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-rose-500/80">
                    Room {padded}
                  </p>

                  <h3 className="mt-1 font-display text-2xl leading-snug text-stone-800 group-hover/plaque:text-rose-600 sm:text-[1.6rem]">
                    {room.title}
                  </h3>
                </div>

                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c9a25a]/50 bg-[linear-gradient(135deg,#fff7e6,#f9e5c3)] text-xs font-semibold text-[#8a6233] shadow-[0_8px_20px_-10px_rgba(201,162,90,0.7)] sm:h-12 sm:w-12 sm:text-sm">
                  {padded}
                </span>
              </div>

              <div className="relative mt-5 flex items-center gap-3 border-t border-stone-200/70 pt-4">
                <MapPin className="h-4 w-4 text-rose-500/80" />

                <p className="text-xs leading-6 text-stone-600">
                  {room.tagline}
                </p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.section>
  );
}