"use server";

import { answerTutorQuery } from "@/lib/grounded-tutor";

export async function askTutor(query: string) {
  return answerTutorQuery(query);
}
