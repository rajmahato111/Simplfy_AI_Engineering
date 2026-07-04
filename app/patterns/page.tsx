import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patterns",
  description: "AI system design patterns and anti-patterns catalog.",
};

const PATTERNS = [
  {
    name: "Hybrid retrieval",
    category: "Retrieval",
    use: "Combine BM25 + vector search before reranking.",
    tradeoff: "Extra index infra; better recall on exact + semantic matches.",
  },
  {
    name: "Permission-aware RAG",
    category: "Security",
    use: "Filter chunks inside the retrieval query, not after fetch.",
    tradeoff: "ACL sync pipeline required; safest multi-tenant pattern.",
  },
];

export default function PatternsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Patterns</h1>
      <p className="mt-2 text-zinc-600">
        Reusable architecture patterns from the corpus. Expands as content batches land.
      </p>
      <ul className="mt-8 space-y-4">
        {PATTERNS.map((p) => (
          <li key={p.name} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{p.category}</p>
            <h2 className="mt-1 font-semibold text-zinc-900">{p.name}</h2>
            <p className="mt-2 text-sm text-zinc-600">{p.use}</p>
            <p className="mt-2 text-sm text-zinc-500">
              <strong>Tradeoff:</strong> {p.tradeoff}
            </p>
          </li>
        ))}
      </ul>
      <Link href="/learn" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
        Learn the concepts →
      </Link>
    </div>
  );
}
