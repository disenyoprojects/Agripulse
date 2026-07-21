'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import TerraceField from './TerraceField'
import { EASE, DURATION, riseVariants, settleVariants, drawVariants, stagger } from '@/lib/motion'

interface Props {
  counts: { farmers: number; submissions: number }
}

/** Headline is split by line so each can rise from behind its own baseline. */
const HEADLINE = ['Plant with the', 'valley — not', 'against it.']

export default function HeroSection({ counts }: Props) {
  const reduced = useReducedMotion()

  return (
    <section
      data-surface="dark"
      className="relative flex min-h-svh flex-col overflow-hidden bg-pine-950"
    >
      <TerraceField />

      {/* Cold dawn light bleeding in from the ridge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 78% 8%, color-mix(in oklab, var(--color-glacier-400) 12%, transparent) 0%, transparent 62%)',
        }}
      />

      <div className="relative flex flex-1 items-center px-[6vw] pt-28 pb-12">
        <motion.div
          variants={stagger(0.09, 0.15)}
          initial="hidden"
          animate="visible"
          className="w-full max-w-5xl"
        >
          <h1 className="u-display text-ink-inv text-display-xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  variants={reduced ? settleVariants : riseVariants}
                  /* Later lines lag slightly — the ridge settling. */
                  transition={{
                    duration: DURATION.brand,
                    ease: [...EASE.outExpo] as [number, number, number, number],
                    delay: 0.15 + i * 0.08,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.hr
            variants={drawVariants}
            className="u-rule my-7 w-full max-w-md"
          />

          <motion.p
            variants={settleVariants}
            className="u-measure text-pine-300 text-xl leading-relaxed sm:text-2xl"
            lang="tl"
          >
            Kapag alam ng lahat kung ano ang itatanim, walang presyong bumabagsak.
          </motion.p>

          <motion.p
            variants={settleVariants}
            className="u-measure text-ink-inv-muted mt-5 text-base leading-relaxed sm:text-lg"
          >
            Benguet farmers report what goes in the ground. Municipal
            agriculturists see oversupply forming weeks before it reaches the
            trading post — while there is still time to plant something else.
          </motion.p>

          <motion.div variants={settleVariants} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/mobile-wizard"
              className="bg-ember-500 text-pine-950 hover:bg-ember-400 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold tracking-tight transition-[background-color,transform] duration-[var(--duration-base)] ease-[var(--ease-out-quart)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Isumite ang tanim
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/dashboard"
              className="border-[var(--line-strong)] text-ink-inv hover:bg-ink-inv/8 hover:border-ink-inv/50 inline-flex items-center rounded-full border px-8 py-4 text-base font-semibold transition-colors duration-[var(--duration-base)]"
            >
              LGU dashboard
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Instrument strip: live survey readout, not a hero stat card.
          These are real database counts — the projected percentages live
          in the impact section where they can be qualified. */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DURATION.brand,
          ease: [...EASE.outQuint] as [number, number, number, number],
          delay: 0.9,
        }}
        className="relative border-t border-[var(--line)] px-[6vw] py-5"
      >
        <dl className="text-ink-inv-muted flex flex-wrap items-baseline gap-x-10 gap-y-3 text-sm">
          <div className="flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className="bg-ember-500 inline-block size-1.5 shrink-0 rounded-full"
            />
            <dt>Nagpaparehistrong magsasaka</dt>
            <dd className="text-ink-inv font-bold" data-nums>
              {counts.farmers.toLocaleString('en-PH')}
            </dd>
          </div>
          <div className="flex items-baseline gap-2.5">
            <dt>Naisumiteng tanim</dt>
            <dd className="text-ink-inv font-bold" data-nums>
              {counts.submissions.toLocaleString('en-PH')}
            </dd>
          </div>
          <div className="ml-auto hidden sm:block">
            <span className="u-wide">
              BLISTT · Baguio · La Trinidad · Itogon · Sablan · Tuba · Tublay
            </span>
          </div>
        </dl>
      </motion.div>
    </section>
  )
}
