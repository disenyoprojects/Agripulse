'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionLink = motion(Link)
const spring = { type: 'spring', stiffness: 500, damping: 22 } as const

export default function NavLinks() {
  return (
    <div className="flex gap-3">
      <MotionLink
        href="/mobile-wizard"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className="text-xs px-3 py-1.5 rounded-full border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-green transition-colors font-semibold"
      >
        Farmer Portal
      </MotionLink>
      <MotionLink
        href="/dashboard"
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
        className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        LGU Dashboard
      </MotionLink>
    </div>
  )
}
