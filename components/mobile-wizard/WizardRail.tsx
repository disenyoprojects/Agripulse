import Link from 'next/link'

type WizardRailProps = {
  /** Current wizard step (1-based). */
  step: number
  /** Step number → label. Shared with the mobile header so they never drift. */
  titles: Record<number, string>
  /** Total number of steps. */
  total: number
}

/**
 * Desktop-only left rail for the Farmer Portal. Hidden on mobile (the wizard
 * keeps its sticky green header there); on wide screens it carries branding,
 * a vertical step tracker, and overall progress so the portal reads as a real
 * web app instead of a centered phone column. Purely presentational — all
 * state and step logic stay in the wizard page.
 */
export default function WizardRail({ step, titles, total }: WizardRailProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1)
  const pct = Math.round((Math.max(0, step - 1) / (total - 1)) * 100)

  return (
    <aside
      className="fw-rail"
      style={{
        width: 300,
        flexShrink: 0,
        flexDirection: 'column',
        gap: '1.75rem',
        padding: '2rem 1.75rem',
        color: '#fff',
        background: 'linear-gradient(160deg, #2D5016 0%, #4A7C2C 100%)',
      }}
    >
      <Link
        href="/"
        aria-label="Balik sa AgriPulse home"
        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', textDecoration: 'none' }}
      >
        <span aria-hidden="true" style={{ fontSize: '1.7rem', lineHeight: 1 }}>🌾</span>
        <span>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: '1.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1,
          }}>
            AgriPulse
          </span>
          <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>Portal ng Magsasaka</span>
        </span>
      </Link>

      <nav aria-label="Mga hakbang" style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {steps.map((n) => {
          const state = n < step ? 'done' : n === step ? 'current' : 'upcoming'
          return (
            <div
              key={n}
              aria-current={state === 'current' ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.55rem 0.6rem',
                borderRadius: '10px',
                background: state === 'current' ? 'rgba(255,255,255,0.16)' : 'transparent',
                transition: 'background var(--dur-base) var(--ease-out-quart)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: state === 'upcoming' ? 'rgba(255,255,255,0.14)' : '#F4A300',
                  color: state === 'upcoming' ? 'rgba(255,255,255,0.75)' : '#2D5016',
                }}
              >
                {state === 'done' ? '✓' : n}
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: state === 'current' ? 700 : 500,
                color: state === 'upcoming' ? 'rgba(255,255,255,0.62)' : '#fff',
              }}>
                {titles[n]}
              </span>
            </div>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.85, marginBottom: '0.5rem' }}>
          <span>Hakbang {step} ng {total}</span>
          <span data-nums>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: '#F4A300',
            transition: 'width var(--dur-slow) var(--ease-out-quart)',
          }} />
        </div>
      </div>
    </aside>
  )
}
