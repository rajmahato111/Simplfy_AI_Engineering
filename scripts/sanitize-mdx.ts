#!/usr/bin/env npx tsx
/** Re-sanitize draft MDX bodies for MDX compiler safety. */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function sanitizeSegment(text: string) {
  return text
    .replace(/<(?![a-zA-Z/!&])/g, "&lt;")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/<br\s*\/?>/gi, " ");
}

export function sanitizeForMdx(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => (part.startsWith("```") ? part : sanitizeSegment(part)))
    .join("");
}

function walk(dir: string, files: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".mdx")) files.push(full);
  }
  return files;
}

const root = path.join(process.cwd(), "content");
let fixed = 0;
for (const file of walk(root)) {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  if (data.status !== "draft") continue;
  const next = sanitizeForMdx(content);
  if (next === content) continue;
  fs.writeFileSync(file, matter.stringify(next, data));
  fixed++;
}
console.log(`Sanitized ${fixed} draft file(s)`);
