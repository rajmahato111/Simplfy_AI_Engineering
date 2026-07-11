import { cheatColorClasses } from "@/components/cheatsheet/colors";
import type { CheatColorToken } from "@/lib/cheatsheet-schema";

export function ColorBar({
  value,
  color,
  label,
}: {
  value: number;
  color: CheatColorToken;
  label?: string;
}) {
  const classes = cheatColorClasses[color];
  return (
    <div className="min-w-[120px]">
      {label && <p className="mb-1 text-xs text-zinc-500">{label}</p>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className={`h-full transition-all ${classes.barFill}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
