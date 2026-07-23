import Link from 'next/link'

/**
 * Full-width return bar for LGU staff who open the Farmer Portal from the admin
 * sidebar's "Farmer Form" link. The Farmer Portal carries no admin chrome, so
 * without this an admin has no clear way back to the dashboard.
 *
 * Rendered only for authenticated admins (gated by the layout's auth check),
 * so farmers never see it. It sits in normal flow above the wizard — full-width
 * at every breakpoint — so it never overlaps the wizard's own header or footer.
 */
export default function AdminReturnBar() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #2D5016 0%, #38541F 100%)',
        borderBottom: '1px solid rgba(143,191,169,0.28)',
        color: '#fff',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0.6rem 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <Link
          href="/dashboard"
          aria-label="Back to admin dashboard"
          className="admin-return-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#fff',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1 }}>←</span>
          Back to Dashboard
        </Link>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-turquoise-light)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          <span aria-hidden="true">📊 </span>
          <span className="hidden sm:inline">LGU Admin · </span>Farmer Portal
        </span>
      </div>
    </div>
  )
}
