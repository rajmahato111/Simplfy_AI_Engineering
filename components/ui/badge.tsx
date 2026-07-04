import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BadgeBrand({ children }: { children: React.ReactNode }) {
  return (
    <Badge className="border-brand/20 bg-brand-muted text-brand-text">{children}</Badge>
  );
}
