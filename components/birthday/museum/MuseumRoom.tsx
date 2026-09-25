"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MuseumRoomProps {
  id: string;
  roomNumber: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function MuseumRoom({
  id,
  roomNumber,
  title,
  subtitle,
  children,
  className,
}: MuseumRoomProps) {
  const padded = String(roomNumber).padStart(2, "0");

  return (
    <section
      id={id}
      data-testid={`museum-room-${padded}`}
      className={cn(
        "relative scroll-mt-24 rounded-[28px] border border-stone-200/80",
        "bg-[radial-gradient(circle_at_top_left,_#fffdf8_0%,_#fff5ea_48%,_#fcefe0_100%)]",
        "shadow-[0_18px_60px_-30px_rgba(124,90,72,0.22)]",
        "px-5 py-8 sm:px-8 sm:py-12",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-[0.14]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.47  0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />

      <motion.header
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mb-8 flex flex-col gap-3 sm:mb-10"
      >
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#c9a25a]/50 bg-[linear-gradient(135deg,#fff7e6,#f9e5c3)] text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6233] shadow-[0_6px_18px_-10px_rgba(201,162,90,0.6)]"
          >
            {padded}
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-rose-500/80">
              Room · Gallery
            </p>
            <h2 className="mt-1 font-display text-3xl leading-tight text-stone-800 sm:text-4xl md:text-[2.5rem]">
              {title}
            </h2>
          </div>
        </div>

        {subtitle ? (
          <p className="max-w-2xl pl-1 text-sm leading-7 text-stone-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}

        <div
          aria-hidden
          className="mt-2 h-px w-full bg-gradient-to-r from-transparent via-stone-300/80 to-transparent"
        />
      </motion.header>

      <div className="relative">{children}</div>
    </section>
  );
}
