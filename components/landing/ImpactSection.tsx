'use client'

import { motion } from 'framer-motion'

// Ordered by weight: the income outcome leads (it is the product's headline
// promise), the rest support it. Rendered as an editorial figure list, not a
// grid of equal cards — hierarchy is the point.
const stats = [
  { number: '25–40%', label: 'steadier farmer income', lead: true },
  { number: '~30%', label: 'less post-harvest waste' },
  { number: '60%', label: 'sharper LGU planning' },
  { number: '85%', label: 'data accuracy rate' },
]

export default function ImpactSection() {
  return (
    <section id="impact" style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(4.5rem, 8vw, 7.5rem) 5%',
      background: '#1C4015',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 62% 50% at 85% 2%, rgba(93,158,135,0.14) 0%, transparent 60%)',
      }} />

      <div className="impact-wrap" style={{ position: 'relative', zIndex: 2, maxWidth: '1180px', margin: '0 auto' }}>
        {/* Left: the claim */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: '#fff',
            margin: '0 0 1.5rem',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}>
            The payoff of<br />planting with data
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, margin: 0, maxWidth: '38ch' }}>
            Pilot targets across economic, environmental, and social sustainability —
            the difference between reacting to a crash and seeing it coming.
          </p>
        </motion.div>

        {/* Right: the figures, weighted */}
        <div className="impact-figures">
          {stats.map(({ number, label, lead }, i) => (
            <motion.div
              key={label}
              className="impact-row"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                data-nums
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  color: 'var(--color-harvest-lime)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.03em',
                  fontSize: lead ? 'clamp(3.4rem, 8vw, 5.5rem)' : 'clamp(2.2rem, 4.5vw, 3.1rem)',
                }}
              >
                {number}
              </span>
              <span style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontWeight: 700,
                fontSize: lead ? '1.15rem' : '1rem',
                color: lead ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.68)',
                lineHeight: 1.3,
                textAlign: 'right',
                maxWidth: '14ch',
              }}>
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .impact-wrap {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: start;
        }
        .impact-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem 1.5rem;
          padding: 1.4rem 0;
          border-top: 1px solid rgba(255,255,255,0.14);
        }
        .impact-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.14); }
        @media (min-width: 900px) {
          .impact-wrap { grid-template-columns: 1fr 1.05fr; gap: 5rem; }
          .impact-figures { padding-top: 0.5rem; }
        }
      `}</style>
    </section>
  )
}
