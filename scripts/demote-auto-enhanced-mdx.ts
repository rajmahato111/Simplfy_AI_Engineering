#!/usr/bin/env npx tsx
/**
 * Revert bulk-enhanced chapters to draft when they still carry placeholder markers.
 * Keeps the three Claude pilots (and any file without kitchen/generic SVG).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");
const KEEP_REVIEWED = new Set([
  "rag-fundamentals",
  "chunking-strategies",
  "design-a-production-rag-system",
]);
const PLACEHOLDER_ANALOGY = "running a kitchen during rush hour";
const GENERIC_SVG = 'viewBox="0 0 520 100"';

function walkMdx(dir: string, files: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkMdx(full, files);
    else if (e.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

let demoted = 0;
for (const file of walkMdx(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const slug = data.slug as string;
  if (KEEP_REVIEWED.has(slug)) continue;

  const hasPlaceholder =
    content.includes(PLACEHOLDER_ANALOGY) ||
    (Array.isArray(data.diagrams) &&
      data.diagrams.some((d: string) => {
        const svgPath = path.join(path.dirname(file), d);
        return fs.existsSync(svgPath) && fs.readFileSync(svgPath, "utf8").includes(GENERIC_SVG);
      }));

  if (!hasPlaceholder || data.status === "draft") continue;

  const updated = { ...data, status: "draft" };
  fs.writeFileSync(file, matter.stringify(content, updated));
  demoted++;
  console.log(`demoted → draft: ${slug}`);
}

console.log(`\nDemoted ${demoted} file(s) to draft`);
