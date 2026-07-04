#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { listUpstreamChapters, targetMdxPath, areaForSection, slugFromUpstream } from "./lib/upstream-catalog";
import { shouldSkipUpstream } from "./lib/mdx-from-upstream";

async function main() {
  const chapters = await listUpstreamChapters();
  const catalog = chapters
    .filter((c) => c.section !== "00-interview-prep")
    .map((c) => ({
      upstream_path: c.upstream_path,
      section: c.section,
      area: areaForSection(c.section),
      slug: slugFromUpstream(c.filename),
      target_mdx: targetMdxPath(c).replace(/^content\//, "").replace(/\.mdx$/, ""),
      skip: shouldSkipUpstream(c.upstream_path),
    }));

  const out = path.join(process.cwd(), "data", "mdx-catalog.json");
  fs.writeFileSync(out, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Wrote ${catalog.length} entries → data/mdx-catalog.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
