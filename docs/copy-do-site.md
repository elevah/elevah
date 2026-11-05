# Parte 1 — Copy final do site Elevah

Novembro de 2026 · Fonte de verdade: *Elevah: entregas, valor e preço por perfil* (04/11/2026)

**Sobre os materiais.** O Material 1 (copy anterior) não chegou a esta sessão e o site da Tríade Health não é acessível pela rede desta sessão. A copy abaixo parte do documento de ofertas e da estratégia de conteúdo já aprovada. Da Tríade, uso a estrutura que a tornou referência: proposta de valor na primeira dobra, soluções apresentadas pelo resultado, telas reais como prova, um único convite repetido com clareza.

**Legenda de disponibilidade** (usar internamente; no site, nunca prometer o que está em "planejado" como se existisse):

- ✅ **Pronto**: forecast, faturamento e custos, origem do cliente (Hubla), link de agendamento, margem por item, hub Mercado Livre.
- 🔄 **Em teste**: concorrentes, redes e anúncios (aguarda Meta), calendário de agenda.
- 🛠 **Em construção**: início executivo, metas, clientes e retenção, campanhas e WhatsApp, estoque, RevOps, voz do cliente, DRE e caixa, portal (exceto agendamento), equipe e comissão.
- 📋 **Planejado**: vendas (orçamento, contrato, cobrança, nota), prontuário, leitura de ERP (Linx, Trier, Bling), NF-e, Hotmart e Kiwify.

No site, recursos ✅ podem ser mostrados em tela. Recursos 🔄 e 🛠 aparecem como capacidades da plataforma descritas no presente, sem demonstração. Recursos 📋 aparecem como "em breve" ou ficam fora.

---

## 1. Arquitetura recomendada

```
Home
├─ Soluções (menu com 6 itens; cada um é uma página)
│  ├─ Previsão e resultado        (Financeiro e forecast · Início · Metas)
│  ├─ Clientes e recorrência      (Clientes e retenção · Campanhas e WhatsApp · Voz do cliente)
│  ├─ Origem e funil              (Funil, CRM e origem · Redes e conteúdo · RevOps)
│  ├─ Margem, estoque e capacidade(Preço e margem · Estoque e compras · Agenda)
│  ├─ Equipe e operação           (Unidades e equipe · Vendas · Portal do cliente)
│  └─ Integrações
├─ Para quem (uma página com 7 seções âncora; cada perfil também pode virar página própria para campanhas)
│  ├─ Clínicas e serviços com equipe
│  ├─ Farmácias
│  ├─ Lojas
│  ├─ Profissionais e criadores
│  ├─ Pet shops
│  ├─ Agências
│  └─ Escritórios contábeis
├─ Como funciona (método: efetivo → vigente → projeção → ação)
├─ Sobre
└─ Agendar diagnóstico (página de conversão)
```

Por que assim: a Home vende a plataforma inteira e o método. "Soluções" organiza os 19 módulos em 6 resultados, que é como o cliente pensa. "Para quem" mostra o encaixe sem fragmentar a marca: cada perfil é uma aplicação da mesma lógica. O CTA é um só em todo o site ("Agendar diagnóstico"), com variação secundária ("Ver como funciona").

**Hierarquia visual (orientação geral):** primeira dobra com headline, subheadline, CTA e uma tela real do forecast. Seções alternam texto à esquerda + tela à direita. Fundo branco, cartões cinza, azul só em CTAs secundários e destaques. Títulos curtos (até 8 palavras), parágrafos de até 2 linhas, listas de no máximo 4 itens.

---

## 2. Home

### 2.1 Headline principal: três alternativas

