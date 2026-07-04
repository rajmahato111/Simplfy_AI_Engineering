"use server";

import { auth } from "@/auth";
import { ensureUser, upsertProgress } from "@/lib/progress";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  const user = await ensureUser(email, session.user?.name);
  return user?.id ?? null;
}

export async function toggleBookmark(slug: string, bookmarked: boolean) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required" };
  await upsertProgress(userId, slug, { bookmarked });
  revalidatePath(`/learn/${slug}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function toggleComplete(slug: string, completed: boolean) {
  const userId = await requireUserId();
  if (!userId) return { ok: false as const, error: "Sign in required" };
  await upsertProgress(userId, slug, { completed });
  revalidatePath(`/learn/${slug}`);
  revalidatePath("/dashboard");
  return { ok: true as const };
}
