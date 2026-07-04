import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users } from "./db/schema";

const FREE_MOCK_LIMIT = 1;

export function isProBypassEnabled() {
  return process.env.PRO_ACCESS === "all";
}

export async function isProUser(userId: string) {
  if (isProBypassEnabled()) return true;
  const db = getDb();
  if (!db) return false;
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user?.proUntil) return false;
    return user.proUntil.getTime() > Date.now();
  } catch {
    return false;
  }
}

export async function grantPro(userId: string, days = 30) {
  const db = getDb();
  if (!db) return null;
  const until = new Date();
  until.setDate(until.getDate() + days);
  const [row] = await db.update(users).set({ proUntil: until }).where(eq(users.id, userId)).returning();
  return row ?? null;
}

export { FREE_MOCK_LIMIT };
