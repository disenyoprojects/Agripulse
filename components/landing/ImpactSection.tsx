'use client'

import { motion } from 'framer-motion'

const stats = [
  { number: '25-40%', label: 'Farmer Income Stabilization' },
  { number: '30%', label: 'Post-Harvest Waste Reduction' },
  { number: '60%', label: 'LGU Planning Efficiency' },
  { number: '85%', label: 'Data Accuracy Rate' },
]

export default function ImpactSection() {
  return (
    <section id="impact" style={{ padding: '110px 5%', background: '#F3F1E7' }}>
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="badge badge-accent" style={{ marginBottom: '1.25rem' }}>
            Projected Impact
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase' as const,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#12150C',
            margin: '0 0 1.25rem',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}>
            Better Farm Data Creates Better Harvest Decisions
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#5a5f52', lineHeight: 1.7, margin: 0 }}>
            Pilot data projects significant improvements across economic, environmental,
            and social sustainability metrics.
          </p>
        </motion.div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1080px',
        margin: '0 auto',
      }}>
        {stats.map(({ number, label }, i) => (
          <motion.div
            key={number}
            className="card card-interactive"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            style={{ padding: '2rem 1.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '44px', height: '3px', borderRadius: '999px',
              background: 'var(--accent-turquoise)',
            }} />
            <div data-nums style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: '2.75rem',
              color: '#2D5016',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}>
              {number}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#5a5f52', fontWeight: 600, lineHeight: 1.4 }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
