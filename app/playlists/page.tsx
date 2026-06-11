"use client";

import { FLIGHT_PHASES } from "@/lib/playlists";

export default function PlaylistsPage() {
  return (
    <main className="min-h-screen px-5 py-12" style={{ background: "#faf7f2" }}>
      <div className="w-full max-w-sm mx-auto space-y-8">

        <div className="space-y-2">
          <a href="/" className="text-xs" style={{ color: "#c8b89a" }}>← Turbulence Brief</a>
          <h1 className="text-2xl font-light" style={{ color: "#1a1510" }}>In-flight playlists</h1>
          <p className="text-sm font-light" style={{ color: "#a89070" }}>
            Open these in Spotify before you board. They won&apos;t load mid-flight.
          </p>
        </div>

        {FLIGHT_PHASES.map((phase) => (
          <div key={phase.phase} className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#b8946a" }}>{phase.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#a89070" }}>{phase.sublabel}</p>
            </div>

            {phase.playlists.map((playlist) => (
              <div key={playlist.spotifyId} className="rounded-xl p-4 space-y-3"
                style={{ background: "white", border: "1px solid #e8ddd0" }}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1a1510" }}>{playlist.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#a89070" }}>{playlist.description}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "#f0e8dc", color: "#8b6040" }}>
                    {playlist.mood}
                  </span>
                </div>

                <iframe
                  src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="rounded-lg"
                />

                <a href={playlist.youtubeMusicUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs" style={{ color: "#c8b89a" }}>
                  Open in YouTube Music instead
                </a>
              </div>
            ))}
          </div>
        ))}

        <p className="text-center text-xs pt-2" style={{ color: "#d4c0a8" }}>
          Turbulence Brief · Free · No sign-up
        </p>
      </div>
    </main>
  );
}
