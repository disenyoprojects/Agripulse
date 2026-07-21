interface Props {
  label: string
  value: number | string
  highlight?: boolean
  icon?: string
}

export default function StatsCard({ label, value, highlight = false, icon }: Props) {
  return (
    <div className="card card-interactive" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      {/* subtle top accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: highlight
            ? 'linear-gradient(to right, var(--color-accent-gold), var(--accent-turquoise))'
            : 'var(--accent-turquoise)',
          opacity: highlight ? 0.9 : 0.55,
        }}
      />
      {icon && (
        <div
          aria-hidden="true"
          style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', marginBottom: '0.9rem',
            background: 'var(--accent-turquoise-50)',
            border: '1px solid var(--accent-turquoise-100)',
          }}
        >
          {icon}
        </div>
      )}
      <div data-nums style={{
        fontFamily: 'var(--font-heading), sans-serif',
        fontSize: '2.5rem',
        color: highlight ? '#b37200' : '#2D5016',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        marginBottom: '0.5rem',
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ color: '#6b7360', fontSize: '0.92rem', fontWeight: 600 }}>{label}</div>
    </div>
  )
}
