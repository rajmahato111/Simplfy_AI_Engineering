"use client";

import { useState } from "react";

export function WhiteboardShell() {
  const [notes, setNotes] = useState("");
  const [critique, setCritique] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function critiqueDiagram() {
    setPending(true);
    setCritique(null);
    try {
      const res = await fetch("/api/whiteboard/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = (await res.json()) as { text: string };
      setCritique(data.text);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-zinc-600">
        Text whiteboard shell — describe your architecture in prose or ASCII. Excalidraw canvas ships next.
      </p>
      <textarea
        className="mt-4 w-full rounded-lg border border-zinc-300 p-4 font-mono text-sm"
        rows={12}
        placeholder="Client → API GW → RAG pipeline → LLM …"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        type="button"
        disabled={pending || !notes.trim()}
        onClick={() => void critiqueDiagram()}
        className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
      >
        {pending ? "Reviewing…" : "AI critique (when API key set)"}
      </button>
      {critique && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700 whitespace-pre-wrap">
          {critique}
        </div>
      )}
    </div>
  );
}
