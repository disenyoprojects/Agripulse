interface Alert {
  icon: string
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
        icon: '🔴',
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Oversupply risk. Advise farmers to consider alternative crops.',
        type: 'critical' as const,
      }
    } else if (pct > 20) {
      return {
        icon: '🟡',
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Monitor closely. Market approaching balanced supply.',
        type: 'warning' as const,
      }
    } else {
      return {
        icon: '🟢',
        title: `${c.cropName} — ${pct}% Saturation`,
        description: 'Opportunity crop. Low supply — good time to plant.',
        type: 'success' as const,
      }
    }
  })

  if (alerts.length === 0) return null

  const borderColors = {
    critical: '#D32F2F',
    warning: '#FF6F00',
    success: '#2E7D32',
  }
  const bgColors = {
    critical: '#FFEBEE',
    warning: '#FFF3E0',
    success: '#E8F5E9',
  }

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      marginBottom: '30px',
      border: '3px solid #A8C686',
    }}>
      <h2 style={{
        fontFamily: 'Archivo Black, sans-serif',
        fontSize: '1.5rem',
        color: '#3E2723',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        ⚡ Crop Saturation Alerts
      </h2>
      {alerts.map((alert) => (
        <div
          key={alert.title}
          style={{
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontWeight: 600,
            background: bgColors[alert.type],
            borderLeft: `6px solid ${borderColors[alert.type]}`,
          }}
        >
          <span style={{ fontSize: '2rem', flexShrink: 0 }}>{alert.icon}</span>
          <div>
            <div style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{alert.title}</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, fontWeight: 400 }}>{alert.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
