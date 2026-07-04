import { getContentBySlug, listContentSlugs } from "./content";
import { searchContent as keywordSearch } from "./search";
import { getDb, isDbConfigured } from "./db";
import { contentChunks } from "./db/search-schema";
import { sql } from "drizzle-orm";

function excerptFromContent(content: string, maxLen = 200) {
  const line = content
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("|") && !l.startsWith("!["));
  if (!line) return "";
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
}

/** Rebuild content_chunks from MDX (run after ingest or on deploy). */
export async function rebuildSearchIndex() {
  const db = getDb();
  if (!db) return { ok: false as const, reason: "no database" };

  await db.delete(contentChunks);
  for (const slug of listContentSlugs()) {
    const doc = getContentBySlug(slug)!;
    await db.insert(contentChunks).values({
      slug,
      title: doc.frontmatter.title,
      excerpt: excerptFromContent(doc.content),
    });
  }
  return { ok: true as const, count: listContentSlugs().length };
}

export async function searchContentHybrid(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [];

  if (isDbConfigured()) {
    const db = getDb();
    if (db) {
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
          type: getContentBySlug(r.slug)?.frontmatter.type ?? "concept",
          area: getContentBySlug(r.slug)?.frontmatter.area ?? "general",
          excerpt: r.excerpt,
          score: 1,
          href: `/learn/${r.slug}`,
        }));
      }
    }
  }

  return keywordSearch(q, limit);
}
