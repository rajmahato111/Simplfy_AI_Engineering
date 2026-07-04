/** ponytail: fetch API, no SDK — add @anthropic-ai/sdk only if this grows */

export function isLlmConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export function llmModel() {
  return process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-20250514";
}

type AnthropicResponse = {
  content?: { type: string; text?: string }[];
};

export async function anthropicComplete(system: string, user: string, maxTokens = 1024) {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: llmModel(),
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as AnthropicResponse;
  return data.content?.find((c) => c.type === "text")?.text?.trim() ?? null;
}

export async function anthropicJson<T>(system: string, user: string, maxTokens = 2048): Promise<T | null> {
  const text = await anthropicComplete(
    system + "\n\nRespond with valid JSON only. No markdown fences.",
    user,
    maxTokens,
  );
  if (!text) return null;
  try {
    return JSON.parse(text.replace(/^```json?\s*|\s*```$/g, "")) as T;
  } catch {
    return null;
  }
}
