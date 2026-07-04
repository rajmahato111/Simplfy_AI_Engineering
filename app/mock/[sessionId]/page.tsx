import { notFound } from "next/navigation";
import Link from "next/link";
import { MockInterviewFlow } from "@/components/mock-interview-flow";
import { getQuestionBySlug } from "@/lib/questions";

type Props = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ question?: string }>;
};

export default async function MockSessionPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { question: questionSlug } = await searchParams;
  if (!questionSlug) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <p className="text-sm text-zinc-600">Missing question. Start from the mock setup page.</p>
        <Link href="/mock" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          ← Mock setup
        </Link>
      </div>
    );
  }

  const question = getQuestionBySlug(questionSlug);
  if (!question) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/mock" className="text-sm font-medium text-brand hover:underline">
        ← Exit mock
      </Link>
      <div className="mt-6">
        <MockInterviewFlow sessionId={sessionId} question={question} />
      </div>
    </div>
  );
}
