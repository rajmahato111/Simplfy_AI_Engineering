import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** All MDX slugs relative to content/, e.g. concepts/retrieval/rag-fundamentals */
export function listContentSlugs(): string[] {
  const slugs: string[] = [];

  function walk(dir: string, prefix: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.name.endsWith(".mdx")) slugs.push(rel.replace(/\.mdx$/, ""));
    }
  }

  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR, "");
  return slugs.sort();
}

export type ContentFrontmatter = {
  title?: string;
  slug?: string;
  type?: string;
  area?: string;
  difficulty?: string;
  est_minutes?: number;
  status?: string;
  source_attribution?: string;
};

export function getContentBySlug(slug: string) {
  const normalized = slug.replace(/^\/+|\/+$/g, "");
  const filePath = path.join(CONTENT_DIR, `${normalized}.mdx`);
  if (!filePath.startsWith(CONTENT_DIR) || !fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug: normalized,
    frontmatter: data as ContentFrontmatter,
    content,
    dir: path.dirname(filePath),
  };
}

/** Resolve a diagram path from an MDX file directory to an absolute content path. */
export function resolveContentAsset(slug: string, assetPath: string) {
  const doc = getContentBySlug(slug);
  if (!doc) return null;
  const abs = path.normalize(path.join(doc.dir, assetPath));
  if (!abs.startsWith(CONTENT_DIR) || !fs.existsSync(abs)) return null;
  return abs;
}

export function readContentAsset(slug: string, assetPath: string) {
  const abs = resolveContentAsset(slug, assetPath);
  if (!abs) return null;
  return fs.readFileSync(abs);
}
