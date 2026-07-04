"use server";

import { auth } from "@/auth";
import { ensureUser } from "@/lib/progress";
import {
  getMockSession,
  listUserMockSessions,
  parseMockScorecard,
  registerMockSession,
  saveMockSessionResult,
} from "@/lib/mock-sessions-db";
import { scoreSpiderPractice } from "@/lib/spider-feedback";
import { getQuestionBySlug } from "@/lib/questions";
import { mockInterviewerPrompt } from "@/lib/mock-session";
import { anthropicComplete, isLlmConfigured } from "@/lib/llm";
import type { Question } from "@/lib/question-schema";

async function optionalUserId() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return null;
    const user = await ensureUser(email, session.user?.name);
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function startMockSession(sessionId: string, questionSlug: string) {
  const userId = await optionalUserId();
  await registerMockSession(sessionId, questionSlug, userId);
  return { ok: true as const, sessionId };
}

export async function completeMockSession(sessionId: string, notes: string[], questionSlug: string) {
  const scorecard = await scoreSpiderPractice(notes, questionSlug);
  await saveMockSessionResult(sessionId, notes, scorecard);
  return scorecard;
}

export async function getMockSessionReplay(sessionId: string) {
  const row = await getMockSession(sessionId);
  if (!row?.completedAt) return null;
  const question = getQuestionBySlug(row.questionSlug);
  if (!question) return null;
  return {
    question,
    scorecard: parseMockScorecard(row.scorecard),
  };
}

export async function listMyMockSessions() {
  const userId = await optionalUserId();
  if (!userId) return [];
  const rows = await listUserMockSessions(userId);
  return rows.map((r) => ({
    id: r.id,
    questionSlug: r.questionSlug,
    completed: Boolean(r.completedAt),
    overall: parseMockScorecard(r.scorecard)?.overall ?? null,
    startedAt: r.startedAt.toISOString(),
  }));
}

export async function getInterviewerLine(phaseId: string, questionSlug: string, priorAnswer?: string) {
  const question = getQuestionBySlug(questionSlug);
  if (!question) return { line: "", mode: "stub" as const };

  const template = mockInterviewerPrompt(phaseId, question);
  if (!isLlmConfigured() || !priorAnswer?.trim()) {
    return { line: template, mode: "stub" as const };
  }

  const llm = await anthropicComplete(
    "You are a senior AI system design interviewer. One short follow-up or transition (2-3 sentences max). Stay in character.",
    `Question: ${question.title}\nPhase: ${phaseId}\nCandidate just said:\n${priorAnswer}\n\nTemplate prompt to adapt:\n${template}`,
    256,
  );

  return { line: llm ?? template, mode: llm ? ("llm" as const) : ("stub" as const) };
}

export type { Question };