| | Headline | Subheadline | Avaliação |
|---|---|---|---|
| **A (recomendada)** | **Veja o resultado do mês antes do mês acabar.** | A Elevah mostra para onde o seu negócio vai, quanto cada desvio custa e o que fazer hoje. Com a lista de quem acionar. | Concreta, memorável, traduz a promessa "ver antes" sem jargão. Serve a todos os perfis. Foca no que já está pronto (forecast). |
| B | Dados conectados. Decisões antes do problema. | Faturamento, clientes, estoque e marketing num só lugar, com a próxima ação pronta e o impacto em reais. | Boa para posicionar "integrado", mas abstrata na primeira leitura. Usar como título de seção. |
| C | O que está acontecendo no seu negócio, em reais, agora. | Inteligência que lê os seus dados, encontra onde o dinheiro escapa e indica a ação com maior retorno. | Forte em "impacto em R$", mas perde a ideia de antecipação, que é o diferencial. |

**Recomendação: A.** É a única que descreve uma cena que o dono reconhece (fechar o mês e descobrir tarde) e a inverte. As outras duas ficam como títulos de seção dentro da Home.

### 2.2 Seções da Home (copy final)

**Seção 1 · Hero**

- Eyebrow: Inteligência de gestão para negócios que querem crescer com margem
- H1: **Veja o resultado do mês antes do mês acabar.**
- Sub: A Elevah mostra para onde o seu negócio vai, quanto cada desvio custa e o que fazer hoje. Com a lista de quem acionar.
- CTA primário: **Agendar diagnóstico**
- CTA secundário: Ver como funciona
- Microtexto sob o CTA: 20 minutos, com os seus dados. Sem compromisso.
- Visual: tela do forecast com realizado, projeção e % da meta. Legenda na imagem: "Dia 12: ritmo projeta 95% da meta. 140 clientes fora do ciclo para chamar."

**Seção 2 · O problema (identificação curta)**

- H2: **O resultado chega no dia 30. A decisão precisava ter sido no dia 10.**
- Três colunas, cada uma com ícone, título e uma linha:
  - **Cinco sistemas, nenhuma resposta.** Agenda, financeiro, WhatsApp, planilha e redes contam histórias diferentes.
  - **O problema aparece tarde.** Estoque que vence, agenda vazia, cliente que sumiu: tudo descoberto no fechamento.
  - **Dado sem ação.** Relatório mostra o número. Ninguém diz o que fazer, para quem e quanto vale.

**Seção 3 · O método (como funciona)**

- H2: **Quatro perguntas. Uma tela.**
- Sub: Todo módulo da Elevah responde na mesma ordem, para você não precisar montar a análise.
- Quatro passos numerados (passos reais, por isso numerados):
  1. **Efetivo** · O que já aconteceu. Faturamento, custo e resultado fechados, por canal, pessoa e produto.
  2. **Vigente** · O que está acontecendo. Quanto do mês já foi, em que ritmo, comparado com a meta.
  3. **Projeção** · Onde vai parar. O ritmo atual até o fim do período, com o efeito de cada desvio.
  4. **Ação** · O que fazer e para quem. Uma ação concreta, a lista pronta e o impacto estimado em reais.
- Nota curta abaixo: A inteligência da Elevah lê os seus dados, explica o desvio e prioriza. Ela nunca cria número.
- Visual: a tela do Início (quando pronta) ou a do forecast com os quatro blocos destacados.

**Seção 4 · Soluções por resultado**

- H2: **Dados conectados. Decisões antes do problema.**
- Sub: Seis frentes que compartilham a mesma base de dados e a mesma lógica.
- Seis cartões (título, uma linha, link "Saiba mais"):
  - **Previsão e resultado** · Forecast do mês, meta por pessoa, custo que cresceu sem ninguém notar.
  - **Clientes e recorrência** · Quem passou do prazo de voltar, quem está perto de recomprar, quanto isso vale.
  - **Origem e funil** · De onde vem cada cliente e quanto custa, do post à venda.
  - **Margem, estoque e capacidade** · Margem real por item e canal, estoque a vencer, hora vazia na agenda.
  - **Equipe e operação** · Cada pessoa vê o próprio número. Agenda, comissão e portal do cliente.
  - **Integrações** · A Elevah lê o que você já usa: plataformas de venda, marketplaces, redes e cobrança.

**Seção 5 · Em tela (demonstração)**

