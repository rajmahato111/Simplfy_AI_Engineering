import { getContentBySlug, listContentSlugs } from "./content";

/** Canonical reading order; unknown slugs append alphabetically. */
const READING_ORDER = [
  "concepts/retrieval/rag-fundamentals",
  "concepts/retrieval/chunking-strategies",
  "walkthroughs/design-a-production-rag-system",
];

export function orderedContentSlugs(): string[] {
  const all = listContentSlugs();
  const ordered = READING_ORDER.filter((s) => all.includes(s));
  for (const slug of all.sort()) {
    if (!ordered.includes(slug)) ordered.push(slug);
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
