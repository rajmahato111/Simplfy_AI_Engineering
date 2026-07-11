import type { IconListItem } from "@/lib/cheatsheet-schema";
import { cheatIcons } from "@/components/cheatsheet/icons";

export function IconList({ items }: { items: IconListItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => {
        const Icon = cheatIcons[item.icon];
        return (
          <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700">
            <Icon size={16} className="mt-0.5 shrink-0 text-zinc-500" />
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
