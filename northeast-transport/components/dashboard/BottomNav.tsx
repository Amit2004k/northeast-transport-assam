'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Package, Truck, User, Settings, BarChart3, FileText } from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
}

const CUSTOMER_NAV: NavItem[] = [
  { href: '/dashboard/customer', icon: Home, label: 'Home' },
  { href: '/booking', icon: Package, label: 'Book' },
  { href: '/dashboard/customer', icon: User, label: 'Profile' },
]

const DRIVER_NAV: NavItem[] = [
  { href: '/dashboard/driver', icon: Home, label: 'Home' },
  { href: '/dashboard/driver', icon: Truck, label: 'Jobs' },
  { href: '/dashboard/driver', icon: BarChart3, label: 'Earnings' },
  { href: '/dashboard/driver', icon: FileText, label: 'Docs' },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/dashboard/admin', icon: BarChart3, label: 'Overview' },
  { href: '/dashboard/admin', icon: Package, label: 'Bookings' },
  { href: '/dashboard/admin', icon: Truck, label: 'Drivers' },
  { href: '/dashboard/admin', icon: Settings, label: 'Settings' },
]

export default function BottomNav({ role }: { role: 'customer' | 'driver' | 'admin' }) {
  const pathname = usePathname()

  const navItems = role === 'customer' ? CUSTOMER_NAV
    : role === 'driver' ? DRIVER_NAV
    : ADMIN_NAV

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-dark-800/90 backdrop-blur-xl border-t border-white/5 bottom-nav z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive ? 'text-brand-400' : 'text-white/30 hover:text-white/60'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
