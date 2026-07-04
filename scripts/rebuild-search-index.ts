#!/usr/bin/env npx tsx
import { closeDb } from "../lib/db";
import { rebuildSearchIndex } from "../lib/search-hybrid";

async function main() {
  const result = await rebuildSearchIndex();
  if (!result.ok) {
    console.log("Search index skipped:", result.reason);
    return;
  }
  console.log(`Search index rebuilt — ${result.count} chunk(s)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
