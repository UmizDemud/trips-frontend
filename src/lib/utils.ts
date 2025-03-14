import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const incrementIndexToHourString = (i: number) => {
  const totalMinutes = i * 30;

  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`
}


type Coordinate = [number, number]; // [longitude, latitude]

/**
 * Calculate the great-circle distance between two points using the Haversine formula
 * @param point1 - [longitude, latitude] of the first point
 * @param point2 - [longitude, latitude] of the second point
 * @returns Distance in kilometers
 */
export function getDistance(point1: Coordinate, point2: Coordinate): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const [lon1, lat1] = point1;
  const [lon2, lat2] = point2;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const getFuelStops = async (lat: number, lon: number, radius = 5000): Promise<{
  location: [number, number],
  name: string
}[]> => {
  const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:${radius},${lat},${lon});out;`;

  try {

    const response = await fetch(overpassUrl);
    const {elements} = await response.json();
    
    return elements.map((element: {
      lon: string | number,
      lat: string | number,
      tags: {
        name?: string
      },
    }) => ({
      location: [element.lon, element.lat],
      name: element.tags.name || "Unknown Station",
    }));
  } catch (error) {
    console.error("Error fetching fuel stops:", error);
    return [];
  }
}

export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export const secondsToDurationString = (secs: number) => {
  const daysInSecs = (60*60*24);
  const hoursInSecs = 60*60;

  const days = secs / daysInSecs;
  let remaining = secs % daysInSecs;

  const hours = remaining / hoursInSecs;
  remaining = remaining % hoursInSecs;

  const minutes = remaining / 60;
  remaining = remaining % 60;

  return `${(days < 1) ? "" : `${days.toFixed(0)}(days), `}${hours.toFixed(0).padStart(2, "0")}:${minutes.toFixed(0).padStart(2, "0")}`
}

export const metersToDistanceString = (ms: number) => {
  return `${(ms / 1000).toFixed(0)}kms`
}
