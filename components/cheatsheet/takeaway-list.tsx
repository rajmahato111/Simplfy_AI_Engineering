import { Sparkles } from "lucide-react";

export function TakeawayList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
          <Sparkles size={16} className="mt-0.5 shrink-0 text-cheat-amber" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
