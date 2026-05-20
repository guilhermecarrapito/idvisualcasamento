import { useState } from 'react'

const BG_OPTIONS = [
  { color: '#FFFFFF', label: 'Branco' },
  { color: '#FAF7F2', label: 'Creme' },
  { color: '#2C1A0E', label: 'Escuro' },
  { color: '#C4A882', label: 'Dourado' }
]

function downloadSVG(svgCode, filename) {
  const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function MonogramDisplay({ monogram }) {
  const [bgIndex, setBgIndex] = useState(0)

  const bg = BG_OPTIONS[bgIndex]

  return (
    <div className="monogram-wrap">
      <div
        className="monogram-stage"
        style={{ background: bg.color }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: monogram.svgCode }}
          style={{ maxWidth: 280, maxHeight: 280 }}
        />
      </div>

      <div className="monogram-bg-controls">
        {BG_OPTIONS.map((opt, i) => (
          <button
            key={i}
            className={`bg-btn ${bgIndex === i ? 'active' : ''}`}
            style={{ background: opt.color }}
            onClick={() => setBgIndex(i)}
            title={`Fundo ${opt.label}`}
          />
        ))}
      </div>

      {monogram.description && (
        <p className="monogram-desc">{monogram.description}</p>
      )}

      <div className="monogram-actions">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => downloadSVG(monogram.svgCode, 'monograma.svg')}
        >
          Baixar SVG
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            const canvas = document.createElement('canvas')
            canvas.width = 600
            canvas.height = 600
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = bg.color
            ctx.fillRect(0, 0, 600, 600)
            const img = new Image()
            const blob = new Blob([monogram.svgCode], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            img.onload = () => {
              ctx.drawImage(img, 0, 0, 600, 600)
              URL.revokeObjectURL(url)
              const a = document.createElement('a')
              a.download = 'monograma.png'
              a.href = canvas.toDataURL('image/png')
              a.click()
            }
            img.src = url
          }}
        >
          Baixar PNG
        </button>
      </div>
    </div>
  )
}
