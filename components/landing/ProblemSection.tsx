'use client'

import { motion } from 'framer-motion'

// Accent per problem — turquoise, gold, lime, earth greens, all from the brand
// ramp, held large enough to stay legible on the deep-green surface.
const problems = [
  {
    index: '01',
    color: '#8fbfa9', // turquoise-light
    title: 'Price crashes',
    description: 'When everyone plants cabbage, prices plummet to ₱5/kg. Farmers lose up to ₱35,000 a cycle to oversupply nobody saw coming.',
  },
  {
    index: '02',
    color: '#F4A300', // brand accent gold
    title: 'Shortage spikes',
    description: 'Few plant carrots, so prices soar to ₱120/kg. Urban communities face food insecurity and whiplash price volatility.',
  },
  {
    index: '03',
    color: '#D6E85C', // harvest lime
    title: 'Wasted produce',
    description: '20–30% of vegetables rot in the field, unsold. Lost income for the farmer, needless waste for everyone downstream.',
  },
  {
    index: '04',
    color: '#A8C686', // earth light-2
    title: 'Blind LGU planning',
    description: 'Agricultural offices hand out seed without knowing what is already in the ground — reacting to the crash instead of preventing it.',
  },
]

export default function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        padding: 'clamp(4.5rem, 8vw, 7.5rem) 5%',
        overflowX: 'clip',
        background:
          'radial-gradient(ellipse 68% 55% at 74% 4%, rgba(93,158,135,0.16) 0%, transparent 55%),' +
          'radial-gradient(ellipse 70% 55% at 22% 98%, rgba(214,232,92,0.07) 0%, transparent 55%),' +
          'linear-gradient(160deg, #123510 0%, #1C4015 45%, #437628 100%)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: '620px', marginBottom: '3.5rem' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-heading), sans-serif',
            textTransform: 'uppercase',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: '#F8F7F2',
            margin: '0 0 1.25rem',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}>
            Farmers are planting blind
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0 }}>
            Without real-time crop intelligence, whole communities ride the same
            boom-and-bust cycle — oversupply crashes and shortage spikes that quietly
            drain farmer livelihoods.
          </p>
        </motion.div>

        <div className="problem-list">
          {problems.map((p, i) => (
            <motion.div
              key={p.index}
              className="problem-row"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="problem-head">
                <span data-nums style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                  lineHeight: 0.9,
                  color: p.color,
                  letterSpacing: '-0.03em',
                }}>
                  {p.index}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                  color: '#F8F7F2',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}>
                  {p.title}
                </h3>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.74)',
                lineHeight: 1.7,
                margin: 0,
                fontSize: '1.05rem',
                maxWidth: '54ch',
              }}>
                {p.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .problem-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          padding: 2rem 0;
          border-top: 1px solid rgba(255,255,255,0.13);
        }
        .problem-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.13); }
        .problem-head {
          display: flex;
          align-items: baseline;
          gap: 1.1rem;
        }
        @media (min-width: 860px) {
          .problem-row {
            grid-template-columns: minmax(260px, 0.85fr) 1.4fr;
            gap: 3rem;
            align-items: baseline;
          }
        }
      `}</style>
    </section>
  )
}
