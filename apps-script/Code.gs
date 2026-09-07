/**
 * Upload de fotos e vídeos do casamento para uma pasta do Google Drive.
 *
 * COMO USAR (resumo — passo a passo completo no README.md do repositório):
 *   1. Crie uma pasta no seu Google Drive e copie o ID dela (o trecho da URL
 *      depois de /folders/).
 *   2. Cole o ID na constante FOLDER_ID abaixo.
 *   3. Em script.google.com, crie um projeto, cole este arquivo e implante
 *      como "App da Web":
 *        - Executar como: EU (sua conta)
 *        - Quem pode acessar: QUALQUER PESSOA
 *   4. Copie a URL do app (termina em /exec) e cole no CONFIG.scriptUrl
 *      do index.html.
 *
 * Os convidados nunca acessam sua conta: o navegador deles só recebe uma
 * URL de sessão de upload válida para um único arquivo, criada por este
 * script com a sua permissão.
 */

var FOLDER_ID = 'COLE_AQUI_O_ID_DA_PASTA_DO_DRIVE';

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    if (req.action === 'initUpload') return initUpload_(req);
    if (req.action === 'directUpload') return directUpload_(req);
    return json_({ ok: false, error: 'Ação desconhecida' });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Verificação rápida: abra a URL /exec no navegador e deve aparecer {"ok":true,...}
function doGet() {
  return json_({ ok: true, service: 'upload-casamento', folderConfigured: FOLDER_ID.indexOf('COLE_AQUI') === -1 });
}

/**
 * Cria uma sessão de upload retomável na API do Drive e devolve a URL da
 * sessão. O navegador do convidado envia o arquivo em pedaços direto para
 * o Google, sem passar pelo limite de payload do Apps Script — por isso
 * vídeos grandes funcionam.
 */
function initUpload_(req) {
  var name = sanitizeName_(req.name);
  var res = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
    {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      payload: JSON.stringify({ name: name, parents: [FOLDER_ID] }),
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'X-Upload-Content-Type': String(req.mimeType || 'application/octet-stream'),
        'X-Upload-Content-Length': String(req.size || 0)
      },
      muteHttpExceptions: true
    }
  );
  if (res.getResponseCode() >= 300) {
    return json_({ ok: false, error: 'Falha ao iniciar upload: HTTP ' + res.getResponseCode() });
  }
  var headers = res.getAllHeaders();
  var uploadUrl = headers['Location'] || headers['location'];
  if (!uploadUrl) return json_({ ok: false, error: 'API do Drive não devolveu a URL de upload' });
  return json_({ ok: true, uploadUrl: uploadUrl });
}

/**
 * Caminho alternativo para arquivos pequenos (< ~30 MB): recebe o conteúdo
 * em base64 e grava direto na pasta. Usado pelo index.html apenas se o
 * envio retomável falhar.
 */
function directUpload_(req) {
  var bytes = Utilities.base64Decode(req.data);
  var blob = Utilities.newBlob(bytes, String(req.mimeType || 'application/octet-stream'), sanitizeName_(req.name));
  var file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
  return json_({ ok: true, id: file.getId() });
}

function sanitizeName_(name) {
  var clean = String(name || 'arquivo').replace(/[\\/:*?"<>|#]/g, '_').slice(0, 180);
  return clean || 'arquivo';
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
