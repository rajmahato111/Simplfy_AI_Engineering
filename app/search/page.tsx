import Link from "next/link";
import type { Metadata } from "next";
import { searchContent } from "@/lib/search";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Search",
  description: "Search concepts and walkthroughs in the learning library.",
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchContent(query) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Search</h1>
      <p className="mt-2 text-zinc-600">Find concepts and walkthroughs across the library.</p>

      <form className="mt-8" action="/search" method="get">
        <div className="flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="e.g. RAG, chunking, hybrid search"
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <p className="mt-6 text-sm text-zinc-500">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      <ul className="mt-4 space-y-4">
        {results.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/learn/${r.slug}`}
              className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand/30"
            >
              <div className="flex flex-wrap gap-2">
                <Badge className="capitalize">{r.type}</Badge>
                <Badge className="capitalize">{r.area}</Badge>
              </div>
              <h2 className="mt-2 font-semibold text-zinc-900">{r.title}</h2>
              {r.excerpt && <p className="mt-2 text-sm text-zinc-600">{r.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>

      {query && results.length === 0 && (
        <p className="mt-8 text-sm text-zinc-600">No matches. Try different keywords.</p>
      )}
    </div>
  );
}
