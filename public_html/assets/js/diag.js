/* Elevah — Diagnóstico de Alavancas de Crescimento (8 perguntas, 4 pilares B-DATA).
   Pesos (A=0, B=1, C=3) e textos de resultado: documento "DIAGNÓSTICO ELEVAH". */
(function () {
  'use strict';
  var root = document.querySelector('[data-dg]');
  if (!root) return;
  var E = window.Elevah || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || root).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
  var STORE = 'elevah-diag-v3', QUEUE = 'elevah-diag-fila';
  var WHATS = E.WHATS || '5511955521350';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var icon = function (n) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; };
  var md = function (s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); };

  /* ---------- conteúdo (ordem dos pilares: Comportamento, Brand Experience, Inteligência, Experiência) ---------- */
  var PILLARS = [
    { name: 'Comportamento Humano', short: 'Comportamento', icon: 'brain',
      impact: 'Frequência de compra, conversão e receita gerada pela base atual.',
      ref: { big: '60%–70%', cap: 'de chance de vender para quem já é cliente', text: 'Entender o que influencia decisão, recompra e expansão pode mudar significativamente a eficiência comercial: a probabilidade de vender para um cliente atual pode chegar a **60%–70%**, contra **5%–20%** para um novo prospect.' },
      res: ['**A empresa já trabalha tanto estímulos de recompra quanto barreiras de decisão.** O potencial está em testar quais mecanismos produzem maior resposta.',
        '**Já existe intenção clara de influenciar o comportamento do cliente, mas uma das dimensões ainda pode ser melhor compreendida.**',
        '**Existem iniciativas e conhecimento do cliente, mas ainda de forma pouco sistemática.** O potencial está em transformar percepções em mecanismos intencionais.',
        '**Uma alavanca comportamental está bem trabalhada, mas existe um ponto importante ainda sem visibilidade ou estímulo.** Ele deve ser priorizado.',
        '**Parte do comportamento do cliente já é percebida, mas decisões importantes ainda ficam por conta da iniciativa espontânea dele.**',
        '**Recompra e decisão acontecem hoje com pouca intervenção estruturada da empresa.** Existe alto potencial em entender barreiras e criar estímulos que facilitem a próxima decisão.'] },
    { name: 'Brand Experience', icon: 'diamond',
      impact: 'Poder de preço, margem e preferência no momento da escolha.',
      ref: { big: '6%–14%', cap: 'mais lucro operacional com +1% no preço realizado', text: 'Marcas com maior poder de demanda podem alcançar até **9x mais participação em volume** e maior capacidade de sustentar preços. Em paralelo, estudos de pricing mostram que apenas **1% de aumento no preço realizado** pode elevar o lucro operacional entre **6% e 14%**.' },
      res: ['**A marca já demonstra capacidade de sustentar escolha sem depender fortemente de preço.** O próximo nível está em ampliar e proteger essa preferência ao longo da jornada.',
        '**Existe valor percebido, mas ele ainda não aparece com a mesma força em todas as situações.** O principal potencial está no ponto intermediário identificado.',
        '**A marca participa da decisão, mas ainda não sustenta preferência de forma consistente.** Há potencial relevante para ampliar diferenciação e valor percebido.',
        '**Existe um ativo positivo de marca, mas também uma fragilidade relevante em diferenciação ou dependência de preço.** Essa diferença merece investigação prioritária.',
        '**A escolha ainda fica bastante exposta à comparação e ao preço.** Existe oportunidade de tornar o valor da marca mais claro e reconhecível.',
        '**A marca hoje exerce pouca vantagem perceptível no momento de escolha.** Isso aumenta a exposição à comparação por preço e eleva o esforço necessário para vender.'] },
    { name: 'Inteligência', icon: 'database',
      impact: 'Precisão do investimento, retenção e custo de aquisição.',
      ref: { big: '+47%', cap: 'mais leads convertidos com dados estruturados e CRM', text: 'Empresas que estruturam dados e acompanham o ciclo do cliente com CRM podem converter **até 47% mais leads** do que operações baseadas em controles manuais. Mais visibilidade permite identificar perdas, oportunidades e tomar decisões com maior precisão.' },
      res: ['**Existe boa visibilidade sobre clientes e resultados.** O próximo nível está em transformar essas informações em decisões cada vez mais precisas de crescimento.',
        '**A empresa já possui uma base relevante de informação, mas existe um ponto que ainda depende de percepção.** Essa é a principal oportunidade de aprofundamento.',
        '**Existe conhecimento sobre o negócio, mas parte relevante ainda está dispersa ou baseada na percepção da equipe.** Há potencial em transformar esse conhecimento em inteligência recorrente.',
        '**Há inteligência em uma área importante, mas também um ponto cego relevante.** Antes de ampliar análises, vale resolver essa ausência de informação.',
        '**A empresa possui algumas referências, mas ainda toma decisões importantes com baixa visibilidade sobre o comportamento da base.**',
        '**Hoje existe pouca visibilidade sobre quem permanece, quem sai e o que influencia a escolha.** Construir essa base pode mudar significativamente a qualidade das decisões comerciais.'] },
    { name: 'Experiência', icon: 'path',
      impact: 'Retenção, recompra e recomendação ao longo da jornada.',
      ref: { big: '25%–95%', cap: 'mais lucro com apenas +5% de retenção', text: 'Estudos de mercado mostram que melhorar retenção em apenas **5%** pode elevar o lucro entre **25% e 95%**. Uma experiência mais consistente ao longo da jornada aumenta as chances de o cliente permanecer, comprar novamente e indicar.' },
      res: ['**Sua experiência já apresenta uma boa base de consistência e continuidade.** O maior potencial está em otimizar etapas específicas e encontrar oportunidades de gerar mais valor ao longo da jornada.',
        '**Existe uma boa base, mas parte da experiência ainda varia.** A principal oportunidade está justamente no ponto que hoje acontece de forma menos consistente.',
        '**A experiência já acontece com alguma lógica, mas ainda depende bastante da situação.** Existe potencial relevante em transformar boas práticas atuais em uma jornada mais consistente.',
        '**Uma parte importante da experiência já está estruturada, mas existe uma quebra relevante na jornada.** Esse ponto deve ser investigado primeiro, porque pode limitar retenção e valor mesmo com outras etapas funcionando bem.',
        '**Há iniciativas positivas, mas uma parte importante da jornada ainda acontece de forma reativa.** O maior potencial está primeiro no ponto ausente e depois na padronização do que já existe.',
        '**A experiência hoje depende principalmente do fluxo natural da venda e da entrega.** Existe uma oportunidade estrutural de desenhar continuidade, consistência e mecanismos de retenção.'] }
  ];
  var Q = [
    { p: 0, q: 'Hoje existe alguma ação para estimular o cliente a voltar?', o: ['Sim, acontece de forma recorrente.', 'Fazemos algumas ações, mas sem frequência definida.', 'Não. Quando volta, normalmente parte dele.'],
      a: 'Criar mecanismos intencionais de recompra: momentos, gatilhos e contatos que levam o cliente a voltar.' },
    { p: 0, q: 'Você sabe quais são os principais motivos que fazem um cliente desistir ou adiar uma compra?', o: ['Sim, esses motivos aparecem com clareza.', 'Temos algumas percepções, mas nada muito consolidado.', 'Não sabemos com clareza.'],
      a: 'Mapear as barreiras que fazem o cliente desistir ou adiar a compra e removê-las da jornada.' },
    { p: 1, q: 'Quando precisa aumentar vendas, o desconto costuma ser um dos primeiros recursos usados?', o: ['Raramente.', 'Às vezes.', 'Sim, com frequência.'],
      a: 'Reduzir a dependência de desconto, reforçando o valor percebido nos momentos de decisão.' },
    { p: 1, q: 'Além do preço, você sabe dizer o que faz seu cliente escolher você em vez do concorrente?', o: ['Sim, sabemos claramente quais motivos fazem o cliente nos escolher.', 'Temos uma ideia, mas não sabemos com clareza.', 'Não, hoje não sabemos dizer com segurança.'],
      a: 'Identificar e comunicar com clareza os motivos que fazem o cliente escolher você.' },
    { p: 2, q: 'Você sabe quantos clientes deixaram de comprar nos últimos 3 meses?', o: ['Sim, temos esse número e acompanhamos.', 'Consigo estimar ou levantar manualmente.', 'Não sabemos hoje.'],
      a: 'Medir e acompanhar quem deixa de comprar, para agir antes da perda.' },
    { p: 2, q: 'Você sabe quais clientes mais compram e o que costuma levá-los a escolher vocês?', o: ['Sim, temos informações e padrões claros.', 'Temos uma boa ideia, mas muito vem da percepção da equipe.', 'Não temos clareza sobre isso.'],
      a: 'Transformar o conhecimento sobre os melhores clientes em dados e padrões que orientem decisões.' },
    { p: 3, q: 'Depois da venda, o cliente recebe algum contato seu?', o: ['Sim. Faz parte do processo e acontece regularmente.', 'Sim, mas depende do cliente, da pessoa ou do momento.', 'Não. Normalmente o contato termina depois da entrega.'],
      a: 'Estruturar o contato pós-venda com rotina, momento e responsável definidos.' },
    { p: 3, q: 'O atendimento segue o mesmo padrão para todos os clientes, independentemente de quem atende?', o: ['Sim, existe um padrão claro e todos seguem.', 'Em parte. Algumas etapas são padronizadas, outras dependem de quem atende.', 'Não. O atendimento varia bastante de acordo com a pessoa ou situação.'],
      a: 'Padronizar as etapas-chave do atendimento para que a experiência não dependa de quem atende.' }
  ];
  var W = [0, 1, 3];                                   // A, B, C
  var BY_GAP = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 6: 5 }; // A+A, A+B, B+B, A+C, B+C, C+C
  var CLASS = ['Estruturado', 'Melhoria localizada', 'Oportunidade relevante', 'Prioridade alta', 'Prioridade muito alta', 'Prioridade crítica'];
  var LEVEL = [0, 1, 2, 3, 3, 3];

  /* ---------- estado ---------- */
  var st = load() || { ans: [], i: 0, lead: null };
  function load() { try { return JSON.parse(localStorage.getItem(STORE)); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }
  var complete = function () { return st.ans.length === Q.length && st.ans.every(function (x) { return x != null; }); };

  function score() {
    return PILLARS.map(function (p, k) {
      var a = st.ans[k * 2], b = st.ans[k * 2 + 1], gap = W[a] + W[b], idx = BY_GAP[gap];
      var worst = W[a] >= W[b] ? k * 2 : k * 2 + 1;
      return { k: k, p: p, gap: gap, idx: idx, cls: CLASS[idx], lvl: LEVEL[idx], text: p.res[idx], worst: Q[worst], qs: [k * 2, k * 2 + 1] };
    });
  }
  // ranking: maior oportunidade primeiro (C+C → B+C → A+C → B+B → A+B → A+A); empate mantém a ordem dos pilares
  var ranked = function () { return score().sort(function (a, b) { return b.gap - a.gap || a.k - b.k; }); };

  /* ---------- telas ---------- */
  function showOnly(names) {
    $$('[data-screen]').forEach(function (s) { s.hidden = names.indexOf(s.dataset.screen) < 0; });
    $('[data-intro]').hidden = names.indexOf('intro') < 0;
    root.dataset.state = names[names.length - 1];
  }
  function jump(el) { var y = el.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: Math.max(0, y), behavior: 'instant' }); }

  /* ---------- questionário ---------- */
  var opts = $('[data-q-opts]'), card = $('[data-qcard]'), locked = false;
  function renderQ(dir) {
    var i = st.i, q = Q[i], p = PILLARS[q.p];
    $('[data-q-pillar]').textContent = p.name;
    $('[data-q-ico]').innerHTML = icon(p.icon);
    $('[data-q-pnum]').textContent = 'Pilar ' + (q.p + 1) + ' de 4';
    var left = Q.length - i;
    $('[data-q-left]').textContent = left === 1 ? 'Última pergunta' : 'Faltam ' + left + ' perguntas';
    $('[data-q-num]').textContent = 'Pergunta ' + (i + 1) + ' de ' + Q.length;
    $('[data-q-text]').textContent = q.q;
    $$('[data-seg]').forEach(function (seg) {
      var n = +seg.dataset.seg;
      seg.querySelector('i').style.transform = 'scaleX(' + Math.max(0, Math.min(1, (i - n * 2) / 2)) + ')';
      seg.classList.toggle('is-on', n === q.p);
    });
    opts.innerHTML = q.o.map(function (t, k) {
      return '<button type="button" role="radio" class="dg-opt" aria-checked="' + (st.ans[i] === k) + '" data-k="' + k + '"><span class="dg-key">' + (k + 1) + '</span><span>' + esc(t) + '</span><span class="dg-tick">' + icon('check') + '</span></button>';
    }).join('');
    $('[data-back]').style.visibility = i === 0 ? 'hidden' : 'visible';
    if (!reduce && dir) { card.classList.remove('in-l', 'in-r'); void card.offsetWidth; card.classList.add(dir > 0 ? 'in-r' : 'in-l'); }
  }
  function answer(k) {
    if (locked) return;
    locked = true;
    st.ans[st.i] = k; save();
    $$('.dg-opt', opts).forEach(function (b) { b.setAttribute('aria-checked', String(+b.dataset.k === k)); });
    setTimeout(function () {
      locked = false;
      if (st.i < Q.length - 1) { st.i++; save(); renderQ(1); $('[data-q-text]').focus({ preventScroll: true }); var r = card.getBoundingClientRect(); if (r.top < 70 || r.bottom > window.innerHeight) jump($('#questionario')); }
      else showGate();
    }, reduce ? 0 : 320);
  }
  opts.addEventListener('click', function (e) { var b = e.target.closest('.dg-opt'); if (b) answer(+b.dataset.k); });
  document.addEventListener('keydown', function (e) {
    if (root.dataset.state !== 'quiz' || e.altKey || e.ctrlKey || e.metaKey || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    var r = card.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; // só quando o questionário está à vista
    if (/^[123]$/.test(e.key)) { e.preventDefault(); answer(+e.key - 1); }
  });
  $('[data-back]').addEventListener('click', function () { if (st.i > 0) { st.i--; save(); renderQ(-1); } });
  $('[data-start]').addEventListener('click', function (e) {
    e.preventDefault();
    jump($('#questionario'));
    $('[data-q-text]').focus({ preventScroll: true });
  });

  /* ---------- captura ---------- */
  function showGate() {
    $('[data-teaser]').innerHTML = ranked().map(function (s) {
      return '<li><span>' + esc(s.p.short || s.p.name) + '</span><i><b style="width:' + Math.max(8, s.gap / 6 * 100) + '%"></b></i></li>';
    }).join('');
    if (st.form) Object.keys(st.form).forEach(function (k) { var el = form.elements[k]; if (el && !el.value) el.value = st.form[k]; });
    showOnly(['gate']);
    jump($('[data-screen="gate"]'));
    $('#g-nome').focus({ preventScroll: true });
  }
  function payload(form) {
    var data = {}, fd = new FormData(form), sc = score(), top = ranked()[0];
    fd.forEach(function (v, k) { data[k] = v; });
    data.respostas = Q.map(function (q, i) { return (i + 1) + '. [' + PILLARS[q.p].name + '] ' + q.q + ' → ' + 'ABC'[st.ans[i]] + ': ' + q.o[st.ans[i]]; }).join('\n');
    data.resultado = ranked().map(function (s, n) { return (n + 1) + '. ' + s.p.name + ': ' + s.cls; }).join('\n');
    data.prioridade = top.p.name + ' — ' + top.cls;
    return data;
  }
  // envio com nova tentativa: o lead fica guardado no navegador até o servidor confirmar
  function send(data) {
    var fd = new FormData(); Object.keys(data).forEach(function (k) { fd.append(k, data[k]); });
    var ctrl = 'AbortController' in window ? new AbortController() : null, t = ctrl && setTimeout(function () { ctrl.abort(); }, 10000);
    return fetch('/api/diagnostico.php', { method: 'POST', body: fd, headers: { Accept: 'application/json' }, signal: ctrl && ctrl.signal })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error('falhou'); return j; }); })
      .finally(function () { t && clearTimeout(t); });
  }
  function queue(data) { try { var q = JSON.parse(localStorage.getItem(QUEUE) || '[]'); q.push(data); localStorage.setItem(QUEUE, JSON.stringify(q)); } catch (e) {} }
  function flush() {
    var q; try { q = JSON.parse(localStorage.getItem(QUEUE) || '[]'); } catch (e) { q = []; }
    if (!q.length) return;
    var next = q[0];
    send(next).then(function () { q.shift(); localStorage.setItem(QUEUE, JSON.stringify(q)); flush(); }).catch(function () { setTimeout(flush, 30000); });
  }
  var form = $('[data-gate-form]');
  E.wire && E.wire(form);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (E.validate && !E.validate(form)) return;
    var data = payload(form), btn = $('button[type="submit"]', form);
    btn.disabled = true; btn.classList.add('is-loading');
    st.lead = { nome: String(data.nome || '').trim().split(/\s+/)[0], empresa: data.empresa };
    st.form = { nome: data.nome, email: data.email, whatsapp: data.whatsapp, empresa: data.empresa, segmento: data.segmento }; save();
    window.elevahTrack && elevahTrack('lead_enviado', { formulario: 'diagnostico', pagina: location.pathname });
    send(data).catch(function () { queue(data); setTimeout(flush, 15000); })
      .finally(function () { btn.disabled = false; btn.classList.remove('is-loading'); showResult(true); });
  });

  /* ---------- resultado ---------- */
  function showResult(scrollTop) {
    var list = ranked(), first = list[0];
    $('[data-r-name]').textContent = (st.lead && st.lead.nome) || 'Você';
    $('[data-map]').innerHTML = list.map(function (s, n) {
      return '<li class="lv-' + s.lvl + '"><b class="dg-rank">' + (n + 1) + '</b><span class="dg-ico dg-ico--sm">' + icon(s.p.icon) + '</span><span class="dg-mp-n">' + esc(s.p.name) + '</span><span class="dg-mp-bar"><i style="--w:' + Math.max(6, s.gap / 6 * 100) + '%"></i></span><span class="dg-badge lv-' + s.lvl + '">' + s.cls + '</span></li>';
    }).join('');
    $('[data-cards]').innerHTML = list.map(function (s, n) {
      var top = n === 0 && s.gap > 0, ref = s.p.ref;
      var answers = s.qs.map(function (qi) {
        var a = st.ans[qi];
        return '<li><p>' + esc(Q[qi].q) + '</p><span class="dg-ans a-' + a + '">' + esc(Q[qi].o[a]) + '</span></li>';
      }).join('');
      return '<article class="dg-card lv-' + s.lvl + (top ? ' is-top' : '') + '" style="--n:' + n + '">' +
        '<header><span class="dg-ico">' + icon(s.p.icon) + '</span><div class="dg-card-h">' + (top ? '<p class="dg-flag">' + icon('target') + 'Comece por aqui</p>' : '') + '<h3>' + esc(s.p.name) + '</h3></div><span class="dg-badge lv-' + s.lvl + '">' + s.cls + '</span></header>' +
        '<details class="dg-why"><summary>Visualizar resposta ' + icon('caret-down') + '</summary><ul>' + answers + '</ul></details>' +
        '<p class="dg-card-t">' + md(s.text) + '</p>' +
        '<div class="dg-flow">' +
        '<div><p class="dg-flow-k">' + icon('chart-line-up') + 'Onde impacta no seu resultado</p><p>' + esc(s.p.impact) + '</p></div>' +
        '<div class="is-action"><p class="dg-flow-k">' + icon('target') + 'Ação prioritária</p><p>' + esc(s.gap === 0 ? 'Otimizar e ampliar o que já funciona, testando o que gera mais resposta.' : s.worst.a) + '</p></div>' +
        '</div>' +
        '<div class="dg-ref"><div class="dg-ref-big"><b>' + ref.big + '</b><span>' + esc(ref.cap) + '</span></div><div><p class="dg-flow-k">' + icon('seal-check') + 'Referências de mercado</p><p>' + md(ref.text) + '</p></div></div>' +
        '</article>';
    }).join('');
    var name = (st.lead && st.lead.nome) || '';
    var msg = 'Olá, ' + (name ? 'sou ' + name + (st.lead.empresa ? ', da ' + st.lead.empresa : '') + '. ' : '') + 'Fiz o Diagnóstico Elevah e quero entender meu resultado. Meu pilar prioritário foi ' + first.p.name + ' (' + first.cls.toLowerCase() + ').';
    $('[data-wa]').href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
    showOnly(['result']);
    if (scrollTop) { window.scrollTo({ top: 0, behavior: 'instant' }); $('#rs-t').focus({ preventScroll: true }); }
    root.classList.remove('is-revealed');
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-revealed'); }); });
    observeCards();
  }

  // cada bloco aparece ao rolar e o anterior recua levemente por baixo do seguinte
  var cards = [], io;
  function observeCards() {
    cards = $$('.dg-card');
    if (io) io.disconnect();
    if ('IntersectionObserver' in window && !reduce) {
      io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
      cards.forEach(function (c) { io.observe(c); });
    } else cards.forEach(function (c) { c.classList.add('is-in'); });
    onScroll();
  }
  var ticking = false;
  function onScroll() {
    if (ticking || !cards.length) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      cards.forEach(function (c, i) {
        var next = cards[i + 1];
        if (!next || reduce) { c.style.setProperty('--cover', 0); return; }
        var a = c.getBoundingClientRect(), b = next.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (a.bottom - b.top) / Math.max(1, a.height)));
        c.style.setProperty('--cover', p.toFixed(3));
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  $('[data-restart]').addEventListener('click', function () {
    st = { ans: [], i: 0, lead: null, form: st.form }; save();
    showOnly(['intro', 'quiz']); renderQ(0);
    jump($('#questionario'));
  });

  /* ---------- início ---------- */
  if (/[?&]novo\b/.test(location.search)) { st = { ans: [], i: 0, lead: null }; save(); try { localStorage.removeItem(QUEUE); } catch (e) {} }
  flush();
  if (complete() && st.lead) showResult(false);
  else {
    if (st.i >= Q.length) st.i = Q.length - 1;
    showOnly(['intro', 'quiz']); renderQ(0);
    if (complete() && !st.lead) showGate();
  }
})();
