"use server";

import { BoundingBox } from "@/lib/routeBox";

// Sample origin, midpoint, destination for convective instability data
function routePoints(box: BoundingBox) {
  return [
    { lat: box.minLat, lon: box.minLon, label: "origin" },
    { lat: (box.minLat + box.maxLat) / 2, lon: (box.minLon + box.maxLon) / 2, label: "midpoint" },
    { lat: box.maxLat, lon: box.maxLon, label: "destination" },
  ];
}

async function getCapeData(box: BoundingBox): Promise<string> {
  const points = routePoints(box);
  const results: string[] = [];

  await Promise.all(
    points.map(async (pt) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${pt.lat}&longitude=${pt.lon}&hourly=cape,lifted_index&forecast_days=2&timezone=Asia%2FKolkata`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return;
        const data = await res.json();

        const cape: number[] = data.hourly?.cape?.slice(0, 12) ?? [];
        const li: number[] = data.hourly?.lifted_index?.slice(0, 12) ?? [];

        const maxCape = cape.length ? Math.max(...cape) : 0;
        const minLI = li.length ? Math.min(...li) : 0;

        if (maxCape > 100) {
          const risk =
            maxCape > 2500 ? "HIGH convective risk"
            : maxCape > 1000 ? "MODERATE convective risk"
            : maxCape > 500 ? "LOW convective risk"
            : "minimal convective activity";

          const stability =
            minLI < -4 ? "very unstable"
            : minLI < -2 ? "unstable"
            : minLI < 0 ? "slightly unstable"
            : "stable";

          results.push(
            `${pt.label.toUpperCase()}: CAPE=${maxCape} J/kg (${risk}), LI=${minLI} (${stability})`
          );
        }
      } catch {
        // skip point
      }
    })
  );

  return results.length > 0
    ? `CONVECTIVE INSTABILITY (Open-Meteo, next 12h):\n${results.join("\n")}`
    : "";
}

export async function getTurbulenceData(box: BoundingBox): Promise<string> {
  try {
    // No hazard filter — India's primary hazard is TS (embedded thunderstorms), not standalone TURB.
    // The old hazard=turb filter was silently excluding all Indian SIGMETs.
    const sigmetUrl = `https://aviationweather.gov/api/data/isigmet?format=raw&bbox=${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`;
    const airmetUrl = `https://aviationweather.gov/api/data/airsigmet?format=raw&hazard=turb&bbox=${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`;

    const [sigmetRes, airmetRes, capeText] = await Promise.all([
      fetch(sigmetUrl, { next: { revalidate: 0 } }).catch(() => null),
      fetch(airmetUrl, { next: { revalidate: 0 } }).catch(() => null),
      getCapeData(box),
    ]);

    const parts: string[] = [];

    if (sigmetRes?.ok) {
      const text = await sigmetRes.text();
      if (text.trim()) {
        // Filter to turbulence/convection-relevant lines
        const lines = text.trim().split("\n").filter((line) => {
          const u = line.toUpperCase();
          return u.includes("TURB") || u.includes("TS") || u.includes("CB") || u.includes("SEV") || u.includes("MOD") || u.includes("ICE");
        });
        if (lines.length > 0) {
          parts.push(`SIGMET DATA:\n${lines.join("\n")}`);
        } else {
          // Still include raw data so Claude knows SIGMETs exist (might be non-turb advisories)
          parts.push(`SIGMET DATA (no turbulence/convection advisories active):\nnone`);
        }
      }
    }

    if (airmetRes?.ok) {
      const text = await airmetRes.text();
      if (text.trim()) parts.push(`AIRMET DATA:\n${text.trim()}`);
    }

    if (capeText) parts.push(capeText);

    return parts.join("\n\n");
  } catch {
    return "";
  }
}
