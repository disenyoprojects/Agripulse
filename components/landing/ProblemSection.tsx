'use client'

import { motion } from 'framer-motion'

// Accents tuned for the deep-green surface — lighter turquoise, lime and
// earth greens that hold AA contrast on the dark gradient, so the section
// reads as part of the AgriPulse theme rather than a white cut-out.
const problems = [
  {
    index: '01',
    color: '#8fbfa9', // turquoise-light
    bar: '#5d9e87',   // brand turquoise
    title: 'Price Crashes',
    description: 'When everyone plants cabbage, prices plummet to ₱5/kg. Farmers lose ₱35,000 per cycle to oversupply.',
  },
  {
    index: '02',
    color: '#F4A300', // brand accent gold
    bar: '#F4A300',
    title: 'Shortage Spikes',
    description: 'Few plant carrots, prices soar to ₱120/kg. Urban communities face food insecurity and price volatility.',
  },
  {
    index: '03',
    color: '#D6E85C', // harvest lime
    bar: '#6b9a4c',   // brand green-500
    title: 'Wasted Produce',
    description: '20-30% of vegetables rot in fields unsold. Environmental waste and lost income opportunities.',
  },
  {
    index: '04',
    color: '#A8C686', // earth light-2
    bar: '#7FA34A',   // earth light
    title: 'Blind LGU Planning',
    description: 'Agricultural offices distribute seeds without knowing what\'s being planted — reactive, not predictive.',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        padding: '110px 5%',
        background:
          'radial-gradient(ellipse 68% 55% at 74% 4%, rgba(93,158,135,0.16) 0%, transparent 55%),' +
          'radial-gradient(ellipse 70% 55% at 22% 98%, rgba(214,232,92,0.07) 0%, transparent 55%),' +
          'linear-gradient(160deg, #060A04 0%, #10190B 45%, #2f4a1c 100%)',
        position: 'relative',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(93,158,135,0.14)',
              border: '1px solid rgba(143,191,169,0.28)',
              color: 'var(--accent-turquoise-light)',
              marginBottom: '1.25rem',
            }}
          >
            The Challenge
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#F8F7F2',
            margin: '0 0 1.25rem',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}>
            Farmers Are Planting Blind
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, margin: 0 }}>
            Without real-time crop intelligence, communities face devastating cycles of
            oversupply crashes and shortage spikes that destroy farmer livelihoods.
          </p>
        </motion.div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1180px',
        margin: '0 auto',
      }}>
        {problems.map((p, i) => (
          <motion.div
            key={p.index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, borderColor: 'rgba(143,191,169,0.4)' }}
            style={{
              padding: '2rem',
              cursor: 'default',
              background: 'rgba(255,255,255,0.045)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-xl)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div data-nums style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: '2.5rem',
              lineHeight: 1,
              color: p.color,
              letterSpacing: '-0.01em',
            }}>
              {p.index}
            </div>
            <div style={{
              width: '32px',
              height: '4px',
              borderRadius: '999px',
              margin: '0.85rem 0 1.25rem',
              background: p.bar,
            }} />
            <h3 style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontWeight: 700,
              fontSize: '1.3rem',
              color: '#F8F7F2',
              margin: '0 0 0.6rem',
              letterSpacing: '-0.01em',
            }}>
              {p.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.65, margin: 0, fontSize: '0.98rem' }}>{p.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
