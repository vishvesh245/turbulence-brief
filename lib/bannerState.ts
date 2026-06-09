// Determines accuracy banner state based on hours until departure

export type BannerState = "live" | "forecast" | "estimate";

export interface BannerInfo {
  state: BannerState;
  message: string;
}

export function getBannerInfo(departureDate: Date): BannerInfo {
  const now = new Date();
  const hoursUntil = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntil <= 18) {
    return {
      state: "live",
      message: "Based on live forecast data.",
    };
  } else if (hoursUntil <= 48) {
    return {
      state: "forecast",
      message: "Based on forecast models. Most accurate within 18 hours of departure.",
    };
  } else {
    return {
      state: "estimate",
      message:
        "No live forecast exists yet for this date. This is based on typical weather patterns for this route — check back closer to departure for a live briefing.",
    };
  }
}
