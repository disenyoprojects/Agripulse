/**
 * Farmer "report your crop" phone mockup for landing surfaces. Presentational
 * only; content is prop-driven so it can be localized or restated per section.
 * On-brand per DESIGN.md: deep-green screen, gold submit pill, amber saturation
 * warning, DM Sans labels + Baloo 2 heading (no off-system serif).
 */

type FieldTone = 'default' | 'warning'

type PhoneField = {
  label: string
  value: string
  tone?: FieldTone
}

type CropReportPhoneProps = {
  greeting?: string
  title?: string
  fields?: PhoneField[]
  submitLabel?: string
  footnote?: string
}

const DEFAULT_FIELDS: PhoneField[] = [
  { label: 'Crop', value: 'Cabbage / Repolyo' },
  { label: 'Area planted', value: '0.5 hectares' },
  { label: 'Barangay', value: 'La Trinidad' },
  { label: 'Saturation right now', value: '⚠️ High — consider carrots', tone: 'warning' },
]

export default function CropReportPhone({
  greeting = 'Kumusta, Mang Delfin 👋',
  title = 'Report your crop',
  fields = DEFAULT_FIELDS,
  submitLabel = 'Submit — 30 seconds ⏱',
  footnote = 'Works offline · syncs when you have signal',
}: CropReportPhoneProps) {
  return (
    <div
      role="img"
      aria-label={`Farmer app preview: ${title}. ${fields
        .map((f) => `${f.label}: ${f.value}`)
        .join('. ')}. ${submitLabel}.`}
      style={{
        width: '100%',
        maxWidth: '340px',
        padding: '10px',
        borderRadius: '46px',
        background: '#0b120a',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(93,158,135,0.08)',
      }}
    >
      {/* Screen */}
      <div
        style={{
          position: 'relative',
          borderRadius: '38px',
          padding: '26px 22px 22px',
          overflow: 'hidden',
          background:
            'radial-gradient(ellipse 85% 40% at 50% -5%, rgba(93,158,135,0.20) 0%, transparent 60%),' +
            'linear-gradient(180deg, #17291a 0%, #101d0f 55%, #0c150a 100%)',
        }}
      >
        {/* Dynamic-island notch */}
        <div
          aria-hidden="true"
          style={{
            width: '100px',
            height: '26px',
            borderRadius: '999px',
            background: '#05080a',
            margin: '0 auto 22px',
          }}
        />

        <p
          style={{
            color: 'var(--accent-turquoise-light)',
            fontFamily: 'var(--font-ui), sans-serif',
            fontSize: '0.85rem',
            fontWeight: 600,
            margin: '0 0 2px',
          }}
        >
          {greeting}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-display, Baloo 2), sans-serif',
            fontSize: '1.6rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.01em',
            margin: '0 0 20px',
          }}
        >
          {title}
        </h3>

        <div>
          {fields.map((field) => (
            <div
              key={field.label}
              style={{
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '13px 16px',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-ui), sans-serif',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: '3px',
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-ui), sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: field.tone === 'warning' ? '#f4b942' : '#ffffff',
                }}
              >
                {field.value}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          tabIndex={-1}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '15px',
            border: 'none',
            borderRadius: '999px',
            cursor: 'default',
            fontFamily: 'var(--font-ui), sans-serif',
            fontWeight: 800,
            fontSize: '0.98rem',
            letterSpacing: '0.01em',
            color: '#231400',
            background: 'linear-gradient(180deg, #f6cf6a 0%, #e9b23c 100%)',
            boxShadow: '0 12px 26px -10px rgba(233,178,60,0.6)',
          }}
        >
          {submitLabel}
        </button>

        <p
          style={{
            textAlign: 'center',
            margin: '12px 0 0',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-ui), sans-serif',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {footnote}
        </p>
      </div>
    </div>
  )
}
