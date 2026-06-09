"use server";

import { BoundingBox } from "@/lib/routeBox";

export async function getTurbulenceData(box: BoundingBox): Promise<string> {
  try {
    // Fetch SIGMETs from AviationWeather.gov (free, no key required)
    const sigmetUrl = `https://aviationweather.gov/api/data/isigmet?format=raw&hazard=turb&bbox=${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`;
    const airmetUrl = `https://aviationweather.gov/api/data/airsigmet?format=raw&hazard=turb&bbox=${box.minLon},${box.minLat},${box.maxLon},${box.maxLat}`;

    const [sigmetRes, airmetRes] = await Promise.allSettled([
      fetch(sigmetUrl, { next: { revalidate: 0 } }),
      fetch(airmetUrl, { next: { revalidate: 0 } }),
    ]);

    const parts: string[] = [];

    if (sigmetRes.status === "fulfilled" && sigmetRes.value.ok) {
      const text = await sigmetRes.value.text();
      if (text.trim()) parts.push(`SIGMET DATA:\n${text.trim()}`);
    }

    if (airmetRes.status === "fulfilled" && airmetRes.value.ok) {
      const text = await airmetRes.value.text();
      if (text.trim()) parts.push(`AIRMET DATA:\n${text.trim()}`);
    }

    return parts.length > 0 ? parts.join("\n\n") : "";
  } catch {
    return "";
  }
}
