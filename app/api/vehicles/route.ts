import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { VehicleStatus, VehicleType } from '@/lib/supabase/database.types'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') || 'available') as VehicleStatus
  const type = searchParams.get('type') as VehicleType | null
  const city = searchParams.get('city') || 'Guwahati'
  let query = supabase.from('vehicles').select('*, owner:profiles!vehicles_owner_id_fkey(id, full_name, phone)').eq('status', status)
  if (type) query = query.eq('type', type)
  if (city) query = query.eq('city', city)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { data, error } = await supabase.from('vehicles').insert({ ...body, owner_id: user.id }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
