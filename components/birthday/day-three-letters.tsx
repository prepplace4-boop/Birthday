"use client";

import { useMemo, useState } from "react";

export type LetterItem = {
  title?: string;
  message?: string;
};

export function DayThreeLetters({ envelopes }: { envelopes: LetterItem[] }) {
  const [opened, setOpened] = useState<number[]>([]);

  const total = Math.max(envelopes.length, 1);
  const progress = useMemo(
    () => (opened.length / total) * 100,
    [opened.length, total],
  );

  const toggleLetter = (index: number) => {
    setOpened((prev) =>
      prev.includes(index)
        ? prev.filter((value) => value !== index)
        : [...prev, index],
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-[20px] border border-amber-200 bg-[#fef7ee] px-4 py-3">
        <span className="text-[10px] uppercase tracking-[0.22em] text-amber-700">
          {opened.length} of {total} opened
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-amber-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {envelopes.map((envelope, index) => {
          const isOpen = opened.includes(index);

          return (
            <div
              key={`${envelope.title ?? "letter"}-${index}`}
              className={`overflow-hidden rounded-[26px] border transition-all duration-300 ${
                isOpen
                  ? "border-rose-200 bg-[#fffaf4] shadow-[0_18px_36px_rgba(73,55,41,0.08)]"
                  : "border-stone-200 bg-[#fffaf4] hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(73,55,41,0.08)]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleLetter(index)}
                className="flex w-full items-center justify-between gap-3 p-5 text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-xl text-rose-700 shadow-inner shadow-rose-200">
                    {isOpen ? "✉" : "✦"}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
                      letter {index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-stone-800">
                      {envelope.title ?? "A letter"}
                    </h3>
                  </div>
                </div>
                <span className="text-lg text-stone-500">{isOpen ? "−" : "+"}</span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-500 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-stone-200 bg-white/70 px-5 pb-5 pt-4">
                    <p className="text-sm leading-7 text-stone-700">
                      {envelope.message ??
                        "There is something here I wish I had said earlier."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