- H2: **O que está pronto, mostrado como é.**
- Três abas ou três blocos, cada um com uma tela real e uma linha:
  - **Forecast** · Realizado, projeção e o impacto de um imprevisto antes de acontecer.
  - **Origem do cliente** · Canal, campanha e anúncio de cada venda, com a plataforma de venda conectada.
  - **Margem por item** · Os produtos que mais vendem, ordenados pelo lucro real.
  - **Agendamento** · O cliente agenda sozinho, 24 horas, pelo link no Instagram, Google ou WhatsApp.
- Rodapé da seção: Veja estas telas com os seus dados no diagnóstico. → Agendar diagnóstico

**Seção 6 · Para quem**

- H2: **Uma lógica. Sete negócios diferentes.**
- Sub: O papel da Elevah muda conforme o negócio. A inteligência é a mesma.
- Sete linhas (nome do perfil, papel, uma frase):
  - **Clínicas e serviços com equipe** · Sistema único · Agenda, pacientes, financeiro e campanhas num só lugar.
  - **Farmácias** · Camada sobre o seu sistema · Validade cruzada com quem compra, meta por balconista.
  - **Lojas** · Gestão ou camada sobre o ERP · Produto parado encontra o cliente certo; margem real por canal.
  - **Profissionais e criadores** · Painel do conteúdo à venda · Qual post e qual anúncio geraram a venda.
  - **Pet shops** · Gestão do serviço recorrente · Pets atrasados para o banho, pacotes e ocupação.
  - **Agências** · Gestão e portal com a sua marca · Relatório que mostra venda, não só alcance.
  - **Escritórios contábeis** · Gestão comercial e painel para cada empresa · Serviço consultivo visível e cobrado.
- Link: Ver aplicações por negócio →

**Seção 7 · Diferenciais**

- H2: **O que muda quando os dados contam a mesma história.**
- Quatro itens, sem ícone de "IA":
  - **Antecipação com valor.** Não só quanto vai faturar: quanto custa cada imprevisto e o que fazer antes.
  - **Ação pronta.** A tela chega com o número, o motivo, a lista de clientes e o impacto se a ação for feita ou não.
  - **Ponta a ponta.** Conteúdo, lead, venda, recompra e caixa no mesmo lugar. Marketing e operação olhando o mesmo número.
  - **Toda a equipe dentro.** Cada pessoa vê a própria agenda, meta e produção. Sem custo por acesso.

**Seção 8 · Confiança (só o verificável)**

- H2: **Transparência faz parte do produto.**
- Três linhas:
  - **A inteligência não inventa número.** Ela lê, explica e prioriza. Toda projeção vem do seu dado.
  - **Mapa de entregas aberto.** Você sabe o que está pronto, em teste e em construção.
  - **Fontes citadas.** Quando usamos pesquisa de mercado, a referência vai junto.
- *Nota de implementação:* não incluir depoimentos, logos ou números de clientes até existirem e serem autorizados. Quando houver, esta seção recebe um bloco "Quem já usa".

**Seção 9 · CTA final**

- H2: **Veja o seu mês antes de ele acabar.**
- Sub: Em 20 minutos, mostramos o forecast com os seus dados e a primeira lista de ação.
- CTA: **Agendar diagnóstico**
- Microtexto: Para negócios com equipe, estoque, agenda ou base de clientes. Sem compromisso.

**Rodapé**

- Colunas: Soluções · Para quem · Como funciona · Sobre · Contato.
- Linha: Elevah · Inteligência de gestão orientada a resultado.

---

## 3. Páginas de soluções

Cada página segue o mesmo esqueleto: hero (benefício), problema, resultado esperado, o que sustenta a entrega (funcionalidades com status), diferenciais, aplicações por perfil, CTA.

### 3.1 Previsão e resultado

