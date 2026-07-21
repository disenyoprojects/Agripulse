'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🌾',
    label: 'Farmer Registration',
    href: '/mobile-wizard',
    desc: 'Digital farm data submission in Tagalog',
    soon: false,
  },
  {
    icon: '📊',
    label: 'LGU Dashboard',
    href: '/dashboard',
    desc: 'Real-time crop intelligence for officials',
    soon: false,
  },
  {
    icon: '🏆',
    label: 'Leaderboard',
    href: null,
    desc: 'Incentivize farmers with points',
    soon: true,
  },
  {
    icon: '🤖',
    label: 'AI Price Advisor',
    href: null,
    desc: 'Claude-powered farmgate price estimates',
    soon: true,
  },
]

export default function FeaturesSection() {
  return (
    <div className="bg-green-900 border-t border-white/10 px-6 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map(({ icon, label, href, desc, soon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            whileHover={soon ? {} : { y: -6 }}
            className="h-full"
            style={{ willChange: 'transform' }}
          >
            {href ? (
              <Link
                href={href}
                className="feature-card group flex flex-col h-full rounded-2xl p-5 transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.045)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-colors"
                  style={{ background: 'rgba(93,158,135,0.16)', border: '1px solid rgba(93,158,135,0.28)' }}
                >
                  {icon}
                </div>
                <p className="text-sm font-bold text-white transition-colors group-hover:text-accent-turquoise-light">
                  {label}
                </p>
                <p className="text-xs text-green-300 mt-1 leading-relaxed">{desc}</p>
              </Link>
            ) : (
              <div
                className="flex flex-col h-full rounded-2xl p-5 opacity-70 cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {icon}
                </div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-green-300 mt-1 leading-relaxed">{desc}</p>
                <span className="mt-3 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                  style={{ background: 'rgba(93,158,135,0.16)', color: 'var(--accent-turquoise-light)' }}
                >
                  Coming Soon
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <style>{`
        .feature-card:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: var(--accent-turquoise) !important;
          box-shadow: 0 18px 40px -16px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}
