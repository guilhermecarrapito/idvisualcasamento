# 📸 Fotos do Casamento — Upload pelos Convidados

Ferramenta para o dia do casamento: os convidados escaneiam um **QR Code**,
abrem uma página com um texto de estímulo, selecionam fotos e vídeos que
tiraram no evento e tocam em **"Enviar foto(s) e/ou vídeo(s)"**. Os arquivos
caem direto numa pasta do **seu Google Drive**.

- Os convidados **não precisam de conta Google** nem de instalar nada.
- Funciona no navegador do celular (iPhone e Android).
- Suporta **vídeos grandes** (envio em pedaços, direto para o Drive).
- Totalmente gratuito: GitHub Pages + Google Apps Script.

## Como funciona

```
Convidado (celular)                Google Apps Script            Google Drive
       │  1. abre a página via QR         │                           │
       │  2. pede autorização de envio ──▶│  cria sessão de upload ──▶│
       │  ◀── recebe URL da sessão ───────│                           │
       │  3. envia o arquivo em pedaços ─────────────────────────────▶│
```

O navegador do convidado nunca tem acesso à sua conta — apenas a uma URL de
sessão válida para enviar aquele único arquivo para a pasta configurada.

## Configuração (uma vez só, ~15 minutos)

### 1. Criar a pasta no Google Drive

1. Crie uma pasta no seu Drive (ex.: `Fotos do Casamento`).
2. Abra a pasta e copie o **ID** dela na URL do navegador — é o trecho
   depois de `/folders/`:
   `https://drive.google.com/drive/folders/`**`1AbCdEfGhIjKlMnOpQrStUv`**
3. A pasta **não precisa ser pública** — o script grava nela com a sua
   permissão. Mantê-la privada é inclusive mais seguro.

### 2. Criar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com) → **Novo projeto**.
2. Apague o conteúdo do editor e cole o arquivo
   [`apps-script/Code.gs`](apps-script/Code.gs) deste repositório.
3. Na constante `FOLDER_ID`, cole o ID da pasta do passo 1.
4. Salve (ícone de disquete) e dê um nome ao projeto (ex.: `upload-casamento`).
5. Clique em **Implantar → Nova implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu** (sua conta)
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize o acesso quando solicitado (o Google mostrará um aviso de "app
   não verificado" — clique em *Avançado → Acessar (não seguro)*; é o seu
   próprio script, é seguro).
7. Copie a **URL do app da web** (termina em `/exec`).
8. Teste: abra essa URL no navegador — deve aparecer
   `{"ok":true,"service":"upload-casamento","folderConfigured":true}`.

> ⚠️ Se editar o `Code.gs` depois, é preciso **Implantar → Gerenciar
> implantações → editar → Nova versão** para a mudança valer na URL `/exec`.

### 3. Configurar a página

No arquivo [`index.html`](index.html), edite o bloco `CONFIG` no topo do
`<script>`:

```js
const CONFIG = {
  scriptUrl: 'https://script.google.com/macros/s/SEU_ID/exec', // URL do passo 2.7
  coupleNames: 'Guilherme & ...',                              // nomes do casal
  introText: '...',                                            // texto de estímulo
  maxFileSizeMB: 1024                                          // limite por arquivo
};
```

Faça commit e push da alteração.

### 4. Publicar no GitHub Pages

1. No GitHub, abra **Settings → Pages** do repositório.
2. Em *Source*, escolha **Deploy from a branch**, selecione a branch
   principal e a pasta `/ (root)`. Salve.
3. Em ~1 minuto a página fica disponível em
   `https://SEU_USUARIO.github.io/idvisualcasamento/`.
4. Abra no celular e faça um envio de teste — o arquivo deve aparecer na
   pasta do Drive.

### 5. Gerar e imprimir o QR Code

1. Abra `https://SEU_USUARIO.github.io/idvisualcasamento/qr.html`.
2. Confirme a URL da página de upload e clique em **Gerar QR Code**.
3. Imprima (Ctrl+P) — sai um cartão pronto com o QR e um convite para os
   convidados. Espalhe pelas mesas do evento. 🎉

## Perguntas frequentes

**Qual o limite de tamanho dos arquivos?**
O envio principal vai em pedaços direto para o Drive, então vídeos grandes
funcionam (o limite configurado é 1 GB por arquivo, ajustável no `CONFIG`).
O que conta é o espaço livre do **seu** Google Drive.

**E se muita gente enviar ao mesmo tempo?**
O Apps Script só é usado por ~1 segundo por arquivo (para criar a sessão);
o upload pesado vai direto para os servidores do Google. As cotas gratuitas
do Apps Script comportam tranquilamente um casamento.

**Os convidados veem as fotos uns dos outros?**
Não. A página só envia; a pasta do Drive continua privada, visível só para você.

**Posso personalizar textos e cores?**
Sim — textos no bloco `CONFIG` do `index.html`; cores nas variáveis CSS
(`:root`) no topo do mesmo arquivo.
