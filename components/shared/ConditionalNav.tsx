'use client'

import { usePathname } from 'next/navigation'
import SiteNav from '@/components/shared/SiteNav'

// Routes whose own chrome fully replaces the global nav at every breakpoint
// (the admin dashboard has its sidebar).
const HIDDEN_PREFIXES = ['/dashboard']

// The farmer portal owns the top chrome on mobile (its sticky green header +
// bottom tabs), but the desktop web view has no top bar — so show the global
// nav there on wide screens only.
const DESKTOP_ONLY_PREFIXES = ['/mobile-wizard']

export default function ConditionalNav() {
  const pathname = usePathname()

  if (HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))) return null

  if (DESKTOP_ONLY_PREFIXES.some((p) => pathname?.startsWith(p))) {
    return (
      <div className="hidden lg:block">
        <SiteNav />
      </div>
    )
  }

  return <SiteNav />
}
