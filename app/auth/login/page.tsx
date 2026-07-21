'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

const spring = { type: 'spring', stiffness: 500, damping: 22 } as const

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid email or password.')
      } else {
        const safe = callbackUrl.startsWith('/') ? callbackUrl : '/dashboard'
        window.location.href = safe
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(93,158,135,0.14) 0%, transparent 55%), linear-gradient(160deg, #1a2e10 0%, #0c150a 100%)',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="card p-8">
          {/* Brand mark */}
          <div className="text-center mb-8">
            <span
              className="badge badge-accent eyebrow inline-block mb-4"
            >
              Staff Access
            </span>
            <h1
              className="font-heading text-[1.9rem] text-primary-green"
              style={{ letterSpacing: '-0.015em' }}
            >
              AGRI<span style={{ color: 'var(--accent-turquoise-strong)' }}>PULSE</span>
            </h1>
            <p className="text-sm text-[#6b7a5f] mt-1.5">The Pulse of Predictive Farming</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-[0.75rem] font-bold text-[#2e4321] uppercase tracking-wider mb-1.5"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input w-full"
                placeholder="admin@agripulse.gov.ph"
              />
            </div>

            <div>
              <label
                className="block text-[0.75rem] font-bold text-[#2e4321] uppercase tracking-wider mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input w-full"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                className="text-sm rounded-xl px-3.5 py-2.5"
                role="alert"
                style={{
                  color: '#8a3527',
                  background: '#fdecec',
                  border: '1px solid rgba(211,47,47,0.18)',
                }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02, y: -2 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={spring}
              className="btn btn-primary w-full mt-1"
            >
              {loading ? 'Signing in…' : 'SIGN IN'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-[#8a917e] mt-7">
            © 2026 AgriPulse System | DisenyoDigitals
          </p>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
