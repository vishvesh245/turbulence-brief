"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getBriefing, BriefingResult, BriefingError } from "./actions/getBriefing";

type Mode = "flight" | "route";

export default function Home() {
  const [mode, setMode] = useState<Mode>("flight");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("mode", mode);

    startTransition(async () => {
      const result = await getBriefing(formData);

      if ("type" in result) {
        const err = result as BriefingError;
        if (err.type === "not_found") {
          setError(err.message);
          setMode("route");
        } else {
          setError(err.message);
        }
        return;
      }

      const res = result as BriefingResult;
      sessionStorage.setItem("briefing", JSON.stringify(res));
      router.push("/briefing");
    });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ background: "#faf7f2" }}>
      <div className="w-full max-w-sm space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs tracking-widest uppercase" style={{ color: "#b8946a" }}>✈ Turbulence Brief</p>
          <h1 className="text-2xl font-light leading-snug" style={{ color: "#1a1510" }}>
            Know what&apos;s ahead<br />
            <span className="font-semibold" style={{ color: "#5c3d1e" }}>before you board.</span>
          </h1>
          <p className="text-sm font-light" style={{ color: "#a89070" }}>Plain English. No jargon. Just calm.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(0,0,0,0.04)" }}>
          <button
            type="button"
            onClick={() => { setMode("flight"); setError(null); }}
            className="flex-1 py-2.5 text-sm rounded-lg transition-all"
            style={mode === "flight"
              ? { background: "white", color: "#3a2518", fontWeight: 500, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { color: "#a89070" }}
          >
            Flight number
          </button>
          <button
            type="button"
            onClick={() => { setMode("route"); setError(null); }}
            className="flex-1 py-2.5 text-sm rounded-lg transition-all"
            style={mode === "route"
              ? { background: "white", color: "#3a2518", fontWeight: 500, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { color: "#a89070" }}
          >
            My route
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "flight" ? (
            <div className="space-y-1.5">
              <label className="text-sm" style={{ color: "#6a5040" }}>Flight number</label>
              <input
                name="flightNumber"
                placeholder="e.g. 6E123 or AI302"
                required
                autoFocus
                className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
                style={{ background: "white", border: "1px solid #e8ddd0", color: "#1a1510" }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm" style={{ color: "#6a5040" }}>From</label>
                <input
                  name="origin"
                  placeholder="BOM"
                  maxLength={3}
                  required
                  autoFocus
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none uppercase"
                  style={{ background: "white", border: "1px solid #e8ddd0", color: "#1a1510" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm" style={{ color: "#6a5040" }}>To</label>
                <input
                  name="destination"
                  placeholder="DEL"
                  maxLength={3}
                  required
                  className="w-full rounded-xl px-4 py-3.5 text-sm outline-none uppercase"
                  style={{ background: "white", border: "1px solid #e8ddd0", color: "#1a1510" }}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm" style={{ color: "#6a5040" }}>Date</label>
            <input
              name="date"
              type="date"
              defaultValue={today}
              min={today}
              required
              className="w-full rounded-xl px-4 py-3.5 text-sm outline-none"
              style={{ background: "white", border: "1px solid #e8ddd0", color: "#1a1510" }}
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3" style={{ background: "#fff8f0", border: "1px solid #e8d4b8" }}>
              <p className="text-sm" style={{ color: "#8b5e3c" }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-xl text-sm font-medium transition-opacity"
            style={{ background: "#5c3d1e", color: "#f5ede2", opacity: isPending ? 0.7 : 1 }}
          >
            {isPending ? "Getting your briefing…" : "Get my briefing"}
          </button>
        </form>

        <p className="text-center text-xs" style={{ color: "#c8b89a" }}>
          Live aviation weather · Built for Indian routes
        </p>
      </div>
    </main>
  );
}
