'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🌾',
    label: 'Farmer Registration',
    href: '/mobile-wizard',
    desc: 'Digital farm data submission in Tagalog',
  },
  {
    icon: '📊',
    label: 'LGU Dashboard',
    href: '/dashboard',
    desc: 'Real-time crop intelligence for officials',
  },
  {
    icon: '🏆',
    label: 'Leaderboard',
    href: '/leaderboard',
    desc: 'Incentivize farmers with points',
  },
  {
    icon: '🤖',
    label: 'AI Price Advisor',
    href: '/price-advisor',
    desc: 'Claude-powered farmgate price estimates',
  },
]

export default function FeaturesSection() {
  return (
    <div className="bg-green-900 border-t border-white/10 px-6 py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map(({ icon, label, href, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            whileHover={{ scale: 1.05, y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            className="h-full"
            style={{ willChange: 'transform' }}
          >
            <Link
              href={href}
              className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-transparent hover:border-accent-gold/40 flex flex-col h-full transition-colors"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">
                {label}
              </p>
              <p className="text-xs text-green-300 mt-1 leading-relaxed">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
