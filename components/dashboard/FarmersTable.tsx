'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FarmerRowMenu from '@/components/dashboard/FarmerRowMenu'

type Status = 'PENDING' | 'APPROVED' | 'REJECTED'

export type FarmerRow = {
  id: string
  fullName: string
  status: Status
  barangay: string
  municipality: string
  totalSubmissions: number
  pending: number
  verified: number
  totalPoints: number
}

const STATUS_STYLE: Record<Status, { dot: string; text: string; bg: string; border: string; label: string }> = {
  PENDING:  { dot: '#FF6F00', text: '#C15A00', bg: '#FDF3E7', border: 'rgba(193,90,0,0.18)', label: 'Pending' },
  APPROVED: { dot: '#2E7D32', text: '#1e6b24', bg: '#EBF5EC', border: 'rgba(46,125,50,0.18)', label: 'Approved' },
  REJECTED: { dot: '#D32F2F', text: '#b52a2a', bg: '#FDECEC', border: 'rgba(211,47,47,0.18)', label: 'Rejected' },
}

type Filter = 'ALL' | Status

function StatusBadge({ status }: { status: Status }) {
  const st = STATUS_STYLE[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
      {st.label}
    </span>
  )
}

export default function FarmersTable({
  farmers,
  initialFilter = 'ALL',
}: {
  farmers: FarmerRow[]
  initialFilter?: Filter
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>(initialFilter)

  const counts = useMemo(
    () => ({
      ALL: farmers.length,
      PENDING: farmers.filter((f) => f.status === 'PENDING').length,
      APPROVED: farmers.filter((f) => f.status === 'APPROVED').length,
      REJECTED: farmers.filter((f) => f.status === 'REJECTED').length,
    }),
    [farmers]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return farmers.filter(
      (f) =>
        (filter === 'ALL' || f.status === filter) &&
        (q === '' || f.fullName.toLowerCase().includes(q))
    )
  }, [farmers, query, filter])

  const tabs: { key: Filter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'APPROVED', label: 'Approved' },
    { key: 'REJECTED', label: 'Rejected' },
  ]

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search farmers by name…"
          className="field-input w-full sm:max-w-sm"
          aria-label="Search farmers by name"
        />
        <div className="flex gap-2 flex-wrap">
          {tabs.map(({ key, label }) => {
            const active = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="text-sm font-semibold rounded-full px-3.5 py-1.5 transition-colors"
                style={{
                  background: active ? 'var(--accent-turquoise)' : '#fff',
                  color: active ? 'var(--on-turquoise)' : '#5a5f52',
                  border: `1px solid ${active ? 'var(--accent-turquoise)' : '#e6e2d6'}`,
                }}
                aria-pressed={active}
              >
                {label}
                <span className="ml-1.5 opacity-70" data-nums>{counts[key]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-[#6b7360]">No farmers match your filters.</div>
      ) : (
        <>
          {/* Mobile: tappable cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((f) => (
              <Link
                key={f.id}
                href={`/dashboard/farmers/${f.id}`}
                className="card card-interactive p-4 block no-underline"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-primary-green">{f.fullName}</span>
                  <StatusBadge status={f.status} />
                </div>
                <p className="text-[0.82rem] text-[#5a5f52] mt-1">
                  {f.barangay || '—'}, {f.municipality}
                </p>
                <p className="text-[0.82rem] text-[#8a917e] mt-1.5" data-nums>
                  {f.totalSubmissions} submission{f.totalSubmissions !== 1 ? 's' : ''} · {f.totalPoints} pts
                  {f.pending > 0 && <span className="text-[#C15A00] font-semibold"> · {f.pending} pending</span>}
                </p>
              </Link>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="card overflow-x-auto hidden md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Farmer', 'Status', 'Barangay', 'Municipality', 'Submissions', 'Pending', 'Verified', 'Points', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-[#6b7360] pt-6 pb-3 px-4 text-left font-bold text-xs uppercase tracking-wider border-b-2 border-[#e6e2d6]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id} className="border-b border-[#eeeae0] hover:bg-[#faf8f2] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-primary-green">{f.fullName}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={f.status} /></td>
                    <td className="py-3.5 px-4 text-[#5a5f52]">{f.barangay || '—'}</td>
                    <td className="py-3.5 px-4 text-[#5a5f52]">{f.municipality}</td>
                    <td className="py-3.5 px-4 text-[#5a5f52] text-center" data-nums>{f.totalSubmissions}</td>
                    <td className="py-3.5 px-4 text-center">
                      {f.pending > 0 ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#C15A00]">
                          <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: '#FF6F00' }} />
                          {f.pending}
                        </span>
                      ) : (
                        <span className="text-[#b0b8a6]">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#2E7D32]">
                        <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: '#2E7D32' }} />
                        {f.verified}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-accent-gold" data-nums>{f.totalPoints}</td>
                    <td className="py-3.5 px-4 text-right">
                      <FarmerRowMenu farmerId={f.id} farmerName={f.fullName} status={f.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
