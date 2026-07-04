import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { grantPro } from "@/lib/pro-access";

/** ponytail: minimal webhook — verify signature in production hardening pass */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook not configured" }, { status: 501 });
  }

  const body = await req.text();
  let event: { type?: string; data?: { object?: { customer_email?: string; customer_details?: { email?: string } } } };
  try {
    event = JSON.parse(body) as typeof event;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const email =
      event.data?.object?.customer_email ?? event.data?.object?.customer_details?.email;
    if (email) {
      const db = getDb();
      if (db) {
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (user) await grantPro(user.id, 30);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
