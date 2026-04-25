// Distance calculation utilities using Haversine formula for Google Maps distance calculation

interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(point2.latitude - point1.latitude)
  const dLon = toRad(point2.longitude - point1.longitude)
  const lat1 = toRad(point1.latitude)
  const lat2 = toRad(point2.latitude)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Sort volunteers by distance from a given location
 */
export function sortByDistance(
  volunteers: (Coordinates & { id: string; name: string })[],
  fromLocation: Coordinates
): (Coordinates & { id: string; name: string; distance: number })[] {
  return volunteers
    .map((volunteer) => ({
      ...volunteer,
      distance: calculateDistance(fromLocation, volunteer),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Get nearest volunteers within a certain radius
 */
export function getNearestVolunteers(
  volunteers: (Coordinates & { id: string; name: string })[],
  fromLocation: Coordinates,
  maxDistanceKm: number = 10,
  limit: number = 5
): (Coordinates & { id: string; name: string; distance: number })[] {
  return sortByDistance(volunteers, fromLocation)
    .filter((v) => v.distance <= maxDistanceKm)
    .slice(0, limit)
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  // Apply Dhaka road distance factor (1.4x straight-line)
  const roadDistance = distanceKm * 1.4
  if (roadDistance < 1) {
    return `${Math.round(roadDistance * 1000)}m`
  }
  return `${roadDistance.toFixed(1)}km`
}

/**
 * Estimate delivery time based on distance
 * Assume average speed of 20 km/h in city traffic
 */


export function estimateDeliveryTime(distanceKm: number): string {
  // Dhaka road distance is typically 1.4x straight-line distance
  // Average speed in Dhaka traffic: 12 km/h
  const roadDistance = distanceKm * 1.4
  const hours = roadDistance / 12
  const minutes = Math.round(hours * 60)
  
  if (minutes < 60) {
    return `${minutes} min`
  }
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}