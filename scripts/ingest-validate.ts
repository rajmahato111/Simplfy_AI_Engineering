#!/usr/bin/env npx tsx
/**
 * Content ingest scaffold (E11) — validates upstream-style JSON/MDX drops.
 * Usage: npm run ingest:validate [-- path/to/manifest.json]
 */
import fs from "fs";
import path from "path";
import { validateFrontmatter } from "../lib/content-schema";
import matter from "gray-matter";

type IngestManifest = {
  mdx?: string[];
  questions?: string;
};

const manifestPath = process.argv[2] ?? "data/ingest-manifest.example.json";

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as IngestManifest;
let errors = 0;

console.log(`Ingest validation — ${manifestPath}\n`);

for (const rel of manifest.mdx ?? []) {
  const filePath = path.join(process.cwd(), rel);
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${rel} — file missing`);
    errors++;
    continue;
  }
  const { data } = matter(fs.readFileSync(filePath, "utf8"));
  const slug = rel.replace(/^content\//, "").replace(/\.mdx$/, "");
  const result = validateFrontmatter(data, { fileSlug: slug });
  if (!result.ok) {
    console.log(`✗ ${rel} — frontmatter invalid`);
    for (const i of result.issues) console.log(`    ${i.field}: ${i.message}`);
    errors++;
  } else {
    console.log(`✓ ${rel}`);
  }
}

if (manifest.questions) {
  const qPath = path.join(process.cwd(), manifest.questions);
  if (!fs.existsSync(qPath)) {
    console.log(`✗ ${manifest.questions} — missing`);
    errors++;
  } else {
    const qs = JSON.parse(fs.readFileSync(qPath, "utf8"));
    console.log(`✓ ${manifest.questions} — ${Array.isArray(qs) ? qs.length : 0} question(s)`);
  }
}

if (errors) {
  console.log(`\nFAIL — ${errors} error(s)`);
  process.exit(1);
}
console.log("\nIngest manifest valid.");
