import type { Variants, Transition } from 'framer-motion'

/**
 * Motion vocabulary for AgriPulse.
 *
 * Deliberately several *distinct* reveals rather than one shared
 * fade-up. A single entrance replayed on every section is what makes
 * a page read as generated; each section should pick the reveal that
 * suits what it is revealing.
 *
 * Every variant here animates only transform/opacity/filter, so
 * nothing triggers layout. Reduced-motion is handled globally in
 * globals.css and per-component via useReducedMotion().
 */

export const EASE = {
  outQuint: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const satisfies Record<string, [number, number, number, number]>

export const DURATION = {
  fast: 0.15,
  base: 0.24,
  slow: 0.42,
  brand: 0.76,
  brandLg: 1.15,
} as const

/** Shared viewport config — reveal once, slightly before full entry. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const

const t = (
  duration: number,
  ease: readonly [number, number, number, number] = EASE.outQuint,
  delay = 0,
): Transition => ({ duration, ease: [...ease] as [number, number, number, number], delay })

/**
 * Display type: rises from behind its own baseline. Pair with a
 * parent that has overflow:hidden on each line for the mask effect.
 */
export const riseVariants: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: t(DURATION.brand, EASE.outExpo) },
}

/** Rules and dividers: draw themselves along their own axis. */
export const drawVariants: Variants = {
  hidden: { scaleX: 0, transformOrigin: 'left' },
  visible: { scaleX: 1, transition: t(DURATION.brandLg, EASE.inOutQuart) },
}

/** Body copy: settles into focus. Blur reads as depth-of-field, not decoration. */
export const settleVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: t(DURATION.brand, EASE.outQuint),
  },
}

/** Data/figures: count-in feel — scales up from slightly compressed. */
export const meterVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0.72, transformOrigin: 'bottom' },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: t(DURATION.brand, EASE.outExpo),
  },
}

/** Panels entering from the side of the layout they belong to. */
export const slabVariants = (from: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: from === 'left' ? -36 : 36 },
  visible: { opacity: 1, x: 0, transition: t(DURATION.brand, EASE.outQuint) },
})

/**
 * Stagger container. Staggering items *within one list* is legitimate;
 * the tell is the same stagger on every section, so vary `each`.
 */
export const stagger = (each = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: each, delayChildren } },
})

/** Interactive feedback — product timings, not brand choreography. */
export const pressable = {
  whileHover: { y: -2 },
  whileTap: { y: 0, scale: 0.985 },
  transition: t(DURATION.base, EASE.outQuart),
} as const
