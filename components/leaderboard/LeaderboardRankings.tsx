'use client'

import { useMemo, useState } from 'react'

export type Ranking = {
  rank: number
  name: string
  municipality: string
  cropName: string
  hectares: number | null
  points: number
  submissions: number
}

function medal(rank: number): string | null {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

export default function LeaderboardRankings({ rankings }: { rankings: Ranking[] }) {
  const [selected, setSelected] = useState('All')

  const municipalities = useMemo(() => {
    const set = new Set(rankings.map((r) => r.municipality).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [rankings])

  const filtered = selected === 'All' ? rankings : rankings.filter((r) => r.municipality === selected)

  if (rankings.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
        <p className="text-5xl mb-4">🌱</p>
        <p>Walang datos pa. Mag-submit sa Farmer Portal!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Municipality filter chips — horizontally scrollable */}
      {municipalities.length > 2 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {municipalities.map((m) => {
            const active = selected === m
            return (
              <button
                key={m}
                onClick={() => setSelected(m)}
                className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors"
                style={{
                  background: active ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.07)',
                  color: active ? 'var(--on-turquoise)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${active ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.14)'}`,
                }}
                aria-pressed={active}
              >
                {m}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {filtered.map((r) => (
          <div
            key={r.rank}
            className="ranking-row flex items-center gap-4 rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.07)',
              transition: 'all var(--dur-base) var(--ease-out-quart)',
            }}
          >
            <div
              className="w-11 text-center font-heading text-[1.45rem] shrink-0"
              style={{
                color:
                  r.rank === 1 ? '#FFD700' : r.rank === 2 ? '#C0C0C0' : r.rank === 3 ? '#CD7F32' : 'rgba(255,255,255,0.45)',
                letterSpacing: '-0.02em',
              }}
            >
              {medal(r.rank) ?? `#${r.rank}`}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-[1.1rem] truncate">{r.name}</div>
              <div className="text-[0.82rem] mt-0.5 flex gap-3 flex-wrap" style={{ color: 'rgba(255,255,255,0.50)' }}>
                <span>📍 {r.municipality}</span>
                <span>🌾 {r.cropName}</span>
                {r.hectares && <span>📏 {r.hectares}ha</span>}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div
                data-nums
                className="font-heading"
                style={{ fontSize: '1.75rem', color: 'var(--color-accent-gold)', letterSpacing: '-0.02em', lineHeight: 1 }}
              >
                {r.points}
              </div>
              <div className="text-[0.68rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>POINTS</div>
              <div className="text-[0.78rem] mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
                {r.submissions} sub{r.submissions !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Walang magsasaka mula sa {selected}.
          </p>
        )}
      </div>
    </div>
  )
}
