// Compute a bounding box around a flight route for querying turbulence data
// Uses great-circle midpoint + padding to cover the full flight path

interface Coords {
  lat: number;
  lon: number;
}

// Degrees of padding around the route bounding box (~100km buffer)
const PADDING_DEG = 2.0;

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

export function computeRouteBoundingBox(origin: Coords, destination: Coords): BoundingBox {
  const minLat = Math.min(origin.lat, destination.lat) - PADDING_DEG;
  const maxLat = Math.max(origin.lat, destination.lat) + PADDING_DEG;
  const minLon = Math.min(origin.lon, destination.lon) - PADDING_DEG;
  const maxLon = Math.max(origin.lon, destination.lon) + PADDING_DEG;

  return {
    minLat: Math.max(minLat, -90),
    maxLat: Math.min(maxLat, 90),
    minLon: Math.max(minLon, -180),
    maxLon: Math.min(maxLon, 180),
  };
}

// Estimate rough flight duration in hours based on distance
export function estimateFlightHours(origin: Coords, destination: Coords): number {
  const R = 6371; // Earth radius in km
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLon = ((destination.lon - origin.lon) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  // Assume ~800 km/h cruising speed
  return Math.round((distanceKm / 800) * 10) / 10;
}
