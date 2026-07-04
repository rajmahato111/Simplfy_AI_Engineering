import Link from "next/link";
import { listContentSlugs, getContentBySlug } from "@/lib/content";
import { Badge, BadgeBrand } from "@/components/ui/badge";

export default function LearnIndexPage() {
  const slugs = listContentSlugs();
  const byArea = new Map<string, typeof slugs>();

  for (const slug of slugs) {
    const doc = getContentBySlug(slug);
    const area = doc?.frontmatter.area ?? "general";
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area)!.push(slug);
  }

  const areaLabels: Record<string, string> = {
    retrieval: "Retrieval & RAG",
    agents: "Agentic systems",
    general: "General",
  };

  return (
    <div className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <BadgeBrand>Free reader</BadgeBrand>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Learn
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-zinc-600">
          Simplified concepts and interview walkthroughs — analogy first, interview lens
          always. Pick a track and read in order.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 sm:px-6">
        {[...byArea.entries()].map(([area, areaSlugs]) => (
          <section key={area}>
            <h2 className="text-lg font-semibold text-zinc-900">
              {areaLabels[area] ?? area}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {areaSlugs.map((slug) => {
                const doc = getContentBySlug(slug);
                const title = doc?.frontmatter.title ?? slug;
                const { type, difficulty, est_minutes } = doc?.frontmatter ?? {};
                return (
                  <Link
                    key={slug}
                    href={`/learn/${slug}`}
                    className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-brand/30 hover:shadow-md"
                  >
                    <div className="flex flex-wrap gap-2">
                      {type && <Badge className="capitalize">{type}</Badge>}
                      {difficulty && <Badge className="capitalize">{difficulty}</Badge>}
                      {est_minutes && <Badge>{est_minutes} min</Badge>}
                    </div>
                    <h3 className="mt-3 font-semibold text-zinc-900 group-hover:text-brand">
                      {title}
                    </h3>
                    <p className="mt-auto pt-4 text-sm font-medium text-brand">
                      Read chapter →
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
