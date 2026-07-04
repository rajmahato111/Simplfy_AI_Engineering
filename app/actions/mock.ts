"use server";

import { scoreSpiderPractice } from "@/lib/spider-feedback";

export async function completeMockSession(notes: string[], questionSlug: string) {
  return scoreSpiderPractice(notes, questionSlug);
}
