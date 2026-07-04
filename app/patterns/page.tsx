import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listPatternCategories, listPatterns, patternCount } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "Patterns",
  description: "AI system design patterns and anti-patterns catalog.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function PatternsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const categories = listPatternCategories();
  const patterns = listPatterns(category);
  const total = patternCount();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Patterns</h1>
      <p className="mt-2 text-zinc-600">
        {total} patterns and anti-patterns from the upstream catalog (attributed).
      </p>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
        >
          Filter
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {patterns.map((p) => (
          <li key={p.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <Badge>{p.category}</Badge>
              {p.kind === "anti-pattern" && <Badge className="capitalize">Anti-pattern</Badge>}
            </div>
            <h2 className="mt-2 font-semibold text-zinc-900">{p.name}</h2>
            <p className="mt-2 text-sm text-zinc-600">{p.use_case}</p>
            <p className="mt-2 text-sm text-zinc-500">
              <strong>Tradeoff:</strong> {p.key_tradeoff}
            </p>
          </li>
        ))}
      </ul>
      <Link href="/learn" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
        Browse chapters →
      </Link>
    </div>
  );
}
