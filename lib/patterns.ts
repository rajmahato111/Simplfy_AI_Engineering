import fs from "fs";
import path from "path";
import type { Pattern } from "./pattern-schema";

const DATA_FILE = path.join(process.cwd(), "data", "patterns.json");

function loadPatterns(): Pattern[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Pattern[];
  return Array.isArray(raw) ? raw : [];
}

export function listPatterns(category?: string): Pattern[] {
  let items = loadPatterns();
  if (category) items = items.filter((p) => p.category === category);
  return items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

export function listPatternCategories(): string[] {
  return [...new Set(loadPatterns().map((p) => p.category))].sort();
}

export function patternCount() {
  return loadPatterns().length;
}
