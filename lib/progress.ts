import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { users, userProgress } from "./db/schema";

export async function ensureUser(email: string, name?: string | null) {
  const db = getDb();
  if (!db) return null;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return existing;

  const [created] = await db.insert(users).values({ email, name: name ?? null }).returning();
  return created;
}

export async function getProgressForUser(userId: string, slug: string) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.slug, slug)))
    .limit(1);
  return row ?? null;
}

export async function listUserProgress(userId: string) {
  const db = getDb();
  if (!db) return [];

  return db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .orderBy(desc(userProgress.lastSeenAt));
}

export async function upsertProgress(
  userId: string,
  slug: string,
  patch: { completed?: boolean; bookmarked?: boolean },
) {
  const db = getDb();
  if (!db) return null;

  const existing = await getProgressForUser(userId, slug);
  if (existing) {
    const [row] = await db
      .update(userProgress)
      .set({ ...patch, lastSeenAt: new Date() })
      .where(eq(userProgress.id, existing.id))
      .returning();
    return row;
  }

  const [row] = await db
    .insert(userProgress)
    .values({
      userId,
      slug,
      completed: patch.completed ?? false,
      bookmarked: patch.bookmarked ?? false,
    })
    .returning();
  return row;
}

export async function recordChapterView(userId: string, slug: string) {
  await upsertProgress(userId, slug, {});
}
