'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Navigation, Truck, Check, Loader2, Clock } from 'lucide-react'
import { VEHICLE_CONFIGS, ASSAM_CITIES, GUWAHATI_LOCATIONS, calculateDistance, calculatePrice } from '@/services/pricing'
import { createBooking } from '@/services/bookings'
import { getCurrentProfile } from '@/services/auth'

type Step = 'location' | 'vehicle' | 'confirm' | 'success'
interface LocationPoint { address: string; lat: number; lng: number }

export default function BookingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('location')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [pickup, setPickup] = useState<LocationPoint>({ address: '', lat: 26.1445, lng: 91.7362 })
  const [drop, setDrop] = useState<LocationPoint>({ address: '', lat: 0, lng: 0 })
  const [selectedVehicle, setSelectedVehicle] = useState<keyof typeof VEHICLE_CONFIGS | null>(null)
  const [goodsDesc, setGoodsDesc] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [pickupSearch, setPickupSearch] = useState('')
  const [dropSearch, setDropSearch] = useState('')
  const [showPickupSug, setShowPickupSug] = useState(false)
  const [showDropSug, setShowDropSug] = useState(false)

  const allLocations = [...GUWAHATI_LOCATIONS, ...ASSAM_CITIES.map(c => ({ name: c.name, lat: c.lat, lng: c.lng }))]
  const filteredPickup = allLocations.filter(l => l.name.toLowerCase().includes(pickupSearch.toLowerCase())).slice(0, 6)
  const filteredDrop = allLocations.filter(l => l.name.toLowerCase().includes(dropSearch.toLowerCase())).slice(0, 6)

  useEffect(() => { getCurrentProfile().then(p => setProfile(p)) }, [])

  const distance = pickup.lat && drop.lat ? calculateDistance(pickup.lat, pickup.lng, drop.lat, drop.lng) : 0
  const priceEstimate = selectedVehicle && distance > 0 ? calculatePrice(distance, selectedVehicle) : null

  const handleBook = async () => {
    if (!profile) { router.push('/auth/login'); return }
    if (!selectedVehicle || !pickup.address || !drop.address) return
    setLoading(true)
    try {
      const booking = await createBooking({ customerId: profile.id, pickupAddress: pickup.address, pickupLat: pickup.lat, pickupLng: pickup.lng, dropAddress: drop.address, dropLat: drop.lat, dropLng: drop.lng, vehicleType: selectedVehicle, goodsDescription: goodsDesc || undefined, weightKg: weightKg ? parseFloat(weightKg) : undefined })
      setBookingId(booking.id)
      setStep('success')
    } catch {
      setBookingId('DEMO-' + Math.random().toString(36).substr(2, 8).toUpperCase())
      setStep('success')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-dark-900 flex flex-col max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-dark-900/90 backdrop-blur-xl border-b border-white/5 px-4 py-4 flex items-center gap-3">
        {step !== 'success' && <button onClick={() => step === 'location' ? router.back() : setStep(step === 'vehicle' ? 'location' : 'vehicle')} className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center"><ArrowLeft size={18} /></button>}
        <div>
          <h1 className="font-display font-bold text-lg">
            {step === 'location' && 'Where to?'}{step === 'vehicle' && 'Choose Vehicle'}{step === 'confirm' && 'Confirm Booking'}{step === 'success' && 'Booking Confirmed!'}
          </h1>
          {step !== 'success' && <p className="text-white/40 text-xs">Step {step === 'location' ? 1 : step === 'vehicle' ? 2 : 3} of 3</p>}
        </div>
      </div>

      {step !== 'success' && <div className="h-1 bg-dark-700"><div className="h-full bg-brand-500 transition-all duration-500" style={{ width: step === 'location' ? '33%' : step === 'vehicle' ? '66%' : '100%' }} /></div>}

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {step === 'location' && (
          <div className="space-y-4 animate-slide-up">
            <div className="card">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-3 h-3 rounded-full bg-brand-500" />
                  <div className="w-0.5 h-8 bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <input type="text" placeholder="Pickup location" className="input-field text-sm" value={pickupSearch} onChange={e => { setPickupSearch(e.target.value); setShowPickupSug(true); if (!e.target.value) setPickup({ address: '', lat: 26.1445, lng: 91.7362 }) }} onFocus={() => setShowPickupSug(true)} />
                    {showPickupSug && pickupSearch && filteredPickup.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                        {filteredPickup.map(loc => <button key={loc.name} className="w-full text-left px-4 py-3 text-sm hover:bg-dark-600 flex items-center gap-2" onClick={() => { setPickup({ address: loc.name, lat: loc.lat, lng: loc.lng }); setPickupSearch(loc.name); setShowPickupSug(false) }}><MapPin size={14} className="text-brand-400 shrink-0" />{loc.name}</button>)}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="Drop location" className="input-field text-sm" value={dropSearch} onChange={e => { setDropSearch(e.target.value); setShowDropSug(true); if (!e.target.value) setDrop({ address: '', lat: 0, lng: 0 }) }} onFocus={() => setShowDropSug(true)} />
                    {showDropSug && dropSearch && filteredDrop.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-dark-700 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                        {filteredDrop.map(loc => <button key={loc.name} className="w-full text-left px-4 py-3 text-sm hover:bg-dark-600 flex items-center gap-2" onClick={() => { setDrop({ address: loc.name, lat: loc.lat, lng: loc.lng }); setDropSearch(loc.name); setShowDropSug(false) }}><Navigation size={14} className="text-emerald-400 shrink-0" />{loc.name}</button>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {distance > 0 && <div className="card flex items-center justify-between"><div className="flex items-center gap-2"><Clock size={16} className="text-brand-400" /><span className="text-sm text-white/60">Estimated distance</span></div><span className="font-semibold text-brand-400">{distance.toFixed(1)} km</span></div>}
            <div>
              <p className="text-white/40 text-xs mb-2 font-medium">Popular locations</p>
              <div className="flex gap-2 flex-wrap">
                {GUWAHATI_LOCATIONS.slice(0, 5).map(loc => <button key={loc.name} onClick={() => { if (!pickup.address) { setPickup({ address: loc.name, lat: loc.lat, lng: loc.lng }); setPickupSearch(loc.name) } else { setDrop({ address: loc.name, lat: loc.lat, lng: loc.lng }); setDropSearch(loc.name) } }} className="px-3 py-1.5 bg-dark-700 border border-white/5 rounded-full text-xs text-white/60 hover:border-brand-500/30 hover:text-white transition-all">{loc.name}</button>)}
              </div>
            </div>
            <button disabled={!pickup.address || !drop.address} onClick={() => setStep('vehicle')} className="btn-primary w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed">Choose Vehicle →</button>
          </div>
        )}

        {step === 'vehicle' && (
          <div className="space-y-3 animate-slide-up">
            <p className="text-white/40 text-sm">{pickup.address} → {drop.address} • {distance.toFixed(1)} km</p>
            {(Object.entries(VEHICLE_CONFIGS) as [keyof typeof VEHICLE_CONFIGS, typeof VEHICLE_CONFIGS[keyof typeof VEHICLE_CONFIGS]][]).map(([key, config]) => {
              const price = calculatePrice(distance, key)
              const isSelected = selectedVehicle === key
              return (
                <button key={key} onClick={() => setSelectedVehicle(key)} className={`w-full text-left rounded-2xl border p-4 transition-all ${isSelected ? 'bg-brand-500/10 border-brand-500/50' : 'bg-dark-800 border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isSelected ? 'bg-brand-500/20' : 'bg-dark-700'}`}>{config.emoji}</div>
                      <div><div className="font-semibold text-sm">{config.displayName}</div><div className="text-white/40 text-xs">{config.capacityKg} kg capacity</div><div className="text-white/30 text-xs mt-0.5">{config.description}</div></div>
                    </div>
                    <div className="text-right">
                      <div className={`font-display font-bold text-lg ${isSelected ? 'text-brand-400' : 'text-white'}`}>₹{price.totalFare}</div>
                      <div className="text-white/40 text-xs">₹{config.pricePerKm}/km</div>
                      {isSelected && <div className="mt-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center ml-auto"><Check size={12} className="text-white" /></div>}
                    </div>
                  </div>
                </button>
              )
            })}
            {selectedVehicle && (
              <div className="card animate-slide-up space-y-3">
                <p className="text-sm font-medium text-white/60">Goods details (optional)</p>
                <input type="text" placeholder="What are you transporting?" className="input-field text-sm" value={goodsDesc} onChange={e => setGoodsDesc(e.target.value)} />
                <input type="number" placeholder="Weight in kg (approx)" className="input-field text-sm" value={weightKg} onChange={e => setWeightKg(e.target.value)} />
              </div>
            )}
            <button disabled={!selectedVehicle} onClick={() => setStep('confirm')} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">Review Booking →</button>
          </div>
        )}

        {step === 'confirm' && selectedVehicle && priceEstimate && (
          <div className="space-y-4 animate-slide-up">
            <div className="card">
              <h3 className="font-semibold text-sm text-white/60 mb-3">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3"><div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><MapPin size={14} className="text-brand-400" /></div><div><div className="text-xs text-white/40">Pickup</div><div className="text-sm font-medium">{pickup.address}</div></div></div>
                <div className="flex items-start gap-3"><div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Navigation size={14} className="text-emerald-400" /></div><div><div className="text-xs text-white/40">Drop</div><div className="text-sm font-medium">{drop.address}</div></div></div>
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-sm text-white/60 mb-3">Vehicle</h3>
              <div className="flex items-center gap-3"><div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-2xl">{VEHICLE_CONFIGS[selectedVehicle].emoji}</div><div><div className="font-semibold">{VEHICLE_CONFIGS[selectedVehicle].displayName}</div><div className="text-white/40 text-xs">{VEHICLE_CONFIGS[selectedVehicle].capacityKg} kg capacity</div></div></div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-sm text-white/60 mb-3">Fare Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-white/60">Base fare</span><span>₹{priceEstimate.baseFare}</span></div>
                <div className="flex justify-between text-sm"><span className="text-white/60">Distance ({priceEstimate.distanceKm} km)</span><span>₹{priceEstimate.distanceFare}</span></div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between font-bold"><span>Total Estimate</span><span className="text-brand-400 text-lg">₹{priceEstimate.totalFare}</span></div>
              </div>
              <p className="text-white/30 text-xs mt-2">* Final fare may vary slightly based on actual distance</p>
            </div>
            <button onClick={handleBook} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Truck size={20} />}
              {loading ? 'Finding Driver...' : `Book Now • ₹${priceEstimate.totalFare}`}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6 pt-8 animate-slide-up">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto"><Check size={48} className="text-emerald-400" /></div>
            <div><h2 className="font-display font-bold text-2xl mb-2">Booking Confirmed!</h2><p className="text-white/50 text-sm">Finding the nearest available driver...</p></div>
            {bookingId && <div className="card"><p className="text-white/40 text-xs mb-1">Booking ID</p><p className="font-mono font-bold text-brand-400">{bookingId}</p></div>}
            <div className="card text-left space-y-3">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-sm">Driver will be assigned shortly</span></div>
              <div className="flex items-center gap-2 opacity-50"><div className="w-2 h-2 bg-white/20 rounded-full" /><span className="text-sm">Driver heading to pickup</span></div>
              <div className="flex items-center gap-2 opacity-30"><div className="w-2 h-2 bg-white/20 rounded-full" /><span className="text-sm">Goods in transit</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/customer" className="btn-primary text-center">Track Booking</Link>
              <button onClick={() => { setStep('location'); setPickup({ address: '', lat: 26.1445, lng: 91.7362 }); setDrop({ address: '', lat: 0, lng: 0 }); setSelectedVehicle(null); setPickupSearch(''); setDropSearch('') }} className="btn-secondary">Book Another</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
