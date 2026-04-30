// Distance calculation (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Vehicle configs (OBJECT ✅)
export const VEHICLE_CONFIGS = {
  pickup: {
    displayName: "Pickup",
    baseFare: 100,
    perKm: 15,
    emoji: "🚛",
    capacityKg: 750
  },
  mini_truck: {
    displayName: "Mini Truck",
    baseFare: 200,
    perKm: 20,
    emoji: "🚚",
    capacityKg: 1500
  }
}

// Price calculation
export function calculatePrice(distance: number, vehicleType: keyof typeof VEHICLE_CONFIGS) {
  const config = VEHICLE_CONFIGS[vehicleType]

  const total = config.baseFare + (distance * config.perKm)

  return {
    distanceKm: distance,
    totalPrice: Math.round(total)
  }
}

// Optional (for UI)
export const GUWAHATI_LOCATIONS = [
  "Beltola",
  "Dispur",
  "Paltan Bazaar",
  "Ganeshguri"
]

export const ASSAM_CITIES = [
  "Guwahati",
  "Dibrugarh",
  "Silchar",
  "Jorhat"
]