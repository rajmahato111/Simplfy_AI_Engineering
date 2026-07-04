import { notFound } from "next/navigation";
import Link from "next/link";
import { MockInterviewFlow } from "@/components/mock-interview-flow";
import { getMockSessionReplay } from "@/app/actions/mock";
import { getQuestionBySlug } from "@/lib/questions";

type Props = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ question?: string }>;
};

export default async function MockSessionPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { question: questionSlug } = await searchParams;

  const replay = await getMockSessionReplay(sessionId);
  const slug = questionSlug ?? replay?.question.slug;
  if (!slug) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <p className="text-sm text-zinc-600">Missing question. Start from the mock setup page.</p>
        <Link href="/mock" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          ← Mock setup
        </Link>
      </div>
    );
  }

  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/mock" className="text-sm font-medium text-brand hover:underline">
        ← Exit mock
      </Link>
      {replay && (
        <p className="mt-2 text-xs text-zinc-500">Replay — completed session from history</p>
      )}
      <div className="mt-6">
        <MockInterviewFlow
          sessionId={sessionId}
          question={question}
          initialScorecard={replay?.scorecard ?? null}
        />
      </div>
    </div>
  );
}
