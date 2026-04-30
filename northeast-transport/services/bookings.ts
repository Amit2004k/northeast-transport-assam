import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import { calculatePrice, calculateDistance } from './pricing'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingRow = Database['public']['Tables']['bookings']['Row']

export interface CreateBookingParams {
  customerId: string
  pickupAddress: string
  pickupLat: number
  pickupLng: number
  dropAddress: string
  dropLat: number
  dropLng: number
  vehicleType: string
  goodsDescription?: string
  weightKg?: number
}

export async function createBooking(params: CreateBookingParams) {
  const supabase = createClient()

  const distanceKm = calculateDistance(
    params.pickupLat, params.pickupLng,
    params.dropLat, params.dropLng
  )

  const vehicleTypeKey = params.vehicleType as any
  const priceEstimate = calculatePrice(distanceKm, vehicleTypeKey)

  const booking: BookingInsert = {
    customer_id: params.customerId,
    pickup_address: params.pickupAddress,
    pickup_lat: params.pickupLat,
    pickup_lng: params.pickupLng,
    drop_address: params.dropAddress,
    drop_lat: params.dropLat,
    drop_lng: params.dropLng,
    distance_km: distanceKm,
    estimated_price: priceEstimate.totalFare,
    vehicle_type: params.vehicleType,
    goods_description: params.goodsDescription || null,
    weight_kg: params.weightKg || null,
    status: 'requested',
    requested_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCustomerBookings(customerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      vehicles (
        id, display_name, type, registration_number
      ),
      driver:profiles!bookings_driver_id_fkey (
        id, full_name, phone
      )
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getDriverBookings(driverId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!bookings_customer_id_fkey (
        id, full_name, phone
      )
    `)
    .eq('driver_id', driverId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getPendingBookings() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:profiles!bookings_customer_id_fkey (
        id, full_name, phone
      )
    `)
    .eq('status', 'requested')
    .order('requested_at', { ascending: true })

  if (error) throw error
  return data
}

export async function acceptBooking(bookingId: string, driverId: string, vehicleId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'accepted',
      driver_id: driverId,
      vehicle_id: vehicleId,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('status', 'requested')
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'in_progress' | 'completed' | 'cancelled',
  extra?: { cancellationReason?: string; finalPrice?: number }
) {
  const supabase = createClient()

  const updates: Partial<BookingRow> = { status }

  if (status === 'in_progress') {
    updates.started_at = new Date().toISOString()
  } else if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
    if (extra?.finalPrice) updates.final_price = extra.finalPrice
  } else if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString()
    if (extra?.cancellationReason) updates.cancellation_reason = extra.cancellationReason
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAvailableVehicles(vehicleType?: string) {
  const supabase = createClient()

  let query = supabase
    .from('vehicles')
    .select(`
      *,
      owner:profiles!vehicles_owner_id_fkey (
        id, full_name, phone
      )
    `)
    .eq('status', 'available')

  if (vehicleType) {
    query = query.eq('type', vehicleType)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}
