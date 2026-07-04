"use client";

import { useState } from "react";
import { SPIDER_PHASES } from "@/lib/spider-phases";
import { cn } from "@/lib/cn";

const btn =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 h-9 px-3.5 text-sm";
const btnPrimary = cn(btn, "bg-brand text-white shadow-sm hover:bg-brand-hover focus-visible:ring-brand/40");
const btnSecondary = cn(
  btn,
  "border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
);

export function PracticeSpiderFlow() {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<string[]>(() => SPIDER_PHASES.map(() => ""));
  const phase = SPIDER_PHASES[step];
  const progress = Math.round(((step + 1) / SPIDER_PHASES.length) * 100);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-500">
        Phase {step + 1} of {SPIDER_PHASES.length} — {phase.name}
      </p>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900">{phase.name}</h2>
      <p className="mt-2 text-zinc-600">{phase.prompt}</p>
      <textarea
        className="mt-4 w-full rounded-lg border border-zinc-300 p-3 text-sm"
        rows={5}
        placeholder="Your answer for this phase…"
        value={notes[step]}
        onChange={(e) => {
          const next = [...notes];
          next[step] = e.target.value;
          setNotes(next);
        }}
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </button>
        {step < SPIDER_PHASES.length - 1 ? (
          <button type="button" className={btnPrimary} onClick={() => setStep((s) => s + 1)}>
            Next phase
          </button>
        ) : (
          <button
            type="button"
            className={btnPrimary}
            onClick={() => alert("AI feedback ships in P2 — notes saved in session only.")}
          >
            Submit for feedback
          </button>
        )}
      </div>
    </div>
  );
}
