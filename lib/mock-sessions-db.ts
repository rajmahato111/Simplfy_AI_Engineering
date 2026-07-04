import { desc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { mockSessions } from "./db/schema";
import type { SpiderFeedback } from "./spider-feedback";

export async function registerMockSession(sessionId: string, questionSlug: string, userId?: string | null) {
  const db = getDb();
  if (!db) return null;

  try {
    const [row] = await db
      .insert(mockSessions)
      .values({
        id: sessionId,
        questionSlug,
        userId: userId ?? null,
        notes: "[]",
      })
      .onConflictDoNothing()
      .returning();
    return row ?? null;
  } catch {
    return null;
  }
}

export async function saveMockSessionResult(
  sessionId: string,
  notes: string[],
  scorecard: SpiderFeedback,
) {
  const db = getDb();
  if (!db) return null;

  try {
    const [row] = await db
      .update(mockSessions)
      .set({
        notes: JSON.stringify(notes),
        scorecard: JSON.stringify(scorecard),
        completedAt: new Date(),
      })
      .where(eq(mockSessions.id, sessionId))
      .returning();
    return row ?? null;
  } catch {
    return null;
  }
}

export async function getMockSession(sessionId: string) {
  const db = getDb();
  if (!db) return null;

  try {
    const [row] = await db.select().from(mockSessions).where(eq(mockSessions.id, sessionId)).limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function listUserMockSessions(userId: string, limit = 20) {
  const db = getDb();
  if (!db) return [];

  try {
    return db
      .select()
      .from(mockSessions)
      .where(eq(mockSessions.userId, userId))
      .orderBy(desc(mockSessions.startedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export function parseMockNotes(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseMockScorecard(raw: string | null): SpiderFeedback | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SpiderFeedback;
  } catch {
    return null;
  }
}
