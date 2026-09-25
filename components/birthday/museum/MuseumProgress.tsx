"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MuseumProgressProps {
  found: number;
  total: number;
  className?: string;
}

export function MuseumProgress({
  found,
  total,
  className,
}: MuseumProgressProps) {
  const safeTotal = Math.max(1, total);
  const percent = Math.min(100, Math.max(0, (found / safeTotal) * 100));
  const complete = found >= safeTotal;

  return (
    <div
      data-testid="museum-progress"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 shadow-[0_10px_24px_-18px_rgba(124,90,72,0.25)] backdrop-blur sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-stone-500">
            Exhibition Progress
          </p>
          <p
            className={cn(
              "mt-1 font-display text-lg text-stone-800 sm:text-xl",
              complete && "text-rose-600",
            )}
          >
            <span className="tabular-nums">{found}</span>
            <span className="mx-1 text-stone-400">/</span>
            <span className="tabular-nums text-stone-500">{total}</span>{" "}
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
              details discovered
            </span>
          </p>
        </div>
        {complete ? (
          <span className="rounded-full border border-[#c9a25a]/60 bg-[linear-gradient(135deg,#fff7e6,#fae4b3)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a6233] shadow-[0_6px_16px_-10px_rgba(201,162,90,0.7)]">
            Complete
          </span>
        ) : null}
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={found}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            complete
              ? "bg-[linear-gradient(90deg,#d9244a,#ff385c,#c9a25a)]"
              : "bg-[linear-gradient(90deg,#e9c0c7,#ff385c)]",
          )}
        />
      </div>
    </div>
  );
}
