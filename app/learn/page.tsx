import Link from "next/link";
import { listContentSlugs, getContentBySlug } from "@/lib/content";

export default function LearnIndexPage() {
  const slugs = listContentSlugs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Learn</h1>
      <p className="text-slate-600">
        Simplified concepts and interview walkthroughs. More tracks ship as content
        batches land.
      </p>
      <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
        {slugs.map((slug) => {
          const doc = getContentBySlug(slug);
          const title = doc?.frontmatter.title ?? slug;
          const meta = [doc?.frontmatter.type, doc?.frontmatter.difficulty]
            .filter(Boolean)
            .join(" · ");
          return (
            <li key={slug}>
              <Link
                href={`/learn/${slug}`}
                className="flex flex-col gap-1 px-4 py-3 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-slate-900">{title}</span>
                <span className="text-sm text-slate-500">{meta || slug}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
