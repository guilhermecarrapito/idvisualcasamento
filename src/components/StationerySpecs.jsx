const PIECES = [
  { key: 'invitation', label: 'Convite', icon: '✉' },
  { key: 'envelope', label: 'Envelope', icon: '📬' },
  { key: 'menu', label: 'Menu', icon: '🍽' },
  { key: 'tableCard', label: 'Cartão de Mesa', icon: '🪑' },
  { key: 'programCard', label: 'Roteiro da Cerimônia', icon: '📋' }
]

function PaperMockup({ piece, palette, coupleNames }) {
  const bg = palette?.[0]?.hex || '#FAF7F2'
  const accent = palette?.[2]?.hex || '#C4A882'
  const text = palette?.[4]?.hex || '#2C1A0E'

  const dims = piece.dimensions || '13cm × 18cm'
  const [wStr, hStr] = dims.replace(/cm/g, '').split('×').map(s => parseFloat(s.trim()))
  const ratio = (hStr || 18) / (wStr || 13)
  const width = 110
  const height = Math.round(width * ratio)

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        className="paper-mockup"
        style={{
          width,
          height,
          background: bg,
          border: `1px solid ${accent}30`
        }}
      >
        <div className="paper-inner">
          <div
            className="paper-monogram-mini"
            style={{ color: accent, fontFamily: 'Cormorant Garamond, serif' }}
          >
            ✦
          </div>
          <div
            className="paper-couple-mini"
            style={{ color: text, fontFamily: 'Cormorant Garamond, serif' }}
          >
            {coupleNames || 'Ana & Pedro'}
          </div>
          <div className="paper-date-mini" style={{ color: text }}>
            {dims}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StationerySpecs({ stationery, palette, coupleNames }) {
  return (
    <div className="stationery-grid">
      {PIECES.map(({ key, label, icon }) => {
        const piece = stationery?.[key]
        if (!piece) return null
        return (
          <div key={key} className="stationery-card">
            <div className="stationery-mockup">
              <PaperMockup piece={piece} palette={palette} coupleNames={coupleNames} />
            </div>
            <div className="stationery-meta">
              <div className="stationery-piece-name">{icon} {label}</div>
              {piece.dimensions && (
                <div className="stationery-dimensions">{piece.dimensions}</div>
              )}
              <div className="stationery-layout">{piece.layout}</div>
              {piece.colorUsage && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.72rem',
                  color: 'var(--primary-light)',
                  fontStyle: 'italic'
                }}>
                  {piece.colorUsage}
                </div>
              )}
              {piece.typographyUsage && (
                <div style={{
                  marginTop: '0.25rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  {piece.typographyUsage}
                </div>
              )}
              {piece.sealDescription && (
                <div style={{
                  marginTop: '0.25rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  Lacre: {piece.sealDescription}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
