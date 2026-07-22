'use client'

import { usePathname } from 'next/navigation'
import SiteNav from '@/components/shared/SiteNav'

// Routes with their own dedicated chrome (admin sidebar, wizard header) that
// should not also show the global marketing nav.
const HIDDEN_PREFIXES = ['/dashboard', '/mobile-wizard']

export default function ConditionalNav() {
  const pathname = usePathname()
  const hidden = HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p))
  if (hidden) return null
  return <SiteNav />
}
