import fs from "fs";
import path from "path";
import { getContentBySlug, listContentSlugs } from "./content";

const CATALOG_FILE = path.join(process.cwd(), "data", "mdx-catalog.json");

type CatalogEntry = {
  target_mdx: string;
  skip?: boolean;
  section: string;
};

/** Canonical reading order from upstream catalog; polished chapters first within each section. */
const POLISHED_FIRST = [
  "concepts/retrieval/rag-fundamentals",
  "concepts/retrieval/chunking-strategies",
  "walkthroughs/design-a-production-rag-system",
];

function loadCatalogOrder(): string[] {
  if (!fs.existsSync(CATALOG_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(CATALOG_FILE, "utf8")) as CatalogEntry[];
  return raw.filter((e) => !e.skip).map((e) => e.target_mdx);
}

export function orderedContentSlugs(): string[] {
  const all = new Set(listContentSlugs());
  const ordered: string[] = [];

  for (const slug of POLISHED_FIRST) {
    if (all.has(slug)) {
      ordered.push(slug);
      all.delete(slug);
    }
  }

  for (const slug of loadCatalogOrder()) {
    if (all.has(slug) && !ordered.includes(slug)) {
      ordered.push(slug);
      all.delete(slug);
    }
  }

  for (const slug of [...all].sort()) {
    ordered.push(slug);
  }

  return ordered;
}

export function getAdjacentSlugs(slug: string) {
  const slugs = orderedContentSlugs();
  const index = slugs.indexOf(slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? slugs[index - 1] : undefined,
    next: index < slugs.length - 1 ? slugs[index + 1] : undefined,
  };
}

export function getContentTitle(slug: string) {
  return getContentBySlug(slug)?.frontmatter.title ?? slug;
}
