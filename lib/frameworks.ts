import fs from "fs";
import path from "path";
import type { Framework } from "./framework-schema";

const DATA_FILE = path.join(process.cwd(), "data", "frameworks.json");

function loadFrameworks(): Framework[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Framework[];
  return Array.isArray(raw) ? raw : [];
}

export function listFrameworks() {
  return loadFrameworks();
}

export function getFrameworkById(id: string) {
  return loadFrameworks().find((f) => f.id === id) ?? null;
}
