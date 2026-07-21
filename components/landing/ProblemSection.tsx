'use client'

import { motion } from 'framer-motion'

const problems = [
  {
    index: '01',
    color: '#6f7d28', // number: AA on white
    bar: '#D6E85C',   // accent bar: vibrant brand lime
    title: 'Price Crashes',
    description: 'When everyone plants cabbage, prices plummet to ₱5/kg. Farmers lose ₱35,000 per cycle to oversupply.',
  },
  {
    index: '02',
    color: '#b37200',
    bar: '#F4A300',
    title: 'Shortage Spikes',
    description: 'Few plant carrots, prices soar to ₱120/kg. Urban communities face food insecurity and price volatility.',
  },
  {
    index: '03',
    color: '#2e7d6a',
    bar: '#3FAE95',
    title: 'Wasted Produce',
    description: '20-30% of vegetables rot in fields unsold. Environmental waste and lost income opportunities.',
  },
  {
    index: '04',
    color: '#c33a4a',
    bar: '#E85D6B',
    title: 'Blind LGU Planning',
    description: 'Agricultural offices distribute seeds without knowing what\'s being planted — reactive, not predictive.',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding: '110px 5%', background: 'white', position: 'relative' }}>
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="badge badge-accent" style={{ marginBottom: '1.25rem' }}>
            The Challenge
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#12150C',
            margin: '0 0 1.25rem',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}>
            Farmers Are Planting Blind
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#5a5f52', lineHeight: 1.7, margin: 0 }}>
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
            className="card card-interactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            style={{ padding: '2rem', cursor: 'default' }}
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
              color: '#12150C',
              margin: '0 0 0.6rem',
              letterSpacing: '-0.01em',
            }}>
              {p.title}
            </h3>
            <p style={{ color: '#5a5f52', lineHeight: 1.65, margin: 0, fontSize: '0.98rem' }}>{p.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
