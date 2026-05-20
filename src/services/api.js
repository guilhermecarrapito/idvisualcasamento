export async function generateIdentity(data) {
  const formData = new FormData()

  formData.append('coupleNames', data.coupleNames || '')
  formData.append('weddingDate', data.weddingDate || '')
  formData.append('venueType', data.venueType || '')
  formData.append('styleDescription', data.styleDescription || '')
  formData.append('audioTranscript', data.audioTranscript || '')

  if (data.images && data.images.length > 0) {
    for (const img of data.images) {
      formData.append('images', img)
    }
  }

  const res = await fetch('/api/generate', {
    method: 'POST',
    body: formData
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Erro ao gerar identidade visual')
  }

  return json.identity
}
