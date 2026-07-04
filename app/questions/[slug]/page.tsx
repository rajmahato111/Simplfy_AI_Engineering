import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getQuestionBySlug } from "@/lib/questions";
import { relatedChaptersForQuestion } from "@/lib/related-chapters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionStudyPanel } from "@/components/question-study-panel";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) return { title: "Question not found" };
  return { title: q.title, description: q.body_md.slice(0, 160) };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  if (!q) notFound();
  const related = relatedChaptersForQuestion(q);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/questions" className="text-sm font-medium text-brand hover:underline">
        ← Question bank
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{q.topic_label ?? q.topic}</Badge>
        <Badge className="capitalize">{q.difficulty}</Badge>
        {q.cohort && <Badge>{q.cohort}</Badge>}
        {q.upstream_id && <Badge>{q.upstream_id}</Badge>}
      </div>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-900">{q.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-700">{q.body_md}</p>

      <section className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="font-semibold text-zinc-900">Practice mode</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Run a SPIDER walkthrough with rubric checkpoint feedback for this question.
        </p>
        <Button href={`/practice?question=${q.slug}`} variant="secondary" size="sm" className="mt-4">
          Open guided practice
        </Button>
        <Button href={`/mock?question=${q.slug}`} variant="ghost" size="sm" className="mt-2">
          Start mock interview
        </Button>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-zinc-900">Related chapters</h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={r.href} className="text-sm font-medium text-brand hover:underline">
                  {r.title}
                </Link>
                <span className="ml-2 text-xs text-zinc-500">{r.type}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {q.key_insight && (
        <section className="mt-8 rounded-xl border border-brand/20 bg-brand-muted p-6">
          <h2 className="font-semibold text-zinc-900">Key insight</h2>
          <p className="mt-2 text-sm text-zinc-700">{q.key_insight}</p>
        </section>
      )}

      {q.follow_ups && q.follow_ups.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-zinc-900">Follow-up to expect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
            {q.follow_ups.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <details className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <summary className="cursor-pointer font-semibold text-zinc-900">
          Interview rubric — what interviewers look for
        </summary>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          {q.interviewer_looks_for.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <QuestionStudyPanel
        strongAnswerCovers={q.strong_answer_covers}
        sampleAnswerExcerpt={q.sample_answer_excerpt}
        sampleAnswerMd={q.sample_answer_md}
      />
    </div>
  );
}