- H1: **Saiba hoje se vai bater a meta. Não no dia 30.**
- Sub: Faturamento, custos e projeção do mês, com o impacto de cada desvio e a ação para corrigir o rumo.
- **Resolve:** vender muito e sobrar pouco sem saber onde o dinheiro escapa; descobrir o resultado só no fechamento; meta que fica no papel.
- **Resultado esperado:** decisão com 20 dias de margem em vez de zero. Custo que cresceu identificado no mês em que cresceu. Meta quebrada por pessoa e por dia.
- **O que sustenta a entrega:**
  - Faturamento por dia, canal, serviço, produto e profissional, com média histórica. ✅
  - Custos fixos e variáveis por categoria, com variação contra o mês anterior. ✅
  - Forecast: realizado + projeção pelo ritmo, % da meta, cenário com desvio (falta de produto ou de profissional). ✅
  - Início: riscos e oportunidades ordenados por valor em reais, com botão de ação. 🛠 *(no site: "Painel de ação, em construção")*
  - Metas do ano ao mês, por unidade e por pessoa; plano de ação em kanban. 🛠
  - DRE gerencial e fluxo de caixa projetado. 🛠
  - Orçamento e cenários: altere preço, volume ou contratação e veja o efeito. 🛠
- **Diferenciais:** projeção com o custo de cada imprevisto; ação sugerida com a lista pronta; revisão mensal com a pauta preparada (desvio, causa, três decisões).
- **Aplicações:** clínica com profissional afastado vê as horas perdidas e os pacientes para remanejar; farmácia vê a loja que projeta 88% e o desvio por balconista; escritório contábil entrega o forecast de cada empresa cliente.
- CTA: **Ver o forecast com os meus dados**

### 3.2 Clientes e recorrência

- H1: **O cliente que sumiu não reclamou. Ele só não voltou.**
- Sub: A Elevah mostra quem passou do prazo de retorno, quem está perto de recomprar e quanto isso vale. E manda a mensagem certa para a pessoa certa.
- **Resolve:** cliente fora do ciclo que ninguém chama; resposta lenta ao lead; campanha mandada para todo mundo; avaliação sem resposta.
- **Resultado esperado:** lista pronta de quem chamar hoje, com valor em reais. Campanha para quem tem motivo para comprar. Menos falta e menos lead esfriando.
- **O que sustenta a entrega:**
  - Ficha do cliente: frequência, ticket, último atendimento, origem. 🛠
  - Fora do ciclo: quem passou do intervalo normal de retorno e quanto vale. 🛠
  - Cliente certo para o produto: histórico × estoque × margem. 🛠
  - Atendimento automático 24h com envio do link de agendamento. 🛠 *(depende de aprovação da Meta)*
  - Confirmação, lembrete e remarcação que atualizam a agenda. 🛠
  - Listas sugeridas e resultado da campanha em reais. 🛠
  - Avaliações do Google e redes num só lugar; temas que mais pesam; voz do cliente ligada à receita. 🛠
  - Fidelidade e cashback. 📋
- *Nota de implementação:* esta página fica no site com os recursos descritos como capacidade da plataforma e sem tela. Incluir a linha "Campanhas por WhatsApp em homologação" até a aprovação.
- **Diferenciais:** lista de retorno com valor em reais; recompra prevista pelo histórico (uso contínuo, ração, banho); reclamação que custa dinheiro, não só nota média.
- **Aplicações:** pet shop com 85 pets atrasados; farmácia com cliente de uso contínuo perto de acabar o remédio; clínica com paciente em tratamento sem sessão marcada.
- CTA: **Agendar diagnóstico**

### 3.3 Origem e funil

- H1: **Saiba qual post, qual anúncio e qual canal trouxeram cada cliente.**
- Sub: Da plataforma de venda à campanha de origem, a Elevah liga conteúdo a receita. E mostra o custo de cada cliente por canal.
- **Resolve:** investir em anúncio e conteúdo sem saber o que volta; métrica de curtida sem ligação com venda; relatório que não mostra resultado.
- **Resultado esperado:** verba movida para o canal que traz cliente, não só lead. Formato de post que vende identificado e repetido. CAC e LTV sem planilha.
- **O que sustenta a entrega:**
  - Origem de cada cliente: canal, campanha e anúncio de cada lead e venda. ✅ *(Hubla conectada; Hotmart e Kiwify 📋)*
  - Desempenho do Instagram, anúncios e caixa de entrada como leads. 🔄 *(aguarda aprovação da Meta)*
  - Post → lead → venda. 🔄
  - Pipeline, carteira e performance por vendedor. 🛠
  - CAC por canal; lead qualificado × lead que não converte. 🛠
  - RevOps: receita nova, recorrente, recuperada e perdida; funil em reais; coortes; vazamentos. 🛠
