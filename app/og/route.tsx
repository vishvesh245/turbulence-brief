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

  // Severity-based card headline — written for a card, not pulled from briefing paragraph
  const cardHeadline =
    severity === "none"
      ? "You're going to be fine."
      : severity === "light"
      ? "A little bumpy, nothing to worry about."
      : severity === "moderate"
      ? "Rough patch ahead — but the plane handles this every day."
      : "It'll be choppy. The aircraft is built for far worse.";

  const severityLabel =
    severity === "none" ? "Smooth flight expected" :
    severity === "light" ? "Light turbulence" :
    severity === "moderate" ? "Moderate turbulence" :
    "Rough conditions";

  const severityColor =
    severity === "none" ? "#5a8a6a" :
    severity === "light" ? "#8a7a3a" :
    severity === "moderate" ? "#8a5a2a" :
    "#8a3a3a";

  const severityBg =
    severity === "none" ? "#e8f5ec" :
    severity === "light" ? "#f5f0e0" :
    severity === "moderate" ? "#f5ece0" :
    "#f5e0e0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#faf7f2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top: app name */}
        <div style={{ color: "#c8b89a", fontSize: "20px", letterSpacing: "0.15em", fontFamily: "sans-serif" }}>
          ✈ TURBULENCE BRIEF
        </div>

        {/* Middle: route + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span style={{ color: "#1a1510", fontSize: "64px", fontWeight: "700", fontFamily: "sans-serif" }}>
              {originCity}
            </span>
            <span style={{ color: "#d4c0a8", fontSize: "52px", fontFamily: "sans-serif" }}>→</span>
            <span style={{ color: "#1a1510", fontSize: "64px", fontWeight: "700", fontFamily: "sans-serif" }}>
              {destinationCity}
            </span>
          </div>

          <p style={{ color: "#5c3d1e", fontSize: "34px", lineHeight: "1.4", margin: "0", fontWeight: "300" }}>
            {cardHeadline}
          </p>
        </div>

        {/* Bottom: severity pill + url */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: severityBg,
            border: `1px solid ${severityColor}40`,
            borderRadius: "100px",
            padding: "8px 20px",
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: severityColor }} />
            <span style={{ color: severityColor, fontSize: "20px", fontFamily: "sans-serif" }}>{severityLabel}</span>
          </div>
          <span style={{ color: "#c8b89a", fontSize: "18px", fontFamily: "sans-serif" }}>turbulencebrief.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
