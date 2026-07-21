interface Alert {
  title: string
  description: string
  type: 'critical' | 'warning' | 'success'
}

interface Props {
  cropBreakdown: { cropName: string; _count: { cropName: number } }[]
  totalSubmissions: number
}

export default function AlertSection({ cropBreakdown, totalSubmissions }: Props) {
  const total = totalSubmissions || 1

  const alerts: Alert[] = cropBreakdown.slice(0, 6).map((c) => {
    const pct = Math.round((c._count.cropName / total) * 100)
    if (pct > 40) {
      return {
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Oversupply risk. Advise farmers to consider alternative crops.',
        type: 'critical' as const,
      }
    } else if (pct > 20) {
      return {
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Monitor closely. Market approaching balanced supply.',
        type: 'warning' as const,
      }
    } else {
      return {
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Opportunity crop. Low supply — good time to plant.',
        type: 'success' as const,
      }
    }
  })

  if (alerts.length === 0) return null

  const tone = {
    critical: { dot: '#D32F2F', bg: '#FDECEC', ring: 'rgba(211,47,47,0.18)' },
    warning: { dot: '#C15A00', bg: '#FDF3E7', ring: 'rgba(193,90,0,0.18)' },
    success: { dot: '#2E7D32', bg: '#EBF5EC', ring: 'rgba(46,125,50,0.18)' },
  }

  return (
    <div className="card p-7 mb-6">
      <h2 className="font-heading text-[1.3rem] text-[#243016] mb-5" style={{ letterSpacing: '-0.01em' }}>
        Crop Saturation Alerts
      </h2>
      <div className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const t = tone[alert.type]
          return (
            <div
              key={alert.title}
              className="flex items-start gap-3.5 rounded-2xl p-4"
              style={{ background: t.bg, border: `1px solid ${t.ring}` }}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: t.dot, boxShadow: `0 0 0 4px ${t.ring}` }}
              />
              <div>
                <div className="font-bold text-[#2a3320] text-[1rem]">{alert.title}</div>
                <div className="text-[0.875rem] text-[#5a5f52] mt-0.5">{alert.description}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
