import { NextResponse } from "next/server";
import { anthropicComplete, isLlmConfigured } from "@/lib/llm";

export async function POST(req: Request) {
  const body = (await req.json()) as { notes?: string };
  const notes = body.notes?.trim() ?? "";
  if (!notes) return NextResponse.json({ text: "Add a diagram description first." });

  if (!isLlmConfigured()) {
    return NextResponse.json({
      text: "Set ANTHROPIC_API_KEY for AI whiteboard critique. For now, self-check: naming, data flow, failure modes, and eval hooks.",
    });
  }

  const text =
    (await anthropicComplete(
      "You critique AI system design whiteboard answers in 5-8 bullet points. Focus on gaps, tradeoffs, and interview signals.",
      notes,
      512,
    )) ?? "Could not generate critique — try again.";

  return NextResponse.json({ text });
}
