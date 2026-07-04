import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { PracticeSpiderFlow } from "@/components/practice-spider-flow";

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="Guided practice"
        title="SPIDER walkthrough"
        description="Step through Scope → Prioritize → Initial architecture → Deep dive → Eval → Reliability. Submit for rubric checkpoint feedback."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading practice…</p>}>
          <PracticeSpiderFlow />
        </Suspense>
      </div>
    </>
  );
}
