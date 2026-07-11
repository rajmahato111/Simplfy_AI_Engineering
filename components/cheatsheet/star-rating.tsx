import { Star } from "lucide-react";

export function StarRating({ value }: { value: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < filled ? "fill-cheat-star text-cheat-star" : "text-zinc-300"}
        />
      ))}
    </div>
  );
}
