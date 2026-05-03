'use client'
import { useState, useEffect } from 'react'
import { Truck, Check, X, Phone, Clock, Star, Loader2, Package } from 'lucide-react'
import { getCurrentProfile } from '@/services/auth'
import BottomNav from '@/components/dashboard/BottomNav'
import StatusBadge from '@/components/ui/StatusBadge'

const MOCK_PENDING = [
  { id: 'BK-003', pickup_address: 'Ganeshguri, Guwahati', drop_address: 'Beltola Market, Guwahati', distance_km: 5.4, estimated_price: 181, vehicle_type: 'tata_ace', status: 'requested', requested_at: new Date(Date.now() - 3*60*1000).toISOString(), goods_description: 'Grocery items', weight_kg: 200, customer: { full_name: 'Priya Sharma', phone: '+91 94350 12345' } },
  { id: 'BK-004', pickup_address: 'Paltan Bazaar, Guwahati', drop_address: 'Narengi, Guwahati', distance_km: 12.1, estimated_price: 332, vehicle_type: 'bolero_pickup', status: 'requested', requested_at: new Date(Date.now() - 1*60*1000).toISOString(), goods_description: 'Office furniture', weight_kg: 500, customer: { full_name: 'Rahul Borah', phone: '+91 98765 00001' } },
]
const MOCK_ACTIVE = { id: 'BK-002', pickup_address: 'Fancy Bazaar, Guwahati', drop_address: 'Dispur Secretariat', distance_km: 8.2, estimated_price: 243, vehicle_type: 'bolero_pickup', status: 'in_progress', requested_at: new Date(Date.now() - 30*60*1000).toISOString(), goods_description: 'Electronics', customer: { full_name: 'Atul Das', phone: '+91 87654 32109' } }

