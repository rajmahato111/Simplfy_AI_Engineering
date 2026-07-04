import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getWhiteboardExercise } from "@/lib/whiteboard-exercises";
import { Button } from "@/components/ui/button";
import { WhiteboardShell } from "@/components/whiteboard-shell";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ex = getWhiteboardExercise(slug);
  if (!ex) return { title: "Exercise not found" };
  return { title: ex.title, description: ex.summary };
}

export default async function WhiteboardExercisePage({ params }: Props) {
  const { slug } = await params;
  const ex = getWhiteboardExercise(slug);
  if (!ex) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/whiteboard" className="text-sm font-medium text-brand hover:underline">
        ← Whiteboard exercises
      </Link>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Exercise {ex.number}
      </p>
      <h1 className="mt-1 text-3xl font-semibold text-zinc-900">{ex.title}</h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
        {ex.problem_statement}
      </p>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="font-semibold text-zinc-900">Practice with SPIDER</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Run a structured walkthrough or mock interview for this system design prompt.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/practice" variant="secondary" size="sm">
            Open guided practice
          </Button>
          <Button href="/mock" variant="ghost" size="sm">
            Start mock interview
          </Button>
        </div>
      </section>

      {ex.time_allocation_md && (
        <section className="mt-8">
          <h2 className="font-semibold text-zinc-900">Time allocation</h2>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
            {ex.time_allocation_md}
          </pre>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-semibold text-zinc-900">Your whiteboard</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Describe your architecture in prose or ASCII, then request an AI critique.
        </p>
        <div className="mt-4">
          <WhiteboardShell
            prompt={`Exercise ${ex.number}: ${ex.title}\n\n${ex.problem_statement.slice(0, 1200)}`}
          />
        </div>
      </section>

      <section className="mt-12 space-y-8">
        <h2 className="font-semibold text-zinc-900">Solution walkthrough</h2>
        {ex.sections
          .filter((s) => !/problem statement|time allocation/i.test(s.title))
          .map((s) => (
            <article
              key={s.id}
              className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ${s.level === 4 ? "ml-0 sm:ml-4" : ""}`}
            >
              <h3 className={`font-semibold text-zinc-900 ${s.level === 4 ? "text-base" : "text-lg"}`}>
                {s.title}
              </h3>
              <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                {s.body_md}
              </pre>
            </article>
          ))}
      </section>
    </div>
  );
}
