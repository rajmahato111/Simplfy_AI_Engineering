#!/usr/bin/env npx tsx
/**
 * Validate cheat-sheet JSON files referenced by chapter frontmatter.
 *
 * Usage: npm run validate:cheatsheet [-- --json]
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateCheatSheet } from "../lib/cheatsheet-schema";

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

function resolveAsset(mdxFilePath: string, assetPath: string): string | null {
  const dir = path.dirname(mdxFilePath);
  const abs = path.normalize(path.join(dir, assetPath));
  if (abs !== CONTENT_DIR && !abs.startsWith(CONTENT_DIR + path.sep)) return null;
  return abs;
}

type Result = {
  slug: string;
  cheatSheetPath?: string;
  ok: boolean;
  issues: { field: string; message: string }[];
  warnings: string[];
};

const results: Result[] = [];

for (const { slug, filePath } of listMdxFiles()) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const cheatSheetPath = typeof data.cheat_sheet === "string" ? data.cheat_sheet : undefined;
  if (!cheatSheetPath) continue; // no cheat sheet for this chapter — nothing to check

  const abs = resolveAsset(filePath, cheatSheetPath);
  if (!abs) {
    results.push({
      slug,
      cheatSheetPath,
      ok: false,
      issues: [{ field: "cheat_sheet", message: `Path escapes content/: ${cheatSheetPath}` }],
      warnings: [],
    });
    continue;
  }
  if (!fs.existsSync(abs)) {
    results.push({
      slug,
      cheatSheetPath,
      ok: false,
      issues: [{ field: "cheat_sheet", message: `File not found: ${cheatSheetPath}` }],
      warnings: [],
    });
    continue;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    results.push({
      slug,
      cheatSheetPath,
      ok: false,
      issues: [{ field: "cheat_sheet", message: `Invalid JSON: ${(e as Error).message}` }],
      warnings: [],
    });
    continue;
  }

  const validation = validateCheatSheet(parsed);
  results.push({
    slug,
    cheatSheetPath,
    ok: validation.ok,
    issues: validation.issues,
    warnings: validation.warnings,
  });
}

const failures = results.filter((r) => !r.ok);

if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
} else {
  console.log(`Cheat-sheet validation — ${results.length} chapter(s) with a cheat sheet\n`);
  for (const r of results) {
    console.log(r.ok ? `✓ ${r.slug} (${r.cheatSheetPath})` : `✗ ${r.slug} (${r.cheatSheetPath})`);
    for (const issue of r.issues) console.log(`    ${issue.field}: ${issue.message}`);
    for (const warning of r.warnings) console.log(`    warning: ${warning}`);
  }
  if (failures.length) {
    console.log(`\nFAIL — ${failures.length} cheat sheet(s) with issues`);
  } else if (results.length === 0) {
    console.log("No chapters reference a cheat sheet yet.");
  } else {
    console.log("\nAll cheat sheets valid.");
  }
}

process.exit(failures.length ? 1 : 0);
