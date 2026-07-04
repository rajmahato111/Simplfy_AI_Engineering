import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { AuthNav } from "@/components/auth-nav";

const NAV = [
  { href: "/learn", label: "Learn" },
  { href: "/search", label: "Search" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock Interview" },
  { href: "/tutor", label: "Tutor" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            AI
          </span>
          <span className="hidden font-semibold tracking-tight text-zinc-900 sm:inline">
            Simplify AI Engineering
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <MobileNav />
          <AuthNav />
          <Link
            href="/dashboard"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:inline"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 lg:inline"
          >
            Pricing
          </Link>
          <Button href="/learn" size="sm">
            Start learning
          </Button>
        </div>
      </div>
    </header>
  );
}

const FOOTER_COLUMNS = [
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "All tracks" },
      { href: "/learn/concepts/retrieval/rag-fundamentals", label: "RAG fundamentals" },
      { href: "/questions", label: "Question bank" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/practice", label: "Guided practice" },
      { href: "/mock", label: "Mock interview" },
      { href: "/tutor", label: "AI tutor" },
    ],
  },
  {
    title: "Links",
    links: [
      { href: "/credits", label: "Credits" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-semibold text-zinc-900">Simplify AI Engineering</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            AI-native interview prep for production AI systems — built on an open,
            attributed knowledge base.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-zinc-900">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-brand hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500">
        Content references the MIT-licensed{" "}
        <a
          href="https://github.com/ombharatiya/ai-system-design-guide"
          className="underline hover:text-zinc-800"
        >
          AI System Design Guide
        </a>{" "}
        by Om Bharatiya. See{" "}
        <Link href="/credits" className="underline hover:text-zinc-800">
          Credits
        </Link>
        .
      </div>
    </footer>
  );
}
