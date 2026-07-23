'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FarmerBottomTabs from '@/components/shared/FarmerBottomTabs'
import BackButton from '@/components/shared/BackButton'

const spring = { type: 'spring', stiffness: 500, damping: 22 } as const

type LookupResult = {
  found: boolean
  fullName?: string
  municipality?: string
  barangay?: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  submissionCount?: number
  error?: string
}

const STATUS_META: Record<string, { label: string; sub: string; emoji: string; bg: string; border: string; color: string }> = {
  PENDING: {
    label: 'Naghihintay ng Pagsusuri',
    sub: 'Sinusuri pa ng LGU ang iyong rehistro. Lalabas ka sa leaderboard kapag na-aprubahan na.',
    emoji: '⏳', bg: '#FDF3E7', border: 'rgba(193,90,0,0.22)', color: '#C15A00',
  },
  APPROVED: {
    label: 'Aprubado',
    sub: 'Beripikado ang iyong rehistro. Salamat sa iyong kontribusyon!',
    emoji: '✅', bg: '#EBF5EC', border: 'rgba(46,125,50,0.22)', color: '#1e6b24',
  },
  REJECTED: {
    label: 'Hindi Naaprubahan',
    sub: 'Makipag-ugnayan sa iyong LGU office para sa karagdagang impormasyon.',
    emoji: '❌', bg: '#FDECEC', border: 'rgba(211,47,47,0.22)', color: '#b52a2a',
  },
}

function StatusTimeline({ status }: { status: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  const rejected = status === 'REJECTED'
  const steps = [
    { label: 'Nag-submit', state: 'done' as const },
    { label: 'Sinusuri', state: status === 'PENDING' ? ('current' as const) : ('done' as const) },
    {
      label: rejected ? 'Hindi Naaprubahan' : 'Aprubado',
      state: status === 'PENDING' ? ('upcoming' as const) : ('done' as const),
    },
  ]

  const colorFor = (state: 'done' | 'current' | 'upcoming', isLast: boolean) => {
    if (state === 'upcoming') return '#c9cbbe'
    if (isLast && rejected) return '#D32F2F'
    if (state === 'current') return '#F4A300'
    return 'var(--accent-turquoise)'
  }

  return (
    <div className="flex items-start justify-between">
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1
        const color = colorFor(s.state, isLast)
        return (
          <div key={s.label} className="flex-1 flex flex-col items-center relative">
            {/* connector to next */}
            {i < steps.length - 1 && (
              <span
                className="absolute top-3 left-1/2 h-0.5"
                style={{
                  width: '100%',
                  background: steps[i + 1].state === 'upcoming' ? '#e0e2d6' : 'var(--accent-turquoise)',
                }}
                aria-hidden="true"
              />
            )}
            <span
              className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white font-bold"
              style={{ background: color }}
            >
              {s.state === 'upcoming' ? '' : s.state === 'current' ? '•' : '✓'}
            </span>
            <span
              className="text-[0.68rem] mt-1.5 text-center leading-tight"
              style={{ color: s.state === 'upcoming' ? '#9aa192' : '#5a5f52', fontWeight: s.state === 'current' ? 700 : 500 }}
            >
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function StatusPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function copyPhone() {
    if (!phone.trim()) return
    try {
      await navigator.clipboard.writeText(phone.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = phone.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`/api/farmers/lookup?phone=${encodeURIComponent(trimmed)}`)
      const data: LookupResult = await res.json()
      if (res.status === 429) {
        setError('Sobra ang bilang ng paghahanap. Subukan muli mamaya.')
      } else {
        setResult(data)
      }
    } catch {
      setError('May nangyaring mali. Subukan muli.')
    } finally {
      setLoading(false)
    }
  }

  const meta = result?.status ? STATUS_META[result.status] : null

  return (
    <main
      className="min-h-screen pt-20 pb-24 md:pb-12 flex items-start justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(93,158,135,0.14) 0%, transparent 55%), linear-gradient(160deg, #1a2e10 0%, #0c150a 100%)',
      }}
    >
      <div className="w-full max-w-md mt-8">
        <div className="mb-4">
          <BackButton fallback="/" label="Back" tone="light" />
        </div>
        <div className="text-center mb-6">
          <div aria-hidden="true" className="text-[3.5rem] leading-none mb-2">🌾</div>
          <h1 className="font-heading text-[1.9rem]" style={{ color: 'var(--color-accent-gold)', letterSpacing: '-0.015em' }}>
            Status ng Rehistro
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#dfe6d4' }}>
            Ilagay ang iyong numero ng telepono
          </p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numero ng telepono"
                className="field-input w-full"
                autoComplete="tel"
              />
              <button
                type="button"
                onClick={copyPhone}
                disabled={!phone.trim()}
                className="btn btn-secondary btn-sm shrink-0"
                aria-label="Kopyahin ang numero"
              >
                {copied ? '✓ Nakopya' : '📋 Kopyahin'}
              </button>
            </div>
            <motion.button
              type="submit"
              disabled={loading || !phone.trim()}
              whileHover={loading ? {} : { scale: 1.02, y: -2 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              transition={spring}
              className="btn btn-primary w-full"
            >
              {loading ? 'Hinahanap…' : 'Hanapin ang Status'}
            </motion.button>
          </form>

          {error && (
            <p
              className="text-sm rounded-xl px-3.5 py-2.5 mt-4"
              role="alert"
              style={{ color: '#8a3527', background: '#fdecec', border: '1px solid rgba(211,47,47,0.18)' }}
            >
              {error}
            </p>
          )}

          {result && !result.found && !error && (
            <p className="text-sm text-[#6b7360] mt-4 text-center">
              Walang nahanap na rehistro para sa numerong ito. Baka hindi ka pa nakarehistro.
            </p>
          )}

          {result?.found && meta && result.status && (
            <div className="mt-5">
              {/* Progress timeline */}
              <StatusTimeline status={result.status} />

              <div
                className="rounded-2xl p-5 text-center mt-4"
                style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
              >
                <div className="text-[2.5rem] leading-none mb-2" aria-hidden="true">{meta.emoji}</div>
                <p className="font-heading text-[1.3rem]" style={{ color: meta.color, letterSpacing: '-0.01em' }}>
                  {meta.label}
                </p>
                <p className="text-sm mt-2" style={{ color: '#5a5f52' }}>{meta.sub}</p>
              </div>
              <div className="mt-4 text-sm text-[#5a5f52] flex flex-col gap-1.5">
                <p><strong className="text-primary-green">{result.fullName}</strong></p>
                <p>{result.barangay}, {result.municipality}</p>
                <p>{result.submissionCount ?? 0} submission{(result.submissionCount ?? 0) !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <Link href="/mobile-wizard" className="btn btn-primary btn-sm">Farmer Portal →</Link>
          <Link href="/" className="btn btn-on-dark btn-sm">Home</Link>
        </div>
      </div>
      <FarmerBottomTabs />
    </main>
  )
}
