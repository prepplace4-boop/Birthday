"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ImageWithFallback } from "@/components/birthday/image-with-fallback";
import { cn } from "@/lib/utils";

interface ExhibitCardProps {
  number: number;
  title: string;
  description: string;
  label?: string;
  image?: string | null | undefined;
  actions?: ReactNode;
  className?: string;
}

function PaperPlaceholder({ label }: { label?: string }) {
  return (
    <div className="relative flex h-full min-h-[180px] w-full items-center justify-center overflow-hidden rounded-[18px] border border-dashed border-stone-300/80 bg-[radial-gradient(circle_at_top,_#fff5e6,_#fbe8cf_70%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.52  0 0 0 0 0.39  0 0 0 0 0.25  0 0 0 0.2 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <p className="relative z-10 px-4 text-center text-sm italic text-stone-500">
        {label ?? "A small, beautiful placeholder. The memory is real — the photo file simply wasn't ready to be in the museum yet."}
      </p>
    </div>
  );
}

export function ExhibitCard({
  number,
  title,
  description,
  label,
  image,
  actions,
  className,
}: ExhibitCardProps) {
  const padded = String(number).padStart(2, "0");
  const hasImage = Boolean(image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn(
        "group/exhibit relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-[linear-gradient(160deg,#fffdf7,#fff3e1_60%,#fdecd1)] p-4 shadow-[0_14px_40px_-24px_rgba(124,90,72,0.35)] sm:p-5",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.34  0 0 0 0 0.22  0 0 0 0.34 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="inline-flex h-8 min-w-10 items-center justify-center rounded-full border border-[#c9a25a]/60 bg-[linear-gradient(135deg,#fff7e6,#f9e5c3)] px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a6233] shadow-[0_6px_18px_-10px_rgba(201,162,90,0.6)]"
        >
          Exhibit {padded}
        </span>
      </div>

      {hasImage ? (
        <div className="relative mt-4 overflow-hidden rounded-[18px] border border-stone-200/80 bg-stone-50 shadow-[0_10px_30px_-16px_rgba(124,90,72,0.3)]">
          <ImageWithFallback
            src={image as string}
            alt={title}
            width={900}
            height={700}
            loading="lazy"
            className="h-56 w-full object-cover transition-transform duration-500 group-hover/exhibit:scale-[1.02] sm:h-60"
          />
        </div>
      ) : (
        <div className="mt-4">
          <PaperPlaceholder label={label} />
        </div>
      )}

      <div className="relative mt-4">
        <h3 className="font-display text-xl leading-snug text-stone-800 sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-7 text-stone-600 sm:text-[15px]">
          {description}
        </p>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-stone-200/80 pt-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
          {label ?? "Museum Collection"}
        </p>
        {actions}
      </div>
    </motion.article>
  );
}
