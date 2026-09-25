"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { museumAppreciation } from "@/lib/museum-data";

export function AppreciationGallery() {
  return (
    <div
      data-testid="appreciation-gallery"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {museumAppreciation.map((line, idx) => (
        <motion.article
          key={line.id}
          initial={{ opacity: 0, y: 24, x: idx % 2 === 0 ? -12 : 12 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: (idx % 3) * 0.15 }}
          whileHover={{ y: -3 }}
          className="group/appre relative overflow-hidden rounded-[24px] border border-rose-200/70 bg-[linear-gradient(155deg,#fff9f7_0%,#fdefe9_55%,#fadcd4_100%)] p-6 shadow-[0_16px_50px_-24px_rgba(217,36,74,0.25)] sm:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.32  0 0 0 0 0.32  0 0 0 0.3 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              mixBlendMode: "multiply",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c9a25a]/15 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.3em] text-rose-500/80">
              Note · {String(idx + 1).padStart(2, "0")}
            </p>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-rose-300/70 bg-white/70 text-rose-500 shadow-[0_10px_24px_-18px_rgba(217,36,74,0.55)]">
              <Heart className="h-4 w-4 fill-current" />
            </span>
          </div>

          <blockquote className="relative mt-5">
            <p className="font-display text-xl leading-[1.45] text-stone-800 sm:text-2xl sm:leading-[1.45]">
              <span className="mr-1 font-serif text-4xl leading-none text-rose-500/80 sm:text-5xl">
                “
              </span>
              {line.text}
              <span className="ml-1 font-serif text-4xl leading-none text-rose-500/80 sm:text-5xl">
                ”
              </span>
            </p>
          </blockquote>

          <div className="relative mt-6 flex items-center justify-between border-t border-rose-200/70 pt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
            <span>Appreciation Wing</span>
            <span>Filed under: you.</span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
