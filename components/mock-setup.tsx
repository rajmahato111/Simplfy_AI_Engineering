"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { createMockSession, MOCK_DURATION_MINUTES } from "@/lib/mock-session";
import { cn } from "@/lib/cn";

type QuestionOption = {
  slug: string;
  title: string;
  topic_label?: string;
  difficulty: string;
};

const btnPrimary = cn(
  "inline-flex h-10 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-hover",
);

function MockSetupInner({ questions }: { questions: QuestionOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preset = searchParams.get("question");
  const initial = preset && questions.some((q) => q.slug === preset) ? preset : (questions[0]?.slug ?? "");
  const [slug, setSlug] = useState(initial);

  function start() {
    if (!slug) return;
    const sessionId = crypto.randomUUID();
    createMockSession(sessionId, slug);
    router.push(`/mock/${sessionId}?question=${encodeURIComponent(slug)}`);
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-zinc-600">
        Text-first mock · ~{MOCK_DURATION_MINUTES} minutes · SPIDER framework · rubric scorecard at the end.
      </p>

      <label className="mt-6 block text-sm font-medium text-zinc-900" htmlFor="mock-question">
        Interview question
      </label>
      <select
        id="mock-question"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      >
        {questions.map((q) => (
          <option key={q.slug} value={q.slug}>
            {q.title.slice(0, 80)}
            {q.title.length > 80 ? "…" : ""} ({q.difficulty})
          </option>
        ))}
      </select>

      <button type="button" className={cn(btnPrimary, "mt-6 w-full")} onClick={start} disabled={!slug}>
        Start mock interview
      </button>

      <p className="mt-4 text-xs text-zinc-500">
        Rule-based interviewer stub — adaptive follow-ups ship with the LLM API.
      </p>
    </div>
  );
}

export function MockSetup({ questions }: { questions: QuestionOption[] }) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <MockSetupInner questions={questions} />
    </Suspense>
  );
}
