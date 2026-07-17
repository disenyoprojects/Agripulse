import Link from 'next/link'
import { db } from '@/lib/db'
import GlobeWrapper from '@/components/landing/GlobeWrapper'

export const dynamic = 'force-dynamic'

async function getLiveCounts() {
  const [farmers, submissions] = await Promise.all([
    db.farmer.count(),
    db.submission.count(),
  ])
  return { farmers, submissions }
}

export default async function LandingPage() {
  const counts = await getLiveCounts()

  return (
    <main className="min-h-screen bg-primary-green text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 relative z-10">
        <div>
          <p className="text-accent-gold font-heading text-lg tracking-wide">AGRIPULSE</p>
          <p className="text-green-300 text-xs">BLISTT Agricultural Intelligence</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/mobile-wizard"
            className="text-xs px-3 py-1.5 rounded-full border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-green transition-colors font-semibold"
          >
            Farmer Portal
          </Link>
          <Link
            href="/dashboard"
            className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            LGU Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-6 text-center">
        {/* Three.js globe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-125 h-125 opacity-40 max-w-full">
            <GlobeWrapper />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-xl">
          <p className="text-accent-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            BLISTT Initiative — Cordillera, Philippines
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-white leading-tight mb-4">
            AgriPulse
            <span className="block text-accent-gold">System</span>
          </h1>
          <p className="text-green-300 text-lg mb-10 leading-relaxed">
            The Pulse of Predictive Farming
          </p>

          {/* Live stats */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-gold">{counts.farmers.toLocaleString()}</p>
              <p className="text-xs text-green-300 mt-1">Registered Farmers</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-gold">{counts.submissions.toLocaleString()}</p>
              <p className="text-xs text-green-300 mt-1">Data Submissions</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-gold">6</p>
              <p className="text-xs text-green-300 mt-1">BLISTT Municipalities</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mobile-wizard"
              className="bg-accent-gold hover:bg-[#d48f00] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              Submit Farm Data
            </Link>
            <Link
              href="/price-advisor"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              AI Price Advisor
            </Link>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="bg-green-900 border-t border-white/10 px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🌾', label: 'Farmer Registration', href: '/mobile-wizard', desc: 'Digital farm data submission in Tagalog' },
            { icon: '📊', label: 'LGU Dashboard', href: '/dashboard', desc: 'Real-time crop intelligence for officials' },
            { icon: '🏆', label: 'Leaderboard', href: '/leaderboard', desc: 'Incentivize farmers with points' },
            { icon: '🤖', label: 'AI Price Advisor', href: '/price-advisor', desc: 'Claude-powered farmgate price estimates' },
          ].map(({ icon, label, href, desc }) => (
            <Link
              key={label}
              href={href}
              className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all border border-transparent hover:border-accent-gold/30"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">{label}</p>
              <p className="text-xs text-green-300 mt-1 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <footer className="text-center py-5 text-xs text-[#4a6b35] border-t border-white/5">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
