'use client'

import { motion } from 'framer-motion'

const problems = [
  {
    index: '01',
    color: '#D6E85C',
    title: 'Price Crashes',
    description: 'When everyone plants cabbage, prices plummet to ₱5/kg. Farmers lose ₱35,000 per cycle to oversupply.',
  },
  {
    index: '02',
    color: '#F4A300',
    title: 'Shortage Spikes',
    description: 'Few plant carrots, prices soar to ₱120/kg. Urban communities face food insecurity and price volatility.',
  },
  {
    index: '03',
    color: '#3FAE95',
    title: 'Wasted Produce',
    description: '20-30% of vegetables rot in fields unsold. Environmental waste and lost income opportunities.',
  },
  {
    index: '04',
    color: '#E85D6B',
    title: 'Blind LGU Planning',
    description: 'Agricultural offices distribute seeds without knowing what\'s being planted — reactive, not predictive.',
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" style={{ padding: '100px 5%', background: 'white', position: 'relative' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
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
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '1.5rem',
          }}>
            The Challenge
          </span>
          <h2 style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            fontSize: '3rem',
            color: '#12150C',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
          }}>
            Farmers Are Planting Blind
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 1.8 }}>
            Without real-time crop intelligence, communities face devastating cycles of
            oversupply crashes and shortage spikes that destroy farmer livelihoods.
          </p>
        </motion.div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {problems.map((p, i) => (
          <motion.div
            key={p.index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10, scale: 1.015, boxShadow: '0 20px 45px rgba(18,21,12,0.18)' }}
            style={{
              background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE6CC 100%)',
              padding: '2.5rem',
              borderRadius: '24px',
              border: '3px solid #12150C',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
            }}
          >
            <div style={{
              fontFamily: 'Anton, sans-serif',
              fontWeight: 400,
              fontSize: '3rem',
              lineHeight: 1,
              color: p.color,
              marginBottom: '1.25rem',
              WebkitTextStroke: '1.5px #12150C',
            }}>
              {p.index}
              <div style={{
                width: '36px',
                height: '5px',
                borderRadius: '3px',
                marginTop: '0.6rem',
                background: p.color,
                WebkitTextStroke: 0,
              }} />
            </div>
            <h3 style={{
              fontFamily: 'Anton, sans-serif',
              fontWeight: 400,
              fontSize: '1.4rem',
              color: '#12150C',
              marginBottom: '1rem',
            }}>
              {p.title}
            </h3>
            <p style={{ color: '#555', lineHeight: 1.7 }}>{p.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
