interface Props {
  label: string
  value: number | string
  highlight?: boolean
  icon?: string
}

export default function StatsCard({ label, value, highlight = false, icon }: Props) {
  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      border: '3px solid #A8C686',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '100px', height: '100px',
        background: 'radial-gradient(circle, rgba(168,198,134,0.2) 0%, transparent 70%)',
      }} />
      {icon && <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>}
      <div style={{
        fontFamily: 'Archivo Black, sans-serif',
        fontSize: '2.8rem',
        color: highlight ? '#F4A300' : '#2D5016',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div style={{ color: '#666', fontSize: '0.95rem', fontWeight: 600 }}>{label}</div>
    </div>
  )
}
