'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import NavLinks from '@/components/landing/NavLinks'

const links = [
  { label: 'Problem', href: '/#problem' },
  { label: 'Solution', href: '/#solution' },
  { label: 'Impact', href: '/#impact' },
  { label: 'Farmer Portal', href: '/mobile-wizard' },
  { label: 'LGU Dashboard', href: '/dashboard' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Price Advisor', href: '/price-advisor' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 'var(--z-sticky)',
          background: 'rgba(16, 25, 11, 0.82)',
          backdropFilter: 'blur(16px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 5%',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px -12px rgba(0,0,0,0.5)',
        }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: '1.4rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '1.6rem', lineHeight: 1 }} aria-hidden="true">🌾</span>
          <span>
            Agri<span style={{ color: 'var(--accent-turquoise-light)' }}>Pulse</span>
          </span>
        </Link>

        <ul
          style={{ gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}
          className="hidden md:flex"
        >
          {links.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href.split('#')[0]) && !href.includes('#'))
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    position: 'relative',
                    color: isActive ? 'var(--accent-turquoise-light)' : 'rgba(255,255,255,0.86)',
                    textDecoration: 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    transition: 'color var(--dur-base) var(--ease-out-quart)',
                  }}
                  className={`nav-link-item${isActive ? ' is-active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden md:flex">
          <NavLinks />
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '5px',
            width: '44px',
            height: '44px',
          }}
        >
          <span style={{
            display: 'block', width: '24px', height: '2px', background: 'var(--accent-turquoise-light)',
            borderRadius: '2px',
            transition: 'transform var(--dur-slow) var(--ease-out-quart), opacity var(--dur-base)',
            transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: 'var(--accent-turquoise-light)',
            borderRadius: '2px',
            transition: 'opacity var(--dur-base)',
            opacity: open ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: 'var(--accent-turquoise-light)',
            borderRadius: '2px',
            transition: 'transform var(--dur-slow) var(--ease-out-quart), opacity var(--dur-base)',
            transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 'var(--z-backdrop)',
          background: 'rgba(8,12,6,0.6)',
          backdropFilter: open ? 'blur(2px)' : 'none',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity var(--dur-slow) var(--ease-out-quart)',
        }}
      />

      {/* Sidebar drawer — slides in from right */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '78vw',
          maxWidth: '340px',
          height: '100%',
          zIndex: 'var(--z-drawer)',
          background: 'linear-gradient(180deg, #142010 0%, #0c150a 100%)',
          borderLeft: '1px solid rgba(93,158,135,0.18)',
          boxShadow: '-24px 0 60px -20px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '5rem',
          paddingBottom: '2rem',
          paddingLeft: '1.75rem',
          paddingRight: '1.75rem',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform var(--dur-slow) var(--ease-out-quint)',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            color: 'var(--accent-turquoise-light)',
            fontSize: '1.1rem',
            lineHeight: 1,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>

        <p className="eyebrow" style={{ color: 'var(--accent-turquoise-light)', opacity: 0.7, marginBottom: '1.25rem' }}>
          Navigation
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {links.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href.split('#')[0]) && !href.includes('#'))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  color: isActive ? 'var(--accent-turquoise-light)' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem',
                  letterSpacing: '0.01em',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  transition: 'color var(--dur-base) var(--ease-out-quart)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {label}
                <span style={{ color: isActive ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>›</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: '2rem' }}>
          <NavLinks />
        </div>
      </div>

      <style>{`
        .nav-link-item::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 2px;
          border-radius: 2px;
          background: var(--accent-turquoise);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform var(--dur-slow) var(--ease-out-expo);
        }
        .nav-link-item.is-active::after { background: var(--accent-turquoise-light); }
        .nav-link-item:hover { color: var(--accent-turquoise-light) !important; }
        .nav-link-item:hover::after,
        .nav-link-item.is-active::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>
    </>
  )
}
