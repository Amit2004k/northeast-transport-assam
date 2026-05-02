import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/database.types'

type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { status, cancellationReason, finalPrice, driverId, vehicleId } = body
  const updates: BookingUpdate = { status }
  if (status === 'accepted') { updates.driver_id = driverId; updates.vehicle_id = vehicleId; updates.accepted_at = new Date().toISOString() }
  else if (status === 'in_progress') updates.started_at = new Date().toISOString()
  else if (status === 'completed') { updates.completed_at = new Date().toISOString(); if (finalPrice) updates.final_price = finalPrice }
  else if (status === 'cancelled') { updates.cancelled_at = new Date().toISOString(); if (cancellationReason) updates.cancellation_reason = cancellationReason }
  const { data, error } = await supabase.from('bookings').update(updates).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase.from('bookings')
    .select('*, vehicles(id, display_name, type, registration_number, current_lat, current_lng), customer:profiles!bookings_customer_id_fkey(id, full_name, phone), driver:profiles!bookings_driver_id_fkey(id, full_name, phone)')
    .eq('id', params.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ data })
}
