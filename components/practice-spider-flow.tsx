"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { submitSpiderPractice } from "@/app/actions/practice";
import { SPIDER_PHASES } from "@/lib/spider-phases";
import type { SpiderFeedback } from "@/lib/spider-feedback";
import { cn } from "@/lib/cn";

const btn =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 h-9 px-3.5 text-sm";
const btnPrimary = cn(btn, "bg-brand text-white shadow-sm hover:bg-brand-hover focus-visible:ring-brand/40");
const btnSecondary = cn(
  btn,
  "border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
);

export function PracticeSpiderFlow() {
  const searchParams = useSearchParams();
  const questionSlug = searchParams.get("question") ?? undefined;

  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<string[]>(() => SPIDER_PHASES.map(() => ""));
  const [feedback, setFeedback] = useState<SpiderFeedback | null>(null);
  const [pending, startTransition] = useTransition();

  const phase = SPIDER_PHASES[step];
  const progress = Math.round(((step + 1) / SPIDER_PHASES.length) * 100);

  function submit() {
    startTransition(async () => {
      const result = await submitSpiderPractice(notes, questionSlug);
      setFeedback(result);
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      {questionSlug && (
        <p className="mb-4 text-sm text-zinc-600">
          Practicing for question: <span className="font-medium">{questionSlug.replace(/-/g, " ")}</span>
        </p>
      )}
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
          setFeedback(null);
        }}
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={step === 0 || pending}
          onClick={() => setStep((s) => s - 1)}
        >
          Back
        </button>
        {step < SPIDER_PHASES.length - 1 ? (
          <button type="button" className={btnPrimary} disabled={pending} onClick={() => setStep((s) => s + 1)}>
            Next phase
          </button>
        ) : (
          <button type="button" className={btnPrimary} disabled={pending} onClick={submit}>
            {pending ? "Scoring…" : "Submit for feedback"}
          </button>
        )}
      </div>

      {feedback && (
        <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6" aria-live="polite">
          <h3 className="text-lg font-semibold text-zinc-900">
            Checkpoint score: {feedback.overall}/100
          </h3>
          <p className="mt-1 text-sm text-zinc-600">
            Rule-based rubric check — full LLM grader ships when the API key is configured.
          </p>
          <ul className="mt-4 space-y-3">
            {feedback.phases.map((p) => (
              <li key={p.phase} className="rounded-lg border border-zinc-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-zinc-900">{p.phase}</span>
                  <span className="text-sm text-zinc-600">{p.score}/100</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{p.feedback}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
