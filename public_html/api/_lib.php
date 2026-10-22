<?php
// Elevah — registro de leads. Um lead é considerado capturado se QUALQUER canal funcionar:
// 1) arquivo CSV no servidor (sempre), 2) e-mail, 3) Google Sheets (se configurado).
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$CFG = require __DIR__ . '/_config.php';

function campo($k, $max = 200) { return trim(mb_substr(strip_tags((string)($_POST[$k] ?? '')), 0, $max)); }
function responder($ok, $extra = []) { echo json_encode(array_merge(['ok' => (bool)$ok], $extra)); exit; }
function exigir_post() {
  if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); responder(false); }
  if (!empty($_POST['website'])) responder(true); // honeypot: robô
}

function salvar_lead($tipo, array $d, $assunto, $corpo) {
  global $CFG;
  $canais = [];
  // 1) CSV — pasta protegida por .htaccess
  $dir = __DIR__ . '/leads';
  if (!is_dir($dir)) @mkdir($dir, 0750, true);
  $arq = $dir . '/leads.csv';
  $novo = !file_exists($arq);
  $fh = @fopen($arq, 'a');
  if ($fh) {
    if ($novo) { fwrite($fh, "\xEF\xBB\xBF"); fputcsv($fh, ['data', 'origem', 'nome', 'email', 'whatsapp', 'empresa', 'detalhes'], ';'); }
    $det = $d; unset($det['nome'], $det['email'], $det['whatsapp'], $det['empresa']);
    $linha = [date('Y-m-d H:i'), $tipo, $d['nome'] ?? '', $d['email'] ?? '', $d['whatsapp'] ?? '', $d['empresa'] ?? '',
      implode(' | ', array_map(fn($k, $v) => "$k: " . str_replace(["\r", "\n"], ' / ', $v), array_keys($det), $det))];
    if (flock($fh, LOCK_EX)) { if (fputcsv($fh, $linha, ';') !== false) $canais[] = 'arquivo'; flock($fh, LOCK_UN); }
    fclose($fh);
  }
  // 2) e-mail
  $subj = '=?UTF-8?B?' . base64_encode($assunto) . '?=';
  $headers = "From: Site Elevah <{$CFG['de']}>\r\nReply-To: " . ($d['email'] ?? $CFG['de']) . "\r\nContent-Type: text/plain; charset=UTF-8\r\n";
  if (@mail($CFG['para'], $subj, $corpo, $headers, '-f' . $CFG['de'])) $canais[] = 'email';
  // 3) Google Sheets (opcional)
  if (!empty($CFG['webhook'])) {
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/json\r\n", 'timeout' => 6,
      'content' => json_encode(array_merge(['origem' => $tipo, 'data' => date('c')], $d), JSON_UNESCAPED_UNICODE)]]);
    if (@file_get_contents($CFG['webhook'], false, $ctx) !== false) $canais[] = 'planilha';
  }
  return $canais;
}
