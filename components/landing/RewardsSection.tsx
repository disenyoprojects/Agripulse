'use client'

import { motion } from 'framer-motion'

const rewards = [
  { title: '+10 Points', desc: 'Per successful submission' },
  { title: 'Fertilizer Vouchers', desc: 'Redeem points for supplies' },
  { title: 'Free Training', desc: 'Access workshops & seminars' },
  { title: 'Priority Support', desc: 'Get agricultural advice first' },
]

export default function RewardsSection() {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#F8F7F2',
      padding: 'clamp(4.5rem, 8vw, 7.5rem) 5%',
      color: '#1E3A13',
    }}>
      {/* soft turquoise data-wash + faint lime warmth for the reward moment */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(93,158,135,0.12) 0%, transparent 58%),' +
          'radial-gradient(ellipse 70% 55% at 50% 108%, rgba(214,232,92,0.14) 0%, transparent 55%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '3.5rem', marginBottom: '16px' }}
          aria-hidden="true"
        >
          🏆
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            margin: '0 0 16px',
            color: '#1E3A13',
            letterSpacing: '-0.02em',
            lineHeight: 1.08,
          }}
        >
          Kumita ng Rewards!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '1.2rem', margin: '0 auto 48px', maxWidth: '620px', lineHeight: 1.6, color: 'rgba(28,44,19,0.72)' }}
        >
          Bawat submission ay kumikita ng{' '}
          <strong style={{ color: 'var(--color-primary-green)' }}>+10 Data Points</strong>.
          Makakuha ng fertilizer vouchers, training, at iba pang rewards!
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginTop: '10px',
        }}>
          {rewards.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              className="card card-interactive"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              style={{
                padding: '1.75rem',
                textAlign: 'left',
                background: '#fff',
                border: '1px solid rgba(45,80,22,0.10)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                marginBottom: '0.4rem',
                color: '#1E3A13',
                letterSpacing: '-0.01em',
              }}>
                {title}
              </h3>
              <p style={{ color: 'rgba(28,44,19,0.62)', margin: 0, fontSize: '0.95rem', lineHeight: 1.55 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: '2.5rem',
            padding: '1.75rem 2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(93,158,135,0.14)',
            border: '1px solid rgba(93,158,135,0.30)',
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px', color: '#1E3A13' }}>
            Mas maraming submission = Mas maraming{' '}
            <span style={{ color: 'var(--color-primary-green)' }}>rewards!</span>
          </p>
          <p style={{ fontSize: '0.98rem', margin: 0, color: 'rgba(28,44,19,0.72)', lineHeight: 1.55 }}>
            Top contributors get exclusive access to new seeds, tools, and market connections.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
