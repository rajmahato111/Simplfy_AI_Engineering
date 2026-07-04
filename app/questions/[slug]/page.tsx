import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getQuestionBySlug } from "@/lib/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/questions" className="text-sm font-medium text-brand hover:underline">
        ← Question bank
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{q.topic}</Badge>
        <Badge className="capitalize">{q.difficulty}</Badge>
      </div>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-900">{q.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-700">{q.body_md}</p>

      <section className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
        <h2 className="font-semibold text-zinc-900">Practice mode</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Answer hidden until you reveal — full interactive practice ships in Phase P2.
        </p>
        <Button href="/practice" variant="secondary" size="sm" className="mt-4">
          Open guided practice
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-zinc-900">What interviewers look for</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          {q.interviewer_looks_for.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <details className="mt-8 rounded-xl border border-brand/20 bg-brand-muted p-6">
        <summary className="cursor-pointer font-semibold text-zinc-900">
          Study mode — strong answer covers
        </summary>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          {q.strong_answer_covers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
