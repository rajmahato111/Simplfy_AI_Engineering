import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function MockPage() {
  return (
    <>
      <PageHero
        eyebrow="Interview"
        title="AI mock interviewer"
        description="Timed AI system-design mocks with rubric scorecards, follow-up probing, and session replay."
      />
      <ComingSoonPanel title="Mock interviewer" phase="PRD E4 · Phase P3" />
    </>
  );
}
