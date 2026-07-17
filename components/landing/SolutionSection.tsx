'use client'

import { motion } from 'framer-motion'

const agriPostFeatures = [
  '30-second mobile submission',
  'Tagalog/Ilocano/English interfaces',
  'SMS & web compatibility',
  'Photo upload optional',
  'Instant confirmation & tips',
  '🏆 +10 Data Points per submission',
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
    <ul style={{ listStyle: 'none', margin: '2rem 0 0', padding: 0 }}>
      {items.map((item) => (
        <li key={item} style={{
          padding: '1rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          fontSize: '1.05rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <span style={{
            background: '#D6E85C',
            color: '#12150C',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            flexShrink: 0,
            fontSize: '0.85rem',
          }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function SolutionSection() {
  return (
    <section
      id="solution"
      style={{
        padding: '100px 5%',
        background: '#10190B',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(214,232,92,0.04) 30%, rgba(214,232,92,0.04) 70%, transparent 70%)',
        backgroundSize: '100px 100px',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{
              display: 'inline-block',
              background: '#38541F',
              color: '#D6E85C',
              padding: '0.5rem 1.5rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase' as const,
              letterSpacing: '1.5px',
              marginBottom: '1.5rem',
            }}>
              The Innovation
            </span>
            <h2 style={{
              fontFamily: 'Anton, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase' as const,
              fontSize: '3rem',
              color: 'white',
              lineHeight: 1.1,
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
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, textTransform: 'uppercase' as const, fontSize: '2.5rem', marginBottom: '1.5rem', color: '#D6E85C' }}>
              The "AgriPost" System
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1rem', opacity: 0.95 }}>
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
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px',
              padding: '2.5rem',
            }}
          >
            <div style={{ background: '#2D5016', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem' }}>
              <p style={{ color: '#D6E85C', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>Isumite ang Iyong Tanim 🌾</p>
              {[
                'Uri ng Tanim: Repolyo (Cabbage)',
                'Sukat: 0.5 ektarya',
                'Petsa ng Tanim: Mayo 20, 2026',
                'Aasahang Ani: Hulyo 15, 2026',
              ].map((line) => (
                <div key={line} style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.85)',
                }}>{line}</div>
              ))}
              <div style={{
                background: '#D6E85C',
                color: '#10190B',
                fontWeight: 700,
                textAlign: 'center',
                padding: '0.875rem',
                borderRadius: '10px',
                marginTop: '1rem',
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
              }}>
                ISUMITE NGAYON
              </div>
            </div>
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
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
            }}
          >
            <h4 style={{ color: '#2D5016', marginBottom: '1rem', fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '1.1rem' }}>
              Real-Time Intelligence Dashboard
            </h4>
            {[
              { color: '#D32F2F', label: '🔴 CABBAGE: 85% Saturation — Oversupply Risk' },
              { color: '#FF6F00', label: '🟡 POTATO: 68% — Monitor Closely' },
              { color: '#2E7D32', label: '🟢 CARROT: 18% — Opportunity Crop' },
              { color: '#2E7D32', label: '🟢 LETTUCE: 42% — Balanced Supply' },
            ].map(({ label }) => (
              <div key={label} style={{ color: '#444', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{label}</div>
            ))}
            <div style={{
              background: '#A8C686',
              padding: '1rem',
              borderRadius: '8px',
              color: '#12150C',
              fontWeight: 700,
              textAlign: 'center' as const,
              marginTop: '1rem',
              fontSize: '0.9rem',
            }}>
              247 Active Farmers | 118.5 Hectares Tracked
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, textTransform: 'uppercase' as const, fontSize: '2.5rem', marginBottom: '1.5rem', color: '#D6E85C' }}>
              Municipal Intelligence
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1rem', opacity: 0.95 }}>
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
