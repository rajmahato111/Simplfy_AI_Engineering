#!/usr/bin/env npx tsx
/**
 * Static content render QA — file refs, diagrams, table counts.
 * Pair with e2e/content-rendering.spec.ts for rendered page checks.
 *
 * Usage: npm run validate:content [-- --json]
 */
import { auditAllContent, validateContentRender } from "../lib/content-audit";

const asJson = process.argv.includes("--json");
const audits = auditAllContent();
const issues = validateContentRender();

if (asJson) {
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), audits, issues }, null, 2));
} else {
  console.log(`Content render QC — ${audits.length} file(s)\n`);
  for (const a of audits) {
    console.log(
      `• ${a.slug}\n  tables in source: ${a.markdownTables} · images expected on page: ${a.expectedRenderedImages.length}`,
    );
    if (a.expectedRenderedImages.length) {
      console.log(`  → ${a.expectedRenderedImages.join(", ")}`);
    }
  }
  if (issues.length) {
    console.log(`\nFAIL — ${issues.length} issue(s):`);
    for (const i of issues) console.log(`  [${i.slug}] ${i.code}: ${i.message}`);
    process.exit(1);
  }
  console.log("\nStatic checks passed. Run e2e content-rendering tests for live page QA.");
}

process.exit(issues.length ? 1 : 0);
