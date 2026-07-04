import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const session = await auth();
  const email = body.email ?? session?.user?.email ?? undefined;
  const result = await createCheckoutSession(email);

  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.error }, { status: 502 });
  }

  if (result.mode === "live") {
    return NextResponse.json({ ok: true, mode: "live", url: result.url });
  }

  return NextResponse.json({
    ok: true,
    mode: "stub",
    message: result.message,
    redirectUrl: result.redirectUrl,
  });
}
