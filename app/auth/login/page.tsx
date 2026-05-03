'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Truck, Eye, EyeOff, Phone, Mail, User, ArrowLeft, Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/services/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') as 'customer' | 'driver' | null
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [role, setRole] = useState<'customer' | 'driver'>(defaultRole || 'customer')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        await signUp({ email: form.email, password: form.password, fullName: form.fullName, phone: form.phone, role })
        setMode('signin')
        setError('Account created! Please sign in.')
      } else {
        await signIn(form.email, form.password)
        router.push(role === 'driver' ? '/dashboard/driver' : '/dashboard/customer')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark-900 bg-mesh flex flex-col">
      <div className="px-4 pt-12 pb-8 max-w-lg mx-auto w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /><span className="text-sm">Back</span>
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
            <Truck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">NE Transport</h1>
            <p className="text-white/40 text-xs">Instant goods transport in Assam</p>
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl mb-1">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <p className="text-white/40 text-sm">{mode === 'signin' ? 'Sign in to continue' : 'Join thousands of users in Assam'}</p>
      </div>

      <div className="flex-1 px-4 max-w-lg mx-auto w-full">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['customer', 'driver'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`p-4 rounded-xl border transition-all ${role === r ? 'bg-brand-500/20 border-brand-500/50 text-brand-400' : 'bg-dark-800 border-white/10 text-white/50'}`}>
                <div className="text-2xl mb-1">{r === 'customer' ? '📦' : '🚛'}</div>
                <div className="font-semibold text-sm capitalize">{r}</div>
                <div className="text-xs opacity-60 mt-0.5">{r === 'customer' ? 'Book transport' : 'Drive & earn'}</div>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="text" required placeholder="Your full name" className="input-field pl-10" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="tel" required placeholder="+91 98765 43210" className="input-field pl-10" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" required placeholder="you@example.com" className="input-field pl-10" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required minLength={6} placeholder="••••••••" className="input-field pr-10" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <div className={`p-3 rounded-xl text-sm ${error.includes('created') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }} className="text-brand-400 font-medium hover:text-brand-300">
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 card">
          <p className="text-white/40 text-xs font-medium mb-3">Demo Accounts</p>
          <div className="space-y-2">
            {[
              { label: 'Customer Demo', email: 'customer@demo.com', pw: 'demo1234', role: 'customer' },
              { label: 'Driver Demo', email: 'driver@demo.com', pw: 'demo1234', role: 'driver' },
              { label: 'Admin Demo', email: 'admin@demo.com', pw: 'demo1234', role: 'admin' },
            ].map((demo) => (
              <button key={demo.role} onClick={() => { setForm({ ...form, email: demo.email, password: demo.pw }); setMode('signin') }} className="w-full text-left px-3 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors text-xs">
                <span className="text-white/60">{demo.label}</span>
                <span className="text-white/30 ml-2">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto w-full text-center">
        <p className="text-white/20 text-xs">By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-brand-500" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
