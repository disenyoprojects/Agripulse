'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

type Item = { label: string; href: string; icon: string }

const NAV: Item[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Farmers', href: '/dashboard/farmers', icon: '👥' },
  { label: 'Farmer Form', href: '/mobile-wizard', icon: '📝' },
  { label: 'Price Advisor', href: '/price-advisor', icon: '💰' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
]

function isActive(pathname: string | null, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname?.startsWith(href) ?? false
}

const PANEL_BG = 'linear-gradient(180deg, #142010 0%, #0c150a 100%)'

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navList = (onNavigate?: () => void) => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {NAV.map(({ label, href, icon }) => {
        const active = isActive(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: active ? 700 : 500,
              color: active ? '#fff' : 'rgba(255,255,255,0.8)',
              background: active ? 'rgba(93,158,135,0.22)' : 'transparent',
              borderLeft: active ? '3px solid var(--accent-turquoise-light)' : '3px solid transparent',
              transition: 'background var(--dur-base) var(--ease-out-quart), color var(--dur-base)',
            }}
          >
            <span style={{ fontSize: '1.15rem', width: '1.4rem', textAlign: 'center' }} aria-hidden="true">{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )

  const brand = (
    <Link
      href="/"
      style={{
        fontFamily: 'var(--font-heading), sans-serif',
        fontSize: '1.3rem',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: '1.5rem', lineHeight: 1 }} aria-hidden="true">🌾</span>
      <span>Agri<span style={{ color: 'var(--accent-turquoise-light)' }}>Pulse</span></span>
    </Link>
  )

  const signOutBtn = (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
      {email && (
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: '0.6rem', wordBreak: 'break-all' }}>
          {email}
        </p>
      )}
      <button
        onClick={() => signOut({ redirectTo: '/auth/login' })}
        className="btn btn-sm btn-on-dark"
        style={{ width: '100%' }}
      >
        Sign Out
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — fixed left */}
      <aside
        className="hidden lg:flex"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '240px',
          height: '100vh',
          background: PANEL_BG,
          borderRight: '1px solid rgba(93,158,135,0.18)',
          flexDirection: 'column',
          padding: '1.5rem 1.1rem',
          zIndex: 'var(--z-sticky)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>{brand}</div>
        <div style={{ flex: 1 }}>{navList()}</div>
        {signOutBtn}
      </aside>

      {/* Mobile top bar — `display` is left to the class so `lg:hidden` can win
          on desktop; an inline `display` would override it and leak onto the
          desktop layout, covering the page header. */}
      <header
        className="lg:hidden flex items-center justify-between"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '56px',
          background: 'rgba(16, 25, 11, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 1rem',
          zIndex: 'var(--z-sticky)',
        }}
      >
        {brand}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-drawer"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '0.5rem', display: 'flex', flexDirection: 'column',
            gap: '5px', width: '44px', height: '44px', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: 'block', width: '22px', height: '2px', borderRadius: '2px', background: 'var(--accent-turquoise-light)' }} />
          ))}
        </button>
      </header>

      {/* Mobile drawer + backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="lg:hidden"
        style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-backdrop)',
          background: 'rgba(8,12,6,0.6)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur-slow) var(--ease-out-quart)',
        }}
      />
      <aside
        id="admin-drawer"
        inert={!open}
        className="lg:hidden flex"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100%', width: '76vw', maxWidth: '300px',
          background: PANEL_BG, borderRight: '1px solid rgba(93,158,135,0.18)',
          zIndex: 'var(--z-drawer)', flexDirection: 'column',
          padding: '1.5rem 1.25rem',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--dur-slow) var(--ease-out-quint)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          {brand}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--radius-full)', cursor: 'pointer', color: 'var(--accent-turquoise-light)',
              width: '36px', height: '36px', fontSize: '1rem', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1 }}>{navList(() => setOpen(false))}</div>
        {signOutBtn}
      </aside>
    </>
  )
}
