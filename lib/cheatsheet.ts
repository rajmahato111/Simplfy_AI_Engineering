import fs from "fs";
import path from "path";
import { validateCheatSheet, type CheatSheet } from "@/lib/cheatsheet-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Load and validate a chapter's cheat sheet, given its already-loaded doc (dir + frontmatter).
 * Callers that already fetched the doc via getContentBySlug should pass it through here rather
 * than re-fetching by slug, to avoid redundant file reads on every page render.
 * Fails soft: any problem (missing field, bad path, invalid JSON, schema violation) returns null.
 */
export function getCheatSheetForDoc(doc: {
  dir: string;
  frontmatter: { cheat_sheet?: string };
}): CheatSheet | null {
  const relPath = doc.frontmatter.cheat_sheet;
  if (!relPath) return null;

  const abs = path.normalize(path.join(doc.dir, relPath));
  if (!abs.startsWith(CONTENT_DIR + path.sep) || !fs.existsSync(abs)) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(abs, "utf8"));
    const result = validateCheatSheet(parsed);
    return result.ok ? (result.data ?? null) : null;
  } catch {
    return null;
  }
}
