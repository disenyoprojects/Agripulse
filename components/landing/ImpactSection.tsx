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
    <section id="impact" style={{ padding: '100px 5%', background: '#F3F1E7' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{
            display: 'inline-block',
            background: '#7FA34A',
            color: '#10190B',
            padding: '0.5rem 1.5rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase' as const,
            letterSpacing: '1.5px',
            marginBottom: '1.5rem',
          }}>
            Projected Impact
          </span>
          <h2 style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase' as const,
            fontSize: '3rem',
            color: '#12150C',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            Better Farm Data Creates Better Harvest Decisions
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 1.8 }}>
            Pilot data projects significant improvements across economic, environmental,
            and social sustainability metrics.
          </p>
        </motion.div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {stats.map(({ number, label }, i) => (
          <motion.div
            key={number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', padding: '2rem' }}
          >
            <div style={{
              fontFamily: 'Anton, sans-serif',
              fontWeight: 400,
              fontSize: '3.5rem',
              color: '#2D5016',
              lineHeight: 1,
              marginBottom: '1rem',
            }}>
              {number}
            </div>
            <div style={{ fontSize: '1rem', color: '#555', fontWeight: 600 }}>{label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
