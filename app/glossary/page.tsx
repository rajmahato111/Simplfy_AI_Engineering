import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary",
  description: "AI engineering terms with definitions and related chapters.",
};

const PLACEHOLDER = [
  { term: "RAG", def: "Retrieval-Augmented Generation — fetch relevant docs into the LLM prompt." },
  { term: "Embedding", def: "Dense vector representation of text for semantic similarity search." },
];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Glossary</h1>
      <p className="mt-2 text-zinc-600">
        Key terms for AI system design interviews. Full corpus syncs with content ingest.
      </p>
      <ul className="mt-8 space-y-4">
        {PLACEHOLDER.map((g) => (
          <li key={g.term} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{g.term}</h2>
            <p className="mt-2 text-sm text-zinc-600">{g.def}</p>
          </li>
        ))}
      </ul>
      <Link href="/learn" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
        Browse chapters →
      </Link>
    </div>
  );
}
