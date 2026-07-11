import type { CheatColorToken } from "@/lib/cheatsheet-schema";

/**
 * Static Tailwind class lookup per color token. Must stay a literal map — Tailwind v4's
 * JIT scanner only generates CSS for class names it can find verbatim in source, so
 * building class names via string interpolation (e.g. `bg-cheat-${token}`) silently
 * produces no styles.
 */
export const cheatColorClasses: Record<
  CheatColorToken,
  { text: string; border: string; bg: string; muted: string; barFill: string }
> = {
  brand: {
    text: "text-brand-text",
    border: "border-brand/30",
    bg: "bg-brand",
    muted: "bg-brand-muted",
    barFill: "bg-brand",
  },
  indigo: {
    text: "text-cheat-indigo-text",
    border: "border-cheat-indigo/30",
    bg: "bg-cheat-indigo",
    muted: "bg-cheat-indigo-muted",
    barFill: "bg-cheat-indigo",
  },
  amber: {
    text: "text-cheat-amber-text",
    border: "border-cheat-amber/30",
    bg: "bg-cheat-amber",
    muted: "bg-cheat-amber-muted",
    barFill: "bg-cheat-amber",
  },
  rose: {
    text: "text-cheat-rose-text",
    border: "border-cheat-rose/30",
    bg: "bg-cheat-rose",
    muted: "bg-cheat-rose-muted",
    barFill: "bg-cheat-rose",
  },
  emerald: {
    text: "text-cheat-emerald-text",
    border: "border-cheat-emerald/30",
    bg: "bg-cheat-emerald",
    muted: "bg-cheat-emerald-muted",
    barFill: "bg-cheat-emerald",
  },
};
