import type { UpstreamChapter } from "./upstream-catalog";
import { areaForSection, slugFromUpstream } from "./upstream-catalog";

const ATTRIBUTION =
  "Factual basis: AI System Design Guide (MIT) by Om Bharatiya; draft reader edition — pending style-guide rewrite. See CREDITS.md.";

const SKIP_UPSTREAM = new Set([
  "06-retrieval-systems/01-rag-fundamentals.md",
  "06-retrieval-systems/02-chunking-strategies.md",
  "16-case-studies/01-enterprise-rag.md",
]);

export function shouldSkipUpstream(path: string) {
  return SKIP_UPSTREAM.has(path);
}

function titleFromMarkdown(md: string, fallback: string) {
  const h1 = md.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return h1 || fallback;
}

function sanitizeSegment(text: string) {
  return text
    .replace(/<(?![a-zA-Z/!&])/g, "&lt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/<br\s*\/?>/gi, " ");
}

function sanitizeForMdx(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => (part.startsWith("```") ? part : sanitizeSegment(part)))
    .join("");
}

function stripBoilerplate(md: string) {
  return md
    .replace(/^#\s+.+\n+/, "")
    .replace(/## Table of Contents[\s\S]*?(?=\n## |\n---|\n$)/i, "")
    .replace(/^---\n+/gm, "")
    .trim();
}

function firstParagraph(md: string) {
  const blocks = md.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    if (block.startsWith("#")) continue;
    if (block.startsWith("|")) continue;
    if (block.startsWith("```")) continue;
    if (block.startsWith("- ")) continue;
    const flat = block.replace(/\*\*/g, "").replace(/\n/g, " ").trim();
    if (flat.length > 40) return flat;
  }
  return "This chapter covers core ideas you need for interviews and production systems.";
}

function extractInterviewSection(md: string) {
  const m = md.match(/## Interview Questions[\s\S]*?(?=\n## |\n$)/i);
  return m ? m[0].replace(/^## Interview Questions\s*/i, "").trim() : "";
}

function mainBodyWithoutInterview(md: string) {
  return md.replace(/## Interview Questions[\s\S]*?(?=\n## |$)/i, "").trim();
}

function inferDifficulty(section: string, filename: string): "beginner" | "intermediate" | "advanced" {
  const slug = slugFromUpstream(filename);
  if (/fundamental|intro|basics|overview|landscape|taxonomy/.test(slug)) return "beginner";
  if (/advanced|scale|production|security|governance|compliance|ensemble/.test(slug)) return "advanced";
  if (section === "16-case-studies") return "advanced";
  if (section === "01-foundations") return "beginner";
  return "intermediate";
}

function inferType(section: string): "concept" | "walkthrough" {
  return section === "16-case-studies" ? "walkthrough" : "concept";
}

function tagsFor(chapter: UpstreamChapter): string[] {
  const area = areaForSection(chapter.section);
  const slug = slugFromUpstream(chapter.filename);
  const parts = slug.split("-").filter((p) => p.length > 2);
  const tags = [area, ...parts.slice(0, 4)];
  return [...new Set(tags)].slice(0, 6);
}

function estMinutes(md: string) {
  const words = md.split(/\s+/).length;
  return Math.max(8, Math.min(45, Math.round(words / 180)));
}

function upstreamUrl(path: string) {
  return `https://github.com/ombharatiya/ai-system-design-guide/blob/main/${path}`;
}

export type MdxDraft = {
  relPath: string;
  slug: string;
  frontmatter: Record<string, unknown>;
  body: string;
};

export function buildMdxDraft(chapter: UpstreamChapter, upstreamMd: string): MdxDraft | null {
  if (shouldSkipUpstream(chapter.upstream_path)) return null;

  const cleaned = sanitizeForMdx(stripBoilerplate(upstreamMd));
  const title = titleFromMarkdown(upstreamMd, chapter.title_guess);
  const slug = slugFromUpstream(chapter.filename);
  const area = areaForSection(chapter.section);
  const type = inferType(chapter.section);
  const interview = extractInterviewSection(cleaned);
  const bodyMd = mainBodyWithoutInterview(cleaned);
  const summary = firstParagraph(bodyMd);

  const relPath =
    type === "walkthrough"
      ? `content/walkthroughs/${slug}.mdx`
      : `content/concepts/${area}/${slug}.mdx`;

  const frontmatter = {
    title,
    slug,
    type,
    area,
    difficulty: inferDifficulty(chapter.section, chapter.filename),
    tags: tagsFor(chapter),
    diagrams: [] as string[],
    est_minutes: estMinutes(upstreamMd),
    source_attribution: ATTRIBUTION,
    last_reviewed: "2026-07-04",
    status: "draft",
  };

  const bodyParts = [
    "## The 30-second version",
    "",
    summary,
    "",
    "## How it actually works",
    "",
    bodyMd,
  ];

  if (interview) {
    bodyParts.push("", "## The interview lens", "", interview);
  }

  bodyParts.push(
    "",
    "## Go deeper",
    "",
    `- [Upstream chapter (${title})](${upstreamUrl(chapter.upstream_path)})`,
    "- Related questions in the [question bank](/questions)",
    "- Practice with [SPIDER walkthrough](/practice) or [mock interview](/mock)",
  );

  return {
    relPath,
    slug: relPath.replace(/^content\//, "").replace(/\.mdx$/, ""),
    frontmatter,
    body: bodyParts.join("\n"),
  };
}
