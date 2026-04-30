import { createClient } from '@/lib/supabase/client'

export async function createBooking(data: any) {
  const supabase = createClient()
  return supabase.from('bookings').insert([data])
}

export async function getCustomerBookings(userId: string) {
  const supabase = createClient()
  return supabase.from('bookings').select('*').eq('customer_id', userId)
}