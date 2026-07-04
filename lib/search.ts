import { getContentBySlug, listContentSlugs } from "./content";
import { listGlossaryTerms } from "./glossary";
import { listQuestions } from "./questions";

export type SearchResult = {
  slug: string;
  title: string;
  type: string;
  area: string;
  excerpt: string;
  score: number;
  href: string;
};

function excerptFromContent(content: string, maxLen = 140) {
  const line = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("!["));
  if (!line) return "";
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
}

function buildIndex() {
  const mdx = listContentSlugs().map((slug) => {
    const doc = getContentBySlug(slug)!;
    const { title, type, area, tags } = doc.frontmatter;
    const bodyText = doc.content.replace(/[#*|`[\]()!>-]/g, " ");
    return {
      slug,
      title,
      type,
      area,
      haystack: [title, area, type, ...tags, bodyText].join(" ").toLowerCase(),
      excerpt: excerptFromContent(doc.content),
      href: `/learn/${slug}`,
    };
  });

  const questions = listQuestions().map((q) => ({
    slug: q.slug,
    title: q.title,
    type: "question",
    area: q.topic_label ?? q.topic,
    haystack: [q.title, q.topic, q.body_md, ...q.interviewer_looks_for].join(" ").toLowerCase(),
    excerpt: q.body_md.slice(0, 140),
    href: `/questions/${q.slug}`,
  }));

  const glossary = listGlossaryTerms().map((g) => ({
    slug: g.id,
    title: g.term,
    type: "glossary",
    area: "reference",
    haystack: [g.term, g.definition].join(" ").toLowerCase(),
    excerpt: g.definition.slice(0, 140),
    href: `/glossary?letter=${g.letter}`,
  }));

  return [...mdx, ...questions, ...glossary];
}

/** Simple keyword search over MDX corpus (FTS upgrade when Postgres lands). */
export function searchContent(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const index = buildIndex();

  return index
    .map((entry) => {
      let score = 0;
      for (const term of terms) {
        if (entry.title.toLowerCase().includes(term)) score += 10;
        if (entry.haystack.includes(term)) score += 1;
      }
      return {
        slug: entry.slug,
        title: entry.title,
        type: entry.type,
        area: entry.area,
        excerpt: entry.excerpt,
        score,
        href: entry.href,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
