import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getContentBySlug, listContentSlugs } from "@/lib/content";
import { getAdjacentSlugs } from "@/lib/content-nav";
import { prepareContentForRender } from "@/lib/content-audit";
import { extractH2Headings } from "@/lib/headings";
import { mdxComponents } from "@/lib/mdx-components";
import { ArticleBreadcrumb, ArticleToc } from "@/components/article-chrome";
import { ArticlePrevNext } from "@/components/article-prev-next";
import { Badge, BadgeBrand } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return listContentSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const doc = getContentBySlug(slug);
  if (!doc) return { title: "Not found" };

  const { title, est_minutes } = doc.frontmatter;
  const description = doc.content
    .split("\n")
    .find((l) => l.trim() && !l.startsWith("#"))
    ?.replace(/^#+\s*/, "")
    .slice(0, 160);

  return {
    title,
    description: description ?? `${title} — Simplify AI Engineering`,
    openGraph: {
      title,
      description: description ?? undefined,
      type: "article",
    },
    other: est_minutes ? { "reading-time": `${est_minutes} min` } : undefined,
  };
}

export default async function LearnDocPage({ params }: Props) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const doc = getContentBySlug(slug);
  if (!doc) notFound();

  const headings = extractH2Headings(doc.content);
  const diagrams = doc.frontmatter.diagrams;
  const source = prepareContentForRender(doc.content, diagrams);

  const { content: MdxBody } = await compileMDX({
    source,
    components: mdxComponents(slug, headings),
    options: {
      parseFrontmatter: false,
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
  });

  const { title, type, area, difficulty, est_minutes, source_attribution } =
    doc.frontmatter;
  const { prev, next } = getAdjacentSlugs(slug);

  return (
    <div className="border-b border-zinc-200 bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <ArticleBreadcrumb area={area} title={title ?? slug} />

        <div className="mt-8 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)_220px]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ArticleToc headings={headings} />
          </aside>

          <article className="min-w-0">
            <header className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              {type && (
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {type === "walkthrough" ? "Interview walkthrough" : "Concept"}
                </p>
              )}
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                {title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {difficulty && <Badge className="capitalize">{difficulty}</Badge>}
                {est_minutes && <Badge>{est_minutes} min read</Badge>}
                <BadgeBrand>Free</BadgeBrand>
              </div>
              {source_attribution && (
                <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                  {source_attribution}
                </p>
              )}
            </header>

            <div className="prose mx-auto mt-8 max-w-none px-1 pb-12">{MdxBody}</div>
            <ArticlePrevNext prev={prev} next={next} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-brand/20 bg-brand-muted p-5">
              <p className="text-sm font-semibold text-zinc-900">Practice this topic</p>
              <p className="mt-2 text-sm text-zinc-600">
                Guided practice and AI mock interviews ship in the next phase.
              </p>
              <div className="mt-4 space-y-2">
                <Button href="/practice" variant="secondary" size="sm" className="w-full">
                  Guided practice
                </Button>
                <Button href="/tutor" variant="ghost" size="sm" className="w-full">
                  Ask the tutor
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
