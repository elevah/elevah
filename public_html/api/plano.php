<?php
// Elevah — pedido de plano a partir das calculadoras (/calculadoras).
require __DIR__ . '/_lib.php';
exigir_post();
$d = ['email'=>campo('email'), 'whatsapp'=>campo('whatsapp', 40), 'nome'=>campo('nome'), 'empresa'=>campo('empresa'),
      'ferramenta'=>campo('ferramenta', 80), 'modelo'=>campo('modelo', 20), 'prioridade'=>campo('prioridade', 10),
      'resumo'=>campo('resumo', 3000), 'dados'=>campo('dados', 1000)];
if (!filter_var($d['email'], FILTER_VALIDATE_EMAIL)) { http_response_code(422); responder(false, ['campo'=>'email']); }
$tag = $d['prioridade'] === 'alta' ? '[PRIORIDADE] ' : '';
$corpo = "Novo pedido de plano pelas calculadoras (elevah.tech/calculadoras)\n\nE-mail: {$d['email']}\nModelo: {$d['modelo']}\n\nResultado:\n{$d['resumo']}\n\nDados digitados: {$d['dados']}\n\nEnviado em " . date('d/m/Y H:i') . "\n";
$canais = salvar_lead('calculadora', $d, $tag . 'Plano das calculadoras — ' . $d['email'], $corpo);
if (!$canais) http_response_code(500);
responder((bool)$canais, ['canais'=>$canais]);
