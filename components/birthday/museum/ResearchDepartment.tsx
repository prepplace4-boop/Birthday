"use client";

import { motion } from "framer-motion";
import { FileSearch, Lock, Stamp, ShieldCheck } from "lucide-react";
import { museumResearch } from "@/lib/museum-data";
import { cn } from "@/lib/utils";
import type { ResearchStat } from "@/lib/museum-data";

function ConfidentialStamp() {
  return (
    <div
      className="pointer-events-none select-none"
      aria-hidden
    >
      <div
        className="translate-y-[18px] -rotate-[16deg] rounded-xl border-4 border-rose-500/70 px-4 py-2 text-center font-display text-2xl font-black uppercase tracking-[0.3em] text-rose-500/75 sm:text-3xl"
        style={{ WebkitTextStroke: "0.3px rgba(217,36,74,0.35)" }}
      >
        Confidential
      </div>
    </div>
  );
}

function StatChart() {
  const bars = [60, 82, 96, 78, 99, 88, 92];
  return (
    <div className="flex h-20 items-end gap-1.5">
      {bars.map((b, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${b}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.05 }}
          className="w-full rounded-t-md bg-[linear-gradient(180deg,#ff385c,#c9a25a)]"
        />
      ))}
    </div>
  );
}

function Meter({ value }: { value: string }) {
  const pct = /[\d.]+%/.test(value) ? Math.min(100, parseFloat(value)) : 92;
  return (
    <div className="space-y-2">
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-stone-200/80">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full bg-[linear-gradient(90deg,#c9a25a,#ff385c)] shadow-[0_0_18px_-2px_rgba(255,56,92,0.5)]"
        />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.22em] text-stone-500">
        <span>Normal</span>
        <span>Exceptional</span>
      </div>
    </div>
  );
}

function ResearchBadge({ headline, value }: { headline: string; value: string }) {
  void headline;
  return (
    <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-[#c9a25a]/60 bg-[radial-gradient(circle_at_top,_#fff7e6,_#f2c980)] shadow-[0_12px_30px_-14px_rgba(201,162,90,0.8)] sm:h-28 sm:w-28">
      <div className="absolute inset-1 rounded-full border border-[#c9a25a]/50" />
      <p className="px-3 text-center font-display text-lg font-semibold text-[#8a5a2a] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function ResearchStamp({ headline, value }: { headline: string; value: string }) {
  void headline;
  return (
    <div className="relative inline-flex -rotate-3 items-center justify-center rounded-full border-[3px] border-rose-500/55 px-5 py-3 shadow-[0_10px_24px_-12px_rgba(217,36,74,0.5)]">
      <p className="font-display text-lg font-black uppercase tracking-[0.26em] text-rose-600/85 sm:text-xl">
        {value}
      </p>
    </div>
  );
}

const VISUAL_LABEL: Record<ResearchStat["visual"], string> = {
  chart: "Statistical Analysis",
  meter: "Field Measurements",
  badge: "Archival Badge",
  stamp: "Redacted · Seal",
};

export function ResearchDepartment() {
  return (
    <div
      data-testid="research-department"
      className="relative overflow-hidden rounded-[24px] border border-stone-200/80 bg-[linear-gradient(160deg,#fffdf7_0%,#f9ead2_45%,#f3dcc2_100%)] p-5 shadow-[0_18px_60px_-30px_rgba(124,90,72,0.35)] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.95' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0.28 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          mixBlendMode: "multiply",
        }}
      />

      <div className="absolute right-6 top-8 sm:right-10 sm:top-10">
        <ConfidentialStamp />
      </div>

      <div className="relative flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-white/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-rose-600 shadow-[0_8px_24px_-16px_rgba(217,36,74,0.4)]">
          <Lock className="h-3.5 w-3.5" />
          Restricted Wing
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a25a]/60 bg-white/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.26em] text-[#8a6233] shadow-[0_8px_24px_-16px_rgba(201,162,90,0.6)]">
          <FileSearch className="h-3.5 w-3.5" />
          Kesar Research · Active
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-3xl leading-tight text-stone-800 sm:text-4xl">
        Classified Research
      </h3>
      <p className="relative mt-2 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
        Highly confidential. Highly unscientific. Highly recommended reading. All findings have been peer-reviewed by exactly one person (me) and the results are devastatingly biased in your favour.
      </p>

      <div className="relative mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {museumResearch.map((stat, idx) => (
          <motion.article
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: (idx % 3) * 0.08 }}
            className="group/research relative overflow-hidden rounded-2xl border border-stone-200/80 bg-[linear-gradient(160deg,#fffdf8,#fbeccd)] p-5 shadow-[0_14px_40px_-24px_rgba(124,90,72,0.4)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#ff385c]/10 blur-2xl"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.26em] text-stone-500">
                Exhibit · {String(idx + 1).padStart(2, "0")}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-stone-600">
                <Stamp className="h-3 w-3" />
                {VISUAL_LABEL[stat.visual]}
              </span>
            </div>

            <h4 className="mt-3 font-display text-lg leading-snug text-stone-800 sm:text-xl">
              {stat.headline}
            </h4>

            <div
              className={cn(
                "mt-4 flex items-center justify-center rounded-2xl border border-dashed border-stone-200/80 bg-white/50 py-5",
                stat.visual === "stamp" && "py-7",
                stat.visual === "badge" && "py-7",
              )}
            >
              {stat.visual === "chart" ? (
                <div className="w-full px-2">
                  <StatChart />
                  <p className="mt-3 text-center font-display text-2xl text-stone-800">
                    {stat.value}
                  </p>
                </div>
              ) : stat.visual === "meter" ? (
                <div className="w-full px-2">
                  <p className="mb-2 text-center font-display text-2xl text-stone-800">
                    {stat.value}
                  </p>
                  <Meter value={stat.value} />
                </div>
              ) : stat.visual === "stamp" ? (
                <ResearchStamp headline={stat.headline} value={stat.value} />
              ) : (
                <ResearchBadge headline={stat.headline} value={stat.value} />
              )}
            </div>

            <p className="mt-4 text-xs leading-6 text-stone-600">
              {stat.confidence}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-[#c9a25a]/40 bg-[linear-gradient(135deg,#fff7e6,#f9e5c3)] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#8a5a2a]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Certified · Not up for debate
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
