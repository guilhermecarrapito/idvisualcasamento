import ColorPalette from './ColorPalette'
import FontShowcase from './FontShowcase'
import MonogramDisplay from './MonogramDisplay'
import GraphicElements from './GraphicElements'
import StationerySpecs from './StationerySpecs'

function SectionHeading({ children }) {
  return (
    <div className="section-heading">
      <h2>{children}</h2>
      <div className="section-rule" />
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const [y, m, d] = dateStr.split('-')
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ]
    return `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`
  } catch {
    return dateStr
  }
}

export default function Step4Results({ identity, coupleNames, weddingDate, onRestart }) {
  const downloadAllSVGs = () => {
    const items = []
    if (identity.monogram?.svgCode) {
      items.push({ content: identity.monogram.svgCode, name: 'monograma.svg' })
    }
    identity.graphicElements?.forEach((el, i) => {
      items.push({
        content: el.svgCode,
        name: `elemento-${i + 1}-${el.name.toLowerCase().replace(/\s+/g, '-')}.svg`
      })
    })

    items.forEach(({ content, name }, i) => {
      setTimeout(() => {
        const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, i * 300)
    })
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(identity, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'identidade-visual.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Hero */}
      <div className="results-hero">
        <p className="results-style-name">✦ {identity.styleName} ✦</p>
        <h2 className="results-couple">{coupleNames}</h2>
        {weddingDate && (
          <p className="results-date">{formatDate(weddingDate)}</p>
        )}
        {identity.styleDescription && (
          <p className="results-style-desc">{identity.styleDescription}</p>
        )}
      </div>

      {/* Palette */}
      {identity.palette?.length > 0 && (
        <div className="section-block">
          <SectionHeading>Paleta de Cores</SectionHeading>
          <ColorPalette palette={identity.palette} />
        </div>
      )}

      {/* Typography */}
      {identity.typography?.length > 0 && (
        <div className="section-block">
          <SectionHeading>Tipografia</SectionHeading>
          <FontShowcase typography={identity.typography} />
        </div>
      )}

      {/* Monogram */}
      {identity.monogram?.svgCode && (
        <div className="section-block">
          <SectionHeading>Monograma</SectionHeading>
          <MonogramDisplay monogram={identity.monogram} />
        </div>
      )}

      {/* Graphic Elements */}
      {identity.graphicElements?.length > 0 && (
        <div className="section-block">
          <SectionHeading>Elementos Gráficos</SectionHeading>
          <GraphicElements graphicElements={identity.graphicElements} />
        </div>
      )}

      {/* Stationery */}
      {identity.stationery && (
        <div className="section-block">
          <SectionHeading>Papelaria</SectionHeading>
          <StationerySpecs
            stationery={identity.stationery}
            palette={identity.palette}
            coupleNames={coupleNames}
          />
        </div>
      )}

      {/* Application Guidelines */}
      {identity.applicationGuidelines && (
        <div className="section-block">
          <SectionHeading>Diretrizes de Aplicação</SectionHeading>
          <div className="guidelines-card">
            <p>{identity.applicationGuidelines}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button className="btn btn-outline" onClick={downloadAllSVGs}>
          ↓ Baixar todos os SVGs
        </button>
        <button className="btn btn-ghost" onClick={downloadJSON}>
          ↓ Baixar JSON da identidade
        </button>
        <button className="btn btn-primary" onClick={onRestart}>
          ✦ Gerar nova identidade
        </button>
      </div>
    </div>
  )
}
