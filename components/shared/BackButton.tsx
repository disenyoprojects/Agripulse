'use client'

import { useRouter } from 'next/navigation'

type BackButtonProps = {
  /** Fallback route if there is no history to go back to. */
  fallback?: string
  label?: string
  /** 'light' for dark backgrounds (nav headers), 'dark' for light backgrounds. */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Browser-style back control. Uses the router history when available and
 * falls back to a known route on a cold/direct load.
 */
export default function BackButton({
  fallback = '/',
  label = 'Back',
  tone = 'dark',
  className = '',
}: BackButtonProps) {
  const router = useRouter()

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  const light = tone === 'light'

  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-1.5 rounded-full text-sm font-semibold transition-colors ${className}`}
      style={{
        padding: '0.4rem 0.9rem',
        background: light ? 'rgba(255,255,255,0.12)' : 'rgba(45,80,22,0.06)',
        border: `1px solid ${light ? 'rgba(255,255,255,0.22)' : 'rgba(45,80,22,0.16)'}`,
        color: light ? '#fff' : '#2D5016',
        cursor: 'pointer',
      }}
      aria-label={label}
    >
      <span aria-hidden="true" style={{ fontSize: '1.05em', lineHeight: 1 }}>←</span>
      {label}
    </button>
  )
}
