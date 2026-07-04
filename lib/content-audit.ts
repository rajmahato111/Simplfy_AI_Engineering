import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentAuditIssue = {
  slug: string;
  code: string;
  message: string;
  detail?: string;
};

export type ContentAuditResult = {
  slug: string;
  title: string;
  type?: string;
  status?: string;
  markdownTables: number;
  bodyImageRefs: string[];
  frontmatterDiagrams: string[];
  expectedRenderedImages: string[];
  missingDiagramFiles: string[];
  brokenBodyImageRefs: string[];
};

function listMdxSlugs(): string[] {
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

function isTableSeparatorRow(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false;
  const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
}

function isTableHeaderRow(line: string, nextLine: string | undefined) {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && !!nextLine && isTableSeparatorRow(nextLine);
}

function countMarkdownTables(content: string) {
  const lines = content.split("\n");
  let count = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    if (isTableHeaderRow(lines[i], lines[i + 1])) {
      count++;
      i++;
    }
  }
  return count;
}

function extractBodyImageRefs(content: string) {
  return [...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
}

function resolveAsset(slug: string, assetPath: string) {
  const docDir = path.dirname(path.join(CONTENT_DIR, `${slug}.mdx`));
  const abs = path.normalize(path.join(docDir, assetPath));
  if (!abs.startsWith(CONTENT_DIR)) return null;
  return abs;
}

export function auditContentSlug(slug: string): ContentAuditResult {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const frontmatterDiagrams = (data.diagrams as string[] | undefined) ?? [];
  const bodyImageRefs = extractBodyImageRefs(content);

  const missingDiagramFiles = frontmatterDiagrams.filter((d) => {
    const abs = resolveAsset(slug, d);
    return !abs || !fs.existsSync(abs);
  });

  const brokenBodyImageRefs = bodyImageRefs.filter((ref) => {
    if (ref.startsWith("http")) return false;
    const abs = resolveAsset(slug, ref);
    return !abs || !fs.existsSync(abs);
  });

  const expectedRenderedImages = [
    ...new Set([
      ...bodyImageRefs.filter((r) => !r.startsWith("http")),
      ...frontmatterDiagrams.filter((d) => !content.includes(d)),
    ]),
  ];

  return {
    slug,
    title: data.title ?? slug,
    type: data.type,
    status: data.status,
    markdownTables: countMarkdownTables(content),
    bodyImageRefs,
    frontmatterDiagrams,
    expectedRenderedImages,
    missingDiagramFiles,
    brokenBodyImageRefs,
  };
}

export function auditAllContent(): ContentAuditResult[] {
  return listMdxSlugs().map(auditContentSlug);
}

export function validateContentRender(): ContentAuditIssue[] {
  const issues: ContentAuditIssue[] = [];
  for (const audit of auditAllContent()) {
    for (const d of audit.missingDiagramFiles) {
      issues.push({
        slug: audit.slug,
        code: "diagram-missing",
        message: `Frontmatter diagram file not found: ${d}`,
      });
    }
    for (const ref of audit.brokenBodyImageRefs) {
      issues.push({
        slug: audit.slug,
        code: "image-ref-broken",
        message: `Body image reference not found: ${ref}`,
      });
    }
  }
  return issues;
}

/** Inject frontmatter diagrams not already referenced in the MDX body. */
export function prepareContentForRender(content: string, diagrams: string[]) {
  const toInject = diagrams.filter((d) => !content.includes(d));
  if (toInject.length === 0) return content;

  const figures = toInject
    .map((d) => {
      const alt = d.split("/").pop()?.replace(/\.svg$/, "").replace(/-/g, " ") ?? "Diagram";
      return `\n\n![${alt}](${d})\n\n`;
    })
    .join("");

  const marker = "## How it actually works";
  const idx = content.indexOf(marker);
  if (idx === -1) return content + figures;

  const lineEnd = content.indexOf("\n", idx);
  const insertAt = lineEnd === -1 ? content.length : lineEnd + 1;
  return content.slice(0, insertAt) + figures + content.slice(insertAt);
}

export function contentAssetUrl(slug: string, assetPath: string) {
  return `/content-assets/${slug}/${assetPath}`.replace(/\/+/g, "/");
}
