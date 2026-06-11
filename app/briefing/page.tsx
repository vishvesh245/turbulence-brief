"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefingResult } from "../actions/getBriefing";

function BannerBadge({ state }: { state: "live" | "forecast" | "estimate" }) {
  const styles = {
    live: { bg: "#e8f5ec", border: "#b8dcc4", color: "#3a7a50", dot: "#3a7a50", label: "Live forecast" },
    forecast: { bg: "#e8f0f8", border: "#b8cce0", color: "#2a5a80", dot: "#2a5a80", label: "Forecast model" },
    estimate: { bg: "#f0e8dc", border: "#d4c0a8", color: "#7a5a3a", dot: "#7a5a3a", label: "Typical conditions" },
  }[state];

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs shrink-0"
      style={{ background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: styles.dot }} />
      {styles.label}
    </span>
  );
}


export default function BriefingPage() {
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [sharing, setSharing] = useState(false);
  const [shareConfirm, setShareConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("briefing");
    if (!stored) { router.replace("/"); return; }
    try { setResult(JSON.parse(stored)); }
    catch { router.replace("/"); }
  }, [router]);

  async function handleShare() {
    if (!result || sharing) return;
    setSharing(true);

    const dateLabel = new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric" });
    const params = new URLSearchParams({
      originCity: result.originCity,
      destinationCity: result.destinationCity,
      severity: result.severity ?? "none",
      date: dateLabel,
      ...(result.flightNumber ? { flightNumber: result.flightNumber } : {}),
    });

    const imageUrl = `${window.location.origin}/og?${params.toString()}`;
    const shareText = `My flight from ${result.originCity} to ${result.destinationCity}:\n\n${result.briefing}\n\nturbulencebrief.vercel.app`;

    try {
      if (navigator.share) {
        const imgRes = await fetch(imageUrl);
        const blob = await imgRes.blob();
        const file = new File([blob], "turbulence-brief.png", { type: "image/png" });
        await navigator.share({ text: shareText, files: [file] });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareConfirm(true);
        setTimeout(() => setShareConfirm(false), 2500);
      }
    } catch { /* user cancelled */ }
    finally { setSharing(false); }
  }

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#faf7f2" }}>
        <p className="text-sm" style={{ color: "#a89070" }}>Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-12" style={{ background: "#faf7f2" }}>
      <div className="w-full max-w-sm mx-auto space-y-5">

        {/* Header */}
        <div className="space-y-0.5">
          <p className="text-xs tracking-widest uppercase" style={{ color: "#b8946a" }}>Your briefing</p>
          <h1 className="text-xl font-light" style={{ color: "#1a1510" }}>
            <span className="font-semibold">{result.originCity}</span>
            <span style={{ color: "#c8b89a" }}> → </span>
            <span className="font-semibold">{result.destinationCity}</span>
          </h1>
          <div className="flex items-center gap-2">
            {result.flightNumber && (
              <span className="text-sm" style={{ color: "#a89070" }}>{result.flightNumber}</span>
            )}
            <span style={{ color: "#ddd0c0" }}>·</span>
            <span className="text-sm" style={{ color: "#a89070" }}>~{result.flightHours}h flight</span>
          </div>
        </div>

        {/* Accuracy banner */}
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: "#f0e8dc", border: "1px solid #e0d0c0" }}>
          <BannerBadge state={result.banner.state} />
          <p className="text-xs" style={{ color: "#a89070" }}>{result.banner.message}</p>
        </div>

        {/* Briefing card */}
        <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid #e8ddd0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <p className="text-base font-light leading-relaxed" style={{ color: "#3a2518" }}>
            {result.briefing}
          </p>
        </div>

        {/* Copy confirm */}
        {shareConfirm && (
          <div className="rounded-xl px-4 py-2.5 text-center text-sm"
            style={{ background: "#e8f5ec", border: "1px solid #b8dcc4", color: "#3a7a50" }}>
            Briefing copied to clipboard
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 py-3.5 rounded-xl text-sm transition-opacity"
            style={{ border: "1px solid #d4b89a", color: "#8b5e3c", opacity: sharing ? 0.6 : 1 }}
          >
            {sharing ? "Preparing…" : "Share briefing"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3.5 rounded-xl text-sm font-medium"
            style={{ background: "#5c3d1e", color: "#f5ede2" }}
          >
            New flight
          </button>
        </div>

        {/* Flying soon nudge */}
        <div className="rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
          style={{ background: "#fff8f0", border: "1px solid #e8d4b8" }}>
          <div>
            <p className="text-sm font-medium" style={{ color: "#3a2518" }}>Flying soon?</p>
            <p className="text-xs mt-0.5" style={{ color: "#a89070" }}>Save the in-flight page before you board.</p>
          </div>
          <a href="/flying" target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium shrink-0" style={{ color: "#8b5e3c" }}>
            Open →
          </a>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e8ddd0" }} />

        {/* Playlists nudge */}
        <div className="rounded-xl px-4 py-3.5 flex items-center justify-between gap-3"
          style={{ background: "white", border: "1px solid #e8ddd0" }}>
          <div>
            <p className="text-sm font-medium" style={{ color: "#3a2518" }}>In-flight playlists</p>
            <p className="text-xs mt-0.5" style={{ color: "#a89070" }}>Music for boarding, cruising, and the bumpy bits.</p>
          </div>
          <a href="/playlists" className="text-sm font-medium shrink-0" style={{ color: "#8b5e3c" }}>
            Browse →
          </a>
        </div>

        <p className="text-center text-xs pt-2" style={{ color: "#d4c0a8" }}>
          Turbulence Brief · Data from AviationWeather.gov
        </p>
      </div>
    </main>
  );
}
