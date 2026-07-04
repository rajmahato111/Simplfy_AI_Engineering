#!/usr/bin/env npx tsx
/**
 * Validate MDX frontmatter against lib/content-schema.ts (style guide §3).
 *
 * Usage: npm run validate:frontmatter [-- --json]
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "../lib/content-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");
const asJson = process.argv.includes("--json");

function listMdxFiles(): { slug: string; filePath: string }[] {
  const files: { slug: string; filePath: string }[] = [];
  function walk(dir: string, prefix: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.name.endsWith(".mdx")) {
        files.push({ slug: rel.replace(/\.mdx$/, ""), filePath: full });
      }
    }
  }
  if (fs.existsSync(CONTENT_DIR)) walk(CONTENT_DIR, "");
  return files.sort((a, b) => a.slug.localeCompare(b.slug));
}

const results = listMdxFiles().map(({ slug, filePath }) => {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const validation = validateFrontmatter(data, { fileSlug: slug });
  return { slug, ...validation };
});

const failures = results.filter((r) => !r.ok);

if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
} else {
  console.log(`Frontmatter validation — ${results.length} file(s)\n`);
  for (const r of results) {
    console.log(r.ok ? `✓ ${r.slug}` : `✗ ${r.slug}`);
    for (const issue of r.issues) console.log(`    ${issue.field}: ${issue.message}`);
  }
  if (failures.length) {
    console.log(`\nFAIL — ${failures.length} file(s) with invalid frontmatter`);
  } else {
    console.log("\nAll frontmatter valid.");
  }
}

process.exit(failures.length ? 1 : 0);
