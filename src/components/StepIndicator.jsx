const STEPS = ['Sobre o Casal', 'Estilo', 'Resultado']

export default function StepIndicator({ current, total }) {
  return (
    <div className="step-indicator">
      {STEPS.slice(0, total).map((label, i) => {
        const n = i + 1
        const isDone = current > n
        const isActive = current === n
        return (
          <div key={n} className="step-dot-wrap">
            <div className="step-item">
              <div className={`step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                {isDone ? '✓' : n}
              </div>
              <div className={`step-label ${isActive ? 'active' : ''}`}>{label}</div>
            </div>
            {i < total - 1 && <div className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