export default function DriverDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [pendingBookings, setPendingBookings] = useState(MOCK_PENDING as any[])
  const [activeJob, setActiveJob] = useState<any>(MOCK_ACTIVE)
  const [completedToday, setCompletedToday] = useState(3)
  const [earningsToday, setEarningsToday] = useState(1250)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => { getCurrentProfile().then(p => setProfile(p)) }, [])

  const handleAccept = async (bookingId: string) => {
    setLoading(bookingId)
    const accepted = pendingBookings.find(b => b.id === bookingId)
    if (accepted) { setActiveJob({ ...accepted, status: 'accepted' }); setPendingBookings(prev => prev.filter(b => b.id !== bookingId)) }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24 max-w-lg mx-auto">
      <div className="bg-dark-800 border-b border-white/5 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div><p className="text-white/40 text-sm">Driver Dashboard</p><h1 className="font-display font-bold text-xl">{profile?.full_name || 'Driver'}</h1></div>
          <button onClick={() => setIsOnline(!isOnline)} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${isOnline ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-dark-700 border-white/10 text-white/50'}`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />{isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-lg text-brand-400">₹{earningsToday}</div><div className="text-white/40 text-xs">Today's Earnings</div></div>
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-lg text-white">{completedToday}</div><div className="text-white/40 text-xs">Trips Done</div></div>
          <div className="bg-dark-700 rounded-xl p-3 text-center"><div className="font-display font-bold text-lg flex items-center justify-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /><span>4.8</span></div><div className="text-white/40 text-xs">Rating</div></div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {activeJob && (
          <div>
            <h2 className="section-title mb-3 flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />Active Job</h2>
            <div className="card border-emerald-500/20">
              <div className="flex items-center justify-between mb-3"><StatusBadge status={activeJob.status} /><span className="text-brand-400 font-bold">₹{activeJob.estimated_price}</span></div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-500 rounded-full" /><span className="text-sm text-white/70">{activeJob.pickup_address}</span></div>
                <div className="w-px h-3 bg-white/20 ml-1.5" />
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /><span className="text-sm text-white/70">{activeJob.drop_address}</span></div>
              </div>
              {activeJob.goods_description && <div className="bg-dark-700 rounded-xl px-3 py-2 mb-3 flex items-center gap-2"><Package size={14} className="text-white/40" /><span className="text-sm text-white/60">{activeJob.goods_description}</span></div>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center font-bold text-sm">{activeJob.customer.full_name[0]}</div><span className="text-sm">{activeJob.customer.full_name}</span></div>
                <div className="flex gap-2">
                  <a href={`tel:${activeJob.customer.phone}`} className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center"><Phone size={16} className="text-emerald-400" /></a>
                  {activeJob.status === 'accepted' && <button onClick={() => setActiveJob({ ...activeJob, status: 'in_progress' })} className="px-3 py-1.5 bg-brand-500 rounded-full text-xs font-medium">Start Trip</button>}
                  {activeJob.status === 'in_progress' && <button onClick={() => { setEarningsToday(p => p + activeJob.estimated_price); setCompletedToday(p => p + 1); setActiveJob(null) }} className="px-3 py-1.5 bg-emerald-500 rounded-full text-xs font-medium">Complete</button>}
                </div>
              </div>
            </div>
          </div>
        )}

        {isOnline && (
          <div>
            <h2 className="section-title mb-3">New Requests ({pendingBookings.length})</h2>
            {pendingBookings.length === 0 ? (
              <div className="card text-center py-8"><div className="text-3xl mb-2">🔍</div><p className="text-white/40 text-sm">Waiting for nearby bookings...</p><div className="mt-3 flex justify-center gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div></div>
            ) : (
              <div className="space-y-3">
                {pendingBookings.map(booking => {
                  const minutesAgo = Math.floor((Date.now() - new Date(booking.requested_at).getTime()) / 60000)
                  return (
                    <div key={booking.id} className="card border-brand-500/20">
                      <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-1.5"><Clock size={13} className="text-amber-400" /><span className="text-amber-400 text-xs">{minutesAgo}m ago</span></div><span className="font-display font-bold text-brand-400">₹{booking.estimated_price}</span></div>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-sm"><div className="w-2.5 h-2.5 bg-brand-500 rounded-full shrink-0" /><span className="text-white/70 truncate">{booking.pickup_address}</span></div>
                        <div className="flex items-center gap-2 text-sm"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" /><span className="text-white/70 truncate">{booking.drop_address}</span></div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40 mb-3"><span>{booking.distance_km} km</span>{booking.goods_description && <span>• {booking.goods_description}</span>}{booking.weight_kg && <span>• {booking.weight_kg}kg</span>}</div>
                      <div className="flex gap-2">
                        <button onClick={() => setPendingBookings(prev => prev.filter(b => b.id !== booking.id))} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium"><X size={16} />Reject</button>
                        <button onClick={() => handleAccept(booking.id)} disabled={loading === booking.id} className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 rounded-xl text-white text-sm font-semibold">{loading === booking.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}Accept Job</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {!isOnline && <div className="card text-center py-10"><div className="text-4xl mb-3">💤</div><p className="font-medium mb-1">You're Offline</p><p className="text-white/40 text-sm">Go online to receive booking requests</p><button onClick={() => setIsOnline(true)} className="btn-primary mt-4 text-sm">Go Online</button></div>}

        <div>
          <h2 className="section-title mb-3">This Week</h2>
          <div className="card">
            <div className="flex items-center justify-between mb-4"><div><p className="text-white/40 text-xs">Total Earnings</p><p className="font-display font-bold text-2xl text-brand-400">₹8,450</p></div><div className="text-right"><p className="text-white/40 text-xs">Trips</p><p className="font-display font-bold text-2xl">24</p></div></div>
            <div className="flex items-end gap-1 h-16">{[65,80,45,90,70,85,60].map((h, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full bg-brand-500/30 rounded-sm" style={{ height: `${h}%` }} /><span className="text-white/20 text-xs">{['M','T','W','T','F','S','S'][i]}</span></div>)}</div>
          </div>
        </div>
      </div>
      <BottomNav role="driver" />
    </div>
  )
}
