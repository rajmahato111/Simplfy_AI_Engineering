import type { Metadata } from "next";
import { signInDemo } from "./actions";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to track progress, bookmarks, and practice sessions.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Auth skeleton for progress and bookmarks. Use the demo account or GitHub when configured.
      </p>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <form action={signInDemo}>
          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand/90"
          >
            Continue as demo user
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-500">
          Demo account: <code className="rounded bg-zinc-100 px-1">demo@simplify.ai</code>
        </p>
      </div>
    </div>
  );
}
