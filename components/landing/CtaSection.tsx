'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionLink = motion(Link)

export default function CtaSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #F4A300 0%, #D6E85C 100%)',
      padding: '110px 5%',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-heading), sans-serif',
          textTransform: 'uppercase',
          fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
          color: '#10190B',
          marginBottom: '1.25rem',
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
        }}>
          Join the Predictive Farming Revolution
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#2a3510', lineHeight: 1.7, margin: '0 auto 2.5rem', maxWidth: '52ch' }}>
          If you can text, you can help build agricultural intelligence.
          Submit your farm data today and earn rewards while protecting your community&apos;s food security.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MotionLink
            href="/mobile-wizard"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-hero btn-lg"
          >
            Start Submitting Data
          </MotionLink>
          <MotionLink
            href="/dashboard"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-lg"
            style={{
              background: 'transparent',
              color: '#10190B',
              border: '1.5px solid rgba(16,25,11,0.55)',
            }}
          >
            Explore Dashboard
          </MotionLink>
        </div>
      </motion.div>
    </section>
  )
}