- **Diferenciais:** venda da plataforma ligada ao post de origem; o canal com mais leads pode ser o que menos vende, e a Elevah mostra isso; vazamentos de receita com ação sugerida.
- **Aplicações:** mentora que descobre que os Reels de bastidor trazem a maioria dos leads que compram; agência que entrega ao cliente um relatório com venda; clínica que move verba do Google para o Instagram porque é de lá que vem o paciente, não só o lead.
- CTA: **Ver a origem dos meus clientes**

### 3.4 Margem, estoque e capacidade

- H1: **Vender mais só vale a pena com a margem certa.**
- Sub: Margem real por item e canal, estoque que vai vencer cruzado com quem compra, hora parada na agenda. O dinheiro que escapa, visível antes de escapar.
- **Resolve:** desconto que destrói margem; capital parado e falta de produto ao mesmo tempo; produto vencendo; agenda vazia em dias fixos.
- **Resultado esperado:** desconto que dá prejuízo cortado. Produto a vencer vira oferta direcionada em vez de perda. Compra orientada por giro. Horário vazio preenchido com campanha específica.
- **O que sustenta a entrega:**
  - Margem por produto e serviço. ✅
  - Vendas abaixo do custo e desconto por vendedor; custo da hora; sugestão de preço. 🛠
  - Estoque: valor, cobertura, ruptura, curva ABC. 🛠
  - Validade em 15, 30 e 60 dias, com a lista de clientes que compram esses itens. 🛠
  - Sugestão de compra, simulador de fornecedor, transferência entre lojas, insumos por procedimento. 🛠
  - Agenda única por profissional e sala; ocupação por dia e horário; receita programada. 🔄
  - Link de agendamento público para Instagram, Google e WhatsApp. ✅
- **Diferenciais:** validade e baixo giro ligados a quem compra cada item; margem por canal depois de taxa e frete; receita prevista pela agenda.
- **Aplicações:** farmácia com R$ 200 mil vencendo em 15 dias e 380 clientes que já compraram esses itens; loja que vende no marketplace com margem negativa depois do frete; clínica com terça à tarde vazia.
- CTA: **Ver a margem dos meus produtos**

### 3.5 Equipe e operação

- H1: **Cada pessoa vê o próprio número. O dono vê o conjunto.**
- Sub: Acesso para toda a equipe, sem custo por usuário. Agenda, produção, meta, comissão e portal do cliente na mesma plataforma.
- **Resolve:** não saber qual unidade ou pessoa puxa o resultado; planilha de comissão; cliente que liga para tudo; proposta, contrato, cobrança e nota em lugares diferentes.
- **Resultado esperado:** equipe engajada no mesmo número sem microgestão. Comparativo entre unidades. Autoatendimento do cliente.
- **O que sustenta a entrega:**
  - Acessos por papel: dono, gestor, recepção, profissional, cliente. 🛠
  - Comparativo por unidade; visão do profissional; comissão automática. 🛠
  - Portal do cliente: agendar, remarcar, cancelar. ✅ · Histórico, pacotes e saldo, documentos, aprovações, faturas. 🛠
  - Orçamento, contrato com assinatura eletrônica, cobrança recorrente e nota fiscal. 📋 *(no site: "Em breve")*
  - Prontuário com assinatura ICP-Brasil, prescrição digital e odontograma. 📋 *(só para clínicas; "Em breve")*
- **Diferenciais:** sem custo por acesso; portal com a marca do cliente (agências e escritórios); do orçamento à nota num fluxo só (em breve).
- **Aplicações:** rede de farmácias com ranking de balconistas e lista diária; agência com portal white label onde o cliente aprova o calendário; escritório contábil com portal de documentos para 60 empresas.
- CTA: **Agendar diagnóstico**

