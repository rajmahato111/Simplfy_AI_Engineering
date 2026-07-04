import fs from "fs";
import path from "path";
import type { GlossaryTerm } from "./glossary-schema";

const DATA_FILE = path.join(process.cwd(), "data", "glossary.json");

function loadTerms(): GlossaryTerm[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as GlossaryTerm[];
  return Array.isArray(raw) ? raw : [];
}

export function listGlossaryTerms(letter?: string): GlossaryTerm[] {
  let terms = loadTerms();
  if (letter) terms = terms.filter((t) => t.letter === letter.toUpperCase());
  return terms.sort((a, b) => a.term.localeCompare(b.term));
}

export function listGlossaryLetters(): string[] {
  return [...new Set(loadTerms().map((t) => t.letter))].sort();
}

export function glossaryCount() {
  return loadTerms().length;
}

export function getGlossaryTerm(id: string) {
  return loadTerms().find((t) => t.id === id) ?? null;
}
