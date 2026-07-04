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
  glossary?: string;
  patterns?: string;
};

const MIN = { glossary: 80, patterns: 40, questions: 115 };

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

function checkJson(key: keyof IngestManifest, min?: number) {
  const rel = manifest[key];
  if (!rel || typeof rel !== "string") return;
  const filePath = path.join(process.cwd(), rel);
  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${rel} — missing`);
    errors++;
    return;
  }
  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const count = Array.isArray(rows) ? rows.length : 0;
  const floor = min ?? 1;
  if (count < floor) {
    console.log(`✗ ${rel} — expected ≥${floor}, got ${count}`);
    errors++;
  } else {
    console.log(`✓ ${rel} — ${count} record(s)`);
  }
}

checkJson("questions", MIN.questions);
checkJson("glossary", MIN.glossary);
checkJson("patterns", MIN.patterns);

if (errors) {
  console.log(`\nFAIL — ${errors} error(s)`);
  process.exit(1);
}
console.log("\nIngest manifest valid.");
