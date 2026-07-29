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
    <footer style={{ background: '#173812', color: 'rgba(255,255,255,0.68)', padding: '72px 5% 36px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem',
      }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: '1.4rem',
            marginBottom: '1rem',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}>
            Agri<span style={{ color: 'var(--accent-turquoise-light)' }}>Pulse</span>
          </h3>
          <p style={{ lineHeight: 1.75, fontSize: '0.95rem', maxWidth: '38ch' }}>
            Community-powered agricultural intelligence platform transforming BLISTT farmers
            from reactive planners into predictive decision-makers. Real-time crop monitoring
            for Baguio, La Trinidad, Itogon, Sablan, Tuba, and Tublay.
          </p>
        </div>

        <div>
          <h4 className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.1rem', display: 'block' }}>
            Platform
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {platformLinks.map(({ label, href }) => (
              <li key={label} style={{ marginBottom: '0.7rem' }}>
                <Link href={href} className="footer-link" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '1.1rem', display: 'block' }}>
            Partners
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {partnerLinks.map(({ label, href }) => (
              <li key={label} style={{ marginBottom: '0.7rem' }}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem' }}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <p style={{ margin: 0 }}>© 2026 AgriPulse System | Urban Agriculture Innovation Summit Entry</p>
        <p style={{ marginTop: '10px', opacity: 0.65 }}>
          Powered by <strong style={{ color: 'rgba(255,255,255,0.85)' }}>DisenyoDigitals</strong> in collaboration with{' '}
          <strong style={{ color: 'rgba(255,255,255,0.85)' }}>The Locale Farm</strong> and <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Session Groceries</strong>
        </p>
      </div>

      <style>{`
        .footer-link { transition: color var(--dur-base) var(--ease-out-quart); }
        .footer-link:hover { color: var(--accent-turquoise-light) !important; }
      `}</style>
    </footer>
  )
}
