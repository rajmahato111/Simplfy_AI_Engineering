import type { StatSegment } from "@/lib/cheatsheet-schema";
import { cheatColorClasses } from "@/components/cheatsheet/colors";

export function StatSplit({ label, segments }: { label: string; segments: StatSegment[] }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-zinc-500">{label}</p>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-zinc-100">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={cheatColorClasses[seg.color].barFill}
            style={{ width: `${seg.value}%` }}
            title={`${seg.label}: ${seg.value}%`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span
              className={`h-2 w-2 rounded-full ${cheatColorClasses[seg.color].barFill}`}
            />
            {seg.label} ({seg.value}%)
          </span>
        ))}
      </div>
    </div>
  );
}
