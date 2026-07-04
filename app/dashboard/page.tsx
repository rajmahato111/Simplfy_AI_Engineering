import { auth } from "@/auth";
import { getContentBySlug } from "@/lib/content";
import { ensureUser, listUserProgress } from "@/lib/progress";
import { isDbConfigured } from "@/lib/db";
import { listMyMockSessions } from "@/app/actions/mock";
import { getQuestionBySlug } from "@/lib/questions";
import { computeReadiness } from "@/lib/readiness";
import { isProUser, isProBypassEnabled } from "@/lib/pro-access";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login?callbackUrl=/dashboard");

  const user = await ensureUser(session.user.email, session.user.name);
  const progress = user ? await listUserProgress(user.id) : [];
  const mocks = await listMyMockSessions();
  const readiness = user ? await computeReadiness(user.id) : null;
  const pro = user ? await isProUser(user.id) : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Signed in as <strong>{session.user.email}</strong>
        {(pro || isProBypassEnabled()) && (
          <Badge className="ml-2">Pro</Badge>
        )}
        {!isDbConfigured() && (
          <span className="block mt-1 text-sm text-amber-700">
            Set <code className="rounded bg-amber-50 px-1">DATABASE_URL</code> to persist progress and mock history.
          </span>
        )}
      </p>

      {readiness && (
        <section className="mt-8 rounded-xl border border-brand/20 bg-brand-muted p-6">
          <h2 className="font-semibold text-zinc-900">Readiness score</h2>
          <p className="mt-2 text-3xl font-semibold text-brand">{readiness.score}/100</p>
          <p className="mt-1 text-sm text-zinc-600">{readiness.label}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Chapters {readiness.chapterCoverage}% · Mock avg{" "}
            {readiness.mockAverage != null ? `${readiness.mockAverage}/100` : "—"}
          </p>
          <Link href="/study-plan" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
            Open study plan →
          </Link>
        </section>
      )}

      {mocks.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-zinc-900">Mock interviews</h2>
          <ul className="mt-4 space-y-3">
            {mocks.map((m) => {
              const q = getQuestionBySlug(m.questionSlug);
              const title = q?.title ?? m.questionSlug;
              return (
                <li key={m.id}>
                  <Link
                    href={`/mock/${m.id}?question=${encodeURIComponent(m.questionSlug)}`}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-brand/30"
                  >
                    <span className="font-medium text-zinc-900 line-clamp-2">{title}</span>
                    <div className="ml-3 flex shrink-0 gap-2">
                      {m.overall != null && <Badge>{m.overall}/100</Badge>}
                      {m.completed ? <Badge className="capitalize">Done</Badge> : <Badge>In progress</Badge>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900">Learning progress</h2>
        {progress.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">
            No chapter activity yet.{" "}
            <Link href="/learn" className="font-medium text-brand hover:underline">
              Start learning →
            </Link>
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {progress.map((p) => {
              const doc = getContentBySlug(p.slug);
              const title = doc?.frontmatter.title ?? p.slug;
              return (
                <li key={p.id}>
                  <Link
                    href={`/learn/${p.slug}`}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-brand/30"
                  >
                    <span className="font-medium text-zinc-900">{title}</span>
                    <div className="flex gap-2">
                      {p.bookmarked && <Badge>Bookmarked</Badge>}
                      {p.completed && <Badge className="capitalize">Done</Badge>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
