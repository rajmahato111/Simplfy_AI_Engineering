import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 text-zinc-600">
        Signed in as <strong>{session.user.email}</strong>. Progress, bookmarks, and readiness
        scores ship in the next phase.
      </p>
      <Link href="/learn" className="mt-6 inline-block text-sm font-medium text-brand hover:underline">
        Continue learning →
      </Link>
    </div>
  );
}
