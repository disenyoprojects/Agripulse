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
      background: 'linear-gradient(135deg, #D6E85C 0%, #F4A300 100%)',
      padding: '96px 5%',
      color: '#12150C',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
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
            color: '#10190B',
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
          style={{ fontSize: '1.2rem', margin: '0 auto 48px', maxWidth: '620px', lineHeight: 1.6, color: '#2a3510' }}
        >
          Bawat submission ay kumikita ng <strong>+10 Data Points</strong>.
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
              style={{ padding: '1.75rem', textAlign: 'left', boxShadow: 'var(--shadow-md)' }}
            >
              <h3 style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontWeight: 700,
                fontSize: '1.35rem',
                marginBottom: '0.4rem',
                color: '#10190B',
                letterSpacing: '-0.01em',
              }}>
                {title}
              </h3>
              <p style={{ color: '#5a5f52', margin: 0, fontSize: '0.95rem', lineHeight: 1.55 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="surface-glass"
          style={{
            marginTop: '2.5rem',
            padding: '1.75rem 2rem',
            background: 'rgba(255,255,255,0.28)',
            border: '1px solid rgba(255,255,255,0.4)',
            textAlign: 'left',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px', color: '#12150C' }}>
            Mas maraming submission = Mas maraming rewards!
          </p>
          <p style={{ fontSize: '0.98rem', margin: 0, color: '#2a3510', lineHeight: 1.55 }}>
            Top contributors get exclusive access to new seeds, tools, and market connections.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
