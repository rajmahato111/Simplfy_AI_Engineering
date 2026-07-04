import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Progress"
        title="Dashboard"
        description="Track reading progress, readiness scores, and your personalized study plan."
      />
      <ComingSoonPanel title="Dashboard" phase="PRD E8 · Phase P1–P2" />
    </>
  );
}
