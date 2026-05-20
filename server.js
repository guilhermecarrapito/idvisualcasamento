import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import Anthropic from '@anthropic-ai/sdk'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.post('/api/generate', upload.array('images', 10), async (req, res) => {
  try {
    const { coupleNames, weddingDate, venueType, styleDescription, audioTranscript } = req.body
    const images = req.files || []

    const contentBlocks = []

    // Add reference images first (vision context)
    for (const img of images) {
      const mimeType = img.mimetype || 'image/jpeg'
      contentBlocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mimeType,
          data: img.buffer.toString('base64')
        }
      })
    }

    const prompt = `Crie uma identidade visual completa e sofisticada para o casamento com as seguintes informações:

Nomes do casal: ${coupleNames || 'Não informado'}
Data do casamento: ${weddingDate || 'Não informado'}
Tipo de cerimônia/venue: ${venueType || 'Não informado'}
Descrição de estilo e preferências: ${styleDescription || 'Não informado'}${audioTranscript ? `\nNotas de voz transcritas: ${audioTranscript}` : ''}${images.length > 0 ? `\n\n[${images.length} imagem(ns) de referência foram enviadas acima. Analise-as para extrair paleta de cores, estilos florais, tipografia e mood geral.]` : ''}

Responda SOMENTE com JSON válido, sem markdown, sem texto fora do JSON. Use exatamente esta estrutura:

{
  "styleName": "Nome poético do estilo (ex: 'Jardim Provençal', 'Minimalismo Dourado', 'Romance Botânico')",
  "styleDescription": "Parágrafo de 3-4 frases descrevendo a identidade visual, o mood, as sensações e a história que ela conta",
  "palette": [
    { "name": "Nome da cor em português", "hex": "#XXXXXX", "usage": "Função desta cor (ex: fundo principal, cor de texto, destaque floral)" },
    { "name": "Nome da cor em português", "hex": "#XXXXXX", "usage": "Função" },
    { "name": "Nome da cor em português", "hex": "#XXXXXX", "usage": "Função" },
    { "name": "Nome da cor em português", "hex": "#XXXXXX", "usage": "Função" },
    { "name": "Nome da cor em português", "hex": "#XXXXXX", "usage": "Função" }
  ],
  "typography": [
    { "googleFont": "Nome exato no Google Fonts", "role": "Títulos e nomes", "weight": "300", "style": "italic", "sampleText": "Ana & Pedro", "pairing": "Elegan e fluida para títulos românticos" },
    { "googleFont": "Nome exato no Google Fonts", "role": "Datas e subtítulos", "weight": "400", "style": "normal", "sampleText": "21 de Junho de 2026", "pairing": "Graciosa para informações secundárias" },
    { "googleFont": "Nome exato no Google Fonts", "role": "Corpo de texto", "weight": "300", "style": "normal", "sampleText": "Juntos para sempre, celebremos este momento único", "pairing": "Legível e refinada para textos corridos" }
  ],
  "monogram": {
    "initials": "Iniciais extraídas dos nomes (ex: A & P)",
    "description": "Descrição do estilo do monograma: traços, ornamentos, estilo visual",
    "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'>CÓDIGO SVG COMPLETO AQUI</svg>"
  },
  "graphicElements": [
    { "name": "Ramo Principal", "description": "Ramo floral principal para cabeçalho de convites", "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>SVG</svg>" },
    { "name": "Ornamento Central", "description": "Elemento decorativo central para separadores", "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'>SVG</svg>" },
    { "name": "Canto Decorativo", "description": "Elemento de canto para molduras de papelaria", "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>SVG</svg>" },
    { "name": "Folhagem Lateral", "description": "Ramo lateral para composições", "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 200'>SVG</svg>" },
    { "name": "Divisor Decorativo", "description": "Linha ornamentada para dividir seções", "svgCode": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 40'>SVG</svg>" }
  ],
  "stationery": {
    "invitation": {
      "layout": "Descrição completa do layout: posicionamento de elementos, hierarquia textual, uso dos grafismos",
      "dimensions": "13cm × 18cm",
      "colorUsage": "Como aplicar a paleta nesta peça",
      "typographyUsage": "Qual fonte para nomes, data, local, textos de apoio"
    },
    "envelope": {
      "layout": "Descrição do envelope: frente com monograma ou ramo, endereçamento, lacre",
      "sealDescription": "Elemento gráfico e cor para o lacre do envelope"
    },
    "menu": {
      "layout": "Descrição do menu: cabeçalho, entradas, pratos, sobremesa",
      "dimensions": "10cm × 21cm",
      "colorUsage": "Aplicação de cores"
    },
    "tableCard": {
      "layout": "Cartão de mesa: nome do convidado, número da mesa, elemento decorativo",
      "dimensions": "9cm × 6cm"
    },
    "programCard": {
      "layout": "Roteiro da cerimônia: capa com monograma, interior com programa",
      "dimensions": "10cm × 21cm"
    }
  },
  "applicationGuidelines": "Parágrafo com diretrizes de uso: combinações recomendadas de fontes e cores, margens e espaçamentos, o que evitar, como manter consistência em todos os materiais"
}

REGRAS PARA OS SVGs:
- Monograma (300×300): Iniciais do casal em tipografia caligráfica/serifada com peso 300-400, entrelaçadas ou lado a lado com ampersand, cercadas por elementos decorativos florais ou geométricos que harmonizem com o estilo. Linhas finas e delicadas. Use stroke sem fill para traços elegantes, ou fill sólido em cor da paleta. TODOS os atributos de estilo inline no SVG (não use style tags separadas).
- Elementos gráficos: Cada SVG deve ser único, detalhado e verdadeiramente decorativo. Use paths bezier suaves para flores, folhas e ornamentos. Stroke fino (0.5-1.5). Cores da paleta.
- Todos SVGs com fundo transparente (sem rect de fundo).
- ViewBox correto para o conteúdo de cada elemento.`

    contentBlocks.push({ type: 'text', text: prompt })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: 'Você é um designer de identidade visual especializado em casamentos de luxo no Brasil. Crie identidades visuais sofisticadas, elegantes e emocionalmente ressonantes. Seus SVGs são detalhados, artísticos e tecnicamente corretos. Responda sempre em JSON válido conforme solicitado.',
      messages: [{ role: 'user', content: contentBlocks }]
    })

    const rawText = message.content[0].text

    let identity
    try {
      identity = JSON.parse(rawText)
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        identity = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Não foi possível extrair JSON da resposta')
      }
    }

    res.json({ success: true, identity })
  } catch (err) {
    console.error('Generation error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
