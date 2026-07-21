'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const MotionLink = motion(Link)
const spring = { type: 'spring', stiffness: 480, damping: 24 } as const

export default function NavLinks() {
  return (
    <div className="flex gap-2.5">
      <MotionLink
        href="/mobile-wizard"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className="btn btn-primary btn-sm"
      >
        Farmer Portal
      </MotionLink>
      <MotionLink
        href="/dashboard"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className="btn btn-sm text-white"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--accent-turquoise)',
        }}
      >
        LGU Dashboard
      </MotionLink>
    </div>
  )
}
