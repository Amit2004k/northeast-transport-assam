'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Booking = Database['public']['Tables']['bookings']['Row']

export function useBookings(userId: string | null, role: 'customer' | 'driver' = 'customer') {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBookings = useCallback(async () => {
    if (!userId) return

    const field = role === 'customer' ? 'customer_id' : 'driver_id'

    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq(field, userId)
      .order('created_at', { ascending: false })

    if (data) setBookings(data)
    setLoading(false)
  }, [userId, role, supabase])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return

    const field = role === 'customer' ? 'customer_id' : 'driver_id'

    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `${field}=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev =>
              prev.map(b => b.id === payload.new.id ? payload.new as Booking : b)
            )
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role, supabase])

  const activeBookings = bookings.filter(b =>
    ['requested', 'accepted', 'in_progress'].includes(b.status)
  )

  const completedBookings = bookings.filter(b =>
    ['completed', 'cancelled'].includes(b.status)
  )

  return {
    bookings,
    activeBookings,
    completedBookings,
    loading,
    refetch: fetchBookings,
  }
}

export function usePendingBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:profiles!bookings_customer_id_fkey (id, full_name, phone)
        `)
        .eq('status', 'requested')
        .order('requested_at', { ascending: true })

      if (data) setBookings(data)
      setLoading(false)
    }

    fetchPending()

    // Real-time: new booking requests
    const channel = supabase
      .channel('pending-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings', filter: 'status=eq.requested' },
        () => fetchPending()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  return { bookings, loading }
}
