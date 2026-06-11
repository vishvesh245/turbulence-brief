// System prompt template for turbulence briefing generation
// Two-step: first extract structured data, then generate human paragraph

export interface BriefingContext {
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  flightHours: number;
  rawWeatherData: string;
  bannerState: "live" | "forecast" | "estimate";
  flightNumber?: string;
  month: number; // 1-12, for seasonal context
  departureDate: string; // e.g. "June 9"
}

export function buildExtractionPrompt(ctx: BriefingContext): string {
  return `You are an aviation weather analyst. Parse the following raw aviation weather data for a flight from ${ctx.originCity} (${ctx.origin}) to ${ctx.destinationCity} (${ctx.destination}).

Raw weather data:
${ctx.rawWeatherData || "No SIGMET or AIRMET data found for this route and date."}

Extract a JSON object with this exact structure:
{
  "hasTurbulence": boolean,
  "severity": "none" | "light" | "moderate" | "severe",
  "timing": string | null,  // e.g. "approximately 90 minutes into the flight" or null if unknown
  "durationMinutes": number | null,  // estimated minutes of turbulence or null
  "altitudeRange": string | null,  // e.g. "35,000–38,000 ft" or null
  "causeDescription": string | null,  // e.g. "jet stream activity", "mountainous terrain", null
  "dataQuality": "live" | "forecast" | "estimate"
}

Rules:
- CAPE > 3000 J/kg AND an active TS/CB SIGMET directly on route = severity "severe"
- CAPE > 2500 J/kg OR an active TS/CB SIGMET = severity "moderate"
- CAPE 1000–2500 with no active SIGMET = severity "light"
- CAPE 500–1000 = possible light turbulence (severity "light")
- CAPE < 500 with no SIGMETs = smooth (severity "none")
- A TS SIGMET nearby but not directly on the route polygon = prefer "light" over "moderate" — SIGMETs cover large areas, not the entire bounding box
- Any TURB SIGMET = hasTurbulence true, severity based on MOD/SEV qualifier
- "Severe" is rare — use it only when both CAPE is extreme AND a SIGMET is active directly covering the route
- Only set hasTurbulence false and severity "none" if there are NO SIGMETs AND CAPE is below 500 everywhere
- Do not invent specific turbulence windows if data quality is "estimate"
- dataQuality must be "${ctx.bannerState}"
- Return ONLY valid JSON, no explanation`;
}

export function buildBriefingPrompt(
  ctx: BriefingContext,
  extracted: {
    hasTurbulence: boolean;
    severity: string;
    timing: string | null;
    durationMinutes: number | null;
    altitudeRange: string | null;
    causeDescription: string | null;
    dataQuality: string;
  }
): string {
  const flightLabel = ctx.flightNumber ? `flight ${ctx.flightNumber}` : `the flight`;
  const durationText = ctx.flightHours < 1
    ? `about ${Math.round(ctx.flightHours * 60)} minutes`
    : `about ${ctx.flightHours} hour${ctx.flightHours !== 1 ? "s" : ""}`;

  const isMonsoon = ctx.month >= 6 && ctx.month <= 9;
  const seasonNote = isMonsoon
    ? `It is currently monsoon season in India (${ctx.departureDate}). Convective activity and afternoon turbulence are common, especially over western and central India. Be honest about this if relevant — don't pretend it's not monsoon season.`
    : `It is ${ctx.departureDate}. No special seasonal context.`;

  return `You are an experienced commercial pilot. A nervous flyer just asked you what their flight will be like. Talk to them like a real person — warm, direct, no fluff.

Flight: ${flightLabel}, ${ctx.originCity} to ${ctx.destinationCity}, ${durationText}.
Seasonal context: ${seasonNote}

If you know anything specific about this route — terrain it crosses, known turbulence patterns, typical conditions — use that. Do not invent data, but do use real geographic knowledge (e.g. the Aravalli range on BOM-JAI, coastal moisture on BOM-COK, the Deccan plateau on BLR-HYD). A specific detail beats a generic statement every time.

Turbulence data:
${JSON.stringify(extracted, null, 2)}

Write 3 sentences maximum. Here is exactly how to write each one:

Sentence 1 — What to expect, stated plainly.
- If no turbulence: don't say "smooth conditions" or "good news". Say what they'll actually feel, like "This one should be pretty uneventful — a short, quiet ride."
- If light turbulence: "There'll be some light bumping, the kind where your drink stays on the tray but you'll feel the air moving a bit."
- If moderate: "There'll be some noticeable bumping on this one — seatbelt on, drink put down, but nothing that should worry you. Pilots fly through this every single day."
- If severe: be grounding, not alarming — "It's going to be a bumpy ride, the kind where you'll feel it in your seat. The aircraft handles this routinely — it's built for conditions much worse than this."

Sentence 2 — One concrete physical anchor that normalizes what they'll feel. Not a disclaimer. Something like: "The aircraft is designed to flex and handle this — what feels dramatic from your seat is very routine from ours." Or for a smooth flight: "At 30,000 feet on a clear day, flying often feels like sitting in a room that happens to be moving."

Sentence 3 — A short, human closer. Not "your crew is monitoring conditions." Something that feels like a real person signed off: "You're going to be fine." or "Sit back, the view's going to be great." or "This is one of the easier ones."

Rules:
- No jargon. No "adverse conditions", "push back", "flight deck", "weather front."
- No hedging disclaimers like "conditions can shift" or "nothing to worry about" — these increase anxiety, not reduce it.
- No em dashes.
- Do not start with "Good news" or any hype opener.
- Do not mention "the crew is monitoring" — it sounds like a PA announcement.
- If dataQuality is "estimate", weave in naturally that this is based on typical patterns for this route, not a live forecast. Don't make it a formal caveat.
- If turbulence is from convective instability (high CAPE) rather than a confirmed SIGMET, phrase it as "the atmosphere along this route looks unsettled" or "there's some convective activity in the area" — not as a certainty.
- Under 80 words total.

Return only the briefing. Nothing else.`;
}
