import { NextRequest, NextResponse } from 'next/server'
import { calculateDistance, calculatePrice, VEHICLE_CONFIGS } from '@/services/pricing'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { pickupLat, pickupLng, dropLat, dropLng, vehicleType } = body
  if (!pickupLat || !pickupLng || !dropLat || !dropLng || !vehicleType) return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  if (!Object.keys(VEHICLE_CONFIGS).includes(vehicleType)) return NextResponse.json({ error: 'Invalid vehicle type' }, { status: 400 })
  const distanceKm = calculateDistance(pickupLat, pickupLng, dropLat, dropLng)
  const estimate = calculatePrice(distanceKm, vehicleType as keyof typeof VEHICLE_CONFIGS)
  return NextResponse.json({ data: { ...estimate, vehicleType, vehicleName: VEHICLE_CONFIGS[vehicleType as keyof typeof VEHICLE_CONFIGS].displayName } })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pickupLat = parseFloat(searchParams.get('pickupLat') || '0')
  const pickupLng = parseFloat(searchParams.get('pickupLng') || '0')
  const dropLat = parseFloat(searchParams.get('dropLat') || '0')
  const dropLng = parseFloat(searchParams.get('dropLng') || '0')
  if (!pickupLat || !dropLat) return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 })
  const distanceKm = calculateDistance(pickupLat, pickupLng, dropLat, dropLng)
  const estimates = Object.entries(VEHICLE_CONFIGS).map(([key, config]) => ({ vehicleType: key, vehicleName: config.displayName, emoji: config.emoji, capacityKg: config.capacityKg, ...calculatePrice(distanceKm, key as keyof typeof VEHICLE_CONFIGS) }))
  return NextResponse.json({ data: { distanceKm, estimates } })
}
