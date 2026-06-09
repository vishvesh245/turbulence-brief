"use server";

import Anthropic from "@anthropic-ai/sdk";
import { BriefingContext, buildExtractionPrompt, buildBriefingPrompt } from "@/lib/prompt";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 20000, // 20s — fail fast rather than hanging indefinitely
});

export interface BriefingOutput {
  briefing: string;
  severity: "none" | "light" | "moderate" | "severe";
}

export async function generateBriefing(ctx: BriefingContext): Promise<BriefingOutput> {
  // Step 1: Extract structured data from raw weather text
  const extractionPrompt = buildExtractionPrompt(ctx);

  const extractionResponse = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    messages: [{ role: "user", content: extractionPrompt }],
  });

  let extracted: Record<string, unknown>;
  try {
    const raw = extractionResponse.content[0].type === "text"
      ? extractionResponse.content[0].text
      : "";
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    extracted = JSON.parse(cleaned);
  } catch {
    // If extraction fails, use safe defaults
    extracted = {
      hasTurbulence: false,
      severity: "none",
      timing: null,
      durationMinutes: null,
      altitudeRange: null,
      causeDescription: null,
      dataQuality: ctx.bannerState,
    };
  }

  // Step 2: Generate human-readable briefing paragraph
  const briefingPrompt = buildBriefingPrompt(ctx, extracted as Parameters<typeof buildBriefingPrompt>[1]);

  const briefingResponse = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    messages: [{ role: "user", content: briefingPrompt }],
  });

  const briefing =
    briefingResponse.content[0].type === "text"
      ? briefingResponse.content[0].text.trim()
      : "We weren't able to generate a briefing for this flight. Please try again.";

  const severity = (extracted.severity as "none" | "light" | "moderate" | "severe") ?? "none";

  return { briefing, severity };
}
