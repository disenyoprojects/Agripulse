'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
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
        padding: scrolled ? '0.9rem 5%' : '1.5rem 5%',
        boxShadow: scrolled ? '0 8px 30px rgba(0,0,0,0.25)' : 'none',
        transition: 'padding 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <Link
        href="/"
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
        @media (max-width: 968px) {
          nav ul { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
