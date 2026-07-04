import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function TutorPage() {
  return (
    <>
      <PageHero
        eyebrow="Coach"
        title="AI tutor"
        description="Grounded, cited Q&A over the full corpus — ask anything, get answers linked to source chapters."
      />
      <ComingSoonPanel title="AI tutor" phase="PRD E6 · Phase P2" />
    </>
  );
}
