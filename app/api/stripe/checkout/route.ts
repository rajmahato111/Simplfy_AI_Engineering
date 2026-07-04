import { NextResponse } from "next/server";
import { createCheckoutStub } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const session = await createCheckoutStub(body.email);
  return NextResponse.json(session);
}
