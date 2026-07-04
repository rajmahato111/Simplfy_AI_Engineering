import { BadgeBrand } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {eyebrow && <BadgeBrand>{eyebrow}</BadgeBrand>}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600">{description}</p>
      </div>
    </div>
  );
}

export function ComingSoonPanel({
  title,
  phase,
  ctaHref = "/learn",
  ctaLabel = "Browse free content",
}: {
  title: string;
  phase: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-brand">{phase}</p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-900">{title}</h2>
        <p className="mt-3 max-w-xl text-zinc-600">
          This surface is on the roadmap. The free reader is live today — start there while
          we build the interactive layer.
        </p>
        <div className="mt-6">
          <Button href={ctaHref} variant="secondary">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
