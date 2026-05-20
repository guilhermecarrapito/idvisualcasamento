import { useState } from 'react'

export default function ColorPalette({ palette }) {
  const [copied, setCopied] = useState(null)

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex).catch(() => {})
    setCopied(hex)
    setTimeout(() => setCopied(null), 2000)
  }

  const textColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#2C1A0E' : '#FAF7F2'
  }

  return (
    <div>
      {/* Color strip */}
      <div className="palette-grid">
        {palette.map((c, i) => (
          <div
            key={i}
            className="palette-strip"
            style={{ background: c.hex }}
          />
        ))}
      </div>

      {/* Swatches */}
      <div className="palette-swatches">
        {palette.map((color, i) => (
          <div
            key={i}
            className="swatch-card"
            onClick={() => copyHex(color.hex)}
            title="Clique para copiar o código hex"
          >
            <div className="swatch-color" style={{ background: color.hex }}>
              <span
                className="swatch-hex-badge"
                style={{ color: textColor(color.hex) }}
              >
                {color.hex}
              </span>
            </div>
            <div className="swatch-info">
              <div className="swatch-name">{color.name}</div>
              <div className="swatch-usage">{color.usage}</div>
            </div>
          </div>
        ))}
      </div>

      {copied && (
        <div className="copied-toast">
          {copied} copiado!
        </div>
      )}
    </div>
  )
}
