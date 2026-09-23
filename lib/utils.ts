import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface DayTheme {
  bg: string;
  fg: string;
  accent: string;
  name: string;
  emoji: string;
}

export function dayTheme(day: 1 | 2 | 3 | 4 | 5): DayTheme {
  const themes: Record<1 | 2 | 3 | 4 | 5, DayTheme> = {
    1: {
      bg: "#fff7f0",
      fg: "#4b2e15",
      accent: "#d98a4b",
      name: "Sunrise Memories",
      emoji: "🌅",
    },
    2: {
      bg: "#f6efe1",
      fg: "#3d2f1a",
      accent: "#9c7a42",
      name: "Vintage Letters",
      emoji: "💌",
    },
    3: {
      bg: "#fff0f3",
      fg: "#4a202c",
      accent: "#d7748a",
      name: "Sweet Romance",
      emoji: "💕",
    },
    4: {
      bg: "#0f1326",
      fg: "#e9e4ff",
      accent: "#d4af37",
      name: "Midnight Wishes",
      emoji: "✨",
    },
    5: {
      bg: "#07070b",
      fg: "#fff8e7",
      accent: "#f6c357",
      name: "Golden Finale",
      emoji: "🎂",
    },
  };
  return themes[day];
}
