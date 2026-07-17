import Link from 'next/link'

const platformLinks = [
  { label: 'Farmer Submission', href: '/mobile-wizard' },
  { label: 'LGU Dashboard', href: '/dashboard' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Price Advisor', href: '/price-advisor' },
]

const partnerLinks = [
  { label: 'Baguio City LGU', href: 'https://baguio.gov.ph' },
  { label: 'SIGLAT Innovation Hub', href: '#' },
  { label: 'Baguio CVAO - Urban Agriculture Division', href: 'https://www.facebook.com/UrbanAgricultureDivision' },
]

export default function LandingFooter() {
  return (
    <footer style={{ background: '#10190B', color: 'rgba(255,255,255,0.7)', padding: '60px 5% 30px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem',
      }}>
        <div>
          <h3 style={{ color: '#D6E85C', fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '1.5rem', marginBottom: '1rem' }}>
            AgriPulse System
          </h3>
          <p style={{ lineHeight: 1.8, fontSize: '0.95rem' }}>
            Community-powered agricultural intelligence platform transforming BLISTT farmers
            from reactive planners into predictive decision-makers. Real-time crop monitoring
            for Baguio, La Trinidad, Itogon, Sablan, Tuba, and Tublay.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            Platform
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {platformLinks.map(({ label, href }) => (
              <li key={label} style={{ marginBottom: '0.75rem' }}>
                <Link href={href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            Partners
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {partnerLinks.map(({ label, href }) => (
              <li key={label} style={{ marginBottom: '0.75rem' }}>
                <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <p>© 2026 AgriPulse System | Urban Agriculture Innovation Summit Entry</p>
        <p style={{ marginTop: '10px', opacity: 0.7 }}>
          Powered by <strong>DisenyoDigitals</strong> in collaboration with{' '}
          <strong>The Locale Farm</strong> and <strong>Session Groceries</strong>
        </p>
      </div>
    </footer>
  )
}
