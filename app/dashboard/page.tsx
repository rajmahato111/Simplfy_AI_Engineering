import { auth } from "@/auth";
import { getContentBySlug } from "@/lib/content";
import { ensureUser, listUserProgress } from "@/lib/progress";
import { isDbConfigured } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login?callbackUrl=/dashboard");

  const user = await ensureUser(session.user.email, session.user.name);
  const progress = user ? await listUserProgress(user.id) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Signed in as <strong>{session.user.email}</strong>
        {!isDbConfigured() && (
          <span className="block mt-1 text-sm text-amber-700">
            Set <code className="rounded bg-amber-50 px-1">DATABASE_URL</code> to persist progress.
          </span>
        )}
      </p>

      {progress.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600">
          No activity yet.{" "}
          <Link href="/learn" className="font-medium text-brand hover:underline">
            Start learning →
          </Link>
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
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
    </div>
  );
}
