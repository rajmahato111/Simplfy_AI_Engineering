import fs from "fs";
import path from "path";
import type { WhiteboardExercise } from "./whiteboard-schema";

const DATA_FILE = path.join(process.cwd(), "data", "whiteboard-exercises.json");

function loadExercises(): WhiteboardExercise[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as WhiteboardExercise[];
  return Array.isArray(raw) ? raw : [];
}

export function listWhiteboardExercises(): WhiteboardExercise[] {
  return loadExercises().sort((a, b) => a.number - b.number);
}

export function getWhiteboardExercise(slug: string) {
  return loadExercises().find((e) => e.slug === slug) ?? null;
}

export function whiteboardExerciseCount() {
  return loadExercises().length;
}
