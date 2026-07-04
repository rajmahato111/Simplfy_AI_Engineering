import { PageHero } from "@/components/page-hero";
import { MockSetup } from "@/components/mock-setup";
import { listQuestions } from "@/lib/questions";

export default function MockPage() {
  const questions = listQuestions().map((q) => ({
    slug: q.slug,
    title: q.title,
    topic_label: q.topic_label,
    difficulty: q.difficulty,
  }));

  return (
    <>
      <PageHero
        eyebrow="Interview"
        title="AI mock interviewer"
        description="Timed text-first system-design mocks with SPIDER phases and a rubric scorecard."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {questions.length > 0 ? (
          <MockSetup questions={questions} />
        ) : (
          <p className="text-sm text-zinc-600">Question bank empty — run ingest first.</p>
        )}
      </div>
    </>
  );
}
