"use server";

export interface FlightRoute {
  origin: string;
  destination: string;
  flightNumber: string;
}

export async function getFlightRoute(
  flightNumber: string,
  date: string
): Promise<FlightRoute | null> {
  const apiKey = process.env.AIRLABS_API_KEY;
  if (!apiKey || apiKey === "your_airlabs_key_here") return null;

  // Normalize: remove spaces, uppercase (handles "6E 5293" → "6E5293")
  const normalized = flightNumber.replace(/\s+/g, "").toUpperCase();

  try {
    // Use /schedules endpoint — works for future flights, not just airborne ones
    const schedulesUrl = `https://airlabs.co/api/v9/schedules?flight_iata=${normalized}&api_key=${apiKey}`;
    const schedulesRes = await fetch(schedulesUrl, { next: { revalidate: 0 } });

    if (schedulesRes.ok) {
      const data = await schedulesRes.json();
      const flights: Array<Record<string, string>> = data.response ?? [];

      if (flights.length > 0) {
        const flight = flights[0];
        const dep = flight.dep_iata ?? flight.dep_icao ?? null;
        const arr = flight.arr_iata ?? flight.arr_icao ?? null;

        if (dep && arr) {
          return { origin: dep, destination: arr, flightNumber: normalized };
        }
      }
    }

    // Fallback: live /flight endpoint for currently airborne flights
    const liveUrl = `https://airlabs.co/api/v9/flight?flight_iata=${normalized}&api_key=${apiKey}`;
    const liveRes = await fetch(liveUrl, { next: { revalidate: 0 } });

    if (!liveRes.ok) return null;

    const liveData = await liveRes.json();
    if (!liveData.response) return null;

    const flight = liveData.response;
    const dep = flight.dep_iata ?? flight.dep_icao ?? null;
    const arr = flight.arr_iata ?? flight.arr_icao ?? null;

    if (!dep || !arr) return null;

    return { origin: dep, destination: arr, flightNumber: normalized };
  } catch {
    return null;
  }
}
