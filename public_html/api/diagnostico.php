<?php
// Elevah — leads do Diagnóstico de Alavancas de Crescimento (/diagnostico).
require __DIR__ . '/_lib.php';
exigir_post();
$d = ['nome'=>campo('nome'), 'email'=>campo('email'), 'whatsapp'=>campo('whatsapp', 40), 'empresa'=>campo('empresa'), 'segmento'=>campo('segmento')];
foreach ($d as $k => $v) if ($v === '') { http_response_code(422); responder(false, ['campo'=>$k]); }
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) { http_response_code(422); responder(false, ['campo'=>'email']); }
$d['prioridade'] = campo('prioridade', 160);
$d['resultado'] = campo('resultado', 1000);
$d['respostas'] = campo('respostas', 4000);

$corpo  = "Novo diagnóstico respondido em elevah.tech/diagnostico — retornar em até 24 horas.\n\n";
foreach (['nome'=>'Nome','empresa'=>'Empresa','segmento'=>'Segmento','email'=>'E-mail','whatsapp'=>'WhatsApp','prioridade'=>'Pilar prioritário'] as $k=>$l) $corpo .= "$l: {$d[$k]}\n";
$corpo .= "\nResultado por pilar:\n{$d['resultado']}\n\nRespostas:\n{$d['respostas']}\n\nEnviado em " . date('d/m/Y H:i') . "\n";
$canais = salvar_lead('diagnostico', $d, 'Diagnóstico Elevah — ' . $d['empresa'] . ' (' . $d['prioridade'] . ')', $corpo);
if (!$canais) http_response_code(500);
responder((bool)$canais, ['canais'=>$canais]);
