'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Suspense } from 'react'

const spring = { type: 'spring', stiffness: 500, damping: 22 } as const

function LoginForm() {
  const router = useRouter()
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
        window.location.href = callbackUrl
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#25361a] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#6b9a4c] mb-1">
            STAFF ACCESS
          </p>
          <h1 className="font-heading text-2xl text-[#2D5016]">AGRIPULSE</h1>
          <p className="text-sm text-[#6b7a5f] mt-1">The Pulse of Predictive Farming</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2e4321] mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#dfe2d3] bg-[#F8F7F2] text-sm focus:outline-none focus:border-[#6b9a4c] focus:ring-2 focus:ring-[#6b9a4c]/20"
              placeholder="admin@agripulse.gov.ph"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2e4321] mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#dfe2d3] bg-[#F8F7F2] text-sm focus:outline-none focus:border-[#6b9a4c] focus:ring-2 focus:ring-[#6b9a4c]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? {} : { scale: 1.04, y: -2 }}
            whileTap={loading ? {} : { scale: 0.97 }}
            transition={spring}
            className="w-full bg-[#F4A300] text-[#2D5016] font-bold text-sm py-3 rounded-lg hover:bg-[#c97f24] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'SIGN IN'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-[#7c8a70] mt-6">
          © 2026 AgriPulse System | DisenyoDigitals
        </p>
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