### 3.6 Integrações

- H1: **A Elevah lê o que você já usa.**
- Sub: Sem migração para começar. A inteligência entra por cima dos dados que já existem.
- Tabela simples (nome, para quê, status público):
  - Hubla · Vendas e origem do cliente · Disponível
  - Mercado Livre · Pedidos e estoque · Disponível
  - Meta (Instagram, anúncios, WhatsApp) · Redes, anúncios e mensagens · Em homologação
  - Hotmart, Kiwify · Vendas e origem · Em breve
  - Bling, Linx, Trier · Leitura do ERP · Em breve
  - Asaas, Mercado Pago · Cobrança · Em breve
- Nota: Não tem o seu sistema na lista? Conte no diagnóstico. A integração por API é parte do mapa.
- CTA: **Agendar diagnóstico**

---

## 4. Página "Para quem"

- H1: **Uma lógica. Sete negócios.**
- Sub: O papel da Elevah muda conforme o negócio: sistema único, camada sobre o sistema atual ou gestão com portal. O método é o mesmo.

Cada perfil é uma seção âncora com: nome, papel da Elevah, três situações (situação → o que a Elevah mostra → ação), exemplo curto (marcado como ilustrativo), o que não cobrimos, CTA. Copy de cada uma:

### 4.1 Clínicas e serviços com equipe

- H2: **Agenda, pacientes, financeiro e campanhas num sistema só.**
- Papel: Sistema único da clínica. Prontuário em breve.
- Situações:
  - Profissional de férias → horas perdidas e impacto no forecast → remanejar pacientes e abrir horários.
  - Fluxo caiu → pacientes em tratamento sem sessão marcada, com valor → lembrete e oferta.
  - Lead pergunta preço às 22h → resposta automática com link → agendado antes da recepção abrir.
- Exemplo (ilustrativo): Clínica de estética com 6 profissionais. No dia 10, o ritmo projeta 92% da meta por causa de um afastamento. A lista mostra 64 pacientes em tratamento sem sessão marcada. O lembrete sai, a agenda enche, o forecast volta a 99%.
- Não cobrimos hoje: prontuário completo (em breve), convênios (TISS), telemedicina, PDV.
- CTA: **Ver a Elevah na minha clínica**

### 4.2 Farmácias

- H2: **Inteligência por cima do seu sistema. Sem migração.**
- Papel: Camada sobre o ERP atual, ou ERP Elevah com o PDV da loja.
- Situações:
  - Produto vencendo em 15 dias → itens, valor e os clientes que já compraram → oferta direcionada em vez de desconto geral.
  - Loja projeta 88% da meta → desvio por balconista e categoria → produto foco e lista para a equipe.
  - Cliente de uso contínuo perto de acabar → data provável de recompra → lembrete antes do concorrente.
- Exemplo (ilustrativo): Rede de 3 lojas. No primeiro dia, R$ 46 mil em produtos vencendo em 30 dias e 210 clientes que compram esses itens. Cada balconista recebe sua parte da lista.
- Não cobrimos: PDV, NFC-e, SNGPC, Farmácia Popular, PBMs, TEF, negociação em rede.
- *Nota:* a leitura de ERP ainda não foi testada com cliente real. No site, manter "camada sobre o seu sistema" como proposta e validar no diagnóstico.
- CTA: **Ver a Elevah na minha farmácia**

### 4.3 Lojas

- H2: **Produto parado encontra o cliente certo.**
- Papel: Gestão com canais de venda, ou camada sobre Bling ou Olist.
- Situações:
  - Coleção parada no fim da estação → valor parado e clientes daquela categoria → pré-venda exclusiva antes da liquidação.
  - Vende no marketplace e não sabe a margem → margem por canal depois de taxa e frete → ajuste de preço ou saída do canal.
  - Cliente comprava todo mês e parou → fora do ciclo com ticket médio → mensagem com novidade da categoria.
- Não cobrimos: PDV com NFC-e e TEF, SPED, expedição com etiquetas.
- CTA: **Ver a Elevah na minha loja**

