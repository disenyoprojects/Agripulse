'use client'

import { motion } from 'framer-motion'
import CropReportPhone from './CropReportPhone'

const agriPostFeatures = [
  '30-second mobile submission',
  'Tagalog/Ilocano/English interfaces',
  'SMS & web compatibility',
  'Photo upload optional',
  'Instant confirmation & tips',
  '+10 Data Points per submission',
  'Rewards: Fertilizer vouchers, training, seeds',
]

const intelligenceFeatures = [
  'Oversupply/shortage alerts',
  'Barangay-level heatmaps',
  'Harvest projections',
  'Data-driven seed distribution',
  'Exportable reports for DA',
]

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '1.75rem 0 0', padding: 0 }}>
      {items.map((item) => (
        <li key={item} style={{
          padding: '0.85rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.09)',
          fontSize: '1.02rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem',
          lineHeight: 1.45,
        }}>
          <span aria-hidden="true" style={{
            background: 'var(--accent-turquoise)',
            color: 'var(--on-turquoise)',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            flexShrink: 0,
            fontSize: '0.8rem',
          }}>✓</span>
          <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const eyebrowOnDark: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: 'rgba(93,158,135,0.15)',
  border: '1px solid rgba(93,158,135,0.32)',
  color: 'var(--accent-turquoise-light)',
  padding: '0.4rem 0.9rem',
  borderRadius: '999px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '1.25rem',
}

const heading3: React.CSSProperties = {
  fontFamily: 'var(--font-heading), sans-serif',
  textTransform: 'uppercase',
  fontSize: 'clamp(1.75rem, 3vw, 2.4rem)',
  marginBottom: '1.25rem',
  color: 'var(--color-harvest-lime)',
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
}

export default function SolutionSection() {
  return (
    <section
      id="solution"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7.5rem) 5%',
        background: '#1C4015',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(93,158,135,0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={eyebrowOnDark}>The Innovation</span>
            <h2 style={{
              fontFamily: 'var(--font-heading), sans-serif',
              textTransform: 'uppercase' as const,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'white',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              Simple Data Systems Protecting Farmer Income
            </h2>
          </motion.div>
        </div>

        {/* Grid 1: AgriPost */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          marginBottom: '5rem',
        }} className="solution-grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 style={heading3}>The &ldquo;AgriPost&rdquo; System</h3>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.75, marginBottom: '1rem', opacity: 0.9 }}>
              If farmers can use Facebook, they can use agricultural intelligence tools.
              Our platform makes crop data submission as simple as posting a status update.
            </p>
            <FeatureList items={agriPostFeatures} />
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <CropReportPhone />
          </motion.div>
        </div>

        {/* Grid 2: Municipal Intelligence */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="solution-grid">
          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="card"
            style={{ padding: '1.75rem', boxShadow: 'var(--shadow-xl)' }}
          >
            <h4 style={{ color: '#2D5016', marginBottom: '1.1rem', fontFamily: 'var(--font-display), sans-serif', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Real-Time Intelligence Dashboard
            </h4>
            {[
              { dot: '#D32F2F', label: 'CABBAGE: 85% Saturation — Oversupply Risk' },
              { dot: '#FF6F00', label: 'POTATO: 68% — Monitor Closely' },
              { dot: '#2E7D32', label: 'CARROT: 18% — Opportunity Crop' },
              { dot: '#2E7D32', label: 'LETTUCE: 42% — Balanced Supply' },
            ].map(({ dot, label }) => (
              <div key={label} style={{ color: '#444', fontSize: '0.88rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span aria-hidden="true" style={{ width: '9px', height: '9px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                {label}
              </div>
            ))}
            <div style={{
              background: 'var(--accent-turquoise-50)',
              border: '1px solid var(--accent-turquoise-100)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-turquoise-strong)',
              fontWeight: 700,
              textAlign: 'center' as const,
              marginTop: '1rem',
              fontSize: '0.88rem',
            }}>
              247 Active Farmers · 118.5 Hectares Tracked
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 style={heading3}>Municipal Intelligence</h3>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.75, marginBottom: '1rem', opacity: 0.9 }}>
              LGU agricultural offices gain real-time visibility into community planting
              patterns, enabling predictive interventions before market crashes happen.
            </p>
            <FeatureList items={intelligenceFeatures} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .solution-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
