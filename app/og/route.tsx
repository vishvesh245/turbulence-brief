import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const originCity = url.searchParams.get("originCity") ?? "Mumbai";
  const destinationCity = url.searchParams.get("destinationCity") ?? "Delhi";
  const severity = url.searchParams.get("severity") ?? "none";
  const flightNumber = url.searchParams.get("flightNumber") ?? null;
  const date = url.searchParams.get("date") ?? null; // e.g. "June 9"

  // Severity-based card headline — written for a card, not pulled from briefing paragraph
  const cardHeadline =
    severity === "none"
      ? "You're going to be fine."
      : severity === "light"
      ? "A little bumpy, but nothing to worry about."
      : severity === "moderate"
      ? "Some bumps ahead. Pilots fly through this every day."
      : "Bumpy ride, but the aircraft is built for far worse.";

  const severityLabel =
    severity === "none" ? "Smooth flight expected" :
    severity === "light" ? "Light turbulence" :
    severity === "moderate" ? "Moderate turbulence" :
    "Bumpy conditions";

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
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: app name + flight meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#c8b89a", fontSize: "18px", letterSpacing: "0.15em" }}>
            ✈ TURBULENCE BRIEF
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {flightNumber && (
              <span style={{
                color: "#8b6040",
                fontSize: "18px",
                background: "#f0e8dc",
                padding: "6px 16px",
                borderRadius: "100px",
                border: "1px solid #e0d0c0",
              }}>
                {flightNumber}
              </span>
            )}
            {date && (
              <span style={{ color: "#c8b89a", fontSize: "18px" }}>{date}</span>
            )}
          </div>
        </div>

        {/* Middle: route + headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span style={{ color: "#1a1510", fontSize: "68px", fontWeight: "700" }}>
              {originCity}
            </span>
            <span style={{ color: "#d4c0a8", fontSize: "56px" }}>→</span>
            <span style={{ color: "#1a1510", fontSize: "68px", fontWeight: "700" }}>
              {destinationCity}
            </span>
          </div>
          <p style={{ color: "#5c3d1e", fontSize: "32px", lineHeight: "1.45", margin: "0", fontWeight: "300" }}>
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
            <span style={{ color: severityColor, fontSize: "18px" }}>{severityLabel}</span>
          </div>
          <span style={{ color: "#c8b89a", fontSize: "16px" }}>turbulencebrief.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
