<?php
// Elevah — formulário "Conversa estratégica" (todas as páginas).
require __DIR__ . '/_lib.php';
exigir_post();
$d = ['nome'=>campo('nome'), 'empresa'=>campo('empresa'), 'cargo'=>campo('cargo'), 'whatsapp'=>campo('whatsapp', 40), 'email'=>campo('email'), 'site'=>campo('site')];
foreach ($d as $k => $v) if ($v === '') { http_response_code(422); responder(false, ['campo'=>$k]); }
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) { http_response_code(422); responder(false, ['campo'=>'email']); }
$d['interesse'] = campo('interesse', 120) ?: 'Conversa estratégica';
$d['pagina'] = campo('pagina', 120);
$d['resumo'] = campo('resumo', 3000);

$corpo = "Nova solicitação pelo site elevah.tech\n\n";
foreach (['interesse'=>'Interesse','nome'=>'Nome','empresa'=>'Empresa','cargo'=>'Cargo','whatsapp'=>'WhatsApp','email'=>'E-mail','site'=>'Site ou rede social','pagina'=>'Página'] as $k=>$l) $corpo .= "$l: {$d[$k]}\n";
if ($d['resumo'] !== '') $corpo .= "\nResultado das calculadoras:\n{$d['resumo']}\n";
$canais = salvar_lead('conversa', $d, $d['interesse'] . ' — ' . $d['empresa'], $corpo . "\nEnviado em " . date('d/m/Y H:i') . "\n");
if (!$canais) http_response_code(500);
responder((bool)$canais, ['canais'=>$canais]);
