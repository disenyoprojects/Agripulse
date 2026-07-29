'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionLink = motion(Link)

export default function CtaSection() {
  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: '#F8F7F2',
      padding: 'clamp(4.5rem, 8vw, 7.5rem) 5%',
    }}>
      {/* soft turquoise + lime wash — data/trust warmth on the cream surface */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(93,158,135,0.12) 0%, transparent 60%)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 2, maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-heading), sans-serif',
          textTransform: 'uppercase',
          fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
          color: '#1E3A13',
          marginBottom: '1.25rem',
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
        }}>
          Join the Predictive Farming Revolution
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'rgba(28,44,19,0.72)', lineHeight: 1.7, margin: '0 auto 2.5rem', maxWidth: '52ch' }}>
          If you can text, you can help build agricultural intelligence.
          Submit your farm data today and earn rewards while protecting your community&apos;s food security.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Primary = the Submit action → harvest-lime, the sanctioned growth moment */}
          <MotionLink
            href="/mobile-wizard"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-lg"
            style={{
              background: '#D6E85C',
              color: '#12150C',
              boxShadow: '0 10px 34px -8px rgba(214,232,92,0.5)',
            }}
          >
            Start Submitting Data
          </MotionLink>
          <MotionLink
            href="/dashboard"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-lg"
            style={{
              background: '#fff',
              color: '#2D5016',
              border: '1px solid rgba(45,80,22,0.25)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Explore Dashboard
          </MotionLink>
        </div>
      </motion.div>
    </section>
  )
}
