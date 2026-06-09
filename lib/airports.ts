// Coordinates for major Indian airports
// Used to compute bounding box for turbulence data queries

export interface Airport {
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
}

export const INDIAN_AIRPORTS: Record<string, Airport> = {
  BOM: { iata: "BOM", name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", lat: 19.0896, lon: 72.8656 },
  DEL: { iata: "DEL", name: "Indira Gandhi International", city: "Delhi", lat: 28.5665, lon: 77.1031 },
  BLR: { iata: "BLR", name: "Kempegowda International", city: "Bengaluru", lat: 13.1979, lon: 77.7063 },
  HYD: { iata: "HYD", name: "Rajiv Gandhi International", city: "Hyderabad", lat: 17.2403, lon: 78.4294 },
  MAA: { iata: "MAA", name: "Chennai International", city: "Chennai", lat: 12.9941, lon: 80.1709 },
  CCU: { iata: "CCU", name: "Netaji Subhas Chandra Bose International", city: "Kolkata", lat: 22.6547, lon: 88.4467 },
  AMD: { iata: "AMD", name: "Sardar Vallabhbhai Patel International", city: "Ahmedabad", lat: 23.0772, lon: 72.6347 },
  COK: { iata: "COK", name: "Cochin International", city: "Kochi", lat: 10.1520, lon: 76.4019 },
  PNQ: { iata: "PNQ", name: "Pune Airport", city: "Pune", lat: 18.5822, lon: 73.9197 },
  GOI: { iata: "GOI", name: "Goa International", city: "Goa", lat: 15.3808, lon: 73.8314 },
  JAI: { iata: "JAI", name: "Jaipur International", city: "Jaipur", lat: 26.8242, lon: 75.8122 },
  LKO: { iata: "LKO", name: "Chaudhary Charan Singh International", city: "Lucknow", lat: 26.7606, lon: 80.8893 },
  IXC: { iata: "IXC", name: "Chandigarh International", city: "Chandigarh", lat: 30.6735, lon: 76.7885 },
  PAT: { iata: "PAT", name: "Jay Prakash Narayan International", city: "Patna", lat: 25.5913, lon: 85.0880 },
  BHO: { iata: "BHO", name: "Raja Bhoj Airport", city: "Bhopal", lat: 23.2875, lon: 77.3374 },
  NAG: { iata: "NAG", name: "Dr. Babasaheb Ambedkar International", city: "Nagpur", lat: 21.0922, lon: 79.0472 },
  VNS: { iata: "VNS", name: "Lal Bahadur Shastri International", city: "Varanasi", lat: 25.4524, lon: 82.8593 },
  IXB: { iata: "IXB", name: "Bagdogra Airport", city: "Siliguri", lat: 26.6812, lon: 88.3286 },
  GAU: { iata: "GAU", name: "Lokpriya Gopinath Bordoloi International", city: "Guwahati", lat: 26.1061, lon: 91.5859 },
  TRV: { iata: "TRV", name: "Trivandrum International", city: "Thiruvananthapuram", lat: 8.4821, lon: 76.9201 },
};

// Fallback: fetch coordinates from a static lookup or return null
export function getAirportCoords(iata: string): { lat: number; lon: number } | null {
  const airport = INDIAN_AIRPORTS[iata.toUpperCase()];
  if (airport) return { lat: airport.lat, lon: airport.lon };
  return null;
}

export function getAirportCity(iata: string): string {
  return INDIAN_AIRPORTS[iata.toUpperCase()]?.city ?? iata;
}
