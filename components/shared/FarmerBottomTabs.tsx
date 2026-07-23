'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Submit', href: '/mobile-wizard', icon: '🌾' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
  { label: 'Status', href: '/status', icon: '🔎' },
]

function isActive(pathname: string | null, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname?.startsWith(href) ?? false
}

/**
 * Facebook/Instagram-style bottom tab bar for farmer-facing pages. Mobile only.
 * Pages that render this should add ~72px of bottom padding so content clears it.
 */
export default function FarmerBottomTabs() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden"
      aria-label="Farmer navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 'var(--z-sticky)',
        background: 'rgba(16, 25, 11, 0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderTop: '1px solid rgba(93,158,135,0.22)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        height: '60px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -8px 24px -12px rgba(0,0,0,0.5)',
      }}
    >
      {TABS.map(({ label, href, icon }) => {
        const active = isActive(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              textDecoration: 'none',
              color: active ? 'var(--accent-turquoise-light)' : 'rgba(255,255,255,0.6)',
              fontWeight: active ? 700 : 500,
            }}
          >
            <span style={{ fontSize: '1.35rem', lineHeight: 1, filter: active ? 'none' : 'grayscale(0.5) opacity(0.85)' }} aria-hidden="true">
              {icon}
            </span>
            <span style={{ fontSize: '0.68rem' }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
