import { getContentBySlug, listContentSlugs } from "./content";
import { searchContent as keywordSearch } from "./search";
import { getDb, isDbConfigured } from "./db";
import { contentChunks } from "./db/search-schema";
import { listGlossaryTerms } from "./glossary";
import { listQuestions } from "./questions";
import { sql } from "drizzle-orm";

function excerptFromContent(content: string, maxLen = 200) {
  const line = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("!["));
  if (!line) return "";
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
}

function hrefForIndexedSlug(slug: string) {
  if (slug.startsWith("question:")) return `/questions/${slug.slice("question:".length)}`;
  if (slug.startsWith("glossary:")) {
    const id = slug.slice("glossary:".length);
    const term = listGlossaryTerms().find((g) => g.id === id);
    return `/glossary?letter=${term?.letter ?? "A"}`;
  }
  return `/learn/${slug}`;
}

function typeForIndexedSlug(slug: string) {
  if (slug.startsWith("question:")) return "question";
  if (slug.startsWith("glossary:")) return "glossary";
  return getContentBySlug(slug)?.frontmatter.type ?? "concept";
}

function areaForIndexedSlug(slug: string) {
  if (slug.startsWith("question:")) {
    const q = listQuestions().find((item) => item.slug === slug.slice("question:".length));
    return q?.topic_label ?? q?.topic ?? "interview";
  }
  if (slug.startsWith("glossary:")) return "reference";
  return getContentBySlug(slug)?.frontmatter.area ?? "general";
}

/** Rebuild content_chunks from MDX + questions + glossary (run after ingest or on deploy). */
export async function rebuildSearchIndex() {
  const db = getDb();
  if (!db) return { ok: false as const, reason: "no database" };

  await db.delete(contentChunks);

  const rows: { slug: string; title: string; excerpt: string }[] = [];

  for (const slug of listContentSlugs()) {
    const doc = getContentBySlug(slug)!;
    rows.push({
      slug,
      title: doc.frontmatter.title,
      excerpt: excerptFromContent(doc.content),
    });
  }

  for (const q of listQuestions()) {
    rows.push({
      slug: `question:${q.slug}`,
      title: q.title,
      excerpt: q.body_md.slice(0, 200),
    });
  }

  for (const g of listGlossaryTerms()) {
    rows.push({
      slug: `glossary:${g.id}`,
      title: g.term,
      excerpt: g.definition.slice(0, 200),
    });
  }

  if (rows.length) await db.insert(contentChunks).values(rows);

  return { ok: true as const, count: rows.length };
}

export async function searchContentHybrid(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [];

  if (isDbConfigured()) {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select()
          .from(contentChunks)
          .where(
            sql`to_tsvector('english', ${contentChunks.title} || ' ' || ${contentChunks.excerpt}) @@ plainto_tsquery('english', ${q})`,
          )
          .limit(limit);
        if (rows.length) {
          return rows.map((r) => ({
            slug: r.slug,
            title: r.title,
            type: typeForIndexedSlug(r.slug),
            area: areaForIndexedSlug(r.slug),
            excerpt: r.excerpt,
            score: 1,
            href: hrefForIndexedSlug(r.slug),
          }));
        }
      } catch {
        // ponytail: keyword fallback when Postgres is configured but unreachable
      }
    }
  }

  return keywordSearch(q, limit);
}
