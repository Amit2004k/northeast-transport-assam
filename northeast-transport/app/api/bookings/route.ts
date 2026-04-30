import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { calculateDistance, calculatePrice } from '@/services/pricing'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = searchParams.get('status')
  const role = searchParams.get('role')

  let query = supabase.from('bookings').select(`
    *,
    vehicles (id, display_name, type, registration_number),
    customer:profiles!bookings_customer_id_fkey (id, full_name, phone),
    driver:profiles!bookings_driver_id_fkey (id, full_name, phone)
  `)

  if (role === 'customer') {
    query = query.eq('customer_id', user.id)
  } else if (role === 'driver') {
    query = query.eq('driver_id', user.id)
  }

  if (status) {
    query = query.eq('status', status)
  }

  query = query.order('created_at', { ascending: false }).limit(50)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    pickupAddress, pickupLat, pickupLng,
    dropAddress, dropLat, dropLng,
    vehicleType, goodsDescription, weightKg
  } = body

  // Validate required fields
  if (!pickupAddress || !dropAddress || !vehicleType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const distanceKm = calculateDistance(pickupLat, pickupLng, dropLat, dropLng)
  const priceEstimate = calculatePrice(distanceKm, vehicleType)

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      customer_id: user.id,
      pickup_address: pickupAddress,
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      drop_address: dropAddress,
      drop_lat: dropLat,
      drop_lng: dropLng,
      distance_km: distanceKm,
      estimated_price: priceEstimate.totalFare,
      vehicle_type: vehicleType,
      goods_description: goodsDescription || null,
      weight_kg: weightKg || null,
      status: 'requested',
      requested_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
