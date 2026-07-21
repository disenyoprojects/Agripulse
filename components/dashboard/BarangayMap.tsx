interface Props {
  barangays: { barangay: string; _count: { id: number } }[]
}

export default function BarangayMap({ barangays }: Props) {
  return (
    <div className="card p-7 mb-6">
      <h2 className="font-heading text-[1.3rem] text-[#243016] mb-5" style={{ letterSpacing: '-0.01em' }}>
        Barangay Participation
      </h2>

      {barangays.length === 0 ? (
        <p className="text-[#6b7360] text-[0.95rem]">No barangay data yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
          {barangays.map(({ barangay, _count }) => (
            <div
              key={barangay}
              className="barangay-tile"
              style={{
                background: '#fff',
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16,25,11,0.09)',
                textAlign: 'center',
                transition: 'transform var(--dur-base) var(--ease-out-quart), box-shadow var(--dur-base) var(--ease-out-quart), border-color var(--dur-base) var(--ease-out-quart)',
              }}
            >
              <div style={{ fontWeight: 600, color: '#243016', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                {barangay || 'Unknown'}
              </div>
              <div data-nums style={{
                fontSize: '1.9rem',
                fontFamily: 'var(--font-heading), sans-serif',
                color: 'var(--accent-turquoise-strong)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {_count.id}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#8a917e', marginTop: '0.3rem' }}>
                {_count.id === 1 ? 'farmer' : 'farmers'}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .barangay-tile:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-turquoise-200) !important;
        }
      `}</style>
    </div>
  )
}
