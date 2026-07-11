import type { QuestionListItem } from "@/lib/cheatsheet-schema";

export function QuestionList({ items }: { items: QuestionListItem[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-muted text-xs font-semibold text-brand-text">
            {i + 1}
          </span>
          <div>
            <p className="text-zinc-800">{item.question}</p>
            {item.hint && <p className="mt-0.5 text-xs text-zinc-500">{item.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
