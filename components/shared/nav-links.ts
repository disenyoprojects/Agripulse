export type NavLink = {
  label: string
  href: string
  icon: string
  /** Shorter label for compact contexts like the mobile bottom bar. */
  short?: string
}

export const homeLink: NavLink = { label: 'Home', href: '/', icon: '🏠' }

export const farmerLinks: NavLink[] = [
  { label: 'Farmer Portal', short: 'Submit', href: '/mobile-wizard', icon: '🌾' },
  { label: 'Leaderboard', href: '/leaderboard', icon: '🏆' },
  { label: 'Status', href: '/status', icon: '🔎' },
  { label: 'Price Advisor', short: 'Prices', href: '/price-advisor', icon: '💰' },
]

export const adminLinks: NavLink[] = [
  { label: 'LGU Dashboard', href: '/dashboard', icon: '📊' },
]

/** Full horizontal set for the desktop top nav. */
export const desktopLinks: NavLink[] = [homeLink, ...farmerLinks, ...adminLinks]

/** Farmer-facing set for the mobile bottom tab bar. */
export const bottomTabLinks: NavLink[] = [homeLink, ...farmerLinks]

export function isActiveHref(pathname: string | null, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || (pathname?.startsWith(href) ?? false)
}
