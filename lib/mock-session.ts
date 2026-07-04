import type { Question } from "./question-schema";
import { SPIDER_PHASES } from "./spider-phases";
import type { SpiderFeedback } from "./spider-feedback";

export type MockSessionRecord = {
  questionSlug: string;
  notes: string[];
  scorecard?: SpiderFeedback;
  startedAt: string;
  completedAt?: string;
};

export const MOCK_DURATION_MINUTES = 45;

export function mockSessionKey(sessionId: string) {
  return `mock-session:${sessionId}`;
}

export function readMockSession(sessionId: string): MockSessionRecord | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(mockSessionKey(sessionId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockSessionRecord;
  } catch {
    return null;
  }
}

export function writeMockSession(sessionId: string, record: MockSessionRecord) {
  sessionStorage.setItem(mockSessionKey(sessionId), JSON.stringify(record));
}

export function createMockSession(sessionId: string, questionSlug: string) {
  const record: MockSessionRecord = {
    questionSlug,
    notes: SPIDER_PHASES.map(() => ""),
    startedAt: new Date().toISOString(),
  };
  writeMockSession(sessionId, record);
  return record;
}

/** ponytail: template interviewer lines — LLM persona when API key lands */
export function mockInterviewerPrompt(phaseId: string, question: Question): string {
  const phase = SPIDER_PHASES.find((p) => p.id === phaseId);
  if (!phase) return question.title;

  switch (phaseId) {
    case "scope":
      return `"${question.title}" — before we draw anything, what clarifying questions do you have? ${phase.prompt}`;
    case "prioritize":
      return "Good. Now prioritize — what matters most for this system? " + phase.prompt;
    case "initial":
      return "Walk me through the high-level architecture. " + phase.prompt;
    case "deep-dive":
      return "Pick the riskiest component and go deep. " + phase.prompt;
    case "eval":
      return "How would you know this works in production? " + phase.prompt;
    case "reliability":
      return "Last piece — failure modes and scale. " + phase.prompt;
    default:
      return phase.prompt;
  }
}

export function formatElapsed(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
