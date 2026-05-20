import { useState } from 'react'

const BG_OPTIONS = ['#FFFFFF', '#FAF7F2', '#2C1A0E']

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

export default function GraphicElements({ graphicElements }) {
  const [bgs, setBgs] = useState(() => graphicElements.map(() => 0))

  const toggleBg = (i) => {
    setBgs(prev => prev.map((v, idx) => idx === i ? (v + 1) % BG_OPTIONS.length : v))
  }

  return (
    <div className="elements-grid">
      {graphicElements.map((el, i) => (
        <div key={i} className="element-card">
          <div
            className="element-preview"
            style={{ background: BG_OPTIONS[bgs[i]] }}
          >
            <div dangerouslySetInnerHTML={{ __html: el.svgCode }} />
          </div>
          <div className="element-info">
            <div className="element-name">{el.name}</div>
            <div className="element-desc">{el.description}</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-outline btn-sm"
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.68rem' }}
                onClick={() => downloadSVG(el.svgCode, `elemento-${i + 1}-${el.name.toLowerCase().replace(/\s+/g, '-')}.svg`)}
              >
                ↓ SVG
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.3rem 0.7rem', fontSize: '0.68rem' }}
                onClick={() => toggleBg(i)}
              >
                ◑ Fundo
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
