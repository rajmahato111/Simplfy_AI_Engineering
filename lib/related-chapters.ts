import type { Question } from "./question-schema";
import { searchContent } from "./search";

/** Match question topics to learn chapters via keyword search. */
export function relatedChaptersForQuestion(question: Question, limit = 3) {
  const query = [question.topic_label, question.topic.replace(/-/g, " "), ...question.role_tags]
    .filter(Boolean)
    .join(" ");

  return searchContent(query, limit + 2)
    .filter((r) => r.type === "concept" || r.type === "walkthrough")
    .slice(0, limit);
}
