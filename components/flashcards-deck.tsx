"use client";

import { useState } from "react";

type Term = { id: string; term: string; definition: string };

export function FlashcardsDeck({ terms }: { terms: Term[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!terms.length) {
    return <p className="text-sm text-zinc-600">Glossary empty — run ingest first.</p>;
  }

  const card = terms[index];

  return (
    <div className="mx-auto max-w-lg">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="min-h-[200px] w-full rounded-xl border border-zinc-200 bg-white p-8 text-left shadow-sm hover:border-brand/30"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {flipped ? "Definition" : "Term"} · {index + 1}/{terms.length}
        </p>
        <p className="mt-4 text-lg font-medium text-zinc-900">
          {flipped ? card.definition : card.term}
        </p>
      </button>
      <div className="mt-4 flex justify-between gap-2">
        <button
          type="button"
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => i - 1);
            setFlipped(false);
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            setIndex((i) => (i + 1) % terms.length);
            setFlipped(false);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
