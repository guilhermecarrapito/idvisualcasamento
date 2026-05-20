import { useState } from 'react'
import Step1CoupleInfo from './components/Step1CoupleInfo'
import Step2StyleInput from './components/Step2StyleInput'
import Step3Generating from './components/Step3Generating'
import Step4Results from './components/Step4Results'
import StepIndicator from './components/StepIndicator'
import { generateIdentity } from './services/api'

export default function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [identity, setIdentity] = useState(null)
  const [error, setError] = useState(null)

  const handleStep1 = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(2)
  }

  const handleStep2 = async (data) => {
    const merged = { ...formData, ...data }
    setFormData(merged)
    setStep(3)
    setError(null)
    try {
      const result = await generateIdentity(merged)
      setIdentity(result)
      setStep(4)
    } catch (err) {
      setError(err.message)
      setStep(2)
    }
  }

  const handleRestart = () => {
    setStep(1)
    setFormData({})
    setIdentity(null)
    setError(null)
  }

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="header-ornament">✦</div>
        <h1 className="app-title">Identidade Visual</h1>
        <p className="app-subtitle">Criador de identidade visual para casamentos</p>
        <div className="header-ornament">✦</div>
      </header>

      {step < 4 && <StepIndicator current={step} total={3} />}

      <main className="app-main">
        {error && (
          <div className="error-banner">
            <p>Ocorreu um erro: {error}</p>
            <button onClick={() => setError(null)}>Tentar novamente</button>
          </div>
        )}

        {step === 1 && <Step1CoupleInfo onNext={handleStep1} />}
        {step === 2 && (
          <Step2StyleInput
            onNext={handleStep2}
            onBack={() => setStep(1)}
            initialData={formData}
          />
        )}
        {step === 3 && <Step3Generating />}
        {step === 4 && identity && (
          <Step4Results
            identity={identity}
            coupleNames={formData.coupleNames}
            weddingDate={formData.weddingDate}
            onRestart={handleRestart}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Gerado com inteligência artificial · Claude</p>
      </footer>
    </div>
  )
}
