'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimWidget from './AnimWidget'

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
      background: 'radial-gradient(ellipse 80% 60% at 70% 0%, rgba(214,232,92,0.10) 0%, transparent 60%), linear-gradient(160deg, #060A04 0%, #10190B 45%, #38541F 100%)',
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
      }}>🌾</div>

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
          <motion.p variants={item} style={{
            color: '#7FA34A',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '1.5rem',
          }}>
            BLISTT Initiative — Cordillera, Philippines
          </motion.p>

          <motion.h1 variants={item} style={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            textTransform: 'uppercase',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            color: 'white',
            lineHeight: 1.02,
            marginBottom: '1.5rem',
          }}>
            From Reactive Farming to Predictive Farming
          </motion.h1>

          <motion.p variants={item} style={{
            fontSize: '1.5rem',
            color: '#7FA34A',
            marginBottom: '1.5rem',
            fontWeight: 500,
          }}>
            Community-Powered Agricultural Intelligence
          </motion.p>

          <motion.p variants={item} style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.8,
            marginBottom: '3rem',
          }}>
            Transform guesswork into data. Help farmers plant smarter, earn steadier,
            and build resilient food security through simple mobile data sharing.
          </motion.p>

          <motion.div variants={item} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/mobile-wizard" style={{
              padding: '1.2rem 2.5rem',
              background: '#D6E85C',
              color: '#12150C',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 20px rgba(214,232,92,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              Submit Farm Data
            </Link>
            <Link href="/dashboard" style={{
              padding: '1.2rem 2.5rem',
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              View Dashboard
            </Link>
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
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
          }}>
            {[
              { number: '25-40%', label: 'Farmer Income Stabilization' },
              { number: '30%', label: 'Post-Harvest Waste Reduction' },
              { number: '60%', label: 'LGU Planning Efficiency' },
            ].map(({ number, label }, i) => (
              <div key={label} style={{ marginBottom: i < 2 ? '1.5rem' : 0 }}>
                <div style={{
                  fontFamily: 'Anton, sans-serif',
                  fontWeight: 400,
                  fontSize: '3rem',
                  color: '#D6E85C',
                  lineHeight: 1,
                }}>
                  {i === 0 ? counts.farmers.toLocaleString() || number : number}
                </div>
                <div style={{ fontSize: '0.95rem', opacity: 0.9, marginTop: '0.5rem' }}>
                  {i === 0 ? `Registered Farmers (${label})` : label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
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
