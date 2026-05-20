import { useState } from 'react'

export default function Step1CoupleInfo({ onNext }) {
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venueType, setVenueType] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({
      coupleNames: `${partner1} & ${partner2}`,
      partner1,
      partner2,
      weddingDate,
      venueType
    })
  }

  const valid = partner1.trim() && partner2.trim()

  return (
    <div className="card">
      <h2 className="card-title">Sobre o casal</h2>
      <p className="card-lead">
        Vamos começar com as informações básicas. Esses dados serão usados para
        criar o monograma e personalizar toda a identidade visual.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="partner1">Nome — Noivo(a) 1</label>
            <input
              id="partner1"
              type="text"
              placeholder="Ex: Ana Clara"
              value={partner1}
              onChange={e => setPartner1(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="partner2">Nome — Noivo(a) 2</label>
            <input
              id="partner2"
              type="text"
              placeholder="Ex: Pedro Henrique"
              value={partner2}
              onChange={e => setPartner2(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Data do Casamento</label>
            <input
              id="date"
              type="date"
              value={weddingDate}
              onChange={e => setWeddingDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="venue">Tipo de Cerimônia / Espaço</label>
            <select
              id="venue"
              value={venueType}
              onChange={e => setVenueType(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option>Igreja + Salão de festas</option>
              <option>Fazenda / Campo</option>
              <option>Praia / Beira-mar</option>
              <option>Jardim / Ao ar livre</option>
              <option>Espaço urbano / Industrial</option>
              <option>Haras / Rancho</option>
              <option>Hotel / Resort</option>
              <option>Outro</option>
            </select>
          </div>
        </div>

        <div className="btn-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!valid}
          >
            Próximo →
          </button>
        </div>
      </form>
    </div>
  )
}
