import type { WorkedExample as WorkedExampleData } from "@/lib/cheatsheet-schema";
import { StatSplit } from "@/components/cheatsheet/stat-split";

export function WorkedExample({ example }: { example: WorkedExampleData }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-zinc-900">{example.heading}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-700">{example.body}</p>
      {example.stat && (
        <div className="mt-4">
          <StatSplit label={example.stat.label} segments={example.stat.segments} />
        </div>
      )}
    </div>
  );
}
