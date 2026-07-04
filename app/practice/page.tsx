import { PageHero } from "@/components/page-hero";
import { PracticeSpiderFlow } from "@/components/practice-spider-flow";

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="Guided practice"
        title="SPIDER walkthrough"
        description="Step through Scope → Prioritize → Initial architecture → Deep dive → Eval → Reliability. AI checkpoint feedback ships next."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <PracticeSpiderFlow />
      </div>
    </>
  );
}
