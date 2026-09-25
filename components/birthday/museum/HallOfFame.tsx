"use client";

import { motion } from "framer-motion";
import { museumAwards } from "@/lib/museum-data";
import { Award as AwardIcon, Crown, Medal, Ribbon, Star, Trophy } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { Award } from "@/lib/museum-data";

const TROPHY_ICON: Record<Award["trophyVariant"], ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  medal: Medal,
  crown: Crown,
  ribbon: Ribbon,
  laurel: AwardIcon,
  star: Star,
};

export function HallOfFame() {
  return (
    <div
      data-testid="hall-of-fame"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {museumAwards.map((award, idx) => {
        const Icon = TROPHY_ICON[award.trophyVariant] ?? Trophy;
        return (
          <motion.article
            key={award.id}
            initial={{ opacity: 0, y: 24, rotate: -0.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4, rotate: idx % 2 === 0 ? 0.3 : -0.3 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: (idx % 3) * 0.08 }}
            className="group/award relative overflow-hidden rounded-[24px] border border-[#c9a25a]/40 bg-[linear-gradient(155deg,#fffdf5,#fbe8b6_55%,#f7d695)] px-5 py-5 shadow-[0_16px_50px_-22px_rgba(160,118,56,0.45)] sm:px-6 sm:py-6"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.8' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.44  0 0 0 0 0.28  0 0 0 0 0.12  0 0 0 0.36 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                mixBlendMode: "multiply",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#ff385c]/10 blur-3xl"
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-600">
                  Citation · {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl leading-tight tracking-tight text-stone-800 sm:text-2xl">
                  {award.title}
                </h3>
              </div>
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#c9a25a]/50 bg-[radial-gradient(circle_at_top,_#fff7e6,_#f2c980)] shadow-[0_10px_26px_-12px_rgba(201,162,90,0.75)] sm:h-16 sm:w-16">
                <Icon className="h-6 w-6 text-[#8a5a2a] sm:h-7 sm:w-7" />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-[#c9a25a]/60"
                  animate={{ opacity: [0.3, 0.05, 0.3], scale: [1, 1.12, 1] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: (idx % 4) * 0.35 }}
                />
              </div>
            </div>

            <div className="relative mt-5 h-px w-full bg-gradient-to-r from-transparent via-[#c9a25a]/60 to-transparent" />

            <p className="relative mt-5 text-[14px] leading-7 text-stone-700 sm:text-[15px]">
              {award.citation}
            </p>

            <div
              className={cn(
                "relative mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]",
                "border-[#8a5a2a]/30 bg-white/60 text-[#7a4f25]",
              )}
            >
              <AwardIcon className="h-3.5 w-3.5" />
              Unanimous decision · Presented with affection
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