### 4.4 Profissionais e criadores

- H2: **Qual post vendeu. Qual anúncio custou caro. O que repetir.**
- Papel: Painel que liga conteúdo, anúncio e venda, com portal de jornada para o cliente.
- Situações:
  - Lançamento com três públicos → custo por venda de cada público e criativo → concentrar verba no que vende.
  - Muitos seguidores, poucas vendas → quais posts geram lead e quais só alcance → repetir o formato que converte.
  - Aluno que não renova → clientes perto do fim do ciclo → oferta de continuidade antes do fim.
- Não cobrimos: hospedagem de curso, área de membros, checkout, e-mail em volume.
- CTA: **Ver de onde vêm as minhas vendas**

### 4.5 Pet shops

- H2: **O tutor que vinha a cada 15 dias sumiu. A Elevah avisa antes.**
- Papel: Gestão do banho e tosa e inteligência de cliente. A venda de produto fica no PDV atual.
- Situações:
  - Pets atrasados → lista com valor mensal em risco → lembrete com link para agendar.
  - Terça e quarta com banheira vazia → ocupação por dia e horário → pacote para quem costuma vir.
  - Pacote vencendo com sessões sobrando → saldo por tutor → aviso para usar e oferta de renovação.
- Não cobrimos: PDV, NFC-e, prontuário veterinário, comandas.
- CTA: **Ver a Elevah no meu pet shop**

### 4.6 Agências

- H2: **Relatório que renova contrato mostra venda, não alcance.**
- Papel: Gestão da agência e portal com a sua marca para cada cliente.
- Situações:
  - Cliente questiona o retorno → relatório no portal com leads e vendas atribuídos → renovação defendida com número.
  - Aprovação perdida no WhatsApp → fila de aprovações por cliente, com prazo → fim do retrabalho de versão errada.
  - Cliente que paga pouco e consome muito → rentabilidade por cliente → reajuste ou mudança de escopo.
- Não cobrimos: gestão detalhada de horas e jobs, criador de sites e funis, e-mail em volume.
- CTA: **Ver o portal com a minha marca**

### 4.7 Escritórios contábeis

- H2: **Do "só entrega guia" ao consultivo que o cliente paga.**
- Papel: Gestão comercial do escritório, portal de documentos e painel gerencial para cada empresa atendida. Não substitui o sistema contábil.
- Situações:
  - Cliente que manda documento atrasado todo mês → retrabalho e horas por cliente → cobrar o retrabalho ou rever honorário.
  - Cliente acha que o contador "só entrega guia" → painel com DRE e forecast da empresa dele → serviço consultivo visível.
  - Empresa cliente vai fechar no vermelho → forecast e caixa projetado → o contador avisa antes.
- Não cobrimos: escrituração, fiscal, folha, obrigações legais, importação de XML.
- CTA: **Ver o painel para os meus clientes**

---

## 5. Página "Como funciona"

- H1: **Ver antes. Saber o impacto. Agir.**
- Sub: O método por trás de cada tela da Elevah.
- Bloco 1 · As quatro perguntas (mesma copy da Home, expandida com um exemplo por pergunta).
- Bloco 2 · **Como aparece na tela.** Tabela com 4 linhas: situação detectada → se nada for feito → ação sugerida → impacto (valores ilustrativos, marcados).
- Bloco 3 · **O que a inteligência faz e o que não faz.**
  - Faz: lê os dados do negócio, explica o desvio, prioriza o que vale mais, sugere a próxima ação.
  - Não faz: criar número, projetar sem base no seu histórico, agir sem você aprovar.
- Bloco 4 · **Do primeiro dia ao resultado.** Três passos reais: diagnóstico (20 min, seus dados) → conexão ou implantação (depende do perfil) → primeira lista de ação na tela.
- CTA: **Agendar diagnóstico**

## 6. Página "Agendar diagnóstico"

