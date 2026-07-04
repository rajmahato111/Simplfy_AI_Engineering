import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { listFrameworks } from "@/lib/frameworks";

export const metadata: Metadata = {
  title: "Answer frameworks",
  description: "SPIDER, ETA, tradeoff, debugging, and STAR-L frameworks for AI system design interviews.",
};

export default function FrameworksPage() {
  const frameworks = listFrameworks();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Answer frameworks</h1>
      <p className="mt-2 text-zinc-600">
        Five structured frameworks from the upstream corpus — use them in guided practice and mocks.
      </p>

      <ul className="mt-8 space-y-8">
        {frameworks.map((f) => (
          <li key={f.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-zinc-900">{f.name}</h2>
              {f.acronym && <Badge>{f.acronym}</Badge>}
            </div>
            <p className="mt-2 text-sm text-zinc-600">{f.summary}</p>

            {f.phases.length > 0 && (
              <ol className="mt-4 space-y-2">
                {f.phases.map((p) => (
                  <li key={p.letter} className="text-sm text-zinc-700">
                    <span className="font-semibold text-zinc-900">
                      {p.letter} — {p.name}
                    </span>
                    {p.purpose && <span className="text-zinc-600"> — {p.purpose}</span>}
                  </li>
                ))}
              </ol>
            )}

            {f.anti_patterns.length > 0 && (
              <p className="mt-4 text-sm text-zinc-500">
                <strong>Anti-pattern:</strong> {f.anti_patterns[0]}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/practice" className="font-medium text-brand hover:underline">
          Try SPIDER practice →
        </Link>
        <Link href="/questions" className="font-medium text-brand hover:underline">
          Question bank →
        </Link>
      </div>
    </div>
  );
}
