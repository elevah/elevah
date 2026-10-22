<?php
// Elevah — painel simples dos leads: https://elevah.tech/api/leads.php?chave=SUA_CHAVE  (CSV: &baixar=1)
$CFG = require __DIR__ . '/_config.php';
if (!hash_equals($CFG['chave'], (string)($_GET['chave'] ?? ''))) { http_response_code(403); exit('Acesso negado.'); }
$arq = __DIR__ . '/leads/leads.csv';
if (isset($_GET['baixar']) && file_exists($arq)) { header('Content-Type: text/csv; charset=utf-8'); header('Content-Disposition: attachment; filename="leads-elevah.csv"'); readfile($arq); exit; }
header('Content-Type: text/html; charset=utf-8');
$linhas = [];
if (($fh = @fopen($arq, 'r'))) { while (($r = fgetcsv($fh, 0, ';')) !== false) $linhas[] = $r; fclose($fh); }
$cab = $linhas ? array_shift($linhas) : [];
$linhas = array_reverse($linhas);
$h = fn($s) => htmlspecialchars(preg_replace('/^\xEF\xBB\xBF/', '', (string)$s), ENT_QUOTES, 'UTF-8');
?><!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Leads | Elevah</title>
<style>body{margin:0;font:15px/1.5 -apple-system,Inter,system-ui,sans-serif;background:#eef1f2;color:#15242c}main{max-width:1200px;margin:0 auto;padding:32px 20px}h1{font-weight:300;letter-spacing:-.03em}a{color:#2f6878}table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 0 0 1px rgba(21,36,44,.12)}th,td{padding:12px 14px;text-align:left;vertical-align:top;border-bottom:1px solid rgba(21,36,44,.08);font-size:14px}th{font-weight:500;color:#51616a;background:#f7f9f9}td.det{color:#51616a;font-size:13px;max-width:420px}.tag{display:inline-block;padding:2px 10px;border-radius:99px;background:rgba(47,104,120,.1);color:#2f6878;font-size:12px}</style></head>
<body><main><h1>Leads do site · <?= count($linhas) ?></h1><p><a href="?chave=<?= $h($_GET['chave']) ?>&baixar=1">Baixar planilha (CSV)</a></p>
<table><thead><tr><?php foreach ($cab as $c) echo '<th>' . $h($c) . '</th>'; ?></tr></thead><tbody>
<?php foreach ($linhas as $r) { echo '<tr>'; foreach ($r as $i => $c) echo $i === 1 ? '<td><span class="tag">' . $h($c) . '</span></td>' : '<td' . ($i === 6 ? ' class="det"' : '') . '>' . nl2br($h(str_replace(' | ', "\n", $c))) . '</td>'; echo '</tr>'; } ?>
<?php if (!$linhas) echo '<tr><td colspan="7">Nenhum lead ainda.</td></tr>'; ?>
</tbody></table></main></body></html>
