import fs from "fs";
import { getContentBySlug, resolveContentAsset } from "@/lib/content";
import { validateCheatSheet, type CheatSheet } from "@/lib/cheatsheet-schema";

/** Load and validate a chapter's cheat sheet, if it has one. Fails soft: any problem returns null. */
export function getCheatSheetForSlug(slug: string): CheatSheet | null {
  const doc = getContentBySlug(slug);
  const relPath = (doc?.frontmatter as { cheat_sheet?: string } | undefined)?.cheat_sheet;
  if (!relPath) return null;

  const abs = resolveContentAsset(slug, relPath);
  if (!abs) return null;

  try {
    const parsed = JSON.parse(fs.readFileSync(abs, "utf8"));
    const result = validateCheatSheet(parsed);
    return result.ok ? (result.data ?? null) : null;
  } catch {
    return null;
  }
}
