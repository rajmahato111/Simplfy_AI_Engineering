import { PageHero } from "@/components/page-hero";
import { PricingCheckoutButton } from "@/components/pricing-checkout-button";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Premium"
        title="Pricing"
        description="Reading stays free. Guided practice, mocks, and the full tutor ship on Pro — freemium like Hello Interview."
      />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-zinc-500">Free</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Reader</h2>
            <p className="mt-3 text-zinc-600">
              Full concept library, walkthroughs, glossary, and search. No card required.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700">
              <li>Learn + Search</li>
              <li>Question bank previews</li>
              <li>SPIDER practice shell</li>
            </ul>
            <div className="mt-8">
              <Button href="/learn" variant="secondary">
                Start with free reader
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-brand/30 bg-white p-8 shadow-sm ring-1 ring-brand/10">
            <p className="text-sm font-medium text-brand">Pro</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Interactive prep</h2>
            <p className="mt-3 text-zinc-600">
              AI feedback on practice, mock interviews, and the full grounded tutor.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-700">
              <li>Guided SPIDER with AI checkpoints</li>
              <li>Mock interviewer sessions</li>
              <li>RAG tutor with citations</li>
            </ul>
            <div className="mt-8">
              <PricingCheckoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
