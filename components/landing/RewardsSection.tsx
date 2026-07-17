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
      padding: '80px 5%',
      color: '#12150C',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '4rem', marginBottom: '20px' }}
        >
          🏆
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            fontSize: '3rem',
            marginBottom: '20px',
            color: '#10190B',
          }}
        >
          Kumita ng Rewards!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '1.3rem', marginBottom: '50px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}
        >
          Bawat submission ay kumikita ng <strong>+10 Data Points</strong>.<br />
          Makakuha ng fertilizer vouchers, training, at iba pang rewards!
        </motion.p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginTop: '10px',
        }}>
          {rewards.map(({ title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              <h3 style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '1.5rem', marginBottom: '10px', color: '#10190B' }}>
                {title}
              </h3>
              <p style={{ color: '#666' }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginTop: '50px',
            padding: '30px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>
            💡 Mas maraming submission = Mas maraming rewards!
          </p>
          <p style={{ fontSize: '1rem' }}>
            Top contributors get exclusive access to new seeds, tools, and market connections.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
