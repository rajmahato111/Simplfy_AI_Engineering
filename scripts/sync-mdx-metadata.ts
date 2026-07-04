#!/usr/bin/env npx tsx
/**
 * Recompute est_minutes from MDX body word count.
 * Only updates status: draft files (does not touch reviewed/approved pilots).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT = path.join(process.cwd(), "content");

function walkMdx(dir: string, files: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkMdx(full, files);
    else if (e.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function estFromWords(words: number, type: string) {
  const wpm = type === "walkthrough" ? 160 : 200;
  return Math.max(type === "walkthrough" ? 15 : 5, Math.min(45, Math.round(words / wpm)));
}

let updated = 0;
for (const file of walkMdx(CONTENT)) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (data.status !== "draft") continue;

  const words = content.split(/\s+/).filter(Boolean).length;
  const est = estFromWords(words, data.type as string);
  if (data.est_minutes === est) continue;

  const next = { ...data, est_minutes: est };
  fs.writeFileSync(file, matter.stringify(content, next));
  updated++;
  console.log(`${data.slug}: ${data.est_minutes} → ${est} min (${words} words)`);
}

console.log(`\nUpdated est_minutes on ${updated} draft file(s)`);
