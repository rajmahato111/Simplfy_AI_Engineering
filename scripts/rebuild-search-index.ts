#!/usr/bin/env npx tsx
import { rebuildSearchIndex } from "../lib/search-hybrid";

const result = await rebuildSearchIndex();
if (!result.ok) {
  console.log("Search index skipped:", result.reason);
  process.exit(0);
}
console.log(`Search index rebuilt — ${result.count} chunk(s)`);
