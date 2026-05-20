import { useState, useEffect } from 'react'

const MESSAGES = [
  'Analisando suas referências...',
  'Harmonizando a paleta de cores...',
  'Escolhendo tipografias elegantes...',
  'Desenhando o monograma...',
  'Criando elementos florais...',
  'Desenvolvendo os grafismos...',
  'Aplicando à papelaria...',
  'Refinando os detalhes...',
  'Quase pronto...'
]

export default function Step3Generating() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="generating-screen">
      <svg
        className="generating-ornament"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="54" stroke="#E2D8CF" strokeWidth="1" />
        <circle cx="60" cy="60" r="44" stroke="#C4A882" strokeWidth="0.75" strokeDasharray="4 6" />
        <path
          d="M60 16 C60 16, 68 28, 60 36 C52 28, 60 16, 60 16"
          fill="#C4A882" opacity="0.7"
        />
        <path
          d="M60 104 C60 104, 68 92, 60 84 C52 92, 60 104, 60 104"
          fill="#C4A882" opacity="0.7"
        />
        <path
          d="M16 60 C16 60, 28 52, 36 60 C28 68, 16 60, 16 60"
          fill="#C4A882" opacity="0.7"
        />
        <path
          d="M104 60 C104 60, 92 52, 84 60 C92 68, 104 60, 104 60"
          fill="#C4A882" opacity="0.7"
        />
        <path
          d="M26 26 C26 26, 34 34, 28 42 C20 36, 26 26, 26 26"
          fill="#C4A882" opacity="0.5"
        />
        <path
          d="M94 26 C94 26, 86 34, 92 42 C100 36, 94 26, 94 26"
          fill="#C4A882" opacity="0.5"
        />
        <path
          d="M26 94 C26 94, 34 86, 28 78 C20 84, 26 94, 26 94"
          fill="#C4A882" opacity="0.5"
        />
        <path
          d="M94 94 C94 94, 86 86, 92 78 C100 84, 94 94, 94 94"
          fill="#C4A882" opacity="0.5"
        />
        <circle cx="60" cy="60" r="5" fill="#6B4F3A" opacity="0.6" />
        <circle cx="60" cy="60" r="2" fill="#6B4F3A" />
      </svg>

      <h2 className="generating-title">Criando sua identidade visual</h2>
      <p className="generating-message">{MESSAGES[msgIndex]}</p>

      <div className="generating-dots">
        <div className="generating-dot" />
        <div className="generating-dot" />
        <div className="generating-dot" />
      </div>

      <p style={{
        marginTop: '2rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
        maxWidth: '320px',
        textAlign: 'center',
        lineHeight: '1.8'
      }}>
        A inteligência artificial está criando paleta de cores,
        tipografia, monograma, grafismos e especificações de papelaria
        personalizados para vocês.
      </p>
    </div>
  )
}
