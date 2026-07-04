import Link from "next/link";
import { getContentTitle } from "@/lib/content-nav";

export function ArticlePrevNext({
  prev,
  next,
}: {
  prev?: string;
  next?: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      className="mt-12 grid gap-4 border-t border-zinc-200 pt-8 sm:grid-cols-2"
      aria-label="Chapter navigation"
    >
      {prev ? (
        <Link
          href={`/learn/${prev}`}
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand/30"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            ← Previous
          </p>
          <p className="mt-2 font-semibold text-zinc-900 group-hover:text-brand">
            {getContentTitle(prev)}
          </p>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/learn/${next}`}
          className="group rounded-xl border border-zinc-200 bg-white p-5 text-right shadow-sm transition hover:border-brand/30 sm:col-start-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Next →
          </p>
          <p className="mt-2 font-semibold text-zinc-900 group-hover:text-brand">
            {getContentTitle(next)}
          </p>
        </Link>
      ) : null}
    </nav>
  );
}
