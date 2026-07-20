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
          zIndex: 200,
          background: 'rgba(16, 25, 11, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.9rem 5%',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
        }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            fontSize: '1.5rem',
            color: '#D6E85C',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: '2rem' }}>🌾</span>
          AGRIPULSE
        </Link>

        <ul
          style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
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
                    color: isActive ? '#D6E85C' : 'white',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    transition: 'color 0.3s',
                  }}
                  className="nav-link-item"
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
          className="md:hidden flex flex-col justify-center items-center gap-1.25 w-10 h-10 rounded-lg"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
        >
          <span style={{
            display: 'block', width: '22px', height: '2px', background: '#D6E85C',
            transition: 'transform 0.3s, opacity 0.3s',
            transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px', background: '#D6E85C',
            transition: 'opacity 0.3s',
            opacity: open ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px', background: '#D6E85C',
            transition: 'transform 0.3s, opacity 0.3s',
            transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 199,
            background: 'rgba(16, 25, 11, 0.97)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            paddingTop: '5rem',
          }}
          className="md:hidden"
        >
          {links.map(({ label, href }) => {
            const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href.split('#')[0]) && !href.includes('#'))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  color: isActive ? '#D6E85C' : 'white',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  letterSpacing: '1px',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </Link>
            )
          })}

          <div style={{ marginTop: '1rem' }}>
            <NavLinks />
          </div>
        </div>
      )}

      <style>{`
        .nav-link-item::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 100%;
          height: 2px;
          background: #D6E85C;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link-item:hover {
          color: #D6E85C !important;
        }
        .nav-link-item:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
      `}</style>
    </>
  )
}
