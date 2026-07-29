'use client'

/**
 * AgriPulse hero — drop-in for components/landing/HeroSection.tsx
 *
 * SETUP (2 steps):
 * 1. Put your text-free illustration in the repo at:  public/hero-bg.png
 * 2. Replace components/landing/HeroSection.tsx with this file.
 *    It takes no props — change `<HeroSection counts={counts} />` in
 *    app/page.tsx to `<HeroSection />` (drop getLiveCounts if unused elsewhere).
 *
 * Uses next/image (fill) + next/link. Inline styles + one <style> block for
 * keyframes. Colors/fonts come from your globals.css tokens.
 */

import Image from 'next/image'
import Link from 'next/link'
import heroBg from '../../public/hero-bg.png' // or: src="/hero-bg.png" on <Image fill />

const MOTES = Array.from({ length: 15 }).map((_, i) => ({
  left: (i * 61) % 100,
  dur: 11 + (i % 6) * 2.4,
  delay: (i * 0.9) % 8,
  size: 2 + (i % 3),
  bottom: 12 + (i % 5) * 6,
  gold: i % 3 === 0,
}))

/** How dark the center gets for headline legibility (0–0.95). */
const CENTER_DARKEN = 0.28

export default function HeroSection() {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 80,
        background: 'linear-gradient(160deg,#123510 0%,#1C4015 45%,#437628 100%)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: '#fff',
      }}
    >
      {/* full-bleed illustrated background (text-free) */}
      <Image
        src={heroBg}
        alt=""
        aria-hidden
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        style={{ objectFit: 'cover', zIndex: 0 }}
      />

      {/* atmospheric center darkening: clean readable middle, detailed edges */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(6,10,4,0.26) 0%, rgba(6,10,4,0.08) 20%, transparent 46%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `linear-gradient(90deg, transparent 12%, rgba(6,10,4,${CENTER_DARKEN * 0.45}) 23%, rgba(6,10,4,${CENTER_DARKEN}) 35%, rgba(6,10,4,${CENTER_DARKEN}) 65%, rgba(6,10,4,${CENTER_DARKEN * 0.45}) 77%, transparent 88%)` }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: `radial-gradient(ellipse 44% 46% at 50% 40%, rgba(6,10,4,${CENTER_DARKEN * 0.5}) 0%, transparent 72%)` }} />

      {/* floating motes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
        {MOTES.map((m, i) => (
          <span key={i} style={{ position: 'absolute', left: `${m.left}%`, bottom: `${m.bottom}%`, width: m.size, height: m.size, borderRadius: '50%', background: m.gold ? 'rgba(214,232,92,0.9)' : 'rgba(255,255,255,0.8)', boxShadow: '0 0 8px rgba(214,232,92,0.6)', animation: `agpMote ${m.dur}s ${m.delay}s ease-in infinite` }} />
        ))}
      </div>

      {/* hero content */}
      <div style={{ position: 'relative', zIndex: 20, maxWidth: 1200, margin: '0 auto', padding: '110px 5% 90px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ maxWidth: 'min(900px,94%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a7d0be', marginBottom: '1.4rem', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: '#5d9e87', boxShadow: '0 0 12px 1px rgba(93,158,135,0.8)' }} />
            BLISST Initiative — Cordillera, Philippines
          </p>
          <h1 style={{ fontFamily: 'var(--font-heading), Archivo Black, sans-serif', textTransform: 'uppercase', fontSize: 'clamp(2.9rem,7vw,6rem)', color: '#fff', lineHeight: 0.98, letterSpacing: '-0.02em', marginBottom: '1.5rem', textShadow: '0 4px 34px rgba(0,0,0,0.7)' }}>
            From Reactive Farming to <span style={{ color: '#D6E85C' }}>Predictive Farming</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-display), Baloo 2, sans-serif', fontSize: 'clamp(1.25rem,2.4vw,1.7rem)', color: '#9fd6c1', marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em', textShadow: '0 2px 18px rgba(0,0,0,0.65)' }}>Community-Powered Agricultural Intelligence</p>
          <p style={{ fontFamily: 'var(--font-body), Nunito, sans-serif', fontSize: 'clamp(1.05rem,1.4vw,1.2rem)', color: 'rgba(255,255,255,0.94)', lineHeight: 1.7, marginBottom: '2.4rem', maxWidth: '52ch', textShadow: '0 2px 16px rgba(0,0,0,0.75)' }}>Transform guesswork into data. Help farmers plant smarter, earn steadier, and build resilient food security through simple mobile data sharing.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/mobile-wizard" className="btn btn-lg" style={{ background: '#D6E85C', color: '#12150C', boxShadow: '0 10px 34px -8px rgba(214,232,92,0.55)' }}>Submit Farm Data</Link>
            <Link href="/dashboard" className="btn btn-lg" style={{ background: 'rgba(16,25,11,0.35)', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)' }}>View Dashboard</Link>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <Link href="#top" style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', textShadow: '0 2px 10px rgba(0,0,0,0.7)', textDecoration: 'none' }}>
        Scroll
        <span style={{ width: 22, height: 34, border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: 999, position: 'relative' }}>
          <span style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 3, height: 7, borderRadius: 2, background: '#D6E85C', animation: 'agpBob 1.8s ease-in-out infinite' }} />
        </span>
      </Link>

      <style>{`
        @keyframes agpMote { 0% { transform: translate(0,0); opacity: 0; } 12% { opacity: .85; } 88% { opacity: .7; } 100% { transform: translate(20px,-130px); opacity: 0; } }
        @keyframes agpBob { 0%,100% { transform: translate(-50%,0); opacity: .5; } 50% { transform: translate(-50%,8px); opacity: 1; } }
      `}</style>
    </section>
  )
}
