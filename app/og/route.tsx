import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.searchParams.get("origin") ?? "BOM";
  const destination = url.searchParams.get("destination") ?? "DEL";
  const originCity = url.searchParams.get("originCity") ?? origin;
  const destinationCity = url.searchParams.get("destinationCity") ?? destination;
  const severity = url.searchParams.get("severity") ?? "none"; // none | light | moderate | severe
  const line = url.searchParams.get("line") ?? "Looks like a smooth one.";

  const dotColor =
    severity === "none" ? "#22c55e" :
    severity === "light" ? "#eab308" :
    severity === "moderate" ? "#f97316" :
    "#ef4444";

  const severityLabel =
    severity === "none" ? "Smooth" :
    severity === "light" ? "Light turbulence" :
    severity === "moderate" ? "Moderate turbulence" :
    "Rough conditions";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: app name */}
        <div style={{ color: "#475569", fontSize: "24px", letterSpacing: "0.1em" }}>
          TURBULENCE BRIEF
        </div>

        {/* Middle: route + briefing line */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ color: "#f8fafc", fontSize: "56px", fontWeight: "700" }}>
              {originCity}
            </span>
            <span style={{ color: "#334155", fontSize: "48px" }}>→</span>
            <span style={{ color: "#f8fafc", fontSize: "56px", fontWeight: "700" }}>
              {destinationCity}
            </span>
          </div>

          <p style={{ color: "#cbd5e1", fontSize: "32px", lineHeight: "1.4", margin: "0" }}>
            {line}
          </p>
        </div>

        {/* Bottom: severity indicator + url */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: dotColor,
            }} />
            <span style={{ color: "#94a3b8", fontSize: "22px" }}>{severityLabel}</span>
          </div>
          <span style={{ color: "#334155", fontSize: "20px" }}>turbulencebrief.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
