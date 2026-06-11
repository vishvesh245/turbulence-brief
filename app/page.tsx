"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { getBriefing, BriefingResult, BriefingError } from "./actions/getBriefing";

type Mode = "flight" | "route";

export default function Home() {
  const [mode, setMode] = useState<Mode>("flight");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split("T")[0];

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
    <main style={{ background: "#faf7f2", minHeight: "100vh" }}>

      {/* Dark hero — truly full bleed */}
      <section style={{ background: "#1a1510", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles — bigger and more dramatic on desktop */}
        <div style={{
          position: "absolute", top: -100, right: -80,
          width: 500, height: 500, borderRadius: "50%",
          background: "rgba(92,61,30,0.18)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 340, height: 340, borderRadius: "50%",
          background: "rgba(184,148,106,0.08)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "30%", left: "45%",
          width: 1, height: "40%", background: "rgba(184,148,106,0.08)",
          pointerEvents: "none",
        }} />

        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "clamp(56px, 8vw, 100px) clamp(24px, 6vw, 80px)",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}>
          {/* Left: headline + copy */}
          <div style={{ maxWidth: 620 }}>
            <p style={{
              fontSize: "clamp(10px, 1vw, 12px)",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#8b6a4a", margin: "0 0 clamp(16px, 3vw, 28px)",
            }}>✈ Turbulence Brief</p>

            <h1 style={{
              fontSize: "clamp(40px, 6.5vw, 80px)",
              fontWeight: 300, lineHeight: 1.08,
              color: "#f5ede2", margin: "0 0 clamp(16px, 2.5vw, 28px)",
              letterSpacing: "-0.5px",
            }}>
              Flights are{" "}
              <em style={{ fontStyle: "italic", color: "#c8a870" }}>safer</em>
              <br />than they feel.
            </h1>

            <p style={{
              fontSize: "clamp(14px, 1.4vw, 18px)",
              color: "#8b7060", fontWeight: 300,
              lineHeight: 1.65, margin: "0 0 clamp(28px, 4vw, 44px)",
              maxWidth: 480,
            }}>
              Turbulence can&apos;t bring a plane down. But it can make an hour
              feel like forever if you don&apos;t know what to expect.
              We made something for that.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={scrollToForm}
                style={{
                  background: "#c8a870", borderRadius: 12,
                  padding: "clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 36px)",
                  fontSize: "clamp(13px, 1.1vw, 15px)", fontWeight: 600,
                  color: "#1a1510", border: "none", cursor: "pointer",
                  letterSpacing: "0.01em",
                }}
              >
                Get a briefing
              </button>
              <a href="/playlists" style={{
                border: "1px solid #3a2a1e", borderRadius: 12,
                padding: "clamp(12px, 1.5vw, 16px) clamp(20px, 2.5vw, 28px)",
                fontSize: "clamp(13px, 1.1vw, 15px)", color: "#8b7060",
                textDecoration: "none",
              }}>
                In-flight playlists
              </a>
              <a href="/flying" style={{
                border: "1px solid #3a2a1e", borderRadius: 12,
                padding: "clamp(12px, 1.5vw, 16px) clamp(20px, 2.5vw, 28px)",
                fontSize: "clamp(13px, 1.1vw, 15px)", color: "#8b7060",
                textDecoration: "none",
              }}>
                Flying companion
              </a>
            </div>
          </div>

          {/* Right: floating stat cards — desktop only */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 12,
            minWidth: 200,
          }} className="hero-stats">
            {[
              { num: "50M+", label: "flights a year, almost all smooth" },
              { num: "0", label: "commercial flights lost to turbulence in decades" },
              { num: "3 min", label: "average turbulence patch duration" },
            ].map((s) => (
              <div key={s.num} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: "#c8a870", margin: "0 0 2px", lineHeight: 1 }}>{s.num}</p>
                <p style={{ fontSize: 11, color: "#6a5a48", margin: 0, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — 3 column grid on desktop */}
      <section style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "clamp(40px, 6vw, 72px) clamp(24px, 6vw, 80px)",
      }}>
        <p style={{
          fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#b8946a", margin: "0 0 clamp(24px, 3vw, 36px)",
        }}>What we built</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "clamp(12px, 2vw, 24px)",
        }}>
          {[
            {
              icon: "📋",
              phase: "Before you fly",
              title: "Turbulence briefing",
              body: "Enter your flight number or route. Get a plain-English read of what to expect — live aviation weather data, no jargon, no charts.",
              cta: "Check your flight",
              href: null,
            },
            {
              icon: "🎵",
              phase: "Anytime",
              title: "In-flight playlists",
              body: "Curated music for boarding, cruising, and the bumpy bits. Open in Spotify before you board — they won't load mid-flight.",
              cta: "Browse playlists",
              href: "/playlists",
            },
            {
              icon: "🧘",
              phase: "Mid-flight",
              title: "Flying companion",
              body: "Save this before you fly. Breathing guide, what turbulence actually is, and why every sound is normal. Works offline.",
              cta: "Open companion",
              href: "/flying",
            },
          ].map((item) => (
            <div key={item.title} style={{
              background: "white", borderRadius: 20,
              border: "1px solid #e8ddd0",
              padding: "clamp(20px, 2.5vw, 32px)",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "#f0e4d0", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 16,
              }}>
                {item.icon}
              </div>
              <p style={{
                fontSize: 10, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#b8946a",
                margin: "0 0 6px",
              }}>{item.phase}</p>
              <p style={{
                fontSize: "clamp(15px, 1.2vw, 17px)",
                fontWeight: 600, color: "#1a1510",
                margin: "0 0 10px",
              }}>{item.title}</p>
              <p style={{
                fontSize: "clamp(12px, 1vw, 14px)",
                color: "#a89070", lineHeight: 1.6,
                margin: "0 0 20px", flex: 1,
              }}>{item.body}</p>
              {item.href ? (
                <a href={item.href} style={{
                  fontSize: 13, color: "#8b5e3c",
                  fontWeight: 500, textDecoration: "none",
                }}>
                  {item.cta} →
                </a>
              ) : (
                <button onClick={scrollToForm} style={{
                  fontSize: 13, color: "#8b5e3c", fontWeight: 500,
                  background: "none", border: "none", padding: 0,
                  cursor: "pointer", textAlign: "left",
                }}>
                  {item.cta} →
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Form section */}
      <div ref={formRef} style={{ borderTop: "1px solid #e8ddd0", background: "#fff8f0" }}>
        <section style={{
          maxWidth: 480, margin: "0 auto",
          padding: "clamp(40px, 5vw, 64px) clamp(24px, 4vw, 48px)",
        }}>
          <p style={{
            fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#b8946a", margin: "0 0 4px",
          }}>Get your briefing</p>
          <p style={{ fontSize: 14, color: "#a89070", margin: "0 0 24px", fontWeight: 300 }}>
            Free. No sign-up. Live aviation weather.
          </p>

          <div style={{
            display: "flex", background: "rgba(0,0,0,0.04)",
            borderRadius: 12, padding: 4, gap: 4, marginBottom: 16,
          }}>
            {(["flight", "route"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 9,
                  fontSize: 13, border: "none", cursor: "pointer",
                  background: mode === m ? "white" : "transparent",
                  color: mode === m ? "#3a2518" : "#a89070",
                  fontWeight: mode === m ? 500 : 400,
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s",
                }}
              >
                {m === "flight" ? "Flight number" : "My route"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "flight" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, color: "#6a5040" }}>Flight number</label>
                <input
                  name="flightNumber"
                  placeholder="e.g. 6E123 or AI302"
                  required
                  style={{
                    borderRadius: 12, border: "1px solid #e8ddd0",
                    padding: "13px 16px", fontSize: 13, color: "#1a1510",
                    background: "white", outline: "none",
                    width: "100%", boxSizing: "border-box",
                  }}
                />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { name: "origin", placeholder: "BOM", label: "From" },
                  { name: "destination", placeholder: "DEL", label: "To" },
                ].map((f) => (
                  <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, color: "#6a5040" }}>{f.label}</label>
                    <input
                      name={f.name}
                      placeholder={f.placeholder}
                      maxLength={3}
                      required
                      style={{
                        borderRadius: 12, border: "1px solid #e8ddd0",
                        padding: "13px 16px", fontSize: 13, color: "#1a1510",
                        background: "white", outline: "none",
                        textTransform: "uppercase",
                        width: "100%", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#6a5040" }}>Date</label>
              <input
                name="date"
                type="date"
                defaultValue={today}
                min={today}
                required
                style={{
                  borderRadius: 12, border: "1px solid #e8ddd0",
                  padding: "13px 16px", fontSize: 13, color: "#1a1510",
                  background: "white", outline: "none",
                  width: "100%", boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{
                borderRadius: 12, padding: "12px 16px",
                background: "#fff8f0", border: "1px solid #e8d4b8",
              }}>
                <p style={{ fontSize: 13, color: "#8b5e3c", margin: 0 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              style={{
                background: "#5c3d1e", color: "#f5ede2",
                borderRadius: 12, padding: "15px 0", fontSize: 14,
                fontWeight: 500, border: "none", cursor: "pointer",
                opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s",
              }}
            >
              {isPending ? "Getting your briefing…" : "Get my briefing"}
            </button>
          </form>
        </section>
      </div>

      <div style={{
        borderTop: "1px solid #e8ddd0",
        padding: "16px clamp(24px, 6vw, 80px)",
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
      }}>
        <p style={{ fontSize: 11, color: "#c8b89a", margin: 0 }}>Turbulence Brief · Data from AviationWeather.gov</p>
        <p style={{ fontSize: 11, color: "#c8b89a", margin: 0 }}>Free · No sign-up · Indian routes</p>
      </div>

    </main>
  );
}
