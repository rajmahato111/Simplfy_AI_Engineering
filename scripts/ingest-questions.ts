#!/usr/bin/env npx tsx
import fs from "fs";
import path from "path";
import { fetchUpstreamFile } from "./lib/upstream-fetch";
import { parseQuestionBank } from "./lib/parse-questions";

async function main() {
  const md = await fetchUpstreamFile("00-interview-prep/01-question-bank.md");
  const questions = parseQuestionBank(md);
  if (questions.length < 100) {
    console.warn(`Warning: expected ~121 questions, parsed ${questions.length}`);
  }
  const out = path.join(process.cwd(), "data", "questions.json");
  fs.writeFileSync(out, JSON.stringify(questions, null, 2) + "\n");
  console.log(`Wrote ${questions.length} question(s) → data/questions.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
