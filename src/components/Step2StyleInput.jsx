import { useState, useRef, useEffect } from 'react'

export default function Step2StyleInput({ onNext, onBack, initialData }) {
  const [styleDescription, setStyleDescription] = useState(initialData?.styleDescription || '')
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [audioTranscript, setAudioTranscript] = useState(initialData?.audioTranscript || '')
  const [isRecording, setIsRecording] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [dragging, setDragging] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef(audioTranscript)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setSpeechSupported(false)
  }, [])

  const startRecording = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const recognition = new SR()
    recognition.lang = 'pt-BR'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (e) => {
      let interim = ''
      let final = finalTranscriptRef.current
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          final += t + ' '
          finalTranscriptRef.current = final
        } else {
          interim = t
        }
      }
      setAudioTranscript(final + interim)
    }

    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)

    recognition.start()
    recognitionRef.current = recognition
    setIsRecording(true)
  }

  const stopRecording = () => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }

  const toggleRecording = () => {
    if (isRecording) stopRecording()
    else startRecording()
  }

  const addImages = (files) => {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    const newImages = [...images, ...newFiles].slice(0, 10)
    setImages(newImages)
    const readers = newImages.map(file =>
      new Promise(resolve => {
        const r = new FileReader()
        r.onload = e => resolve(e.target.result)
        r.readAsDataURL(file)
      })
    )
    Promise.all(readers).then(setImagePreviews)
  }

  const removeImage = (i) => {
    const ni = images.filter((_, idx) => idx !== i)
    const np = imagePreviews.filter((_, idx) => idx !== i)
    setImages(ni)
    setImagePreviews(np)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addImages(e.dataTransfer.files)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ styleDescription, images, audioTranscript })
  }

  const valid = styleDescription.trim().length >= 20

  return (
    <div className="card">
      <h2 className="card-title">Estilo & Referências</h2>
      <p className="card-lead">
        Descreva o casamento dos seus sonhos — flores, cores, humor, referências que admira.
        Quanto mais detalhes, mais precisa será a identidade visual gerada.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Text Description */}
        <div className="form-group">
          <label htmlFor="style">Descreva o estilo do casamento</label>
          <textarea
            id="style"
            placeholder="Ex: Quero um casamento com mood romântico e provençal, com tons de rosa antigo, lavanda e verde-sálvia. Inspirado em jardins franceses, com muitas flores silvestres, peônias e ramos de eucalipto. Tipografia clássica e delicada, nada muito moderno. A cerimônia será num jardim ao pôr do sol..."
            value={styleDescription}
            onChange={e => setStyleDescription(e.target.value)}
            rows={6}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', textAlign: 'right' }}>
            {styleDescription.length} caracteres {styleDescription.length < 20 && '(mínimo 20)'}
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Imagens de referência (mood board, Pinterest, etc.)</label>
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => addImages(e.target.files)}
            />
            <div className="upload-icon">🖼</div>
            <p className="upload-label">
              <strong>Arraste imagens aqui</strong> ou clique para selecionar<br />
              <span>PNG, JPG, WEBP · Até 10 imagens · 20MB cada</span>
            </p>
          </div>
          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((src, i) => (
                <div key={i} className="image-preview-item">
                  <img src={src} alt="" />
                  <button type="button" onClick={() => removeImage(i)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Note */}
        <div className="audio-section">
          <div className="audio-section-title">Nota de voz (opcional)</div>
          <div className="audio-controls">
            {speechSupported ? (
              <>
                <button
                  type="button"
                  className={`btn-record ${isRecording ? 'recording' : ''}`}
                  onClick={toggleRecording}
                  title={isRecording ? 'Parar gravação' : 'Gravar nota de voz'}
                >
                  {isRecording ? '⏹' : '🎙'}
                </button>
                <div
                  className="transcript-box"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={e => {
                    finalTranscriptRef.current = e.target.innerText
                    setAudioTranscript(e.target.innerText)
                  }}
                >
                  {audioTranscript || (
                    <span className="transcript-placeholder">
                      {isRecording
                        ? 'Fale agora... a transcrição aparece aqui'
                        : 'Clique no microfone para gravar. Fale sobre as flores, cores, sentimentos, referências...'}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="form-group" style={{ flex: 1, margin: 0 }}>
                <textarea
                  placeholder="Seu navegador não suporta gravação de voz. Digite aqui suas notas adicionais..."
                  value={audioTranscript}
                  onChange={e => setAudioTranscript(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          {isRecording && (
            <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: '0.5rem', textAlign: 'center', letterSpacing: '0.05em' }}>
              ● Gravando — clique em ⏹ para encerrar
            </p>
          )}
        </div>

        <div className="btn-actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            ← Voltar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!valid}
          >
            Gerar Identidade Visual ✦
          </button>
        </div>
      </form>
    </div>
  )
}
