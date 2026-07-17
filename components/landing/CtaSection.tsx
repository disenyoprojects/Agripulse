'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CtaSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #F4A300 0%, #D6E85C 100%)',
      padding: '100px 5%',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
      >
        <h2 style={{
          fontFamily: 'Anton, sans-serif',
          fontWeight: 400,
          textTransform: 'uppercase',
          fontSize: '3rem',
          color: '#10190B',
          marginBottom: '1.5rem',
          lineHeight: 1.1,
        }}>
          Join the Predictive Farming Revolution
        </h2>
        <p style={{ fontSize: '1.2rem', color: '#1a2a0a', lineHeight: 1.8, marginBottom: '3rem' }}>
          If you can text, you can help build agricultural intelligence.
          Submit your farm data today and earn rewards while protecting your community's food security.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/mobile-wizard" style={{
            padding: '1.2rem 2.5rem',
            background: '#10190B',
            color: 'white',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Start Submitting Data
          </Link>
          <Link href="/dashboard" style={{
            padding: '1.2rem 2.5rem',
            background: 'transparent',
            color: '#10190B',
            border: '2px solid #10190B',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '1rem',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Explore Dashboard
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
