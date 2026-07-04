import Link from "next/link";

export function ArticleToc({ headings }: { headings: { id: string; title: string }[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block" aria-label="On this page">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        On this page
      </p>
      <ul className="mt-3 space-y-2 border-l border-zinc-200 pl-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="block text-sm text-zinc-600 transition hover:text-brand"
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ArticleBreadcrumb({
  area,
  title,
}: {
  area?: string;
  title: string;
}) {
  const areaLabel =
    area === "retrieval" ? "Retrieval & RAG" : area?.replace(/^\w/, (c) => c.toUpperCase());

  return (
    <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
      <Link href="/learn" className="hover:text-brand">
        Learn
      </Link>
      {areaLabel && (
        <>
          <span className="mx-2">/</span>
          <span className="text-zinc-600">{areaLabel}</span>
        </>
      )}
      <span className="mx-2">/</span>
      <span className="text-zinc-800">{title}</span>
    </nav>
  );
}
