'use client'
import { useState } from 'react'
import { Users, Truck, Package, IndianRupee, TrendingUp, AlertCircle, Shield, Ban, Check } from 'lucide-react'
import BottomNav from '@/components/dashboard/BottomNav'
import StatusBadge from '@/components/ui/StatusBadge'

const STATS = [
  { label: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+12%' },
  { label: 'Active Drivers', value: '89', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', change: '+5%' },
  { label: 'Total Bookings', value: '4,832', icon: Package, color: 'text-brand-400', bg: 'bg-brand-500/10', change: '+24%' },
  { label: 'Revenue (MTD)', value: '₹3.2L', icon: IndianRupee, color: 'text-amber-400', bg: 'bg-amber-500/10', change: '+18%' },
]
const RECENT_BOOKINGS = [
  { id: 'BK-891', customer: 'Rajan Borah', from: 'Guwahati', to: 'Jorhat', amount: 5766, status: 'completed', time: '2h ago' },
  { id: 'BK-890', customer: 'Priya Das', from: 'Dibrugarh', to: 'Tinsukia', amount: 890, status: 'in_progress', time: '45m ago' },
  { id: 'BK-889', customer: 'Atul Gogoi', from: 'Silchar', to: 'Karimganj', amount: 450, status: 'accepted', time: '1h ago' },
  { id: 'BK-888', customer: 'Meena Barman', from: 'Nagaon', to: 'Guwahati', amount: 2100, status: 'cancelled', time: '3h ago' },
]
const PENDING_DRIVERS = [
  { id: 'DRV-041', name: 'Bimal Nath', vehicle: 'Tata Yodha', city: 'Guwahati', docs: 3, submitted: '2h ago' },
  { id: 'DRV-042', name: 'Sanjay Kalita', vehicle: 'Bolero Pickup', city: 'Jorhat', docs: 2, submitted: '5h ago' },
]
const MONTHLY_REVENUE = [45, 62, 58, 71, 80, 95, 88, 102, 98, 115, 108, 125]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'drivers'>('overview')
  return (
    <div className="min-h-screen bg-dark-900 pb-24 max-w-lg mx-auto">
      <div className="bg-dark-800 border-b border-white/5 px-4 pt-12 pb-5">
        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center"><Shield size={16} className="text-brand-400" /></div><div><h1 className="font-display font-bold text-lg">Admin Panel</h1><p className="text-white/40 text-xs">NE Transport • Guwahati HQ</p></div></div>
      </div>
      <div className="px-4 pt-4">
        <div className="flex gap-1 bg-dark-800 rounded-xl p-1">
          {(['overview', 'bookings', 'drivers'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-dark-600 text-white' : 'text-white/40'}`}>{tab}</button>)}
        </div>
      </div>
      <div className="px-4 mt-4 space-y-4">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(stat => <div key={stat.label} className="card"><div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-2`}><stat.icon size={18} className={stat.color} /></div><div className="font-display font-bold text-xl">{stat.value}</div><div className="text-white/40 text-xs">{stat.label}</div><div className="text-emerald-400 text-xs mt-1">{stat.change} this month</div></div>)}
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-4"><div><p className="text-white/40 text-xs mb-0.5">Monthly Revenue</p><p className="font-display font-bold text-xl text-brand-400">₹3,24,500</p></div><div className="badge badge-success"><TrendingUp size={11} />+18%</div></div>
              <div className="flex items-end gap-1 h-20">{MONTHLY_REVENUE.map((h, i) => <div key={i} className="flex-1"><div className={`w-full rounded-sm ${i === MONTHLY_REVENUE.length-1 ? 'bg-brand-500' : 'bg-brand-500/30'}`} style={{ height: `${(h/Math.max(...MONTHLY_REVENUE))*100}%` }} /></div>)}</div>
            </div>
            <div className="card"><h3 className="text-sm font-semibold mb-3 text-white/60">Top Cities</h3><div className="space-y-2">{[{city:'Guwahati',bookings:1842,pct:38},{city:'Dibrugarh',bookings:724,pct:15},{city:'Silchar',bookings:612,pct:13},{city:'Jorhat',bookings:493,pct:10}].map(item => <div key={item.city}><div className="flex justify-between text-sm mb-1"><span className="text-white/70">{item.city}</span><span className="text-white/40">{item.bookings} trips</span></div><div className="h-1.5 bg-dark-700 rounded-full overflow-hidden"><div className="h-full bg-brand-500 rounded-full" style={{ width: `${item.pct}%` }} /></div></div>)}</div></div>
          </>
        )}
        {activeTab === 'bookings' && (
          <>
            <div className="flex gap-2">{[{label:'Today',value:47,color:'text-white'},{label:'Active',value:12,color:'text-emerald-400'},{label:'Cancelled',value:3,color:'text-red-400'}].map(s => <div key={s.label} className="flex-1 card text-center py-3"><div className={`font-bold text-lg ${s.color}`}>{s.value}</div><div className="text-white/40 text-xs">{s.label}</div></div>)}</div>
            <div className="space-y-2">{RECENT_BOOKINGS.map(booking => <div key={booking.id} className="card flex items-center justify-between"><div><div className="flex items-center gap-2 mb-1"><span className="text-white/40 text-xs font-mono">{booking.id}</span><span className="text-white/40 text-xs">{booking.time}</span></div><div className="font-medium text-sm">{booking.customer}</div><div className="text-white/40 text-xs">{booking.from} → {booking.to}</div></div><div className="text-right"><div className="font-semibold text-brand-400 text-sm mb-1">₹{booking.amount}</div><StatusBadge status={booking.status} /></div></div>)}</div>
          </>
        )}
        {activeTab === 'drivers' && (
          <>
            <div className="card border-amber-500/20">
              <div className="flex items-center gap-2 mb-3"><AlertCircle size={16} className="text-amber-400" /><span className="text-amber-400 font-medium text-sm">Pending Approvals</span></div>
              <div className="space-y-3">{PENDING_DRIVERS.map(driver => <div key={driver.id} className="bg-dark-700 rounded-xl p-3"><div className="flex items-start justify-between"><div><div className="font-medium text-sm">{driver.name}</div><div className="text-white/40 text-xs">{driver.vehicle} • {driver.city}</div><div className="text-white/30 text-xs">{driver.docs} docs • {driver.submitted}</div></div><div className="flex gap-1.5"><button className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center justify-center"><Check size={14} className="text-emerald-400" /></button><button className="w-8 h-8 bg-red-500/20 border border-red-500/20 rounded-lg flex items-center justify-center"><Ban size={14} className="text-red-400" /></button></div></div></div>)}</div>
            </div>
            <div className="card"><h3 className="text-sm font-semibold text-white/60 mb-3">Top Drivers</h3><div className="space-y-3">{[{name:'Bikash Sharma',trips:142,rating:4.9,earnings:'₹28,400'},{name:'Ranjit Das',trips:118,rating:4.8,earnings:'₹23,100'},{name:'Hemanta Bora',trips:97,rating:4.7,earnings:'₹19,800'}].map((driver, i) => <div key={driver.name} className="flex items-center gap-3"><div className="w-7 h-7 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-xs">{i+1}</div><div className="flex-1"><div className="font-medium text-sm">{driver.name}</div><div className="text-white/40 text-xs">{driver.trips} trips • ⭐{driver.rating}</div></div><div className="text-brand-400 font-semibold text-sm">{driver.earnings}</div></div>)}</div></div>
          </>
        )}
      </div>
      <BottomNav role="admin" />
    </div>
  )
}
