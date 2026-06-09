// Curated playlists per flight phase
// Spotify embed + YouTube Music fallback for each

export interface Playlist {
  name: string;
  description: string;
  spotifyId: string; // Spotify playlist ID for embed
  youtubeMusicUrl: string; // YouTube Music link as fallback
  mood: string; // one word shown as tag
}

export interface FlightPhase {
  phase: "boarding" | "cruising" | "bumpy";
  label: string;
  sublabel: string;
  playlists: Playlist[];
}

export const FLIGHT_PHASES: FlightPhase[] = [
  {
    phase: "boarding",
    label: "Boarding & taxi",
    sublabel: "While you're settling in",
    playlists: [
      {
        name: "Peaceful Morning",
        description: "Gentle, familiar — sets a calm tone before takeoff",
        spotifyId: "37i9dQZF1DX3Ogo9pFvBkY",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_kmPRjHDECIcuVwnKsx2Vo7lJnmGQBM_s0",
        mood: "calm",
      },
      {
        name: "Acoustic Classics",
        description: "Familiar songs, acoustic versions — nothing surprising",
        spotifyId: "37i9dQZF1DXdwTUxmGKrdN",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_lf8okgl2-mTboNbouINcKfQGIBQWfzSm4",
        mood: "familiar",
      },
    ],
  },
  {
    phase: "cruising",
    label: "Cruising",
    sublabel: "Once you're at altitude",
    playlists: [
      {
        name: "Deep Focus",
        description: "Instrumental, no lyrics — good for reading or just zoning out",
        spotifyId: "37i9dQZF1DWZeKCadgRdKQ",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_ly7EOFqB7xnqJiKQLZkq29v6D2GJf9154",
        mood: "focus",
      },
      {
        name: "Bollywood Chill",
        description: "Slow, melodic Bollywood — something that feels like home",
        spotifyId: "37i9dQZF1DX0XUfTFmNBRM",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_kgDCFLBfB8bIhm0D9e6z9iRmH5lj0X_-Y",
        mood: "desi",
      },
    ],
  },
  {
    phase: "bumpy",
    label: "If it gets bumpy",
    sublabel: "Open this one before you board — it won't load mid-flight",
    playlists: [
      {
        name: "Slow Air",
        description: "Slow tempo, no sudden changes, predictable rhythm — specifically for anxious moments",
        spotifyId: "37i9dQZF1DWXe9gFZP0gtP",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_lr0LH-RKb6JE1A_S_PNGXNm6hL2Qhk",
        mood: "grounding",
      },
      {
        name: "Rain & Thunder",
        description: "Ambient rain sounds — masks cabin noise and slows breathing naturally",
        spotifyId: "37i9dQZF1DX4PP3DA4J0N8",
        youtubeMusicUrl: "https://music.youtube.com/playlist?list=RDCLAK5uy_lqFcbnBiGJpuyNPBopHPMJBinNRg0_d94",
        mood: "ambient",
      },
    ],
  },
];
