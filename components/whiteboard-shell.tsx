"use client";

import { useEffect, useState } from "react";

type Props = {
  prompt?: string;
};

export function WhiteboardShell({ prompt }: Props) {
  const [notes, setNotes] = useState("");
  const [critique, setCritique] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (prompt && !notes) setNotes(prompt);
  }, [prompt, notes]);

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
    <div>
      <textarea
        className="w-full rounded-lg border border-zinc-300 p-4 font-mono text-sm"
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
