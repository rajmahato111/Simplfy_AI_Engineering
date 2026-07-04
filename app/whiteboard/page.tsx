import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { listWhiteboardExercises } from "@/lib/whiteboard-exercises";

export default function WhiteboardPage() {
  const exercises = listWhiteboardExercises();

  return (
    <>
      <PageHero
        eyebrow="Practice"
        title="System design whiteboard"
        description="Timed architecture exercises with solution walkthroughs and AI critique."
      />
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {exercises.length === 0 ? (
          <p className="text-sm text-zinc-600">No exercises ingested yet. Run npm run ingest:whiteboard.</p>
        ) : (
          <ul className="space-y-4">
            {exercises.map((ex) => (
              <li key={ex.id}>
                <Link
                  href={`/whiteboard/exercises/${ex.slug}`}
                  className="block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-brand/40"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Exercise {ex.number}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-zinc-900">{ex.title}</h2>
                  <p className="mt-2 text-sm text-zinc-600">{ex.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
