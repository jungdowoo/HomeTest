import { NextResponse } from "next/server";
import { MockExplanationProvider } from "@/lib/ai/mockExplanationProvider";
import { OpenAIExplanationProvider } from "@/lib/ai/openaiExplanationProvider";
import type { ExplanationInput } from "@/lib/ai/explanationProvider";

const cache = new Map<string, string>();

export async function POST(request: Request) {
  const input = (await request.json()) as ExplanationInput;
  const cacheKey = JSON.stringify(input);

  if (cache.has(cacheKey)) {
    return NextResponse.json({ explanation: cache.get(cacheKey), cached: true });
  }

  const provider =
    process.env.AI_EXPLANATION_PROVIDER === "openai"
      ? new OpenAIExplanationProvider()
      : new MockExplanationProvider();
  const explanation = await provider.explain(input);

  cache.set(cacheKey, explanation);

  return NextResponse.json({ explanation, cached: false });
}
