"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock interview" },
  { href: "/tutor", label: "Tutor" },
  { href: "/search", label: "Search" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
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
        <div className="absolute inset-x-0 top-14 z-40 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg">
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
          <div className="mt-4 border-t border-zinc-100 pt-4 sm:hidden">
            <Button href="/learn" size="sm" className="w-full">
              Get started
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
