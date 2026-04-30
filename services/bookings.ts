import { createClient } from '@/lib/supabase/client'

export async function getPendingBookings() {
  const supabase = createClient()

  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'requested')

  return data || []
}

export async function acceptBooking(id: string) {
  const supabase = createClient()

  return supabase
    .from('bookings')
    .update({ status: 'accepted' })
    .eq('id', id)
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = createClient()

  return supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
}