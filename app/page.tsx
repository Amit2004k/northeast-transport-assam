import Link from 'next/link'
import { ArrowRight, MapPin, Truck, Zap, Shield, Star, ChevronRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-900 bg-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">NE Transport</span>
          </div>
          <Link href="/auth/login" className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Sign In →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-12 pb-10 max-w-lg mx-auto animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-3 py-1.5 mb-6">
          <Zap size={12} className="text-brand-400" />
          <span className="text-brand-400 text-xs font-medium">Instant booking • Assam-wide coverage</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight mb-4">
          Move goods
          <br />
          <span className="text-gradient">instantly</span> across
          <br />
          Assam
        </h1>

        <p className="text-white/50 text-base leading-relaxed mb-8">
          Book Tata Yodha, Bolero Pickup, and more. 
          Reliable drivers, transparent pricing, 
          real-time tracking — all in one tap.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/booking"
            className="btn-primary flex items-center justify-center gap-2 text-base"
          >
            Book a Vehicle Now
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/auth/login?role=driver"
            className="btn-secondary flex items-center justify-center gap-2 text-base"
          >
            Drive with Us
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 max-w-lg mx-auto mb-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '500+', label: 'Active Drivers' },
            { value: '14', label: 'Assam Cities' },
            { value: '4.8★', label: 'Average Rating' },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="font-display font-bold text-xl text-brand-400">{stat.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="px-4 max-w-lg mx-auto mb-10">
        <h2 className="section-title mb-4">Available Vehicles</h2>
        <div className="space-y-3">
          {[
            { emoji: '🚛', name: 'Tata Yodha', capacity: '1500 kg', price: '₹18/km', tag: 'Popular' },
            { emoji: '🚚', name: 'Bolero Pickup', capacity: '1000 kg', price: '₹15/km', tag: 'Fast' },
            { emoji: '🚛', name: 'Mini Truck', capacity: '2500 kg', price: '₹22/km', tag: 'Heavy' },
            { emoji: '🚐', name: 'Tata Ace', capacity: '750 kg', price: '₹12/km', tag: 'Budget' },
          ].map((vehicle) => (
            <div key={vehicle.name} className="card-hover flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-2xl">
                  {vehicle.emoji}
                </div>
                <div>
                  <div className="font-semibold text-sm">{vehicle.name}</div>
                  <div className="text-white/40 text-xs">{vehicle.capacity}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-brand">{vehicle.tag}</span>
                <div className="text-brand-400 font-semibold text-sm">{vehicle.price}</div>
                <ChevronRight size={16} className="text-white/30" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 max-w-lg mx-auto mb-10">
        <h2 className="section-title mb-4">How it works</h2>
        <div className="space-y-3">
          {[
            { icon: MapPin, step: '1', title: 'Set Pickup & Drop', desc: 'Enter your locations in Assam' },
            { icon: Truck, step: '2', title: 'Choose Vehicle', desc: 'Select based on load & budget' },
            { icon: Zap, step: '3', title: 'Get Matched', desc: 'Nearest driver accepts in minutes' },
            { icon: Shield, step: '4', title: 'Track & Complete', desc: 'Real-time updates until delivery' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-brand-400" />
              </div>
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-white/40 text-xs">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 max-w-lg mx-auto mb-12">
        <h2 className="section-title mb-4">What customers say</h2>
        <div className="space-y-3">
          {[
            { name: 'Rajan Borah', city: 'Guwahati', text: 'Booked a Tata Yodha for shifting furniture. Driver arrived in 8 minutes. Excellent service!', rating: 5 },
            { name: 'Priya Das', city: 'Jorhat', text: 'Very reliable for inter-city transport. Transparent pricing, no hidden charges.', rating: 5 },
          ].map((review) => (
            <div key={review.name} className="card">
              <div className="flex items-center gap-1 mb-2">
                {Array(review.rating).fill(0).map((_, i) => (
                  <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/70 text-sm mb-2">"{review.text}"</p>
              <div className="text-white/40 text-xs">{review.name} • {review.city}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 max-w-lg mx-auto mb-16 text-center">
        <div className="card bg-gradient-to-br from-brand-500/20 to-brand-700/10 border-brand-500/20">
          <h3 className="font-display font-bold text-xl mb-2">Ready to move?</h3>
          <p className="text-white/50 text-sm mb-5">Join 10,000+ customers across Assam</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center gap-2">
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-6 max-w-lg mx-auto text-center">
        <p className="text-white/30 text-xs">
          © 2024 NE Transport • Guwahati, Assam, India
          <br />
          <span className="text-brand-500/50">Transforming logistics in Northeast India</span>
        </p>
      </footer>
    </main>
  )
}
