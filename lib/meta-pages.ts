import fs from "fs";
import path from "path";
import type { MetaPage } from "./meta-page-schema";

const DATA_FILE = path.join(process.cwd(), "data", "meta-pages.json");

function loadPages(): MetaPage[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as MetaPage[];
  return Array.isArray(raw) ? raw : [];
}

export function listMetaPages() {
  return loadPages();
}

export function getMetaPage(id: string) {
  return loadPages().find((p) => p.id === id) ?? null;
}
