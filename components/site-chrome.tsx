import Link from "next/link";

const NAV = [
  { href: "/learn", label: "Learn" },
  { href: "/questions", label: "Questions" },
  { href: "/practice", label: "Practice" },
  { href: "/mock", label: "Mock Interview" },
  { href: "/tutor", label: "Tutor" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Simplify AI Engineering
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-600 hover:text-slate-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600">
        Content uses the MIT-licensed{" "}
        <a
          href="https://github.com/ombharatiya/ai-system-design-guide"
          className="underline hover:text-slate-900"
        >
          AI System Design Guide
        </a>{" "}
        as a factual reference. See{" "}
        <Link href="/credits" className="underline hover:text-slate-900">
          Credits
        </Link>
        .
      </div>
    </footer>
  );
}
