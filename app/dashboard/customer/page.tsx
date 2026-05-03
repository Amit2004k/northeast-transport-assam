'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Phone, Star, MapPin, Truck } from 'lucide-react'
import { getCustomerBookings } from '@/services/bookings'
import { getCurrentProfile } from '@/services/auth'
import BottomNav from '@/components/dashboard/BottomNav'
import StatusBadge from '@/components/ui/StatusBadge'

const MOCK_BOOKINGS = [
  { id: 'BK-001', pickup_address: 'Paltan Bazaar, Guwahati', drop_address: 'Jorhat City Center', distance_km: 312, estimated_price: 5766, vehicle_type: 'tata_yodha', status: 'completed', requested_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(), vehicles: { display_name: 'Tata Yodha', registration_number: 'AS01AB1234' }, driver: { full_name: 'Bikash Sharma', phone: '+91 98765 43210' }, rating: 5 },
  { id: 'BK-002', pickup_address: 'Fancy Bazaar, Guwahati', drop_address: 'Dispur Secretariat', distance_km: 8.2, estimated_price: 243, vehicle_type: 'bolero_pickup', status: 'in_progress', requested_at: new Date(Date.now() - 30*60*1000).toISOString(), vehicles: { display_name: 'Bolero Pickup', registration_number: 'AS01CD5678' }, driver: { full_name: 'Ranjit Das', phone: '+91 87654 32109' }, rating: null },
  { id: 'BK-003', pickup_address: 'Ganeshguri, Guwahati', drop_address: 'Beltola Market', distance_km: 5.4, estimated_price: 181, vehicle_type: 'tata_ace', status: 'requested', requested_at: new Date(Date.now() - 5*60*1000).toISOString(), vehicles: null, driver: null, rating: null },
]

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS as any[])
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  useEffect(() => {
    getCurrentProfile().then(p => { setProfile(p); if (p) getCustomerBookings(p.id).then(data => { if (data?.length) setBookings(data) }).catch(() => {}) })
  }, [])

  const activeBookings = bookings.filter(b => ['requested','accepted','in_progress'].includes(b.status))
  const historyBookings = bookings.filter(b => ['completed','cancelled'].includes(b.status))
  const totalSpent = historyBookings.reduce((sum, b) => sum + (b.final_price || b.estimated_price), 0)

  return (
    <div className="min-h-screen bg-dark-900 pb-24 max-w-lg mx-auto">
      <div className="bg-dark-800 border-b border-white/5 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="text-white/40 text-sm">Welcome back</p><h1 className="font-display font-bold text-xl">{profile?.full_name || 'Customer'}</h1></div>
          <Link href="/booking" className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm"><Plus size={16} />Book Now</Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-lg text-brand-400">{bookings.length}</div><div className="text-white/40 text-xs">Trips</div></div>
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-lg text-emerald-400">{activeBookings.length}</div><div className="text-white/40 text-xs">Active</div></div>
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-base text-white">₹{(totalSpent/1000).toFixed(1)}k</div><div className="text-white/40 text-xs">Total Spent</div></div>
        </div>
      </div>

      {activeBookings.length > 0 && activeBookings[0].status === 'in_progress' && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-brand-500/20 to-brand-700/10 border border-brand-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" /><span className="text-brand-400 font-medium text-sm">Booking in progress</span></div>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-brand-400" /><span className="text-white/70 truncate">{activeBookings[0].pickup_address}</span></div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400" /><span className="text-white/70 truncate">{activeBookings[0].drop_address}</span></div>
          </div>
          {activeBookings[0].driver && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center text-sm font-bold">{activeBookings[0].driver.full_name[0]}</div><span className="text-sm">{activeBookings[0].driver.full_name}</span></div>
              <a href={`tel:${activeBookings[0].driver.phone}`} className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs border border-emerald-500/20"><Phone size={12} />Call Driver</a>
            </div>
          )}
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1">
          <button onClick={() => setActiveTab('active')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-dark-600 text-white' : 'text-white/40'}`}>Active ({activeBookings.length})</button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-dark-600 text-white' : 'text-white/40'}`}>History ({historyBookings.length})</button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {(activeTab === 'active' ? activeBookings : historyBookings).map(booking => (
          <div key={booking.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{{ tata_yodha: '🚛', bolero_pickup: '🚚', mini_truck: '🚛', mahindra_pickup: '🚐', tata_ace: '🚐' }[booking.vehicle_type as string] || '🚚'}</span>
                <div><p className="font-medium text-sm">{booking.vehicles?.display_name || booking.vehicle_type}</p><p className="text-white/30 text-xs">{new Date(booking.requested_at).toLocaleDateString('en-IN')}</p></div>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-xs text-white/60"><div className="w-2 h-2 bg-brand-500 rounded-full" /><span className="truncate">{booking.pickup_address}</span></div>
              <div className="flex items-center gap-2 text-xs text-white/60"><div className="w-2 h-2 bg-emerald-500 rounded-full" /><span className="truncate">{booking.drop_address}</span></div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <div className="flex items-center gap-3"><span className="text-xs text-white/40">{booking.distance_km} km</span><span className="font-semibold text-brand-400 text-sm">₹{booking.final_price || booking.estimated_price}</span></div>
              {booking.driver && <span className="text-xs text-white/50">{booking.driver.full_name}</span>}
            </div>
            {booking.rating && <div className="flex items-center gap-1 mt-2">{Array(booking.rating).fill(0).map((_: any, i: number) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}</div>}
          </div>
        ))}
        {activeTab === 'active' && activeBookings.length === 0 && (
          <div className="text-center py-12"><div className="text-4xl mb-3">📦</div><p className="text-white/40 text-sm">No active bookings</p><Link href="/booking" className="btn-primary inline-flex mt-4 text-sm">Book a Vehicle</Link></div>
        )}
      </div>
      <BottomNav role="customer" />
    </div>
  )
}
