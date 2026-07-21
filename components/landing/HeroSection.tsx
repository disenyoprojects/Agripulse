'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimWidget from './AnimWidget'

const MotionLink = motion(Link)

interface Props {
  counts: { farmers: number; submissions: number }
}

const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  },
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

export default function HeroSection({ counts }: Props) {
  return (
    <section style={{
      background:
        'radial-gradient(ellipse 68% 55% at 74% 4%, rgba(93,158,135,0.16) 0%, transparent 55%),' +
        'radial-gradient(ellipse 70% 55% at 22% 98%, rgba(214,232,92,0.07) 0%, transparent 55%),' +
        'linear-gradient(160deg, #060A04 0%, #10190B 45%, #2f4a1c 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: '80px',
    }}>
      {/* Background wheat emoji */}
      <div style={{
        position: 'absolute',
        fontSize: '600px',
        opacity: 0.04,
        right: '-100px',
        top: '-100px',
        animation: 'heroFloat 20s infinite ease-in-out',
        pointerEvents: 'none',
        userSelect: 'none',
      }} aria-hidden="true">🌾</div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 5%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        width: '100%',
      }} className="hero-grid">
        {/* Left: text */}
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p variants={item} className="eyebrow" style={{
            color: 'var(--accent-turquoise-light)',
            marginBottom: '1.5rem',
          }}>
            <span aria-hidden="true" style={{
              width: '7px', height: '7px', borderRadius: '999px',
              background: 'var(--accent-turquoise)',
              boxShadow: '0 0 12px 1px rgba(93,158,135,0.7)',
            }} />
            BLISTT Initiative — Cordillera, Philippines
          </motion.p>

          <motion.h1 variants={item} style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            color: 'white',
            lineHeight: 1.02,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}>
            From Reactive Farming to{' '}
            <span style={{ color: 'var(--color-harvest-lime)' }}>Predictive Farming</span>
          </motion.h1>

          <motion.p variants={item} style={{
            fontSize: '1.4rem',
            color: 'var(--accent-turquoise-light)',
            marginBottom: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}>
            Community-Powered Agricultural Intelligence
          </motion.p>

          <motion.p variants={item} style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.75,
            marginBottom: '2.5rem',
            maxWidth: '38ch',
          }}>
            Transform guesswork into data. Help farmers plant smarter, earn steadier,
            and build resilient food security through simple mobile data sharing.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <MotionLink
              href="/mobile-wizard"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-lg"
              style={{
                background: 'var(--color-harvest-lime)',
                color: '#12150C',
                boxShadow: '0 10px 30px -8px rgba(214,232,92,0.5)',
              }}
            >
              Submit Farm Data
            </MotionLink>
            <MotionLink
              href="/dashboard"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-lg hero-secondary"
              style={{
                background: 'rgba(93,158,135,0.08)',
                color: 'var(--accent-turquoise-light)',
                border: '1px solid var(--accent-turquoise)',
              }}
            >
              View Dashboard
            </MotionLink>
          </motion.div>
        </motion.div>

        {/* Right: animated widget + stats card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimWidget />

          {/* Stats card */}
          <div className="surface-glass" style={{
            padding: '2rem',
            color: 'white',
            boxShadow: 'var(--shadow-xl)',
          }}>
            {[
              { number: '25-40%', label: 'Farmer Income Stabilization' },
              { number: '30%', label: 'Post-Harvest Waste Reduction' },
              { number: '60%', label: 'LGU Planning Efficiency' },
            ].map(({ number, label }, i) => (
              <div key={label} style={{
                marginBottom: i < 2 ? '1.5rem' : 0,
                paddingBottom: i < 2 ? '1.5rem' : 0,
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}>
                <div data-nums style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize: '2.75rem',
                  color: i === 0 ? 'var(--accent-turquoise-light)' : 'var(--color-harvest-lime)',
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}>
                  {i === 0 ? counts.farmers.toLocaleString() || number : number}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.5rem', lineHeight: 1.4 }}>
                  {i === 0 ? `Registered Farmers` : label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-secondary:hover {
          background: var(--accent-turquoise) !important;
          color: var(--on-turquoise) !important;
          border-color: var(--accent-turquoise) !important;
        }
        @keyframes heroFloat {
          0%,100%{transform:rotate(0deg)}
          50%{transform:translateY(-30px) rotate(5deg)}
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
