interface Props {
  barangays: { barangay: string; _count: { id: number } }[]
}

export default function BarangayMap({ barangays }: Props) {
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
        🗺️ Barangay Participation Map
      </h2>

      {barangays.length === 0 ? (
        <p style={{ color: '#666', fontSize: '0.95rem' }}>No barangay data yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
        }}>
          {barangays.map(({ barangay, _count }) => (
            <div
              key={barangay}
              style={{
                background: 'linear-gradient(135deg, #FAF6F0 0%, white 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #A8C686',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
            >
              <div style={{ fontWeight: 700, color: '#2D5016', marginBottom: '10px', fontSize: '0.9rem' }}>
                {barangay || 'Unknown'}
              </div>
              <div style={{
                fontSize: '2rem',
                fontFamily: 'Archivo Black, sans-serif',
                color: '#F4A300',
                lineHeight: 1,
              }}>
                {_count.id}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                {_count.id === 1 ? 'farmer' : 'farmers'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
