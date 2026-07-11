import type { MethodCard as MethodCardData } from "@/lib/cheatsheet-schema";
import { cheatColorClasses } from "@/components/cheatsheet/colors";

/** Mirrors lib/mdx-components.tsx's img resolution: content-relative paths route through /content-assets/. */
function resolveDiagramSrc(slug: string, diagram: string) {
  if (diagram.startsWith("http") || diagram.startsWith("/")) return diagram;
  const asset = `${slug}/${diagram}`.replace(/\/+/g, "/");
  return `/content-assets/${asset}`;
}

export function MethodCard({ card, slug }: { card: MethodCardData; slug: string }) {
  const classes = cheatColorClasses[card.color ?? "brand"];
  return (
    <div className={`rounded-xl border ${classes.border} bg-white p-5 shadow-sm`}>
      <h3 className={`text-base font-semibold ${classes.text}`}>{card.name}</h3>
      <p className="mt-1 text-sm text-zinc-600">{card.tagline}</p>
      {card.formula && (
        <code className="mt-3 block rounded-lg bg-zinc-900 px-3 py-2 text-xs text-zinc-100">
          {card.formula}
        </code>
      )}
      {card.diagram && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveDiagramSrc(slug, card.diagram)}
          alt=""
          className="mt-3 w-full rounded-lg border border-zinc-200"
        />
      )}
      <ul className="mt-3 space-y-1.5 text-sm text-zinc-700">
        {card.bullets.map((bullet, i) => (
          <li key={i} className="flex gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${classes.bg}`} />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
