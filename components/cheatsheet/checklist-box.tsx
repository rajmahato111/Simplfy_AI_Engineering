import { CheckCircle2 } from "lucide-react";
import type { ChecklistItem } from "@/lib/cheatsheet-schema";

export function ChecklistBox({ items }: { items: ChecklistItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-cheat-emerald" />
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
