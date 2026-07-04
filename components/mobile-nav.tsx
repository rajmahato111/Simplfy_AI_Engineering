"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock Interview" },
  { href: "/tutor", label: "Tutor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 6l12 12M6 18L18 6" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 z-40 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100",
                )}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
