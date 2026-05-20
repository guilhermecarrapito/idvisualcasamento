import { useEffect } from 'react'

export default function FontShowcase({ typography }) {
  useEffect(() => {
    typography.forEach(({ googleFont, weight, style }) => {
      const fontFamily = googleFont.replace(/ /g, '+')
      const variant = style === 'italic'
        ? `ital,wght@1,${weight}`
        : `wght@${weight}`
      const href = `https://fonts.googleapis.com/css2?family=${fontFamily}:${variant}&display=swap`

      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
      }
    })
  }, [typography])

  const ALPHABET = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'
  const NUMBERS = '0 1 2 3 4 5 6 7 8 9'

  return (
    <div className="font-cards">
      {typography.map((font, i) => (
        <div key={i} className="font-card">
          <div className="font-meta">
            <div className="font-role-badge">{font.role}</div>
            <div className="font-name-label">{font.googleFont}</div>
            <div className="font-weight-label">
              Weight {font.weight} · {font.style === 'italic' ? 'Itálico' : 'Regular'}
            </div>
            <a
              className="font-link"
              href={`https://fonts.google.com/specimen/${font.googleFont.replace(/ /g, '+')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Fonts ↗
            </a>
          </div>

          <div>
            <div
              className="font-sample"
              style={{
                fontFamily: `'${font.googleFont}', serif`,
                fontWeight: font.weight,
                fontStyle: font.style
              }}
            >
              {font.sampleText}
            </div>
            <div
              className="font-alphabet"
              style={{
                fontFamily: `'${font.googleFont}', serif`,
                fontWeight: font.weight
              }}
            >
              {ALPHABET}<br />
              {NUMBERS}
            </div>
            {font.pairing && (
              <p style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic'
              }}>
                {font.pairing}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
