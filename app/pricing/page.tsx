import { PageHero, ComingSoonPanel } from "@/components/page-hero";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Premium"
        title="Pricing"
        description="Reading stays free. Guided practice, mocks, and the full tutor ship on Pro — freemium like Hello Interview."
      />
      <ComingSoonPanel
        title="Pro tier"
        phase="PRD §11 · Phase P2"
        ctaLabel="Start with free reader"
      />
    </>
  );
}
