import Link from "next/link";
import type { Metadata } from "next";
import { listGlossaryLetters, listGlossaryTerms, glossaryCount } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description: "AI engineering terms with definitions and related chapters.",
};

type Props = { searchParams: Promise<{ letter?: string }> };

export default async function GlossaryPage({ searchParams }: Props) {
  const { letter } = await searchParams;
  const letters = listGlossaryLetters();
  const terms = listGlossaryTerms(letter?.toUpperCase());
  const total = glossaryCount();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Glossary</h1>
      <p className="mt-2 text-zinc-600">
        {total} terms from the AI System Design Guide corpus (MIT, attributed).
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="A–Z">
        <Link
          href="/glossary"
          className={`rounded-lg px-2.5 py-1 text-sm font-medium ${!letter ? "bg-brand text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
        >
          All
        </Link>
        {letters.map((l) => (
          <Link
            key={l}
            href={`/glossary?letter=${l}`}
            className={`rounded-lg px-2.5 py-1 text-sm font-medium ${letter?.toUpperCase() === l ? "bg-brand text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}
          >
            {l}
          </Link>
        ))}
      </nav>

      <ul className="mt-8 space-y-4">
        {terms.map((g) => (
          <li key={g.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{g.term}</h2>
            <p className="mt-2 text-sm text-zinc-600">{g.definition}</p>
          </li>
        ))}
      </ul>
      <Link href="/learn" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
        Browse chapters →
      </Link>
    </div>
  );
}
