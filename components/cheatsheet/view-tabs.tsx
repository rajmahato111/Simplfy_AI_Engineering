import Link from "next/link";

export function ViewTabs({ slug, active }: { slug: string; active: "read" | "cheatsheet" }) {
  const tabs: { key: "read" | "cheatsheet"; label: string; href: string }[] = [
    { key: "read", label: "Read", href: `/learn/${slug}` },
    { key: "cheatsheet", label: "Cheat sheet", href: `/learn/${slug}?view=cheatsheet` },
  ];

  return (
    <div className="mt-6 inline-flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? "page" : undefined}
          className={
            active === tab.key
              ? "rounded-md bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-900 shadow-sm"
              : "rounded-md px-3.5 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-800"
          }
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
