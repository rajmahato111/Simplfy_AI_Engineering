import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          AI-native prep for AI engineering interviews
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Learn production AI systems, rehearse system-design interviews, and get
          feedback — built on an open, attributed knowledge base.
        </p>
        <Link
          href="/learn"
          className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Browse the reader
        </Link>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <p>
          <strong className="text-slate-900">Status:</strong> P0 foundation — free
          reader skeleton. Guided practice, mock interviewer, and tutor ship in later
          phases per the PRD.
        </p>
      </section>
    </div>
  );
}
