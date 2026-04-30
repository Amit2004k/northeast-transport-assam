export interface PricingConfig {
  baseFare: number
  pricePerKm: number
  vehicleType: string
}

export interface PriceEstimate {
  baseFare: number
  distanceFare: number
  totalFare: number
  distanceKm: number
}

// Vehicle configs with pricing
export const VEHICLE_CONFIGS = {
  tata_yodha: {
    displayName: 'Tata Yodha',
    baseFare: 150,
    pricePerKm: 18,
    capacityKg: 1500,
    description: 'Best for medium loads, inter-city transport',
    emoji: '🚛',
  },
  bolero_pickup: {
    displayName: 'Bolero Pickup',
    baseFare: 120,
    pricePerKm: 15,
    capacityKg: 1000,
    description: 'Popular choice for city deliveries',
    emoji: '🚚',
  },
  mini_truck: {
    displayName: 'Mini Truck',
    baseFare: 200,
    pricePerKm: 22,
    capacityKg: 2500,
    description: 'Large loads and heavy goods',
    emoji: '🚛',
  },
  mahindra_pickup: {
    displayName: 'Mahindra Pickup',
    baseFare: 100,
    pricePerKm: 14,
    capacityKg: 800,
    description: 'Light loads, quick city runs',
    emoji: '🚐',
  },
  tata_ace: {
    displayName: 'Tata Ace',
    baseFare: 80,
    pricePerKm: 12,
    capacityKg: 750,
    description: 'Small loads, local deliveries',
    emoji: '🚐',
  },
} as const

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function calculatePrice(
  distanceKm: number,
  vehicleType: keyof typeof VEHICLE_CONFIGS
): PriceEstimate {
  const config = VEHICLE_CONFIGS[vehicleType]
  const baseFare = config.baseFare
  const distanceFare = distanceKm * config.pricePerKm
  const totalFare = baseFare + distanceFare

  return {
    baseFare,
    distanceFare: Math.round(distanceFare),
    totalFare: Math.round(totalFare),
    distanceKm: Math.round(distanceKm * 10) / 10,
  }
}

// Assam cities with coordinates
export const ASSAM_CITIES = [
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
  { name: 'Dibrugarh', lat: 27.4728, lng: 94.9120 },
  { name: 'Silchar', lat: 24.8333, lng: 92.7789 },
  { name: 'Jorhat', lat: 26.7509, lng: 94.2037 },
  { name: 'Nagaon', lat: 26.3503, lng: 92.6837 },
  { name: 'Tinsukia', lat: 27.4924, lng: 95.3635 },
  { name: 'Tezpur', lat: 26.6338, lng: 92.8004 },
  { name: 'Bongaigaon', lat: 26.4768, lng: 90.5584 },
  { name: 'Dhubri', lat: 26.0171, lng: 89.9762 },
  { name: 'North Lakhimpur', lat: 27.2356, lng: 94.1041 },
  { name: 'Goalpara', lat: 26.1741, lng: 90.6240 },
  { name: 'Karimganj', lat: 24.8648, lng: 92.3533 },
  { name: 'Sivasagar', lat: 26.9834, lng: 94.6396 },
  { name: 'Diphu', lat: 25.8443, lng: 93.4350 },
  { name: 'Golaghat', lat: 26.5239, lng: 93.9709 },
]

// Popular locations in Guwahati
export const GUWAHATI_LOCATIONS = [
  { name: 'Paltan Bazaar', lat: 26.1832, lng: 91.7516 },
  { name: 'Fancy Bazaar', lat: 26.1874, lng: 91.7434 },
  { name: 'Dispur', lat: 26.1291, lng: 91.7932 },
  { name: 'Ganeshguri', lat: 26.1440, lng: 91.7779 },
  { name: 'Zoo Road', lat: 26.1583, lng: 91.7564 },
  { name: 'Maligaon', lat: 26.1737, lng: 91.7110 },
  { name: 'Narengi', lat: 26.1904, lng: 91.8034 },
  { name: 'Sixmile', lat: 26.1359, lng: 91.8183 },
  { name: 'Beltola', lat: 26.1204, lng: 91.7981 },
  { name: 'LGBI Airport', lat: 26.1061, lng: 91.5860 },
  { name: 'Sarusajai', lat: 26.1742, lng: 91.6937 },
  { name: 'Khanapara', lat: 26.0964, lng: 91.8126 },
]