- H1: **Veja o seu mês antes de ele acabar.**
- Sub: Em 20 minutos, mostramos o forecast com os seus dados e a primeira lista de ação. Sem compromisso.
- O que você leva: a projeção do mês; onde está o maior risco em reais; a lista de clientes ou itens para agir; o encaixe da Elevah no seu negócio (sistema único, camada ou portal).
- O que trazer: acesso ao relatório de vendas do período (planilha ou sistema). Se não tiver, mostramos com dados de exemplo.
- Formulário (campos): nome, negócio, tipo de negócio (lista dos 7 perfis + outro), WhatsApp, "como conheceu a Elevah" (campo de origem para atribuição).
- CTA: **Agendar**

## 7. Página "Sobre"

- H1: **Começamos pelo que o dono precisa decidir. Não pelo que o sistema consegue mostrar.**
- Parágrafo 1: A Elevah nasceu de uma pergunta simples: por que o dono de um negócio descobre o resultado no fim do mês, quando não há mais o que fazer? A resposta estava nos dados, espalhados em cinco ferramentas que não conversam.
- Parágrafo 2: Construímos uma plataforma que lê esses dados, projeta para onde o mês vai e entrega a ação com o impacto em reais. Para clínicas, farmácias, lojas, profissionais, pet shops, agências e escritórios contábeis. Negócios diferentes, a mesma pergunta.
- Parágrafo 3: Três princípios: a inteligência nunca cria número; o mapa de entregas é aberto; toda a equipe entra, sem custo por acesso.
- CTA: **Conhecer o método**

---

## 8. SEO

| Página | Title (≤60) | Description (≤155) |
|---|---|---|
| Home | Elevah · Veja o resultado do mês antes do mês acabar | Inteligência de gestão que projeta o seu mês, mostra o impacto de cada desvio em reais e entrega a ação pronta. Para clínicas, farmácias, lojas e mais. |
| Previsão e resultado | Forecast e resultado do mês · Elevah | Saiba hoje se vai bater a meta. Faturamento, custos e projeção com o impacto de cada imprevisto e a ação para corrigir. |
| Clientes e recorrência | Retenção e recompra de clientes · Elevah | Quem passou do prazo de voltar, quem está perto de recomprar e quanto isso vale. Lista pronta e mensagem certa. |
| Origem e funil | Origem do cliente, CAC e funil de receita · Elevah | Qual post, anúncio e canal trouxeram cada cliente, e quanto custou. Conteúdo ligado a venda. |
| Margem, estoque e capacidade | Margem real, estoque e agenda · Elevah | Margem por item e canal, estoque a vencer cruzado com quem compra, hora vazia na agenda. |
| Equipe e operação | Gestão de equipe, agenda e portal do cliente · Elevah | Cada pessoa vê o próprio número. Agenda, comissão e portal, sem custo por acesso. |
| Integrações | Integrações · Elevah | A Elevah lê o que você já usa: plataformas de venda, marketplaces, redes e cobrança. |
| Para quem | Elevah para clínicas, farmácias, lojas, agências e contadores | Uma lógica, sete negócios. Veja o papel da Elevah no seu tipo de empresa. |
| Como funciona | Como funciona a Elevah · Ver antes, saber o impacto, agir | O método por trás de cada tela: efetivo, vigente, projeção e ação. |
| Diagnóstico | Agendar diagnóstico · Elevah | 20 minutos com os seus dados: forecast do mês e a primeira lista de ação. Sem compromisso. |

---

## 9. Revisão pelos critérios de qualidade

- **Clareza:** a Home responde "o que é" na primeira frase (ver o resultado antes do fim do mês) e "como" na terceira seção.
- **Posicionamento:** uma marca, um método; os perfis aparecem como aplicações, cada um com o seu papel (sistema único, camada, portal).
- **Valor percebido:** cada seção tem um benefício em uma linha; nenhum bloco lista funcionalidade sem o resultado.
- **Conversão:** um CTA em todo o site, com a promessa concreta do diagnóstico (forecast com os seus dados).
- **Branding:** antecipação, impacto em reais, ação pronta, visão integrada e rigor aparecem na Home e se repetem nas soluções.
- **Honestidade:** status marcado em cada recurso; sem depoimentos, logos ou métricas inventadas; preços ausentes.
