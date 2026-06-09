"use server";

import { getFlightRoute } from "./getFlight";
import { getTurbulenceData } from "./getTurbulence";
import { generateBriefing } from "./generateBriefing";
import { getAirportCoords, getAirportCity } from "@/lib/airports";
import { computeRouteBoundingBox, estimateFlightHours } from "@/lib/routeBox";
import { getBannerInfo, BannerInfo } from "@/lib/bannerState";

export interface BriefingResult {
  briefing: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  flightNumber?: string;
  banner: BannerInfo;
  flightHours: number;
  severity: "none" | "light" | "moderate" | "severe";
}

export interface BriefingError {
  type: "not_found" | "missing_coords" | "api_error";
  message: string;
}

export async function getBriefing(formData: FormData): Promise<BriefingResult | BriefingError> {
  const mode = formData.get("mode") as string;
  const date = formData.get("date") as string;

  let origin: string;
  let destination: string;
  let flightNumber: string | undefined;

  if (mode === "flight") {
    const rawFlightNumber = formData.get("flightNumber") as string;
    if (!rawFlightNumber?.trim()) {
      return { type: "api_error", message: "Please enter a flight number." };
    }

    const route = await getFlightRoute(rawFlightNumber.trim(), date);
    if (!route) {
      return {
        type: "not_found",
        message: "Flight not found in schedule. It may not be available yet — try entering your route manually instead.",
      };
    }

    origin = route.origin;
    destination = route.destination;
    flightNumber = route.flightNumber;
  } else {
    origin = (formData.get("origin") as string)?.trim().toUpperCase();
    destination = (formData.get("destination") as string)?.trim().toUpperCase();
    if (!origin || !destination) {
      return { type: "api_error", message: "Please enter both origin and destination." };
    }
  }

  const originCoords = getAirportCoords(origin);
  const destCoords = getAirportCoords(destination);

  if (!originCoords || !destCoords) {
    return {
      type: "missing_coords",
      message: `We don't have location data for ${!originCoords ? origin : destination} yet. We're working on expanding our airport coverage.`,
    };
  }

  const box = computeRouteBoundingBox(originCoords, destCoords);
  const flightHours = estimateFlightHours(originCoords, destCoords);
  // Append T00:00 so it parses as local midnight, not UTC midnight
  const departureDate = new Date(`${date}T00:00`);
  const banner = getBannerInfo(departureDate);

  const rawWeatherData = await getTurbulenceData(box);

  const { briefing, severity } = await generateBriefing({
    origin,
    originCity: getAirportCity(origin),
    destination,
    destinationCity: getAirportCity(destination),
    flightHours,
    rawWeatherData,
    bannerState: banner.state,
    flightNumber,
    month: departureDate.getMonth() + 1,
    departureDate: departureDate.toLocaleDateString("en-IN", { month: "long", day: "numeric" }),
  });

  return {
    briefing,
    severity,
    origin,
    originCity: getAirportCity(origin),
    destination,
    destinationCity: getAirportCity(destination),
    flightNumber,
    banner,
    flightHours,
  };
}
