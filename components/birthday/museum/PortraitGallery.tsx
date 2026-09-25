"use client";

import { motion } from "framer-motion";
import { museumExhibits } from "@/lib/museum-data";

export function PortraitGallery() {
  return (
    <div
      data-testid="portrait-gallery"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {museumExhibits.map((exhibit, index) => (
        <motion.article
          key={exhibit.id}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: (index % 3) * 0.08,
          }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-[24px] border border-stone-200/80 bg-[linear-gradient(155deg,#fffdf7,#fbe9cf_55%,#f7dfbd)] p-6 shadow-[0_16px_50px_-24px_rgba(124,90,72,0.4)] sm:p-7"
        >
          {/* subtle museum texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.44  0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0.3 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: "multiply",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <span className="inline-flex rounded-full border border-[#c9a25a]/60 bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#8a6233]">
              Exhibit {String(index + 1).padStart(2, "0")}
            </span>

            <span className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
              {exhibit.label}
            </span>
          </div>

          <div className="relative mt-7">
            <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-[#c9a25a]/60 to-transparent" />

            <h3 className="font-display text-2xl leading-tight text-stone-800 sm:text-[1.65rem]">
              {exhibit.title}
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-[15px]">
              {exhibit.description}
            </p>
          </div>

          <div className="relative mt-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(255,56,92,0.55)]" />

            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Permanently observed
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}