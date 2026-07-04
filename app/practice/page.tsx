import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function PracticePage() {
  return (
    <>
      <PageHero
        eyebrow="Interactive"
        title="Guided practice"
        description="Step through SPIDER walkthroughs with checkpoint feedback — the Hello Interview motion, for AI system design."
      />
      <ComingSoonPanel title="Guided practice" phase="PRD E3 · Phase P2" />
    </>
  );
}
