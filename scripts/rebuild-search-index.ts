#!/usr/bin/env npx tsx
import { rebuildSearchIndex } from "../lib/search-hybrid";

async function main() {
  const result = await rebuildSearchIndex();
  if (!result.ok) {
    console.log("Search index skipped:", result.reason);
    process.exit(0);
  }
  console.log(`Search index rebuilt — ${result.count} chunk(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
