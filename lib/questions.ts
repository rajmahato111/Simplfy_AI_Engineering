import fs from "fs";
import path from "path";
import type { Question, QuestionFilters } from "./question-schema";

const DATA_FILE = path.join(process.cwd(), "data", "questions.json");

function loadQuestions(): Question[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as Question[];
  return Array.isArray(raw) ? raw : [];
}

export function listQuestions(filters: QuestionFilters = {}): Question[] {
  let items = loadQuestions();
  if (filters.topic) items = items.filter((q) => q.topic === filters.topic);
  if (filters.difficulty) items = items.filter((q) => q.difficulty === filters.difficulty);
  if (filters.q) {
    const term = filters.q.toLowerCase();
    items = items.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        q.body_md.toLowerCase().includes(term),
    );
  }
  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export function listQuestionTopics(): string[] {
  return [...new Set(loadQuestions().map((q) => q.topic))].sort();
}

export function getQuestionBySlug(slug: string) {
  return loadQuestions().find((q) => q.slug === slug) ?? null;
}

export function questionCount() {
  return loadQuestions().length;
}
