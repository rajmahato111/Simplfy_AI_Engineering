import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getContentBySlug, listContentSlugs } from "@/lib/content";
import { mdxComponents } from "@/lib/mdx-components";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return listContentSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export default async function LearnDocPage({ params }: Props) {
  const { slug: parts } = await params;
  const slug = parts.join("/");
  const doc = getContentBySlug(slug);
  if (!doc) notFound();

  const { content: MdxBody } = await compileMDX({
    source: doc.content,
    components: mdxComponents(slug),
    options: { parseFrontmatter: false },
  });

  const { title, type, difficulty, est_minutes, source_attribution, status } =
    doc.frontmatter;

  return (
    <article className="prose max-w-none">
      <header className="mb-8 space-y-2 border-b border-slate-200 pb-6 not-prose">
        <p className="text-sm text-slate-500">
          {[type, difficulty, est_minutes && `${est_minutes} min`, status]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        {source_attribution && (
          <p className="text-sm text-slate-600">{source_attribution}</p>
        )}
      </header>
      {MdxBody}
    </article>
  );
}
