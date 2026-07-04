import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function QuestionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Interview prep"
        title="Question bank"
        description="116 AI system-design questions with practice and study modes — filter by topic, difficulty, and company."
      />
      <ComingSoonPanel title="Question bank" phase="PRD E2 · Phase P1" />
    </>
  );
}
