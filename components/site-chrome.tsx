import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { AuthNav } from "@/components/auth-nav";
import { SiteLogo } from "@/components/site-logo";

const NAV = [
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock", title: "Mock interview" },
  { href: "/tutor", label: "Tutor" },
  { href: "/search", label: "Search" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <SiteLogo />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
          aria-label="Main"
        >
          {NAV.map(({ href, label, ...rest }) => (
            <Link
              key={href}
              href={href}
              title={"title" in rest ? rest.title : undefined}
              className="whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 xl:px-3"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <AuthNav />
            <Link
              href="/dashboard"
              className="hidden whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 md:inline"
            >
              Dashboard
            </Link>
            <span className="mx-1 hidden h-4 w-px bg-zinc-200 lg:inline" aria-hidden />
            <Link
              href="/pricing"
              className="hidden whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 lg:inline"
            >
              Pricing
            </Link>
          </div>
          <Button href="/learn" size="sm" className="hidden whitespace-nowrap sm:inline-flex">
            Get started
          </Button>
          <MobileNav />
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
      { href: "/frameworks", label: "Answer frameworks" },
    ],
  },
  {
    title: "Practice",
    links: [
      { href: "/practice", label: "Guided practice" },
      { href: "/mock", label: "Mock interview" },
      { href: "/whiteboard", label: "Whiteboard" },
      { href: "/flashcards", label: "Flashcards" },
      { href: "/tutor", label: "AI tutor" },
    ],
  },
  {
    title: "Career",
    links: [
      { href: "/prep", label: "Prep hub" },
      { href: "/study-plan", label: "Study plan" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Links",
    links: [{ href: "/credits", label: "Credits" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <SiteLogo />
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
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
