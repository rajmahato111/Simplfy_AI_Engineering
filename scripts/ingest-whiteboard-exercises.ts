#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { parseWhiteboardExercises } from "./lib/parse-whiteboard-exercises";

async function main() {
  const md = await fetchUpstreamFile("00-interview-prep/04-whiteboard-exercises.md");
  const exercises = parseWhiteboardExercises(md);
  if (exercises.length < 1) {
    console.warn("Warning: expected at least 1 whiteboard exercise");
  }
  const out = path.join(process.cwd(), "data", "whiteboard-exercises.json");
  fs.writeFileSync(out, JSON.stringify(exercises, null, 2) + "\n");
  console.log(`Wrote ${exercises.length} whiteboard exercise(s) → data/whiteboard-exercises.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
