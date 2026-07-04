import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { QUESTION_DIFFICULTIES } from "@/lib/question-schema";
import { listQuestionTopics, listQuestions, questionCount } from "@/lib/questions";

export const metadata: Metadata = {
  title: "Question bank",
  description: "AI system-design interview questions with practice and study modes.",
};

type Props = {
  searchParams: Promise<{ topic?: string; difficulty?: string; q?: string }>;
};

export default async function QuestionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const difficulty = QUESTION_DIFFICULTIES.find((d) => d === params.difficulty);
  const questions = listQuestions({
    topic: params.topic,
    difficulty,
    q: params.q,
  });
  const topics = listQuestionTopics();
  const total = questionCount();

  return (
    <div className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <Badge className="capitalize">Interview prep</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Question bank
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600">
          {total > 0
            ? `${total} AI system-design questions — filter by topic, difficulty, and company.`
            : "116 AI system-design questions ship with content ingest. Schema and filters are ready."}
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <form className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm" method="get">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search questions…"
            className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <select
            name="topic"
            defaultValue={params.topic ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">All topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            defaultValue={params.difficulty ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">All levels</option>
            {QUESTION_DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Filter
          </button>
        </form>

        {questions.length > 0 ? (
          <ul className="mt-8 space-y-4">
            {questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/questions/${q.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:border-brand/30"
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge>{q.topic}</Badge>
                    <Badge className="capitalize">{q.difficulty}</Badge>
                  </div>
                  <h2 className="mt-2 font-semibold text-zinc-900">{q.title}</h2>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
            <p className="font-semibold text-zinc-900">No questions in the bank yet</p>
            <p className="mt-2 text-sm text-zinc-600">
              The typed schema lives in <code className="rounded bg-white px-1">lib/question-schema.ts</code>.
              Questions load from <code className="rounded bg-white px-1">data/questions.json</code> after ingest.
            </p>
            <Link href="/learn" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
              Browse learn content while questions ingest →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
