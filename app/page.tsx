import Link from "next/link";
import { Badge, BadgeBrand } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listContentSlugs } from "@/lib/content";
import { questionCount } from "@/lib/questions";

const TRACKS = [
  {
    area: "Retrieval & RAG",
    blurb: "Chunking, hybrid search, reranking, and production RAG system design.",
    href: "/learn/concepts/retrieval/rag-fundamentals",
    count: 3,
  },
] as const;

const STATS = [
  { label: "Chapters", value: String(listContentSlugs().length) },
  { label: "Questions", value: String(questionCount()) },
  { label: "Free to read", value: "100%" },
] as const;

const PILLARS = [
  {
    title: "Learn",
    desc: "Simplified concepts and interview walkthroughs with diagrams.",
    href: "/learn",
  },
  {
    title: "Practice",
    desc: "Guided SPIDER walkthroughs with checkpoint feedback.",
    href: "/practice",
  },
  {
    title: "Mock Interview",
    desc: "AI system-design mocks with rubric scorecards.",
    href: "/mock",
  },
  {
    title: "Tutor",
    desc: "Grounded, cited Q&A over the full corpus.",
    href: "/tutor",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-brand-muted via-white to-white">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <BadgeBrand>Hello Interview, for AI</BadgeBrand>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-tight">
            How AI engineers prepare for production-system interviews
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Practical prep for RAG, agents, evals, and AI system design — free reader,
            guided practice, mock interviewer, and a grounded tutor on an open knowledge
            base.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/learn" size="lg">
              Start with RAG fundamentals
            </Button>
            <Button href="/search" variant="secondary" size="lg">
              Search the library
            </Button>
            <Button href="/learn/walkthroughs/design-a-production-rag-system" variant="ghost" size="lg">
              Production RAG walkthrough
            </Button>
          </div>
          <dl className="mt-10 flex flex-wrap gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-2xl font-semibold text-zinc-900">{s.value}</dt>
                <dd className="text-sm text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-zinc-500">
            Start free. Go deep when you&apos;re ready.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Learn at your own pace — it&apos;s free
            </h2>
            <p className="mt-2 text-zinc-600">
              Tracks organized by interview topic. More areas ship as content batches land.
            </p>
          </div>
          <Link href="/learn" className="text-sm font-medium text-brand hover:underline">
            View all tracks →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <Link
              key={track.area}
              href={track.href}
              className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-zinc-900 group-hover:text-brand">
                  {track.area}
                </h3>
                <Badge>{track.count} chapters</Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{track.blurb}</p>
              <p className="mt-4 text-sm font-medium text-brand">Open track →</p>
            </Link>
          ))}
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-6">
            <h3 className="font-semibold text-zinc-700">Agents · Evals · Inference</h3>
            <p className="mt-3 text-sm text-zinc-500">
              Coming soon — same Hello Interview-style depth, purpose-built for AI roles.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50/80">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-zinc-900">
            Everything you need to rehearse the loop
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <h3 className="font-semibold text-zinc-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-brand/20 bg-brand-muted px-6 py-10 text-center sm:px-10">
          <h2 className="text-xl font-semibold text-zinc-900">
            Built on open knowledge, differentiated by practice
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
            Reading stays free and attributed. Guided practice, mocks, and the AI tutor are
            the moat — the same freemium motion as Hello Interview, for AI engineering.
          </p>
          <div className="mt-6">
            <Button href="/learn">Browse the free reader</Button>
          </div>
        </div>
      </section>
    </>
  );
}
