interface Props {
  label: string
  value: number
  highlight?: boolean
}

export default function StatsCard({ label, value, highlight = false }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e7e4d5]">
      <p className="text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-[#F4A300]' : 'text-[#2D5016]'}`}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}
