#!/usr/bin/env npx tsx
/**
 * Scaffold draft MDX chapters from upstream catalog.
 * Skips chapters that already have polished MDX in content/.
 *
 * Usage:
 *   npm run scaffold:mdx              # all missing chapters
 *   npm run scaffold:mdx -- --section 06-retrieval-systems
 *   npm run scaffold:mdx -- --dry-run
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { listUpstreamChapters } from "./lib/upstream-catalog";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { buildMdxDraft } from "./lib/mdx-from-upstream";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sectionFilter = args.includes("--section")
  ? args[args.indexOf("--section") + 1]
  : undefined;

async function main() {
  const chapters = await listUpstreamChapters();
  const filtered = chapters.filter((c) => {
    if (c.section === "00-interview-prep") return false;
    if (sectionFilter && c.section !== sectionFilter) return false;
    return true;
  });

  let written = 0;
  let skipped = 0;
  let failed = 0;

  for (const chapter of filtered) {
    const draft = buildMdxDraft(chapter, "");
    if (!draft) {
      skipped++;
      continue;
    }

    const outPath = path.join(ROOT, draft.relPath);
    if (fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    try {
      const upstreamMd = await fetchUpstreamFile(chapter.upstream_path);
      const built = buildMdxDraft(chapter, upstreamMd);
      if (!built) {
        skipped++;
        continue;
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      const file = matter.stringify(built.body, built.frontmatter);
      if (dryRun) {
        console.log(`[dry-run] would write ${built.relPath}`);
      } else {
        fs.writeFileSync(outPath, file);
        console.log(`Wrote ${built.relPath}`);
      }
      written++;
    } catch (err) {
      failed++;
      console.error(`Failed ${chapter.upstream_path}:`, err);
    }
  }

  console.log(`\nDone: ${written} written, ${skipped} skipped, ${failed} failed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
