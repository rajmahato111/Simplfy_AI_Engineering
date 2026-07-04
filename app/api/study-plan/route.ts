import { NextResponse } from "next/server";
import { buildStudyPlan } from "@/lib/study-plan";

export async function POST(req: Request) {
  const body = (await req.json()) as { role?: string; weeks?: number };
  const role = body.role ?? "ai-engineer";
  const weeks = Math.min(12, Math.max(1, body.weeks ?? 4));
  return NextResponse.json({ plan: buildStudyPlan(role, weeks) });
}
