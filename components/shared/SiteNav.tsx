'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

/** Landing anchors only make sense on the landing page. */
const sectionLinks = [
  { label: 'Ang suliranin', href: '/#problem' },
  { label: 'Ang sistema', href: '/#solution' },
  { label: 'Epekto', href: '/#impact' },
]

const appLinks = [
  { label: 'LGU dashboard', href: '/dashboard' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Price advisor', href: '/price-advisor' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  const onHome = pathname === '/'
  const links = onHome ? [...sectionLinks, ...appLinks] : appLinks
  const drawerLinks = [...sectionLinks, ...appLinks]

  // Escape closes the drawer and returns focus to the button that opened it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Move focus into the drawer when it opens so keyboard users land there.
  useEffect(() => {
    if (open) drawerRef.current?.focus()
  }, [open])

  const isActive = (href: string) =>
    !href.includes('#') && href !== '/' && pathname?.startsWith(href)

  return (
    <>
      <header
        data-surface="dark"
        className="fixed inset-x-0 top-0"
        style={{ zIndex: 'var(--z-sticky)' }}
      >
        {/* Surface fades in on scroll rather than sitting as permanent glass,
            so the hero reads full-bleed at rest. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 border-b transition-[opacity,backdrop-filter] duration-[var(--duration-slow)] ease-[var(--ease-out-quart)]"
          style={{
            opacity: scrolled ? 1 : 0,
            background: 'color-mix(in oklab, var(--color-pine-950) 88%, transparent)',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderColor: 'var(--line)',
          }}
        />

        <nav
          aria-label="Pangunahing nabigasyon"
          className="relative mx-auto flex max-w-[1600px] items-center gap-8 px-[6vw] py-4"
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-ink-inv group flex shrink-0 items-baseline gap-2 text-xl"
          >
            <span className="u-display tracking-tight">AgriPulse</span>
            {/* The pulse in the name, made literal. */}
            <span
              aria-hidden="true"
              className="bg-ember-500 size-1.5 shrink-0 rounded-full"
              style={{ animation: 'nav-pulse 2.8s var(--ease-in-out-quart) infinite' }}
            />
          </Link>

          <ul className="ml-auto hidden items-center gap-7 lg:flex">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={`nav-link relative text-sm transition-colors duration-[var(--duration-base)] ${
                    isActive(href)
                      ? 'text-ink-inv font-semibold'
                      : 'text-ink-inv-muted hover:text-ink-inv'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/mobile-wizard"
            className="bg-ember-500 text-pine-950 hover:bg-ember-400 ml-auto hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-[var(--duration-base)] lg:ml-0 lg:block"
          >
            Isumite ang tanim
          </Link>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Isara ang menu' : 'Buksan ang menu'}
            aria-expanded={open}
            aria-controls="site-drawer"
            className="ml-auto flex size-10 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              aria-hidden="true"
              className="bg-ink-inv block h-0.5 w-6 rounded-full transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)]"
              style={{ transform: open ? 'translateY(7px) rotate(45deg)' : undefined }}
            />
            <span
              aria-hidden="true"
              className="bg-ink-inv block h-0.5 w-6 rounded-full transition-opacity duration-[var(--duration-base)]"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              aria-hidden="true"
              className="bg-ink-inv block h-0.5 w-6 rounded-full transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-quart)]"
              style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : undefined }}
            />
          </button>
        </nav>
      </header>

      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 transition-opacity duration-[var(--duration-slow)] lg:hidden"
        style={{
          zIndex: 'var(--z-overlay)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* `inert` keeps the closed drawer out of the tab order entirely —
          previously its links stayed focusable behind the page. */}
      <div
        id="site-drawer"
        ref={drawerRef}
        data-surface="dark"
        tabIndex={-1}
        inert={!open}
        aria-label="Menu"
        className="bg-pine-950 fixed inset-y-0 right-0 flex h-full w-[78vw] max-w-sm flex-col border-l px-7 pt-24 pb-8 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quint)] lg:hidden"
        style={{
          zIndex: 'var(--z-modal)',
          borderColor: 'var(--line)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <nav aria-label="Menu" className="flex flex-col">
          {drawerLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`flex items-center justify-between border-b py-4 text-base transition-colors duration-[var(--duration-base)] ${
                isActive(href) ? 'text-ember-400 font-bold' : 'text-ink-inv hover:text-ember-400'
              }`}
              style={{ borderColor: 'var(--line)' }}
            >
              {label}
              <span aria-hidden="true" className="text-ink-inv-muted">
                ›
              </span>
            </Link>
          ))}
        </nav>

        <Link
          href="/mobile-wizard"
          onClick={() => setOpen(false)}
          className="bg-ember-500 text-pine-950 hover:bg-ember-400 mt-8 rounded-full py-3.5 text-center text-base font-bold transition-colors duration-[var(--duration-base)]"
        >
          Isumite ang tanim
        </Link>
      </div>

      <style>{`
        @keyframes nav-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.8); }
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 1.5px;
          background: var(--color-ember-500);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform var(--duration-base) var(--ease-out-quart);
        }
        .nav-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-link::after { transition: none; }
        }
      `}</style>
    </>
  )
}
