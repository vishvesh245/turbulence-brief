"use client";

import { useEffect, useState } from "react";
import { FLYING_CONTENT } from "@/lib/flyingContent";

function BreathingExercise() {
  const [step, setStep] = useState(0); // 0=in, 1=hold, 2=out
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(true);

  const labels = ["Breathe in", "Hold", "Breathe out"];
  const colors = ["#8b9e7a", "#7a8e9e", "#9e8a7a"];

  useEffect(() => {
    if (!running) return;
    if (count > 0) {
      const t = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const next = (step + 1) % 3;
      setStep(next);
      setCount(4);
    }
  }, [count, step, running]);

  const progress = ((4 - count) / 4) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#6a5040" }}>{FLYING_CONTENT.breathingPrompt.instruction}</p>
        <button
          onClick={() => setRunning(r => !r)}
          className="text-xs" style={{ color: "#c8b89a" }}
        >
          {running ? "pause" : "resume"}
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-1000"
          style={{
            background: colors[step],
            opacity: 0.5 + (count / 4) * 0.5,
          }}
        >
          <span className="font-medium text-xl" style={{ color: "white" }}>{count}</span>
        </div>
        <p className="font-medium text-lg" style={{ color: "#3a2518" }}>{labels[step]}</p>

        <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "#e8ddd0" }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, background: colors[step] }}
          />
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: "#c8b89a" }}>{FLYING_CONTENT.breathingPrompt.note}</p>
    </div>
  );
}

export default function FlyingPage() {
  return (
    <main className="min-h-screen px-5 py-12" style={{ background: "#faf7f2" }}>
      <div className="w-full max-w-sm mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-light" style={{ color: "#1a1510" }}>
            {FLYING_CONTENT.headline}
          </h1>
          <p className="text-base font-light" style={{ color: "#a89070" }}>
            {FLYING_CONTENT.subheadline}
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-7">
          {FLYING_CONTENT.sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-xs font-medium uppercase tracking-widest" style={{ color: "#b8946a" }}>
                {section.title}
              </h2>
              <p className="font-light leading-relaxed" style={{ color: "#3a2518" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #e8ddd0" }} />

        {/* Breathing exercise */}
        <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #e8ddd0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <BreathingExercise />
        </div>

        {/* Closer */}
        <p className="font-light leading-relaxed italic text-sm" style={{ color: "#a89070" }}>
          {FLYING_CONTENT.closer}
        </p>

        {/* Back link */}
        <div className="text-center pt-2">
          <a href="/" className="text-xs" style={{ color: "#c8b89a" }}>
            Get a briefing for your next flight
          </a>
        </div>
      </div>
    </main>
  );
}
