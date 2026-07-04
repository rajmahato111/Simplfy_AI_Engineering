"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { completeMockSession, getInterviewerLine } from "@/app/actions/mock";
import { SPIDER_PHASES } from "@/lib/spider-phases";
import {
  formatElapsed,
  mockInterviewerPrompt,
  readMockSession,
  writeMockSession,
} from "@/lib/mock-session";
import type { SpiderFeedback } from "@/lib/spider-feedback";
import type { Question } from "@/lib/question-schema";
import { cn } from "@/lib/cn";

const btn =
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 h-9 px-3.5 text-sm";
const btnPrimary = cn(btn, "bg-brand text-white shadow-sm hover:bg-brand-hover focus-visible:ring-brand/40");
const btnSecondary = cn(
  btn,
  "border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
);

type Props = {
  sessionId: string;
  question: Question;
  initialScorecard?: SpiderFeedback | null;
};

export function MockInterviewFlow({ sessionId, question, initialScorecard }: Props) {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<string[]>(() => SPIDER_PHASES.map(() => ""));
  const [scorecard, setScorecard] = useState<SpiderFeedback | null>(initialScorecard ?? null);
  const [interviewerLine, setInterviewerLine] = useState(() => mockInterviewerPrompt("scope", question));
  const [elapsedMs, setElapsedMs] = useState(0);
  const [pending, startTransition] = useTransition();
  const [ready, setReady] = useState(false);

  const phase = SPIDER_PHASES[step];
  const progress = Math.round(((step + 1) / SPIDER_PHASES.length) * 100);

  useEffect(() => {
    const stored = readMockSession(sessionId);
    if (stored && stored.questionSlug === question.slug) {
      setNotes(stored.notes);
      if (stored.scorecard) setScorecard(stored.scorecard);
    }
    setReady(true);
  }, [sessionId, question.slug]);

  useEffect(() => {
    if (!ready || scorecard) return;
    const stored = readMockSession(sessionId);
    const started = stored?.startedAt ? new Date(stored.startedAt).getTime() : Date.now();
    const tick = () => setElapsedMs(Date.now() - started);
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [ready, scorecard, sessionId]);

  useEffect(() => {
    if (scorecard) return;
    const prior = step > 0 ? notes[step - 1] : undefined;
    let cancelled = false;
    void getInterviewerLine(phase.id, question.slug, prior).then((res) => {
      if (!cancelled) setInterviewerLine(res.line);
    });
    return () => {
      cancelled = true;
    };
  }, [step, question.slug, scorecard, phase.id, notes]);

  function persistNotes(next: string[]) {
    const stored = readMockSession(sessionId);
    if (!stored) return;
    writeMockSession(sessionId, { ...stored, notes: next });
  }

  function finish() {
    startTransition(async () => {
      const result = await completeMockSession(sessionId, notes, question.slug);
      setScorecard(result);
      const stored = readMockSession(sessionId);
      if (stored) {
        writeMockSession(sessionId, {
          ...stored,
          notes,
          scorecard: result,
          completedAt: new Date().toISOString(),
        });
      }
    });
  }

  if (!ready) {
    return <p className="text-sm text-zinc-500">Loading session…</p>;
  }

  if (scorecard) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-zinc-900">Mock scorecard</h2>
          <span className="text-sm text-zinc-500">Time: {formatElapsed(elapsedMs)}</span>
        </div>
        <p className="mt-1 text-sm text-zinc-600">{question.title}</p>
        <p className="mt-4 text-3xl font-semibold text-brand">{scorecard.overall}/100</p>
        <p className="mt-1 text-sm text-zinc-600">
          {scorecard.mode === "llm" ? "AI rubric grader" : "Rule-based rubric"} — session saved when signed in with Postgres.
        </p>
        <ul className="mt-6 space-y-3">
          {scorecard.phases.map((p) => (
            <li key={p.phase} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-zinc-900">{p.phase}</span>
                <span className="text-sm text-zinc-600">{p.score}/100</span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{p.feedback}</p>
            </li>
          ))}
        </ul>
        {question.interviewer_looks_for.length > 0 && (
          <section className="mt-8 rounded-xl border border-brand/20 bg-brand-muted p-5">
            <h3 className="font-semibold text-zinc-900">Signals you were graded against</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {question.interviewer_looks_for.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/mock" className={btnSecondary}>
            New mock
          </Link>
          <Link href={`/questions/${question.slug}`} className={btnPrimary}>
            Review question
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600">
        <span className="font-medium text-zinc-900">{question.title}</span>
        <span>Elapsed {formatElapsed(elapsedMs)}</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">
        <div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs font-medium text-zinc-500">
        Phase {step + 1} of {SPIDER_PHASES.length} — {phase.name}
      </p>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Interviewer</p>
        <p className="mt-2 text-sm text-zinc-800">{interviewerLine}</p>
      </div>

      <textarea
        className="mt-4 w-full rounded-lg border border-zinc-300 p-3 text-sm"
        rows={6}
        placeholder="Your response…"
        value={notes[step]}
        onChange={(e) => {
          const next = [...notes];
          next[step] = e.target.value;
          setNotes(next);
          persistNotes(next);
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
          <button type="button" className={btnPrimary} disabled={pending} onClick={finish}>
            {pending ? "Scoring…" : "End mock & see scorecard"}
          </button>
        )}
      </div>
    </div>
  );
}
