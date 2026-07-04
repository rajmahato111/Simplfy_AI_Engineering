"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudyPlanWeek } from "@/lib/study-plan";

export function StudyPlanForm({ roles }: { roles: string[] }) {
  const [role, setRole] = useState(roles[0] ?? "ai-engineer");
  const [weeks, setWeeks] = useState(4);
  const [plan, setPlan] = useState<StudyPlanWeek[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const res = await fetch("/api/study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, weeks }),
    });
    const data = (await res.json()) as { plan: StudyPlanWeek[] };
    setPlan(data.plan);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-zinc-900" htmlFor="role">
          Target role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <label className="mt-4 block text-sm font-medium text-zinc-900" htmlFor="weeks">
          Timeline (weeks)
        </label>
        <input
          id="weeks"
          type="number"
          min={1}
          max={12}
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
          className="mt-2 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void generate()}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {loading ? "Building…" : "Generate plan"}
        </button>
      </div>
      {plan && (
        <ul className="mt-8 space-y-6">
          {plan.map((week) => (
            <li key={week.week} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="font-semibold text-zinc-900">Week {week.week}</h2>
              <ul className="mt-3 space-y-2">
                {week.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm font-medium text-brand hover:underline">
                      {item.title}
                    </Link>
                    <span className="ml-2 text-xs text-zinc-500">{item.kind}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
