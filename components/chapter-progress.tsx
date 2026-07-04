"use client";

import { useTransition } from "react";
import { toggleBookmark, toggleComplete } from "@/app/actions/progress";

export function ChapterProgress({
  slug,
  completed,
  bookmarked,
  signedIn,
}: {
  slug: string;
  completed: boolean;
  bookmarked: boolean;
  signedIn: boolean;
}) {
  const [bookmarkPending, startBookmark] = useTransition();
  const [completePending, startComplete] = useTransition();

  if (!signedIn) {
    return (
      <p className="text-sm text-zinc-500">
        <a href="/login" className="font-medium text-brand hover:underline">
          Sign in
        </a>{" "}
        to bookmark and track progress.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={bookmarkPending}
        onClick={() => startBookmark(() => void toggleBookmark(slug, !bookmarked))}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
          bookmarked
            ? "border-brand bg-brand-muted text-brand"
            : "border-zinc-300 text-zinc-700 hover:border-brand/40"
        }`}
      >
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
      <button
        type="button"
        disabled={completePending}
        onClick={() => startComplete(() => void toggleComplete(slug, !completed))}
        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
          completed
            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
            : "border-zinc-300 text-zinc-700 hover:border-emerald-400"
        }`}
      >
        {completed ? "Completed ✓" : "Mark complete"}
      </button>
    </div>
  );
}
