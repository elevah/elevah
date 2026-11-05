/* Elevah · Sistema Editorial — base estratégica e dados iniciais.
   Fonte de verdade: "Elevah: entregas, valor e preço por perfil" (04/11/2026).
   Tudo que é exemplo ilustrativo ou dado de demonstração está marcado. */

window.ELEVAH = (function () {

  /* ------------------------------------------------------------------ */
  /* 1. Posicionamento                                                    */
  /* ------------------------------------------------------------------ */
  const positioning = {
    category: 'Inteligência de gestão orientada a resultado',
    categoryWhy: 'Não disputar como "mais um BI", ERP ou sistema de nicho. A categoria que deixa os pontos fortes evidentes (Dunford) é a de quem mostra o resultado antes do fechamento e transforma o dado em ação com valor em R$. Os perfis (clínica, farmácia, loja, agência…) são aplicações da mesma lógica, não marcas diferentes.',
    promise: 'Ver antes. Saber o impacto. Agir.',
    statement: 'A Elevah mostra para onde o resultado do seu negócio vai antes do fim do mês, quanto cada desvio vale em reais e qual ação tomar, com a lista de quem acionar.',
    layers: [
      { k: 'Posicionamento central', v: 'Inteligência de gestão que antecipa o resultado e indica a próxima ação com impacto em R$. Uma marca, uma lógica, todos os perfis.' },
      { k: 'Proposta de valor das soluções', v: 'Efetivo (o que aconteceu) → Vigente (o que está acontecendo) → Projeção (onde vai parar) → Ação (o que fazer e para quem). A IA lê os dados, explica o desvio e prioriza; nunca cria número.' },
      { k: 'Adaptações por perfil', v: 'Sistema único (Gestão, Pet), camada sobre o sistema atual (Farmácia, Lojista, Contabilidade), gestão + portal (Agência, Profissional). Muda o papel; a lógica é a mesma.' },
      { k: 'Comunicação contextual', v: 'Segmentos aparecem como exemplos, casos e campanhas dirigidas, sempre ligados a uma necessidade compartilhada (previsibilidade, margem, recorrência, atribuição).' }
    ],
    functional: [
      'Projeção do mês com o efeito de cada desvio (falta de profissional, estoque vencendo, agenda vazia)',
      'Ações ordenadas por valor em R$, com a lista pronta de clientes ou itens',
      'Origem de cada cliente e custo por canal, até a venda',
      'Margem real por item e por canal',
      'Acesso para toda a equipe, cada um vendo o próprio número, sem custo por usuário',
      'Funciona como sistema único ou por cima do sistema que o negócio já usa'
    ],
    financial: [
      'Receita recuperada da base de clientes fora do ciclo de retorno',
      'Perda evitada em estoque que venceria ou ficaria parado',
      'Verba de anúncio movida para o canal que traz cliente, não só lead',
      'Margem protegida contra desconto e canal deficitário',
      'Menos ferramentas avulsas para pagar e conferir'
    ],
    emotional: [
      'Controle: não descobrir o problema no dia 30',
      'Segurança para decidir com número na mão',
      'Equipe alinhada sem microgestão',
      'Tempo de volta: o que ia para planilha vira ação'
    ],
    differentials: [
      { t: 'Forecast com impacto do desvio', d: 'Não só quanto vai faturar, mas quanto custa cada imprevisto e o que fazer antes que aconteça.' },
      { t: 'Ação priorizada em R$', d: 'A tela chega com o número, o motivo, a lista e o impacto estimado se a ação for feita ou não.' },
      { t: 'IA que não inventa número', d: 'Lê os dados do negócio, explica e prioriza. Princípio fixo que sustenta confiança.' },
      { t: 'Visão de ponta a ponta', d: 'Conteúdo → lead → venda → recompra no mesmo lugar (RevOps). Marketing, venda e caixa contando a mesma história.' },
      { t: 'Voz do cliente ligada à receita', d: 'Qual reclamação custa dinheiro, não só a nota média.' }
    ],
    readyToday: ['Forecast', 'Origem do cliente (Hubla)', 'Link de agendamento', 'Margem por item'],
    risks: [
      { t: 'Prometer o que ainda está em construção', d: 'Vários módulos estão em construção. Conteúdo de produto mostra só o que sustenta venda hoje (forecast, origem, agendamento, margem). O restante aparece como visão e método, nunca como demonstração.', lvl: 'alto' },
      { t: 'Virar "mais um dashboard"', d: 'Se a comunicação falar de gráficos, a Elevah é comparada a BI barato. Falar sempre da decisão e da ação, com o valor em R$.', lvl: 'alto' },
      { t: 'Fragmentar a marca por nicho', d: 'Sete perfis falando sete línguas diluem a lembrança. Segmento entra como exemplo de um problema comum, não como identidade.', lvl: 'alto' },
      { t: 'IA como argumento vazio', d: 'Todo concorrente diz "com IA". A diferença é o que a IA não faz: não cria número.', lvl: 'médio' },
      { t: 'Parecer consultoria genérica', d: 'Dicas de gestão sem conta, sem dado e sem ângulo próprio. Cada pauta precisa de um número, uma conta ou uma tese defensável.', lvl: 'médio' },
      { t: 'Comparação de preço com sistemas de nicho', d: 'O preço sugerido é hipótese e fica acima de sistemas de clínica e pet. Conteúdo de preço só depois de validação comercial.', lvl: 'médio' }
    ]
  };

  /* ------------------------------------------------------------------ */
  /* 2. Associações mentais                                               */
  /* ------------------------------------------------------------------ */
  const associations = [
    { id: 'antecipacao', name: 'Antecipação', short: 'Ver antes',
      message: 'O resultado do mês se decide antes do dia 30.',
      themes: ['Forecast e ritmo × meta', 'Desvios e imprevistos', 'Sazonalidade', 'Metas diárias'],
      proofs: ['Tela de forecast (pronta)', 'Exemplos de projeção com conta aberta', 'Caso antes/depois quando houver cliente real'],
      types: ['analise', 'educativo', 'demonstracao', 'identificacao'], priority: 'alta' },
    { id: 'impacto', name: 'Impacto em R$', short: 'Todo problema tem um tamanho',
      message: 'Todo problema de gestão tem um valor em reais. Quem sabe o valor, decide primeiro.',
      themes: ['Margem real', 'Estoque parado e vencendo', 'Custo da hora vazia', 'Custo do cliente que não volta'],
      proofs: ['Contas abertas e verificáveis', 'Margem por item (pronta)', 'Exemplos ilustrativos sinalizados'],
      types: ['analise', 'mito', 'comparativo', 'educativo'], priority: 'alta' },
    { id: 'acao', name: 'Da análise à ação', short: 'Dado que vira ação',
      message: 'Dado que não vira ação é custo. A Elevah entrega a ação pronta e a lista de quem acionar.',
      themes: ['Listas acionáveis', 'Priorização por valor', 'Campanha para a base certa', 'Rotina do dono'],
      proofs: ['Fluxo detecção → lista → envio → resultado', 'Link de agendamento (pronto)', 'Resultado medido depois'],
      types: ['demonstracao', 'educativo', 'historia', 'ferramenta'], priority: 'media' },
    { id: 'integrada', name: 'Visão integrada', short: 'A mesma história',
      message: 'Marketing, venda, operação e caixa são a mesma história contada por números diferentes.',
      themes: ['Origem → venda → recompra', 'CAC e LTV', 'Vazamentos de receita', 'Uma ferramenta em vez de cinco'],
      proofs: ['Origem do cliente via Hubla (pronta)', 'Funil de receita em R$', 'Comparativo da pilha avulsa'],
      types: ['analise', 'comparativo', 'educativo'], priority: 'media' },
    { id: 'rigor', name: 'Rigor e confiança', short: 'A IA não cria número',
      message: 'Decisão boa começa com número confiável. A IA da Elevah lê, explica e prioriza; nunca inventa.',
      themes: ['IA aplicada sem hype', 'Métricas de vaidade', 'Leitura correta de pesquisas', 'Transparência do que está pronto'],
      proofs: ['Princípio fixo publicado', 'Fontes sempre citadas', 'Mapa de entregas aberto'],
      types: ['opiniao', 'mito', 'bastidores', 'pesquisa'], priority: 'media' },
    { id: 'base', name: 'Crescimento pela base', short: 'O cliente que você já tem',
      message: 'O crescimento mais barato está no cliente que já compra de você e ninguém chamou de volta.',
      themes: ['Fora do ciclo de retorno', 'Recompra e uso contínuo', 'Velocidade de resposta', 'Voz do cliente'],
      proofs: ['Lista de fora do ciclo com valor', 'Estudos sobre lembretes e tempo de resposta', 'Resultado de campanha medido'],
      types: ['pesquisa', 'identificacao', 'historia', 'educativo'], priority: 'alta' }
  ];

  /* Situações de lembrança (category entry points — Romaniuk) */
  const entryPoints = [
    { s: 'Estou na metade do mês e não sei se vou bater a meta', assoc: 'antecipacao', pillar: 'p1', who: 'dono' },
    { s: 'O faturamento caiu e eu não sei exatamente por quê', assoc: 'antecipacao', pillar: 'p1', who: 'dono' },
    { s: 'Vendo bastante, mas sobra pouco no fim do mês', assoc: 'impacto', pillar: 'p2', who: 'financeiro' },
    { s: 'Tenho estoque parado ou perto de vencer', assoc: 'impacto', pillar: 'p2', who: 'ops' },
    { s: 'Um profissional vai faltar ou sair de férias', assoc: 'antecipacao', pillar: 'p1', who: 'gestor' },
    { s: 'Clientes antigos sumiram e ninguém percebeu', assoc: 'base', pillar: 'p3', who: 'dono' },
    { s: 'A agenda tem horários vazios toda semana', assoc: 'acao', pillar: 'p2', who: 'gestor' },
    { s: 'Invisto em anúncio e não sei o que volta em venda', assoc: 'integrada', pillar: 'p4', who: 'mkt' },
    { s: 'Uso cinco ferramentas que não conversam', assoc: 'integrada', pillar: 'p6', who: 'dono' },
    { s: 'Preciso dar uma meta individual para a equipe', assoc: 'acao', pillar: 'p6', who: 'gestor' },
    { s: 'Vou definir preço ou política de desconto', assoc: 'impacto', pillar: 'p2', who: 'financeiro' },
    { s: 'Preciso provar resultado para o meu cliente (agência ou contador)', assoc: 'integrada', pillar: 'p4', who: 'parceiro' },
    { s: 'Estou planejando o próximo mês ou o próximo ano', assoc: 'antecipacao', pillar: 'p1', who: 'dono' },
    { s: 'Ouvi falar de IA na gestão e não sei se confio', assoc: 'rigor', pillar: 'p5', who: 'dono' }
  ];

  /* ------------------------------------------------------------------ */
  /* 3. Dimensões de classificação (independentes entre si)              */
  /* ------------------------------------------------------------------ */
  const stages = [
    { id: 'descoberta', name: 'Descoberta', color: 'var(--st-desc)', fn: 'Alcançar quem ainda não conhece a Elevah e criar memória de marca.', action: 'Ver, parar, lembrar, seguir.',
      metrics: ['Alcance', 'Visualizações', '% de não seguidores', 'Visitas ao perfil', 'Novos seguidores'] },
    { id: 'interesse', name: 'Interesse', color: 'var(--st-int)', fn: 'Aprofundar a atenção de quem já viu: utilidade que se salva e se compartilha.', action: 'Salvar, compartilhar, comentar.',
      metrics: ['Salvamentos', 'Compartilhamentos', 'Comentários', 'Taxa de engajamento'] },
    { id: 'consideracao', name: 'Consideração', color: 'var(--st-con)', fn: 'Construir preferência: competência, método e prova.', action: 'Visitar o site, ler até o fim, perguntar.',
      metrics: ['Visitas ao perfil e site', 'Cliques', 'Tempo/consumo', 'Pedidos de informação'] },
    { id: 'conversao', name: 'Conversão', color: 'var(--st-cv)', fn: 'Facilitar a intenção comercial: convite claro, objeções respondidas.', action: 'Pedir diagnóstico, conversar, agendar.',
      metrics: ['Leads', 'Conversas comerciais', 'Oportunidades', 'Receita atribuível (com rastreio)'] },
    { id: 'relacionamento', name: 'Relacionamento', color: 'var(--st-rel)', fn: 'Manter relevância para quem já segue ou é cliente; estimular recomendação.', action: 'Voltar, responder, indicar.',
      metrics: ['Interações recorrentes', 'Respostas', 'Indicações'] }
  ];

  const objectives = [
    { id: 'audiencia', name: 'Crescimento de audiência', stage: 'descoberta' },
    { id: 'engajamento', name: 'Engajamento qualificado', stage: 'interesse' },
    { id: 'educacao', name: 'Educação de mercado', stage: 'interesse' },
    { id: 'posicionamento', name: 'Reforço de posicionamento', stage: 'descoberta' },
    { id: 'autoridade', name: 'Construção de autoridade', stage: 'consideracao' },
    { id: 'demanda', name: 'Geração de demanda', stage: 'consideracao' },
    { id: 'leads', name: 'Geração de leads', stage: 'conversao' },
    { id: 'conversao', name: 'Conversão', stage: 'conversao' },
    { id: 'relacionamento', name: 'Relacionamento', stage: 'relacionamento' },
    { id: 'fidelizacao', name: 'Fidelização', stage: 'relacionamento' }
  ];

  const channels = [
    { id: 'ig', name: 'Instagram', short: 'IG' },
    { id: 'li', name: 'LinkedIn', short: 'IN' }
  ];

  const formats = [
    { id: 'reels', name: 'Reels / vídeo curto', ch: ['ig'], effort: 3, spec: '30–60 s, gancho nos 2 primeiros segundos, legenda na tela, 1 ideia.', good: 'Descoberta e identificação; alcance de não seguidores.', care: 'Exige roteiro curto e captação. Não usar como padrão para tudo só por alcance.' },
    { id: 'carrossel', name: 'Carrossel', ch: ['ig'], effort: 2, spec: '7–10 lâminas, 1 ideia por lâmina, capa com promessa clara, última lâmina com síntese.', good: 'Interesse e consideração: conteúdo que se salva.', care: 'Texto demais por lâmina derruba leitura.' },
    { id: 'imagem', name: 'Imagem única', ch: ['ig', 'li'], effort: 1, spec: 'Um número ou uma frase, fonte citada, legenda com contexto.', good: 'Dados que importam, frases de posicionamento.', care: 'Precisa de um dado forte; sem ele, some no feed.' },
    { id: 'stories', name: 'Stories', ch: ['ig'], effort: 1, spec: '3–6 telas, enquete ou caixa de pergunta, link quando houver.', good: 'Relacionamento, bastidores, chamada leve para conversão.', care: 'Efêmero: não usar para conteúdo de referência.' },
    { id: 'texto', name: 'Post em texto', ch: ['li'], effort: 1, spec: '900–1.300 caracteres, primeira linha como gancho, parágrafos curtos.', good: 'Tese, opinião, análise curta, bastidores.', care: 'Sem tese clara vira desabafo genérico.' },
    { id: 'documento', name: 'Carrossel PDF (documento)', ch: ['li'], effort: 2, spec: '8–12 páginas verticais, um gráfico ou conta por página.', good: 'Raio-X de pesquisa, métodos, frameworks.', care: 'Adaptar do carrossel do Instagram, não copiar.' },
    { id: 'artigo', name: 'Artigo / newsletter', ch: ['li'], effort: 3, spec: '800–1.500 palavras, subtítulos, fonte e conta abertas.', good: 'Autoridade e consideração; base para reaproveitamento.', care: 'Alto esforço; 1 a 2 por mês no início.' },
    { id: 'video', name: 'Vídeo demonstrativo', ch: ['ig', 'li'], effort: 3, spec: '45–90 s de tela real, narração do problema → tela → resultado.', good: 'Consideração e conversão com recurso pronto.', care: 'Só com funcionalidade publicada (forecast, origem, agendamento, margem).' }
  ];

  const roles = [
    { id: 'dono', name: 'Dono ou sócio', pains: 'Descobre o resultado tarde; abre várias ferramentas; não sabe onde está o dinheiro em risco.', wants: 'Controle, previsibilidade, saber o que fazer primeiro.' },
    { id: 'gestor', name: 'Gestor ou gerente', pains: 'Agenda, equipe e metas espalhadas; imprevistos sem plano B.', wants: 'Equipe no mesmo número, rotina organizada.' },
    { id: 'financeiro', name: 'Responsável financeiro', pains: 'Margem que some, desconto sem controle, caixa apertado sem aviso.', wants: 'Resultado real antes do contador, caixa projetado.' },
    { id: 'mkt', name: 'Marketing e vendas', pains: 'Não liga conteúdo e anúncio a venda; métrica de curtida.', wants: 'Saber o que traz cliente e quanto custa.' },
    { id: 'ops', name: 'Operações e compras', pains: 'Ruptura e estoque parado ao mesmo tempo; produto vencendo.', wants: 'Comprar menos, faltar menos.' },
    { id: 'autonomo', name: 'Profissional autônomo', pains: 'Faz tudo sozinho; não sabe qual post ou anúncio vende.', wants: 'Origem da venda, renovação, mês previsível.' },
    { id: 'parceiro', name: 'Agência ou contador', pains: 'Cliente não percebe valor; retrabalho; prova de resultado.', wants: 'Relatório com venda, serviço consultivo cobrado.' }
  ];

  const profiles = [
    { id: 'gestao', name: 'Gestão', who: 'Clínicas e negócios de serviço com equipe', role: 'Sistema único da clínica', hook: 'Profissional de férias, agenda vazia, paciente em tratamento sem retorno marcado.', price: 'R$ 1.900 sem prontuário · R$ 2.500 com' },
    { id: 'farmacia', name: 'Farmácia', who: 'Drogarias independentes', role: 'Camada sobre o ERP (ou ERP + PDV da loja)', hook: 'Validade × clientes que compram, meta por balconista, uso contínuo.', price: 'R$ 1.490 camada · R$ 1.800 com ERP' },
    { id: 'lojista', name: 'Lojista', who: 'Varejo com loja física e venda online', role: 'Gestão + canais ou camada sobre Bling/Olist', hook: 'Produto parado × cliente certo, margem por canal, recompra.', price: 'R$ 990 + implantação' },
    { id: 'profissional', name: 'Profissional', who: 'Mentores, consultores, infoprodutores', role: 'Painel conteúdo → anúncio → venda', hook: 'Origem da venda, CAC e LTV, renovação.', price: 'R$ 197' },
    { id: 'pet', name: 'Pet', who: 'Pet shop com banho e tosa', role: 'Gestão do serviço recorrente + retenção', hook: 'Pets atrasados, pacotes, ocupação, lembretes.', price: 'R$ 397 por loja' },
    { id: 'agencia', name: 'Agência', who: 'Agências de marketing', role: 'Gestão da agência + portal white label', hook: 'Relatório com venda, aprovações, rentabilidade por cliente.', price: 'R$ 697 (10) · R$ 1.297 (30)' },
    { id: 'contabilidade', name: 'Contabilidade', who: 'Escritórios contábeis', role: 'Gestão comercial + portal + painel para as empresas', hook: 'Rentabilidade e retrabalho, painel consultivo revendável.', price: 'R$ 597 + R$ 97 por empresa com painel' }
  ];

  /* Matriz de públicos: Perfil → Papel decisor → Problema → Desejo → Associação → Tema → Abordagem → Solução */
  const audienceMatrix = [
    { profile: 'gestao', role: 'dono', problem: 'Fica sabendo que o mês foi ruim só no fechamento', desire: 'Saber no dia 10 se vai bater a meta', assoc: 'antecipacao', theme: 'Forecast e ritmo', approach: 'Conta aberta de um imprevisto (férias, falta) e quanto custa', solution: 'Forecast com desvios + lista de pacientes em tratamento sem retorno' },
    { profile: 'gestao', role: 'gestor', problem: 'Agenda com buracos e faltas sem aviso', desire: 'Agenda cheia sem depender da recepção', assoc: 'acao', theme: 'Custo da capacidade', approach: 'Quanto vale uma hora vazia + campanha para o horário', solution: 'Ocupação + link de agendamento + lembretes' },
    { profile: 'farmacia', role: 'dono', problem: 'Lucro real caindo e estoque vencendo', desire: 'Transformar perda em venda direcionada', assoc: 'impacto', theme: 'Estoque e capital parado', approach: 'Liquidação geral × oferta para quem já compra', solution: 'Validade × clientes que compram + campanhas' },
    { profile: 'farmacia', role: 'gestor', problem: 'Equipe sem meta individual clara', desire: 'Cada balconista sabendo o próprio número', assoc: 'acao', theme: 'Equipe e responsabilidade', approach: 'Meta individual que motiva (e a que desmotiva)', solution: 'Meta por balconista, ranking, lista diária' },
    { profile: 'lojista', role: 'financeiro', problem: 'Vende no marketplace e não sabe a margem real', desire: 'Saber qual canal dá lucro', assoc: 'impacto', theme: 'Margem real', approach: 'A conta preço − taxa − frete − devolução', solution: 'Margem por canal' },
    { profile: 'lojista', role: 'ops', problem: 'Coleção parada no fim da estação', desire: 'Girar estoque sem liquidação geral', assoc: 'base', theme: 'Segmentação útil', approach: 'Cliente certo para o produto parado', solution: 'Produto parado × clientes da categoria' },
    { profile: 'profissional', role: 'autonomo', problem: 'Muitos seguidores, poucas vendas', desire: 'Saber qual post e anúncio vendem', assoc: 'integrada', theme: 'Origem e atribuição', approach: 'Post → lead → venda com dados da plataforma', solution: 'Origem (Hubla pronta) + CAC por canal' },
    { profile: 'pet', role: 'dono', problem: 'Tutor que vinha a cada 15 dias sumiu', desire: 'Agenda recorrente previsível', assoc: 'base', theme: 'Ciclo de retorno', approach: 'Contar os dias desde o último banho', solution: 'Pets atrasados + lembrete com link' },
    { profile: 'agencia', role: 'parceiro', problem: 'Cliente questiona retorno do trabalho', desire: 'Renovar contrato com número', assoc: 'integrada', theme: 'Marketing que se mede em venda', approach: 'Relatório que mostra venda, não alcance', solution: 'Relatório com venda + portal white label' },
    { profile: 'contabilidade', role: 'parceiro', problem: 'Cliente acha que contador "só entrega guia"', desire: 'Serviço consultivo visível e cobrado', assoc: 'antecipacao', theme: 'Movimentos por setor', approach: 'O contador que entrega DRE e forecast', solution: 'Painel gerencial por empresa' },
    { profile: 'todos', role: 'mkt', problem: 'Investe em conteúdo e anúncio sem ligar a venda', desire: 'Cortar o que não vende', assoc: 'integrada', theme: 'CAC e LTV', approach: 'O canal com mais leads pode ser o que menos vende', solution: 'Origem + CAC + funil de receita' },
    { profile: 'todos', role: 'financeiro', problem: 'Desconto e custo crescendo sem ninguém notar', desire: 'Margem protegida', assoc: 'impacto', theme: 'Margem real', approach: 'Quanto um desconto exige vender a mais', solution: 'Margem por item + descontos por vendedor' }
  ];

  /* Territórios compartilhados: relevância 0–3 de cada tema para cada perfil */
  const sharedTerritories = [
    { theme: 'Previsibilidade de receita', rel: { gestao: 3, farmacia: 3, lojista: 3, profissional: 3, pet: 3, agencia: 3, contabilidade: 3 } },
    { theme: 'Margem e desconto', rel: { gestao: 3, farmacia: 3, lojista: 3, profissional: 1, pet: 2, agencia: 2, contabilidade: 2 } },
    { theme: 'Cliente fora do ciclo', rel: { gestao: 3, farmacia: 3, lojista: 3, profissional: 2, pet: 3, agencia: 1, contabilidade: 1 } },
    { theme: 'Origem e custo por cliente', rel: { gestao: 3, farmacia: 1, lojista: 2, profissional: 3, pet: 2, agencia: 3, contabilidade: 2 } },
    { theme: 'Estoque e capital parado', rel: { gestao: 1, farmacia: 3, lojista: 3, profissional: 0, pet: 2, agencia: 0, contabilidade: 0 } },
    { theme: 'Capacidade e agenda', rel: { gestao: 3, farmacia: 0, lojista: 0, profissional: 1, pet: 3, agencia: 2, contabilidade: 1 } },
    { theme: 'Equipe e metas individuais', rel: { gestao: 3, farmacia: 3, lojista: 3, profissional: 0, pet: 2, agencia: 2, contabilidade: 2 } },
    { theme: 'Prova de resultado para o cliente', rel: { gestao: 1, farmacia: 0, lojista: 0, profissional: 2, pet: 0, agencia: 3, contabilidade: 3 } },
    { theme: 'IA aplicada à gestão', rel: { gestao: 2, farmacia: 2, lojista: 2, profissional: 2, pet: 1, agencia: 3, contabilidade: 3 } }
  ];

  /* ------------------------------------------------------------------ */
  /* 4. Pilares → Temas → Subtemas                                        */
  /* ------------------------------------------------------------------ */
  const pillars = [
    { id: 'p1', name: 'Previsibilidade e decisão', color: '#0d0d0f',
      goal: 'Fazer da Elevah a marca lembrada quando o assunto é saber o resultado antes do fechamento.',
      assoc: ['antecipacao', 'rigor'], audience: ['dono', 'gestor', 'financeiro'],
      problems: ['Resultado descoberto no fim do mês', 'Meta sem acompanhamento', 'Imprevistos sem plano'],
      approaches: ['Conta aberta do ritmo do mês', 'Cenários com desvio', 'Método efetivo → vigente → projeção → ação'],
      formats: ['reels', 'carrossel', 'documento', 'texto'], stages: ['descoberta', 'interesse', 'consideracao'],
      results: 'Alcance e salvamentos em conteúdos de método; associação com "ver antes".',
      solution: 'Financeiro e forecast · Início · Estratégia e metas',
      themes: [
        { id: 'p1-forecast', name: 'Forecast e ritmo', subs: ['Projeção do mês pelo ritmo', 'Impacto de desvios', 'Valor necessário por dia'] },
        { id: 'p1-metas', name: 'Metas que viram rotina', subs: ['Meta por pessoa', 'Revisão mensal com decisão', 'Plano de ação ligado a resultado'] },
        { id: 'p1-indicadores', name: 'Ler indicadores', subs: ['Efetivo, vigente e projeção', 'Comparações que enganam', 'Métrica de vaidade × métrica de decisão'] },
        { id: 'p1-cenarios', name: 'Cenários e sazonalidade', subs: ['Testar premissas', 'Calendário de sazonalidade', 'Contratação e expansão'] }
      ] },
    { id: 'p2', name: 'Margem e eficiência', color: '#1a6fbf',
      goal: 'Associar a Elevah a enxergar o dinheiro que escapa: margem, estoque, hora parada, ferramentas.',
      assoc: ['impacto'], audience: ['dono', 'financeiro', 'ops'],
      problems: ['Vende muito e sobra pouco', 'Estoque parado e vencendo', 'Desconto sem controle', 'Agenda ociosa'],
      approaches: ['A conta que ninguém faz', 'Mito ou margem', 'Comparação de duas decisões'],
      formats: ['reels', 'carrossel', 'imagem', 'texto'], stages: ['descoberta', 'interesse', 'consideracao'],
      results: 'Compartilhamentos (conta útil) e visitas ao perfil.',
      solution: 'Preço e margem · Estoque e compras · Agenda e capacidade',
      themes: [
        { id: 'p2-margem', name: 'Margem real', subs: ['Margem por item', 'Margem por canal após taxas', 'Desconto e volume necessário'] },
        { id: 'p2-estoque', name: 'Estoque e capital parado', subs: ['Validade e risco', 'Curva ABC', 'Ruptura e venda perdida'] },
        { id: 'p2-capacidade', name: 'Custo da capacidade', subs: ['Custo da hora', 'Ocupação por horário', 'Imprevistos de equipe'] },
        { id: 'p2-pilha', name: 'Ferramentas e retrabalho', subs: ['Custo da pilha avulsa', 'Retrabalho e conferência manual'] }
      ] },
    { id: 'p3', name: 'Clientes e recorrência', color: '#3d9be9',
      goal: 'Ser a referência em crescer com a base: retorno, recompra, resposta rápida, voz do cliente.',
      assoc: ['base', 'acao'], audience: ['dono', 'gestor', 'mkt'],
      problems: ['Cliente some sem avisar', 'Resposta lenta', 'Campanha para todo mundo', 'Reclamação sem resposta'],
      approaches: ['Identificação com a cena', 'Evidência de pesquisa', 'Antes e depois de uma lista'],
      formats: ['reels', 'carrossel', 'texto'], stages: ['descoberta', 'interesse', 'consideracao'],
      results: 'Salvamentos e comentários de identificação.',
      solution: 'Clientes e retenção · Campanhas e WhatsApp · Voz do cliente',
      themes: [
        { id: 'p3-ciclo', name: 'Ciclo de retorno', subs: ['Fora do ciclo', 'Uso contínuo e recompra prevista', 'Pacotes e renovação'] },
        { id: 'p3-resposta', name: 'Velocidade de resposta', subs: ['Tempo de resposta ao lead', 'Lembretes e comparecimento', 'Autoatendimento'] },
        { id: 'p3-segmentos', name: 'Segmentação útil', subs: ['Cliente certo para o produto', 'Campanha para a base certa', 'LTV na prática'] },
        { id: 'p3-voz', name: 'Voz do cliente', subs: ['Reclamação que custa dinheiro', 'Avaliações dos concorrentes'] }
      ] },
    { id: 'p4', name: 'Marketing que se mede em venda', color: '#a6d6f7',
      goal: 'Ligar a marca à ideia de que conteúdo e anúncio se medem em cliente e receita.',
      assoc: ['integrada'], audience: ['mkt', 'autonomo', 'parceiro'],
      problems: ['Investe sem saber o que volta', 'Métrica de curtida', 'Relatório sem venda'],
      approaches: ['Análise com dados ilustrativos sinalizados', 'Tese contra métrica de vaidade', 'How-to de conta simples'],
      formats: ['carrossel', 'documento', 'reels', 'texto'], stages: ['descoberta', 'interesse', 'consideracao'],
      results: 'Seguidores qualificados de marketing, agências e profissionais.',
      solution: 'Funil, CRM e origem · Redes e conteúdo · RevOps',
      themes: [
        { id: 'p4-origem', name: 'Origem e atribuição', subs: ['De onde vem cada cliente', 'Post → lead → venda', 'Plataformas de venda digital'] },
        { id: 'p4-cac', name: 'CAC e LTV', subs: ['CAC sem planilha', 'LTV/CAC por canal', 'Lead que não converte'] },
        { id: 'p4-funil', name: 'Funil de receita', subs: ['Vazamentos', 'Coortes', 'Relatório que renova contrato'] },
        { id: 'p4-conteudo', name: 'Conteúdo e anúncio', subs: ['Métricas de vaidade', 'Experimentação', 'Cortar o que não vende'] }
      ] },
    { id: 'p5', name: 'Mercado e tendências', color: '#8e8e93',
      goal: 'Dar repertório: pesquisas, movimentos setoriais e IA aplicada, sempre com leitura própria.',
      assoc: ['rigor', 'antecipacao'], audience: ['dono', 'parceiro', 'mkt'],
      problems: ['Excesso de notícia sem leitura', 'Hype de IA', 'Mudança de comportamento do cliente'],
      approaches: ['Raio-X de pesquisa', 'Número da semana', 'Notícia comentada com implicação prática'],
      formats: ['documento', 'imagem', 'texto', 'artigo', 'carrossel'], stages: ['descoberta', 'consideracao'],
      results: 'Compartilhamento entre gestores; autoridade no LinkedIn.',
      solution: 'Mercado e concorrência · conhecimento da equipe Elevah',
      themes: [
        { id: 'p5-pesquisas', name: 'Pesquisas setoriais', subs: ['Varejo farmacêutico', 'Agências', 'Contabilidade'] },
        { id: 'p5-ia', name: 'IA aplicada à gestão', subs: ['O que a IA faz bem', 'O que a IA não deve fazer'] },
        { id: 'p5-comportamento', name: 'Comportamento do consumidor', subs: ['WhatsApp como balcão', 'Autoatendimento', 'Expectativa de resposta'] },
        { id: 'p5-setores', name: 'Movimentos por setor', subs: ['Contabilidade consultiva', 'Farmácia independente', 'Serviços recorrentes'] }
      ] },
    { id: 'p6', name: 'Gestão e equipe', color: '#d4d4d8',
      goal: 'Associar a Elevah a uma gestão simples: cada um vê o seu número, o dono começa pelo que vale mais.',
      assoc: ['acao', 'integrada'], audience: ['dono', 'gestor'],
      problems: ['Microgestão', 'Planilha de comissão', 'Processos manuais', 'Dono apagando incêndio'],
      approaches: ['Rotina do dono', 'Tese sobre responsabilidade', 'Checklist útil'],
      formats: ['reels', 'carrossel', 'texto'], stages: ['descoberta', 'interesse', 'relacionamento'],
      results: 'Identificação e salvamentos; conversa com gestores.',
      solution: 'Unidades e equipe · Início · Vendas',
      themes: [
        { id: 'p6-equipe', name: 'Equipe e responsabilidade', subs: ['Cada um vê o próprio número', 'Comissão automática', 'Ranking e meta individual'] },
        { id: 'p6-processos', name: 'Processos sem atrito', subs: ['Do orçamento à nota', 'Um sistema em vez de cinco'] },
        { id: 'p6-rotina', name: 'Rotina do dono', subs: ['2 minutos por dia', 'Priorizar por R$', 'Fechamento mensal'] }
      ] },
    { id: 'p7', name: 'Elevah na prática', color: '#cfe8fa',
      goal: 'Mostrar o método e o produto pronto, com transparência, para quem já tem interesse.',
      assoc: ['acao', 'rigor', 'antecipacao'], audience: ['dono', 'gestor', 'autonomo'],
      problems: ['Dúvida se funciona no meu negócio', 'Preço', 'Medo de migração'],
      approaches: ['Demonstração de 45 s', 'Pergunta e resposta honesta', 'Bastidores do produto'],
      formats: ['video', 'carrossel', 'stories', 'texto'], stages: ['consideracao', 'conversao', 'relacionamento'],
      results: 'Visitas ao site, pedidos de diagnóstico, conversas.',
      solution: 'Todos os módulos prontos: forecast, origem, agendamento, margem',
      themes: [
        { id: 'p7-metodo', name: 'Método', subs: ['Efetivo → vigente → projeção → ação', 'Princípio da IA'] },
        { id: 'p7-demo', name: 'Demonstrações', subs: ['Forecast', 'Origem do cliente', 'Margem', 'Agendamento'] },
        { id: 'p7-casos', name: 'Casos e evidências', subs: ['Exemplos ilustrativos', 'Casos reais (quando houver)'] },
        { id: 'p7-comercial', name: 'Oferta e dúvidas', subs: ['Para quem é', 'Preço', 'Diagnóstico'] },
        { id: 'p7-bastidores', name: 'Bastidores e comunidade', subs: ['Como construímos', 'Perguntas da audiência'] }
      ] }
  ];

  /* ------------------------------------------------------------------ */
  /* 5. Tipos editoriais (≠ formato de mídia)                             */
  /* ------------------------------------------------------------------ */
  const types = [
    { id: 'educativo', name: 'Educativo', goal: 'Ensinar um conceito ou conta aplicável', stage: 'interesse', who: 'Dono, gestor', when: 'Quando o público tem o problema mas não o nome ou a conta', fw: ['howto', 'lista', 'pis'], fo: ['carrossel', 'reels', 'documento'], ex: 'Curva ABC: os poucos itens que pagam a maior parte das contas', cta: 'Salve para aplicar no fechamento', kpi: 'Salvamentos, compartilhamentos' },
    { id: 'analise', name: 'Análise de dados', goal: 'Mostrar raciocínio com número', stage: 'consideracao', who: 'Dono, financeiro, marketing', when: 'Quando existe uma conta ou dado que muda uma decisão', fw: ['dados', 'comparacao', 'tese'], fo: ['documento', 'carrossel', 'artigo'], ex: 'O canal com mais leads pode ser o que menos vende', cta: 'Faça a conta com os seus números', kpi: 'Salvamentos, visitas ao perfil' },
    { id: 'opiniao', name: 'Opinião e tese', goal: 'Marcar posição e diferenciar', stage: 'descoberta', who: 'Gestores em geral', when: 'Quando há uma crença comum a contestar com argumento', fw: ['tese', 'mito'], fo: ['texto', 'reels'], ex: 'Campanha para a base inteira treina o cliente a esperar desconto', cta: 'Você concorda? Comente', kpi: 'Comentários qualificados, alcance' },
    { id: 'noticia', name: 'Notícia comentada', goal: 'Interpretar um fato recente', stage: 'descoberta', who: 'Dono, parceiros', when: 'Fato verificável, recente e ligado a um território', fw: ['dados', 'tese'], fo: ['texto', 'imagem', 'carrossel'], ex: 'Pesquisa Febrafar: o que muda para a farmácia independente', cta: 'Compartilhe com quem precisa ver', kpi: 'Alcance, compartilhamentos' },
    { id: 'tendencia', name: 'Tendência', goal: 'Antecipar um movimento', stage: 'consideracao', who: 'Dono, parceiros', when: 'Mudança sustentada por mais de uma fonte', fw: ['tese', 'pis'], fo: ['artigo', 'documento'], ex: 'O contador que entrega DRE e forecast', cta: 'Leia a análise completa', kpi: 'Leitura, salvamentos' },
    { id: 'pesquisa', name: 'Dados e pesquisa', goal: 'Trazer evidência externa com leitura própria', stage: 'descoberta', who: 'Todos', when: 'Pesquisa confiável com número forte', fw: ['dados'], fo: ['imagem', 'documento', 'carrossel'], ex: '8% das farmácias usam o cadastro de clientes para vender', cta: 'Fonte na legenda; salve', kpi: 'Compartilhamentos, alcance' },
    { id: 'identificacao', name: 'Identificação', goal: 'Fazer o público se ver na cena', stage: 'descoberta', who: 'Dono, gestor', when: 'Dor recorrente e concreta do dia a dia', fw: ['pas', 'story'], fo: ['reels', 'imagem'], ex: 'O cliente que sumiu não reclamou. Ele só não voltou.', cta: 'Marque quem vive isso', kpi: 'Alcance, compartilhamentos, % não seguidores' },
    { id: 'comparativo', name: 'Comparativo', goal: 'Ajudar a escolher entre dois caminhos', stage: 'consideracao', who: 'Decisores', when: 'Duas decisões comuns com resultados diferentes', fw: ['comparacao', 'bab'], fo: ['carrossel', 'documento'], ex: 'Liquidação geral ou lista de quem compra?', cta: 'Qual você usa hoje?', kpi: 'Salvamentos, comentários' },
    { id: 'mito', name: 'Mito × realidade', goal: 'Corrigir crença com conta', stage: 'descoberta', who: 'Todos', when: 'Crença popular que custa dinheiro', fw: ['mito'], fo: ['reels', 'carrossel'], ex: 'Vender mais pode estar te deixando mais pobre', cta: 'Compartilhe com quem acredita nisso', kpi: 'Compartilhamentos, alcance' },
    { id: 'erro', name: 'Erro comum', goal: 'Evitar uma perda específica', stage: 'interesse', who: 'Gestor, financeiro', when: 'Erro frequente com custo calculável', fw: ['pas', 'lista'], fo: ['carrossel', 'reels'], ex: 'Média do mês engana: o que olhar no lugar', cta: 'Salve para revisar', kpi: 'Salvamentos' },
    { id: 'historia', name: 'História', goal: 'Tornar o método memorável', stage: 'interesse', who: 'Dono', when: 'Há uma sequência com virada clara', fw: ['story', 'bab'], fo: ['reels', 'carrossel', 'texto'], ex: 'Quanto vale um cliente que volta: o LTV explicado com um banho de pet', cta: 'Siga para mais histórias com conta', kpi: 'Retenção do vídeo, seguidores' },
    { id: 'demonstracao', name: 'Demonstração', goal: 'Mostrar o recurso pronto resolvendo um problema', stage: 'consideracao', who: 'Quem já tem interesse', when: 'Funcionalidade publicada e estável', fw: ['pis', '4ps'], fo: ['video', 'carrossel'], ex: 'Na tela: o forecast do mês com o impacto de uma falta', cta: 'Veja com os seus dados', kpi: 'Cliques, visitas ao site' },
    { id: 'case', name: 'Case e evidência', goal: 'Provar resultado', stage: 'consideracao', who: 'Decisores', when: 'Resultado real autorizado (ou exemplo ilustrativo sinalizado)', fw: ['bab', 'story'], fo: ['carrossel', 'documento', 'video'], ex: 'Clínica com 6 profissionais: de 92% para 99% da meta (ilustrativo)', cta: 'Quer ver no seu negócio?', kpi: 'Cliques, leads' },
    { id: 'bastidores', name: 'Bastidores', goal: 'Gerar confiança pela transparência', stage: 'relacionamento', who: 'Seguidores, clientes', when: 'Decisões de produto e princípios', fw: ['story', 'tese'], fo: ['texto', 'stories'], ex: 'Como construímos: o mapa de entregas aberto', cta: 'O que você gostaria de ver primeiro?', kpi: 'Comentários, respostas' },
    { id: 'institucional', name: 'Institucional', goal: 'Explicar quem é a Elevah', stage: 'consideracao', who: 'Quem chegou agora', when: 'Fixados, bio, momentos de pico de visita', fw: ['qa', '4ps'], fo: ['carrossel', 'video'], ex: 'Para quem a Elevah é (e para quem não é)', cta: 'Fale com a equipe', kpi: 'Visitas ao site' },
    { id: 'comercial', name: 'Comercial', goal: 'Convidar para a conversa', stage: 'conversao', who: 'Público aquecido', when: 'Depois de conteúdos de consideração; oferta clara', fw: ['aida', '4ps', 'qa'], fo: ['stories', 'texto', 'video'], ex: 'Diagnóstico de 20 minutos com os seus dados', cta: 'Peça o diagnóstico', kpi: 'Leads, conversas' },
    { id: 'relacionamento', name: 'Relacionamento', goal: 'Conversar com quem já acompanha', stage: 'relacionamento', who: 'Seguidores e clientes', when: 'Ritmo semanal leve', fw: ['qa'], fo: ['stories', 'texto'], ex: 'Pergunta da semana: qual número você olha na segunda-feira?', cta: 'Responda na caixa', kpi: 'Respostas, interações recorrentes' },
    { id: 'ferramenta', name: 'Ferramenta / checklist', goal: 'Entregar algo para usar', stage: 'relacionamento', who: 'Gestores', when: 'Momentos de rotina (fechamento, planejamento)', fw: ['lista', 'howto'], fo: ['carrossel', 'documento'], ex: 'Checklist de fechamento mensal em 10 perguntas', cta: 'Salve e use no dia 30', kpi: 'Salvamentos, compartilhamentos' }
  ];

  /* ------------------------------------------------------------------ */
  /* 6. Frameworks narrativos                                             */
  /* ------------------------------------------------------------------ */
  const frameworks = [
    { id: 'howto', name: 'How-to', goal: 'Ensinar a fazer algo em passos', when: 'Conteúdo educativo com aplicação imediata', steps: ['Resultado prometido', 'Passo 1', 'Passo 2', 'Passo 3', 'Erro a evitar', 'Síntese'], pros: 'Claro, salvável, fácil de produzir', cons: 'Vira genérico sem uma conta ou ângulo próprio', types: ['educativo', 'ferramenta'], stages: ['interesse', 'descoberta'], ex: 'Como calcular no dia 12 onde o mês vai fechar' },
    { id: 'pas', name: 'PAS (Problema–Agitação–Solução)', goal: 'Gerar identificação com uma dor', when: 'Dor concreta e reconhecível', steps: ['Problema (cena)', 'Agitação (custo em R$)', 'Solução (método, não produto)'], pros: 'Prende atenção rápido', cons: 'Usado em excesso parece manipulação; evitar em notícia e análise', types: ['identificacao', 'erro'], stages: ['descoberta', 'interesse'], ex: 'Comissão em planilha: o custo invisível do fim do mês' },
    { id: 'aida', name: 'AIDA', goal: 'Conduzir até uma ação comercial', when: 'Conteúdo de conversão com oferta clara', steps: ['Atenção', 'Interesse', 'Desejo', 'Ação'], pros: 'Estrutura comercial testada', cons: 'Não serve para educação, notícia ou análise', types: ['comercial'], stages: ['conversao'], ex: 'Diagnóstico de 20 minutos com o forecast do seu mês' },
    { id: 'bab', name: 'BAB (Antes–Depois–Ponte)', goal: 'Mostrar a transformação', when: 'Casos, comparativos e histórias', steps: ['Antes', 'Depois', 'Ponte (o que mudou)'], pros: 'Visual e memorável', cons: 'Exige um "depois" crível; sinalizar quando for ilustrativo', types: ['case', 'comparativo', 'historia'], stages: ['consideracao', 'interesse'], ex: 'Da liquidação geral à oferta para 380 clientes' },
    { id: '4ps', name: '4Ps (Promessa–Imagem–Prova–Pedido)', goal: 'Apresentar uma solução com prova', when: 'Demonstração e institucional', steps: ['Promessa', 'Imagem (cena do uso)', 'Prova', 'Pedido'], pros: 'Equilibra benefício e evidência', cons: 'Sem prova real, perde força', types: ['demonstracao', 'institucional', 'comercial'], stages: ['consideracao', 'conversao'], ex: 'Link de agendamento: a agenda aberta 24h' },
    { id: 'story', name: 'Storytelling', goal: 'Tornar uma ideia memorável', when: 'Há personagem, conflito e virada', steps: ['Situação', 'Conflito', 'Virada', 'Lição', 'Ponte para o público'], pros: 'Alta retenção e lembrança (Made to Stick)', cons: 'Longo para formatos curtos; pede edição', types: ['historia', 'identificacao', 'bastidores', 'case'], stages: ['descoberta', 'interesse', 'relacionamento'], ex: 'O tutor que vinha a cada 15 dias e sumiu' },
    { id: 'pis', name: 'Problema–Insight–Solução', goal: 'Reenquadrar um problema', when: 'Existe uma percepção nova que muda a solução', steps: ['Problema conhecido', 'Insight (o que ninguém vê)', 'Solução prática'], pros: 'Mostra pensamento próprio', cons: 'Insight fraco derruba o conteúdo', types: ['educativo', 'demonstracao', 'tendencia'], stages: ['interesse', 'consideracao', 'descoberta'], ex: 'Pacote com sessões sobrando é cliente prestes a não renovar' },
    { id: 'lista', name: 'Lista explicativa', goal: 'Organizar várias ideias de um tema', when: 'Checklists, erros, sinais', steps: ['Promessa da lista', 'Itens com explicação curta', 'Síntese ou item bônus'], pros: 'Escaneável e salvável', cons: 'Superficial se cada item não tiver um porquê', types: ['educativo', 'ferramenta', 'erro'], stages: ['interesse', 'relacionamento'], ex: 'Checklist de fechamento mensal em 10 perguntas' },
    { id: 'dados', name: 'Análise de dados (Dado–Contexto–Implicação–Ação)', goal: 'Transformar número em decisão', when: 'Pesquisa, notícia ou conta', steps: ['Dado (com fonte)', 'Contexto', 'Implicação para o negócio', 'Ação recomendada'], pros: 'Constrói autoridade e rigor', cons: 'Depende de fonte verificável; nunca inventar', types: ['analise', 'pesquisa', 'noticia'], stages: ['descoberta', 'consideracao'], ex: '56% das farmácias independentes perderam lucro real: o que fazer' },
    { id: 'comparacao', name: 'Comparação', goal: 'Escolher entre caminhos', when: 'Duas alternativas reais', steps: ['Situação', 'Opção A (custo e resultado)', 'Opção B (custo e resultado)', 'Critério de escolha'], pros: 'Ajuda na decisão', cons: 'Comparação injusta destrói confiança', types: ['comparativo', 'analise'], stages: ['consideracao'], ex: 'R$ 200 mil vencendo: liquidação ou lista de quem compra?' },
    { id: 'mito', name: 'Mito × realidade', goal: 'Corrigir crença', when: 'Crença popular com custo', steps: ['O mito', 'Por que parece verdade', 'A conta real', 'O que fazer'], pros: 'Compartilhável', cons: 'Tom arrogante afasta; mostrar a conta', types: ['mito', 'opiniao'], stages: ['descoberta'], ex: 'Desconto de 10% exige vender quanto a mais?' },
    { id: 'qa', name: 'Pergunta–Resposta', goal: 'Responder dúvida real do comprador', when: 'Preço, comparação, objeções (They Ask, You Answer)', steps: ['Pergunta literal do cliente', 'Resposta direta', 'Contexto e limites', 'Próximo passo'], pros: 'Gera confiança e reduz ciclo de venda', cons: 'Exige honestidade sobre limites', types: ['comercial', 'institucional', 'relacionamento'], stages: ['conversao', 'relacionamento', 'consideracao'], ex: 'Quanto custa a Elevah?' },
    { id: 'tese', name: 'Tese–Argumento–Evidência', goal: 'Defender uma posição', when: 'Opinião, tendência, LinkedIn', steps: ['Tese em uma frase', 'Argumento 1', 'Argumento 2', 'Evidência', 'Implicação'], pros: 'Diferencia e gera debate qualificado', cons: 'Tese óbvia não gera interesse', types: ['opiniao', 'tendencia', 'bastidores', 'noticia'], stages: ['descoberta', 'consideracao'], ex: 'Forecast não é previsão do futuro: é consequência do ritmo atual' }
  ];

  /* ------------------------------------------------------------------ */
  /* 7. Séries recorrentes                                                */
  /* ------------------------------------------------------------------ */
  const series = [
    { id: 'numero', name: 'O número da semana', desc: 'Um dado público relevante e o que ele significa para quem gere um negócio. Fonte sempre na legenda.', stage: 'descoberta', fo: 'imagem', ch: 'li', freq: 'Semanal', assoc: 'rigor' },
    { id: 'conta', name: 'Conta aberta', desc: 'Um problema de gestão calculado em reais, passo a passo, com números ilustrativos sinalizados.', stage: 'descoberta', fo: 'reels', ch: 'ig', freq: 'Semanal', assoc: 'impacto' },
    { id: 'dia30', name: 'Antes do dia 30', desc: 'Um cenário de projeção do mês e a decisão que muda o resultado enquanto ainda dá tempo.', stage: 'interesse', fo: 'carrossel', ch: 'ig', freq: 'Quinzenal', assoc: 'antecipacao' },
    { id: 'mito', name: 'Mito ou margem', desc: 'Crenças comuns de gestão confrontadas com a conta.', stage: 'descoberta', fo: 'reels', ch: 'ig', freq: 'Quinzenal', assoc: 'impacto' },
    { id: 'raiox', name: 'Raio-X do setor', desc: 'Leitura de uma pesquisa setorial: o dado, o contexto e a decisão prática. Fala com um setor e serve a todos.', stage: 'consideracao', fo: 'documento', ch: 'li', freq: 'Mensal', assoc: 'rigor' },
    { id: 'natela', name: 'Na tela', desc: 'Demonstração de 45 s de um recurso pronto resolvendo um problema real.', stage: 'consideracao', fo: 'video', ch: 'ig', freq: 'Quinzenal', assoc: 'acao' }
  ];

  /* ------------------------------------------------------------------ */
  /* 8. Fundamentação (classificada pelo tipo de evidência)               */
  /* ------------------------------------------------------------------ */
  const references = [
    { ref: 'Byron Sharp — How Brands Grow (Ehrenberg-Bass)', kind: 'Evidência empírica', use: 'Crescimento vem de alcançar muitos compradores da categoria, não só os fiéis; disponibilidade mental. Justifica a meta de 40% em descoberta e a consistência de ativos de marca.', limit: 'Base majoritária em bens de consumo; em B2B de nicho o universo de compradores é menor.' },
    { ref: 'Jenni Romaniuk — Building Distinctive Brand Assets; Category Entry Points', kind: 'Modelo estratégico com base empírica', use: 'Mapear as situações em que o comprador pensa na categoria (aba "Situações de lembrança") e repetir ativos distintivos (séries, promessa "Ver antes").', limit: 'As situações listadas aqui são hipóteses a validar em entrevistas.' },
    { ref: 'LinkedIn B2B Institute / Ehrenberg-Bass — regra 95-5 (Dawes, 2021)', kind: 'Evidência empírica', use: 'Em B2B, a maior parte dos potenciais compradores não está pronta para comprar num dado momento. Conteúdo precisa construir memória para quando a necessidade surgir.', limit: 'Proporção estimada para categorias com ciclo de compra longo; usar como princípio, não como número fixo.' },
    { ref: 'Les Binet & Peter Field — The Long and the Short of It (IPA)', kind: 'Evidência empírica (base IPA)', use: 'Equilíbrio entre construção de marca (longo prazo) e ativação (curto prazo). Justifica limitar conteúdo comercial a uma fatia pequena e estável.', limit: 'Proporções derivadas de campanhas pagas de grandes marcas; não transferir percentuais diretamente para orgânico.' },
    { ref: 'April Dunford — Obviously Awesome', kind: 'Modelo estratégico', use: 'Escolha da categoria (inteligência de gestão orientada a resultado) e dos diferenciais com base nas alternativas reais do cliente.', limit: 'Exige validação com clientes ganhos e perdidos.' },
    { ref: 'Kevin Lane Keller — Customer-Based Brand Equity', kind: 'Modelo estratégico', use: 'Associações fortes, favoráveis e únicas: base do mapa de associações e das provas necessárias.', limit: 'Modelo conceitual; mensurar com pesquisa de marca quando houver base.' },
    { ref: 'Chip & Dan Heath — Made to Stick', kind: 'Modelo com base em psicologia', use: 'Simples, inesperado, concreto, crível, emocional, história. Critérios de qualidade de pauta e de ganchos.', limit: '—' },
    { ref: 'Jonah Berger — Contagious', kind: 'Pesquisa acadêmica + modelo', use: 'Valor prático e moeda social explicam compartilhamento: contas úteis e dados que fazem quem compartilha parecer informado.', limit: 'Compartilhamento não é igual a venda.' },
    { ref: 'Marcus Sheridan — They Ask, You Answer', kind: 'Recomendação profissional', use: 'Responder preço, comparação e limites abertamente. Base das pautas de conversão.', limit: 'Preço da Elevah ainda é hipótese: publicar só após validação.' },
    { ref: 'Ann Handley — Everybody Writes', kind: 'Recomendação profissional', use: 'Clareza, utilidade e voz consistente na escrita.', limit: '—' },
    { ref: 'Robert Cialdini — Influence', kind: 'Evidência experimental', use: 'Prova social e autoridade aplicadas com fonte real; nunca escassez falsa.', limit: 'Uso manipulativo destrói confiança.' },
    { ref: 'Donald Miller — Building a StoryBrand', kind: 'Recomendação profissional', use: 'O cliente é o protagonista; a Elevah é guia com plano. Tom das demonstrações.', limit: 'Fórmula rígida se aplicada a todo conteúdo.' },
    { ref: 'Alex Hormozi — $100M Offers / Leads', kind: 'Recomendação profissional', use: 'Clareza de oferta no diagnóstico (resultado, prazo, esforço). Restrito às pautas comerciais.', limit: 'Foco em resposta direta; não orienta construção de marca.' },
    { ref: 'Nielsen Norman Group — leitura em F e escaneabilidade', kind: 'Pesquisa de usabilidade', use: 'Hierarquia de carrosséis, documentos e da própria ferramenta.', limit: '—' },
    { ref: 'HBR (2011) — The Short Life of Online Sales Leads', kind: 'Evidência empírica (dado citado)', use: 'Responder em até 1 hora aumenta muito a chance de qualificar o lead. Pauta de velocidade de resposta.', limit: 'Estudo de 2011 nos EUA; apresentar com data.', url: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads' },
    { ref: 'Revisão sistemática e meta-análise — lembretes digitais e comparecimento', kind: 'Evidência científica', use: 'Lembretes digitais aumentam o comparecimento a consultas. Pauta de lembretes.', limit: 'Contexto de saúde; extrapolar com cuidado.', url: 'https://pubmed.ncbi.nlm.nih.gov/27798006/' },
    { ref: 'Hipótese da equipe — distribuição 40/20/25/10/5', kind: 'Hipótese a validar', use: 'Ponto de partida para a fase de construção de audiência. Revisar após 8 semanas com dados de alcance, salvamento e leads.', limit: 'Não há benchmark universal para orgânico B2B no Brasil.' }
  ];

  /* ------------------------------------------------------------------ */
  /* 9. Biblioteca de pautas (71)                                         */
  /* src: fonte; ex: true quando usa números ilustrativos                 */
  /* ------------------------------------------------------------------ */
  const D = 'descoberta', I = 'interesse', C = 'consideracao', V = 'conversao', R = 'relacionamento';
  const DOC = 'Doc Elevah: entregas, valor e preço por perfil (04/11/2026)';
  const P = (id, pi, th, st, t, a, au, pr, pb, as, ob, fu, fo, ch, ty, fw, prio, extra) =>
    Object.assign({ id, pillar: pi, theme: th, sub: st, title: t, angle: a, audience: au, profiles: pr, problem: pb, assoc: as, objective: ob, stage: fu, format: fo, channel: ch, type: ty, framework: fw, priority: prio, src: '', ex: false, note: '' }, extra || {});

  const ideas = [
    // P1 — Previsibilidade e decisão
    P('k01', 'p1', 'p1-forecast', 'Projeção do mês pelo ritmo', 'No dia 12 você já sabe como o mês vai fechar', 'A conta de três linhas (realizado ÷ dias decorridos × dias do mês) que quase ninguém faz e que antecipa o fechamento em semanas.', 'dono', ['todos'], 'Resultado descoberto no fim do mês', 'antecipacao', 'audiencia', D, 'reels', 'ig', 'educativo', 'howto', 3, { ex: true }),
    P('k02', 'p1', 'p1-forecast', 'Valor necessário por dia', 'Meta mensal é um número. Meta diária é uma decisão.', 'Transformar o que falta da meta em valor por dia útil muda a conversa da equipe de "falta muito" para "hoje precisamos de R$ X".', 'gestor', ['gestao', 'farmacia', 'lojista'], 'Meta que ninguém acompanha', 'antecipacao', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 2, { ex: true }),
    P('k03', 'p1', 'p1-forecast', 'Impacto de desvios', 'O imprevisto de R$ 11 mil que aparece com três semanas de antecedência', 'Férias de um profissional: 42 horas a menos na agenda multiplicadas pelo valor da hora. A perda é previsível; a reação costuma ser tardia.', 'gestor', ['gestao', 'pet'], 'Imprevisto de equipe sem plano', 'antecipacao', 'audiencia', D, 'reels', 'ig', 'educativo', 'pis', 2, { ex: true, src: DOC }),
    P('k04', 'p1', 'p1-indicadores', 'Comparações que enganam', 'Média do mês engana: o que olhar no lugar', 'Comparar o mês com a média geral esconde sazonalidade e dia da semana. Compare com o mesmo período e o mesmo dia da semana.', 'financeiro', ['todos'], 'Leitura errada de indicadores', 'rigor', 'educacao', I, 'texto', 'li', 'erro', 'mito', 2),
    P('k05', 'p1', 'p1-indicadores', 'Efetivo, vigente e projeção', 'Efetivo, vigente, projeção: as três perguntas antes de qualquer decisão', 'O método que separa o que já aconteceu, o que está acontecendo e onde vai parar, e por que a quarta pergunta (a ação) é a que muda o resultado.', 'dono', ['todos'], 'Decisão sem método', 'antecipacao', 'autoridade', C, 'documento', 'li', 'educativo', 'lista', 3, { src: DOC }),
    P('k06', 'p1', 'p1-metas', 'Revisão mensal com decisão', 'Reunião mensal que termina com três decisões, não com trinta slides', 'Pauta em três blocos: desvio da meta, causa, decisão. O que cortar da reunião de resultados.', 'gestor', ['todos'], 'Reunião longa sem decisão', 'acao', 'educacao', I, 'texto', 'li', 'educativo', 'howto', 2),
    P('k07', 'p1', 'p1-forecast', 'Projeção do mês pelo ritmo', 'Por que você descobre o problema no dia 30 (e como antecipar para o dia 10)', 'A cena do dono olhando o fechamento sem poder fazer mais nada, e o que muda quando o desvio aparece com 20 dias de margem.', 'dono', ['todos'], 'Resultado descoberto no fim do mês', 'antecipacao', 'posicionamento', D, 'reels', 'ig', 'identificacao', 'pas', 3),
    P('k08', 'p1', 'p1-cenarios', 'Calendário de sazonalidade', 'Sazonalidade não é surpresa: o calendário que todo negócio deveria montar em janeiro', 'Usar o histórico do próprio negócio para marcar picos e vales e preparar estoque, agenda e campanha antes.', 'dono', ['todos'], 'Pico e queda sem preparo', 'antecipacao', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 1),
    P('k09', 'p1', 'p1-cenarios', 'Contratação e expansão', 'Contratar mais um profissional vale a pena? Teste antes de decidir', 'Simular premissas (ocupação, ticket, custo) para ver o efeito no resultado antes de assumir o custo fixo.', 'dono', ['gestao', 'pet', 'agencia'], 'Decisão de investimento no escuro', 'antecipacao', 'autoridade', C, 'artigo', 'li', 'analise', 'dados', 2, { ex: true }),
    P('k10', 'p1', 'p1-indicadores', 'Métrica de vaidade × métrica de decisão', 'Forecast não é previsão do futuro. É consequência do ritmo atual.', 'Tese contra a ideia de que projeção é adivinhação: ela só mostra para onde o ritmo leva se nada mudar, e por isso serve para mudar.', 'dono', ['todos'], 'Desconfiança de projeções', 'rigor', 'posicionamento', D, 'texto', 'li', 'opiniao', 'tese', 2),

    // P2 — Margem e eficiência
    P('k11', 'p2', 'p2-margem', 'Margem por item', 'Vender mais pode estar te deixando mais pobre', 'Quando o produto mais vendido tem a pior margem, crescer em volume aumenta trabalho e reduz lucro.', 'dono', ['todos'], 'Vende muito e sobra pouco', 'impacto', 'audiencia', D, 'reels', 'ig', 'mito', 'mito', 3),
    P('k12', 'p2', 'p2-margem', 'Margem por canal após taxas', 'A conta do marketplace que ninguém faz: preço − taxa − frete − devolução', 'A venda que parece boa no painel do marketplace e dá prejuízo depois de taxas, frete e devolução.', 'financeiro', ['lojista'], 'Margem negativa escondida', 'impacto', 'educacao', I, 'carrossel', 'ig', 'analise', 'dados', 2, { ex: true }),
    P('k13', 'p2', 'p2-estoque', 'Validade e risco', 'R$ 200 mil vencendo em 15 dias: liquidação geral ou lista de quem compra?', 'Comparar desconto para todos com oferta para os 380 clientes que já compram aqueles itens: perda, margem e efeito no preço percebido.', 'ops', ['farmacia', 'lojista', 'pet'], 'Estoque vencendo', 'impacto', 'demanda', C, 'carrossel', 'ig', 'comparativo', 'comparacao', 3, { ex: true, src: DOC }),
    P('k14', 'p2', 'p2-margem', 'Desconto e volume necessário', 'Desconto de 10% exige vender quanto a mais para manter o lucro?', 'Com margem de 30%, um desconto de 10% obriga a vender 50% a mais só para empatar. A conta na tela, passo a passo.', 'financeiro', ['todos'], 'Desconto que destrói margem', 'impacto', 'audiencia', D, 'reels', 'ig', 'mito', 'mito', 3, { ex: true, series: 'conta' }),
    P('k15', 'p2', 'p2-estoque', 'Curva ABC', 'Estoque parado é dinheiro emprestado sem juros para a prateleira', 'Imagem com uma frase e um número: quanto do capital de giro está em itens sem venda há 90 dias.', 'ops', ['farmacia', 'lojista', 'pet'], 'Capital parado', 'impacto', 'posicionamento', D, 'imagem', 'ig', 'opiniao', 'tese', 1),
    P('k16', 'p2', 'p2-estoque', 'Curva ABC', 'Curva ABC: os poucos itens que pagam a maior parte das contas', 'Como montar a curva com o relatório de vendas e o que fazer com cada faixa (A protege, B acompanha, C questiona).', 'ops', ['farmacia', 'lojista'], 'Compra sem critério', 'impacto', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 2),
    P('k17', 'p2', 'p2-capacidade', 'Custo da hora', 'Quanto custa uma hora vazia na agenda', 'Custo fixo dividido pelas horas disponíveis: o número que muda a forma de olhar terça à tarde vazia.', 'gestor', ['gestao', 'pet', 'agencia'], 'Agenda ociosa', 'impacto', 'audiencia', D, 'reels', 'ig', 'educativo', 'howto', 2, { ex: true, series: 'conta' }),
    P('k18', 'p2', 'p2-capacidade', 'Ocupação por horário', 'Terça à tarde vazia: campanha para o horário, não para a semana', 'Olhar ocupação por dia e horário e chamar só quem costuma vir naquele horário, em vez de promoção geral.', 'gestor', ['gestao', 'pet'], 'Agenda com buracos fixos', 'acao', 'demanda', C, 'carrossel', 'ig', 'educativo', 'pis', 2),
    P('k19', 'p2', 'p2-pilha', 'Custo da pilha avulsa', 'Agenda, CRM, WhatsApp, financeiro, BI e planilha: quanto custa ter tudo separado', 'O custo direto (R$ 1.150 a 6.150/mês em ferramentas avulsas, segundo levantamento de preços) e o custo de conferir dados que não conversam.', 'dono', ['gestao', 'lojista'], 'Ferramentas que não conversam', 'integrada', 'demanda', C, 'texto', 'li', 'comparativo', 'comparacao', 2, { src: DOC }),
    P('k20', 'p2', 'p2-estoque', 'Ruptura e venda perdida', 'Ruptura: a venda que não aparece em nenhum relatório', 'O cliente que pediu e não levou não vira número. Como estimar a venda perdida por falta de item de alto giro.', 'ops', ['farmacia', 'lojista'], 'Falta de produto', 'impacto', 'educacao', I, 'carrossel', 'ig', 'educativo', 'pis', 1),

    // P3 — Clientes e recorrência
    P('k21', 'p3', 'p3-ciclo', 'Fora do ciclo', 'O cliente que sumiu não reclamou. Ele só não voltou.', 'Cena: o cliente fiel que parou de vir sem aviso. A perda silenciosa que nenhum relatório de reclamação mostra.', 'dono', ['todos'], 'Cliente some sem avisar', 'base', 'audiencia', D, 'reels', 'ig', 'identificacao', 'story', 3),
    P('k22', 'p3', 'p3-ciclo', 'Fora do ciclo', 'Fora do ciclo: a lista mais lucrativa que o seu negócio já tem', 'Como identificar quem passou do intervalo normal de retorno e por que essa lista vale mais que qualquer anúncio novo.', 'gestor', ['gestao', 'farmacia', 'pet', 'lojista'], 'Base de clientes esquecida', 'base', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 3),
    P('k23', 'p3', 'p3-resposta', 'Tempo de resposta ao lead', 'Responder em 1 hora ou em 1 dia: o que o estudo da HBR mediu', 'Empresas que respondem em até 1 hora têm cerca de 7 vezes mais chance de qualificar o lead. O que isso significa para quem atende pelo WhatsApp.', 'mkt', ['todos'], 'Resposta lenta', 'base', 'audiencia', D, 'carrossel', 'ig', 'pesquisa', 'dados', 2, { src: 'HBR, 2011 — https://hbr.org/2011/03/the-short-life-of-online-sales-leads' }),
    P('k24', 'p3', 'p3-resposta', 'Lembretes e comparecimento', 'Lembrete reduz falta? O que a ciência já mediu', 'Revisão sistemática com meta-análise mostra que lembretes digitais aumentam o comparecimento. Como aplicar fora da saúde, com cuidado.', 'gestor', ['gestao', 'pet'], 'Faltas sem aviso', 'rigor', 'educacao', I, 'texto', 'li', 'pesquisa', 'dados', 2, { src: 'PubMed 27798006 — https://pubmed.ncbi.nlm.nih.gov/27798006/' }),
    P('k25', 'p3', 'p3-ciclo', 'Uso contínuo e recompra prevista', 'O cliente avisa quando vai voltar. Basta contar os dias.', 'Uso contínuo na farmácia, ração no pet, banho a cada 15 dias: a data provável de recompra já está no histórico.', 'gestor', ['farmacia', 'pet', 'lojista'], 'Recompra perdida para o concorrente', 'base', 'engajamento', I, 'reels', 'ig', 'educativo', 'pis', 2),
    P('k26', 'p3', 'p3-segmentos', 'Cliente certo para o produto', 'Oferta para 380 pessoas em vez de desconto para todos', 'Cruzar histórico de compra com o item parado: a campanha que gira estoque sem treinar o cliente a esperar promoção.', 'ops', ['farmacia', 'lojista'], 'Produto parado', 'acao', 'demanda', C, 'carrossel', 'ig', 'educativo', 'bab', 2, { ex: true }),
    P('k27', 'p3', 'p3-segmentos', 'Campanha para a base certa', 'Campanha para a base inteira treina o cliente a esperar desconto', 'Tese: disparo geral desvaloriza preço e cansa a lista. Cada campanha precisa de um motivo para aquela pessoa.', 'mkt', ['todos'], 'Campanha para todo mundo', 'base', 'posicionamento', D, 'texto', 'li', 'opiniao', 'tese', 2),
    P('k28', 'p3', 'p3-voz', 'Reclamação que custa dinheiro', 'A reclamação que mais custa dinheiro raramente é a mais frequente', 'Cruzar o que o cliente disse com o que ele gastou depois revela a reclamação que faz perder receita.', 'dono', ['todos'], 'Avaliações sem leitura', 'integrada', 'engajamento', I, 'carrossel', 'ig', 'educativo', 'pis', 2),
    P('k29', 'p3', 'p3-voz', 'Avaliações dos concorrentes', 'Avaliações do concorrente: a pesquisa de mercado mais barata que existe', 'Como ler as avaliações do concorrente para descobrir onde ele falha e você pode ganhar.', 'dono', ['todos'], 'Não saber por que perde cliente', 'acao', 'audiencia', D, 'reels', 'ig', 'educativo', 'howto', 2),
    P('k30', 'p3', 'p3-ciclo', 'Pacotes e renovação', 'Pacote com sessões sobrando é cliente prestes a não renovar', 'O saldo parado é um sinal de abandono. Avisar antes do vencimento protege a renovação.', 'gestor', ['gestao', 'pet'], 'Pacote que não renova', 'base', 'demanda', C, 'carrossel', 'ig', 'educativo', 'pis', 1),
    P('k31', 'p3', 'p3-segmentos', 'LTV na prática', 'Quanto vale um cliente que volta: o LTV explicado com um banho de pet', 'Banho de R$ 80 a cada 15 dias por dois anos: a conta mostra por que perder um tutor custa mais que um banho.', 'dono', ['todos'], 'Subestimar o valor do cliente', 'base', 'audiencia', D, 'reels', 'ig', 'historia', 'story', 2, { ex: true }),

    // P4 — Marketing que se mede em venda
    P('k32', 'p4', 'p4-conteudo', 'Métricas de vaidade', 'Curtida não paga boleto: as métricas de conteúdo que se ligam a venda', 'Quais métricas indicam interesse real (salvamento, visita, conversa) e quais só alcance.', 'mkt', ['profissional', 'agencia'], 'Métrica de curtida', 'integrada', 'audiencia', D, 'carrossel', 'ig', 'mito', 'mito', 2),
    P('k33', 'p4', 'p4-cac', 'Lead que não converte', 'O canal com mais leads pode ser o que menos vende', 'Exemplo ilustrativo de três canais: leads, clientes e custo por cliente. A ordem muda completamente.', 'mkt', ['todos'], 'Verba no canal errado', 'integrada', 'educacao', I, 'documento', 'li', 'analise', 'dados', 3, { ex: true }),
    P('k34', 'p4', 'p4-cac', 'CAC sem planilha', 'CAC sem planilha: a conta em três linhas', 'Investimento ÷ clientes novos, por canal. O que entra no investimento e o erro mais comum.', 'mkt', ['profissional', 'gestao', 'agencia'], 'Não saber quanto custa um cliente', 'integrada', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 2),
    P('k35', 'p4', 'p4-conteudo', 'Cortar o que não vende', 'Seu melhor anúncio pode ser o que você deveria desligar', 'Custo por lead baixo e custo por venda alto: o anúncio que parece eficiente e consome a verba.', 'mkt', ['profissional', 'agencia', 'gestao'], 'Anúncio que gasta e não vende', 'integrada', 'audiencia', D, 'reels', 'ig', 'identificacao', 'pas', 2),
    P('k36', 'p4', 'p4-origem', 'Plataformas de venda digital', 'Hotmart, Hubla, Kiwify: como saber qual post gerou a venda', 'O caminho do rastreio da origem até a venda e o que muda quando você sabe qual conteúdo vende.', 'autonomo', ['profissional'], 'Não saber o que vende', 'integrada', 'demanda', C, 'carrossel', 'ig', 'educativo', 'howto', 2, { note: 'Origem pronta para Hubla; Hotmart e Kiwify por API.' }),
    P('k37', 'p4', 'p4-cac', 'LTV/CAC por canal', 'LTV/CAC: quando vale pagar mais caro por um cliente', 'Um canal caro que traz cliente que fica pode valer mais que um barato que traz venda única.', 'mkt', ['todos'], 'Cortar o canal certo', 'integrada', 'autoridade', C, 'artigo', 'li', 'analise', 'dados', 2, { ex: true }),
    P('k38', 'p4', 'p4-funil', 'Relatório que renova contrato', 'O relatório que renova contrato mostra venda, não alcance', 'Tese para agências: o cliente renova quando vê lead e venda atribuídos ao trabalho.', 'parceiro', ['agencia'], 'Cliente questiona o retorno', 'integrada', 'posicionamento', I, 'texto', 'li', 'opiniao', 'tese', 2),
    P('k39', 'p4', 'p4-funil', 'Vazamentos', 'Onde o seu negócio perde mais dinheiro entre o lead e a recompra', 'Funil em R$: a etapa que mais perde dinheiro raramente é a que recebe mais atenção.', 'dono', ['todos'], 'Receita vazando entre áreas', 'integrada', 'autoridade', C, 'carrossel', 'ig', 'analise', 'dados', 2, { ex: true }),
    P('k40', 'p4', 'p4-funil', 'Coortes', 'Coorte em linguagem de gente: o cliente de março ainda está com você?', 'Como olhar a retenção por mês de entrada sem planilha complexa.', 'mkt', ['todos'], 'Não saber se o cliente fica', 'base', 'educacao', I, 'carrossel', 'ig', 'educativo', 'howto', 1),
    P('k41', 'p4', 'p4-conteudo', 'Experimentação', 'Reels de bastidor ou post bonito? Teste antes de opinar', 'Como montar um teste simples de formato e qual métrica olhar para decidir.', 'autonomo', ['profissional', 'agencia'], 'Decidir conteúdo por gosto', 'rigor', 'audiencia', D, 'reels', 'ig', 'educativo', 'howto', 1),

    // P5 — Mercado e tendências
    P('k42', 'p5', 'p5-pesquisas', 'Varejo farmacêutico', 'Só 8% das farmácias usam o cadastro de clientes para vender', 'O dado da pesquisa Febrafar (2.200 farmácias) e o que ele revela sobre qualquer negócio com cadastro parado.', 'dono', ['farmacia', 'todos'], 'Cadastro sem uso', 'rigor', 'audiencia', D, 'imagem', 'li', 'pesquisa', 'dados', 3, { src: 'Pesquisa Febrafar, mar/2026 (citada no briefing de 04/11; confirmar link antes de publicar)', series: 'numero' }),
    P('k43', 'p5', 'p5-pesquisas', 'Varejo farmacêutico', '56% das farmácias independentes perderam lucro real: o que mudou', 'Raio-X: o dado, as causas prováveis e as decisões que estão ao alcance da loja.', 'dono', ['farmacia'], 'Lucro real caindo', 'rigor', 'autoridade', C, 'documento', 'li', 'analise', 'dados', 2, { src: 'Pesquisa Febrafar, mar/2026 (confirmar link)', series: 'raiox' }),
    P('k44', 'p5', 'p5-pesquisas', 'Agências', 'As cinco maiores dores das agências em 2025, segundo 659 agências', 'Captação, processos, prazos, retrabalho e mensuração: o que cada dor custa e como as agências que crescem respondem.', 'parceiro', ['agencia'], 'Dores operacionais da agência', 'rigor', 'audiencia', D, 'documento', 'li', 'pesquisa', 'dados', 2, { src: 'Panorama RD Station 2025 — https://www.rdstation.com/pesquisas/panoramas-rd-station/edicao-2025/agencias/cenario/', series: 'raiox' }),
    P('k45', 'p5', 'p5-setores', 'Contabilidade consultiva', '79% dos escritórios contábeis não têm área comercial: risco ou oportunidade?', 'O dado de Sescon-SP e Omie e o que separa o escritório que cresce por indicação do que cresce por método.', 'parceiro', ['contabilidade'], 'Escritório sem gestão comercial', 'rigor', 'engajamento', I, 'texto', 'li', 'analise', 'dados', 2, { src: 'Escola Exchange (Sescon-SP 2024, Omie 2025) — https://escolaexchange.com.br/benchmark-desafios-do-setor-contabil/' }),
    P('k46', 'p5', 'p5-setores', 'Contabilidade consultiva', '101.880 organizações contábeis e um serviço que o cliente ainda não percebe', 'Número da semana: o tamanho do setor e a lacuna do serviço consultivo (58% dizem que o cliente não percebe valor).', 'parceiro', ['contabilidade'], 'Valor consultivo invisível', 'rigor', 'audiencia', D, 'imagem', 'li', 'pesquisa', 'dados', 1, { src: 'CFC, Relato Integrado 2025 — https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf', series: 'numero' }),
    P('k47', 'p5', 'p5-ia', 'O que a IA faz bem', 'IA na gestão: o que ela faz bem e o que nunca deveria fazer', 'Ler, explicar, priorizar: sim. Criar número: nunca. Um critério simples para avaliar qualquer ferramenta com IA.', 'dono', ['todos'], 'Desconfiança ou hype de IA', 'rigor', 'posicionamento', D, 'reels', 'ig', 'opiniao', 'tese', 3),
    P('k48', 'p5', 'p5-ia', 'O que a IA não deve fazer', 'A IA não deveria inventar número. A regra que adotamos.', 'Bastidor do princípio fixo da Elevah e por que ele limita o que o produto faz.', 'dono', ['todos'], 'Confiança nos dados', 'rigor', 'autoridade', C, 'texto', 'li', 'bastidores', 'tese', 2, { src: DOC }),
    P('k49', 'p5', 'p5-comportamento', 'WhatsApp como balcão', 'O WhatsApp virou o balcão. O que muda na expectativa de resposta', 'Quando o primeiro contato é por mensagem, o tempo de resposta passa a ser parte do atendimento.', 'gestor', ['todos'], 'Atendimento lento por mensagem', 'base', 'engajamento', I, 'carrossel', 'ig', 'tendencia', 'pis', 1),
    P('k50', 'p5', 'p5-comportamento', 'Autoatendimento', 'Seu cliente quer agendar às 22h. Quem atende?', 'A pergunta de preço fora do horário e o lead que esfria até a recepção abrir.', 'gestor', ['gestao', 'pet', 'profissional'], 'Lead fora do horário', 'acao', 'audiencia', D, 'reels', 'ig', 'identificacao', 'pas', 2),
    P('k51', 'p5', 'p5-setores', 'Contabilidade consultiva', 'O contador que entrega DRE e forecast vira consultor', 'Tendência: o painel gerencial por empresa transforma o escritório em serviço consultivo cobrado.', 'parceiro', ['contabilidade'], 'Serviço visto como commodity', 'antecipacao', 'autoridade', C, 'artigo', 'li', 'tendencia', 'tese', 2, { src: 'Escola Exchange — https://escolaexchange.com.br/benchmark-desafios-do-setor-contabil/' }),

    // P6 — Gestão e equipe
    P('k52', 'p6', 'p6-equipe', 'Cada um vê o próprio número', 'Cada pessoa vendo o próprio número: responsabilidade sem microgestão', 'Quando cada profissional vê agenda, produção e meta, o gestor deixa de cobrar e passa a orientar.', 'gestor', ['gestao', 'farmacia', 'lojista'], 'Microgestão', 'acao', 'posicionamento', I, 'texto', 'li', 'opiniao', 'tese', 2),
    P('k53', 'p6', 'p6-equipe', 'Comissão automática', 'Comissão em planilha: o custo invisível do fim do mês', 'Horas de conferência, erro e desconfiança da equipe: o custo que não aparece na DRE.', 'gestor', ['gestao', 'farmacia', 'pet'], 'Comissão manual', 'acao', 'audiencia', D, 'reels', 'ig', 'identificacao', 'pas', 1),
    P('k54', 'p6', 'p6-rotina', '2 minutos por dia', 'Os dois minutos que o dono deveria gastar toda manhã', 'Três números para olhar antes de abrir o WhatsApp: ritmo × meta, o que pede ação e quanto vale.', 'dono', ['todos'], 'Dono apagando incêndio', 'acao', 'audiencia', D, 'reels', 'ig', 'educativo', 'howto', 2),
    P('k55', 'p6', 'p6-processos', 'Do orçamento à nota', 'Orçamento, contrato, cobrança e nota: cada passo manual é um dia a mais para receber', 'Mapear os passos entre o sim do cliente e o dinheiro na conta. Conteúdo educativo, sem demonstração (módulo em construção).', 'financeiro', ['gestao', 'agencia', 'contabilidade'], 'Processo manual de venda', 'integrada', 'educacao', I, 'carrossel', 'ig', 'educativo', 'lista', 1, { note: 'Módulo de vendas não construído: não demonstrar.' }),
    P('k56', 'p6', 'p6-equipe', 'Ranking e meta individual', 'Ranking da equipe motiva ou desmotiva?', 'O que faz meta individual funcionar: número próprio, lista de ação e reconhecimento, não exposição.', 'gestor', ['farmacia', 'lojista'], 'Meta individual mal desenhada', 'acao', 'engajamento', I, 'carrossel', 'ig', 'educativo', 'qa', 1),
    P('k57', 'p6', 'p6-rotina', 'Priorizar por R$', 'Comece o dia pelo que vale mais, não pelo que grita mais', 'Urgência e valor são coisas diferentes. Ordenar riscos e oportunidades por R$ muda a agenda do dono.', 'dono', ['todos'], 'Prioridade pela urgência', 'acao', 'autoridade', C, 'texto', 'li', 'opiniao', 'tese', 2),
    P('k58', 'p6', 'p6-rotina', 'Priorizar por R$', 'O problema não é vender. É saber onde o dinheiro escapa.', 'Identificação: o dono que vende bem e não entende por que o caixa aperta.', 'dono', ['todos'], 'Dinheiro escapando', 'impacto', 'audiencia', D, 'reels', 'ig', 'identificacao', 'pas', 2),
    P('k59', 'p6', 'p6-rotina', 'Fechamento mensal', 'Checklist de fechamento mensal em 10 perguntas', 'Dez perguntas para fazer no dia 30 (e no dia 10) que cabem numa lâmina e viram rotina.', 'gestor', ['todos'], 'Fechamento sem rotina', 'acao', 'fidelizacao', R, 'carrossel', 'ig', 'ferramenta', 'lista', 2),

    // P7 — Elevah na prática
    P('k60', 'p7', 'p7-demo', 'Forecast', 'Na tela: o forecast do mês com o impacto de uma falta', 'Demonstração de 45 s: ritmo, projeção, o desvio de um profissional afastado e a lista de pacientes para chamar.', 'dono', ['gestao'], 'Dúvida se funciona', 'antecipacao', 'demanda', C, 'video', 'ig', 'demonstracao', 'pis', 3, { series: 'natela', note: 'Recurso pronto (depende dos dados do cliente).' }),
    P('k61', 'p7', 'p7-demo', 'Origem do cliente', 'Na tela: de onde vem cada cliente', 'Origem por canal, campanha e anúncio com a Hubla conectada.', 'autonomo', ['profissional'], 'Não saber o que vende', 'integrada', 'demanda', C, 'video', 'ig', 'demonstracao', '4ps', 2, { series: 'natela', note: 'Pronto para Hubla.' }),
    P('k62', 'p7', 'p7-demo', 'Margem', 'Na tela: margem por item em 30 segundos', 'Os itens que mais vendem ordenados pela margem real.', 'financeiro', ['lojista', 'farmacia', 'gestao'], 'Margem desconhecida', 'impacto', 'demanda', C, 'video', 'ig', 'demonstracao', 'pis', 2, { series: 'natela' }),
    P('k63', 'p7', 'p7-demo', 'Agendamento', 'Link de agendamento: a agenda aberta 24h', 'O cliente agenda sozinho pelo Instagram, Google ou WhatsApp. Promessa, cena, prova e convite.', 'gestor', ['gestao', 'pet', 'profissional'], 'Agenda dependente da recepção', 'acao', 'conversao', V, 'video', 'ig', 'demonstracao', '4ps', 2, { note: 'Link pronto.' }),
    P('k64', 'p7', 'p7-comercial', 'Diagnóstico', 'Diagnóstico de 20 minutos: o forecast do seu mês com os seus dados', 'Convite claro: o que a pessoa leva da conversa, quanto tempo leva e o que precisa trazer.', 'dono', ['todos'], 'Intenção sem próximo passo', 'antecipacao', 'leads', V, 'texto', 'li', 'comercial', 'aida', 3),
    P('k65', 'p7', 'p7-comercial', 'Para quem é', 'Para quem a Elevah é (e para quem não é)', 'Resposta honesta: perfis atendidos e o que não cobrimos (PDV, TISS, escrituração contábil).', 'dono', ['todos'], 'Dúvida de encaixe', 'rigor', 'conversao', V, 'carrossel', 'ig', 'institucional', 'qa', 2, { src: DOC }),
    P('k66', 'p7', 'p7-comercial', 'Preço', 'Quanto custa a Elevah e por que não cobramos por usuário', 'Preço por perfil e a lógica de acesso ilimitado para a equipe.', 'dono', ['todos'], 'Objeção de preço', 'acao', 'conversao', V, 'texto', 'li', 'comercial', 'qa', 1, { src: DOC, note: 'Preços são hipótese: publicar só após validação comercial.' }),
    P('k67', 'p7', 'p7-bastidores', 'Como construímos', 'Como construímos: o mapa de entregas aberto', 'O que está pronto, em teste e em construção, e por que mostramos isso.', 'dono', ['todos'], 'Confiança na empresa', 'rigor', 'relacionamento', R, 'texto', 'li', 'bastidores', 'story', 2),
    P('k68', 'p7', 'p7-bastidores', 'Perguntas da audiência', 'Pergunta da semana: qual número você olha primeiro na segunda-feira?', 'Caixa de pergunta nos stories; respostas viram pauta.', 'dono', ['todos'], 'Conversa com a audiência', 'acao', 'relacionamento', R, 'stories', 'ig', 'relacionamento', 'qa', 2),
    P('k69', 'p7', 'p7-casos', 'Exemplos ilustrativos', 'Clínica com 6 profissionais: do forecast de 92% de volta a 99%', 'Biomédica afastada, 64 pacientes em tratamento sem sessão marcada, lembrete pelo WhatsApp e agenda preenchida.', 'gestor', ['gestao'], 'Dúvida sobre resultado', 'acao', 'demanda', C, 'carrossel', 'ig', 'case', 'bab', 2, { ex: true, src: DOC, note: 'Exemplo ilustrativo do documento: sinalizar como tal.' }),
    P('k70', 'p7', 'p7-comercial', 'Para quem é', 'Inteligência por cima do seu sistema, sem migração', 'Para farmácia e loja que já têm ERP: a Elevah lê vendas, estoque e clientes e entrega metas e listas.', 'dono', ['farmacia', 'lojista'], 'Medo de migrar de sistema', 'integrada', 'leads', V, 'carrossel', 'ig', 'comercial', '4ps', 1, { note: 'Leitura de ERP ainda sem teste: segurar até validação.' }),
    P('k71', 'p7', 'p7-bastidores', 'Perguntas da audiência', 'Respondemos: a dúvida mais comum da semana', 'Uma pergunta real de seguidor ou cliente respondida em texto curto ou stories.', 'dono', ['todos'], 'Dúvidas recorrentes', 'rigor', 'relacionamento', R, 'stories', 'ig', 'relacionamento', 'qa', 1)
  ];

  /* ------------------------------------------------------------------ */
  /* 10. Calendário inicial (nov/2026) + histórico demo (out/2026)        */
  /* ------------------------------------------------------------------ */
  const plan = [
    ['2026-11-02', 'k07', 'publicado', 'Conteúdo'], ['2026-11-03', 'k44', 'publicado', 'Conteúdo'],
    ['2026-11-04', 'k22', 'publicado', 'Design'], ['2026-11-05', 'k05', 'agendado', 'Conteúdo'],
    ['2026-11-06', 'k68', 'aprovado', 'Conteúdo'],
    ['2026-11-09', 'k14', 'producao', 'Vídeo'], ['2026-11-10', 'k33', 'roteiro', 'Conteúdo'],
    ['2026-11-11', 'k60', 'producao', 'Vídeo'], ['2026-11-12', 'k42', 'roteiro', 'Design'],
    ['2026-11-16', 'k21', 'priorizado', 'Vídeo'], ['2026-11-17', 'k57', 'priorizado', 'Conteúdo'],
    ['2026-11-18', 'k34', 'priorizado', 'Design'], ['2026-11-19', 'k64', 'priorizado', 'Comercial'],
    ['2026-11-20', 'k69', 'priorizado', 'Design'],
    ['2026-11-23', 'k11', 'priorizado', 'Vídeo'], ['2026-11-24', 'k51', 'priorizado', 'Conteúdo'],
    ['2026-11-25', 'k02', 'priorizado', 'Design'], ['2026-11-27', 'k63', 'priorizado', 'Vídeo']
  ];

  /* Métricas de demonstração (fictícias) — out/2026 e primeira semana de nov */
  const history = [
    ['2026-10-05', 'k66', { alcance: 1180, visualizacoes: 1420, naoSeguidores: 18, visitasPerfil: 22, novosSeguidores: 2, salvamentos: 4, compartilhamentos: 1, comentarios: 3, cliques: 9, leads: 1, conversas: 1 }],
    ['2026-10-07', 'k61', { alcance: 1640, visualizacoes: 2310, naoSeguidores: 31, visitasPerfil: 48, novosSeguidores: 6, salvamentos: 11, compartilhamentos: 4, comentarios: 5, cliques: 17, leads: 2, conversas: 2 }],
    ['2026-10-09', 'k23', { alcance: 4820, visualizacoes: 6100, naoSeguidores: 58, visitasPerfil: 96, novosSeguidores: 21, salvamentos: 88, compartilhamentos: 41, comentarios: 12, cliques: 6, leads: 0, conversas: 0 }],
    ['2026-10-13', 'k65', { alcance: 1350, visualizacoes: 1690, naoSeguidores: 22, visitasPerfil: 35, novosSeguidores: 3, salvamentos: 9, compartilhamentos: 2, comentarios: 4, cliques: 14, leads: 2, conversas: 1 }],
    ['2026-10-15', 'k32', { alcance: 3960, visualizacoes: 5200, naoSeguidores: 52, visitasPerfil: 74, novosSeguidores: 15, salvamentos: 102, compartilhamentos: 37, comentarios: 9, cliques: 4, leads: 0, conversas: 0 }],
    ['2026-10-19', 'k62', { alcance: 1520, visualizacoes: 2080, naoSeguidores: 27, visitasPerfil: 41, novosSeguidores: 4, salvamentos: 14, compartilhamentos: 3, comentarios: 6, cliques: 21, leads: 3, conversas: 2 }],
    ['2026-10-21', 'k47', { alcance: 7340, visualizacoes: 11800, naoSeguidores: 71, visitasPerfil: 158, novosSeguidores: 44, salvamentos: 64, compartilhamentos: 59, comentarios: 31, cliques: 8, leads: 1, conversas: 1 }],
    ['2026-10-23', 'k53', { alcance: 5210, visualizacoes: 8900, naoSeguidores: 66, visitasPerfil: 87, novosSeguidores: 19, salvamentos: 23, compartilhamentos: 48, comentarios: 27, cliques: 2, leads: 0, conversas: 0 }],
    ['2026-10-27', 'k28', { alcance: 2440, visualizacoes: 3150, naoSeguidores: 34, visitasPerfil: 52, novosSeguidores: 7, salvamentos: 71, compartilhamentos: 18, comentarios: 8, cliques: 5, leads: 0, conversas: 0 }],
    ['2026-10-29', 'k67', { alcance: 1890, visualizacoes: 2240, naoSeguidores: 19, visitasPerfil: 33, novosSeguidores: 5, salvamentos: 12, compartilhamentos: 6, comentarios: 22, cliques: 7, leads: 1, conversas: 1 }],
    ['2026-11-02', 'k07', { alcance: 6120, visualizacoes: 9480, naoSeguidores: 69, visitasPerfil: 131, novosSeguidores: 37, salvamentos: 58, compartilhamentos: 52, comentarios: 24, cliques: 3, leads: 0, conversas: 0 }],
    ['2026-11-03', 'k44', { alcance: 3380, visualizacoes: 4010, naoSeguidores: 61, visitasPerfil: 69, novosSeguidores: 18, salvamentos: 47, compartilhamentos: 29, comentarios: 14, cliques: 11, leads: 1, conversas: 1 }],
    ['2026-11-04', 'k22', { alcance: 2910, visualizacoes: 3720, naoSeguidores: 38, visitasPerfil: 57, novosSeguidores: 9, salvamentos: 96, compartilhamentos: 22, comentarios: 11, cliques: 6, leads: 0, conversas: 0 }]
  ];

  /* ------------------------------------------------------------------ */
  /* 11. Radar de pautas (fontes reais do documento + exemplos simulados) */
  /* ------------------------------------------------------------------ */
  const radar = [
    { id: 'n1', title: 'Pesquisa Febrafar: 56% das farmácias independentes tiveram queda de lucro real (2020–2024); 8% usam o cadastro de clientes para vender', source: 'Febrafar (2.200 farmácias, mar/2026), citada no briefing de 04/11', url: '', date: '2026-03-15', kind: 'Pesquisa setorial', simulated: false, pillar: 'p5',
      scores: { relevancia: 3, conexao: 3, interesse: 3, atualidade: 2, credibilidade: 2, analise: 3, associacao: 3, canal: 3, duradouro: 2 }, notes: 'Link original a confirmar antes de publicar.', status: 'convertido', ideaId: 'k42' },
    { id: 'n2', title: 'Panorama RD Station 2025: captação (17%), processos (14%), prazos (11%), retrabalho (11%) e mensuração (10%) lideram as dores das agências', source: 'RD Station — Panorama 2025, 659 agências', url: 'https://www.rdstation.com/pesquisas/panoramas-rd-station/edicao-2025/agencias/cenario/', date: '2025-06-01', kind: 'Pesquisa setorial', simulated: false, pillar: 'p5',
      scores: { relevancia: 2, conexao: 3, interesse: 2, atualidade: 2, credibilidade: 3, analise: 3, associacao: 2, canal: 3, duradouro: 2 }, notes: '', status: 'convertido', ideaId: 'k44' },
    { id: 'n3', title: 'CFC: 101.880 organizações contábeis ativas no Brasil (Relato Integrado 2025)', source: 'Conselho Federal de Contabilidade', url: 'https://cfc.org.br/wp-content/uploads/2026/05/RI_2025.pdf', date: '2026-05-01', kind: 'Dado institucional', simulated: false, pillar: 'p5',
      scores: { relevancia: 2, conexao: 2, interesse: 1, atualidade: 2, credibilidade: 3, analise: 2, associacao: 2, canal: 2, duradouro: 2 }, notes: 'Número forte para série "O número da semana".', status: 'novo' },
    { id: 'n4', title: '79% dos escritórios contábeis não têm área comercial; 58% dizem que o cliente não percebe valor no serviço consultivo', source: 'Escola Exchange (compilação Sescon-SP 2024 e Sondagem Omie 2025)', url: 'https://escolaexchange.com.br/benchmark-desafios-do-setor-contabil/', date: '2025-08-01', kind: 'Compilação de pesquisas', simulated: false, pillar: 'p5',
      scores: { relevancia: 3, conexao: 3, interesse: 2, atualidade: 2, credibilidade: 2, analise: 3, associacao: 3, canal: 3, duradouro: 3 }, notes: 'Fonte secundária: citar as pesquisas originais.', status: 'novo' },
    { id: 'n5', title: 'Responder um lead em até 1 hora aumenta em cerca de 7 vezes a chance de qualificá-lo', source: 'Harvard Business Review, 2011', url: 'https://hbr.org/2011/03/the-short-life-of-online-sales-leads', date: '2011-03-01', kind: 'Estudo', simulated: false, pillar: 'p3',
      scores: { relevancia: 3, conexao: 3, interesse: 3, atualidade: 0, credibilidade: 3, analise: 2, associacao: 3, canal: 3, duradouro: 3 }, notes: 'Antigo: usar como base educativa, sempre com a data.', status: 'convertido', ideaId: 'k23' },
    { id: 'n6', title: 'Lembretes digitais aumentam o comparecimento a consultas (revisão sistemática com meta-análise)', source: 'PubMed 27798006', url: 'https://pubmed.ncbi.nlm.nih.gov/27798006/', date: '2016-11-01', kind: 'Estudo científico', simulated: false, pillar: 'p3',
      scores: { relevancia: 2, conexao: 3, interesse: 2, atualidade: 0, credibilidade: 3, analise: 2, associacao: 3, canal: 2, duradouro: 3 }, notes: '', status: 'novo' },
    { id: 'n7', title: 'EXEMPLO SIMULADO — Big tech anuncia novo assistente de IA para planilhas', source: 'Exemplo para demonstração (não é notícia real)', url: '', date: '2026-11-04', kind: 'Notícia de tecnologia', simulated: true, pillar: 'p5',
      scores: { relevancia: 1, conexao: 2, interesse: 2, atualidade: 3, credibilidade: 1, analise: 2, associacao: 2, canal: 2, duradouro: 1 }, notes: 'Mostra o filtro: tema em alta, mas fonte a verificar.', status: 'novo' },
    { id: 'n8', title: 'EXEMPLO SIMULADO — Trend viral de dancinha "vendedor do mês"', source: 'Exemplo para demonstração (não é notícia real)', url: '', date: '2026-11-03', kind: 'Tendência de redes', simulated: true, pillar: 'p6',
      scores: { relevancia: 1, conexao: 0, interesse: 3, atualidade: 3, credibilidade: 2, analise: 0, associacao: 0, canal: 2, duradouro: 0 }, notes: 'Em alta, sem ligação com o posicionamento.', status: 'novo' }
  ];

  const radarCriteria = [
    { id: 'relevancia', name: 'Relevância para o público', w: 2 },
    { id: 'conexao', name: 'Conexão com territórios Elevah', w: 2 },
    { id: 'credibilidade', name: 'Credibilidade da fonte', w: 2 },
    { id: 'analise', name: 'Espaço para análise própria', w: 1.5 },
    { id: 'associacao', name: 'Reforça associação de marca', w: 1.5 },
    { id: 'interesse', name: 'Interesse potencial', w: 1 },
    { id: 'atualidade', name: 'Atualidade', w: 1 },
    { id: 'duradouro', name: 'Interesse duradouro', w: 1 },
    { id: 'canal', name: 'Adequação ao canal', w: 0.5 }
  ];

  const statuses = [
    { id: 'ideia', name: 'Ideia' },
    { id: 'priorizado', name: 'Priorizado' },
    { id: 'roteiro', name: 'Roteiro' },
    { id: 'producao', name: 'Produção e revisão' },
    { id: 'aprovado', name: 'Aprovado' },
    { id: 'agendado', name: 'Agendado' },
    { id: 'publicado', name: 'Publicado' }
  ];

  const targetPresets = [
    { id: 'crescimento', name: 'Construção de audiência (recomendado agora)', t: { descoberta: 40, interesse: 20, consideracao: 25, conversao: 10, relacionamento: 5 },
      why: 'A marca é nova e a maior parte do público não está comprando agora (regra 95-5): prioridade é alcance e memória. Consideração fica acima de interesse porque a compra é B2B, de valor recorrente, e exige prova de método. Conversão em 10% mantém o convite presente sem cansar. Relacionamento começa pequeno porque a base ainda é pequena.' },
    { id: 'comercial', name: 'Ativação comercial', t: { descoberta: 30, interesse: 20, consideracao: 25, conversao: 20, relacionamento: 5 },
      why: 'Para períodos de campanha ou abertura de agenda de diagnósticos. Usar por 2–4 semanas e voltar.' },
    { id: 'madura', name: 'Base madura', t: { descoberta: 30, interesse: 20, consideracao: 20, conversao: 10, relacionamento: 20 },
      why: 'Quando houver audiência e clientes suficientes para que retenção e indicação pesem no crescimento.' }
  ];

  return { positioning, associations, entryPoints, stages, objectives, channels, formats, roles, profiles,
    audienceMatrix, sharedTerritories, pillars, types, frameworks, series, references, ideas, plan, history,
    radar, radarCriteria, statuses, targetPresets };
})();
