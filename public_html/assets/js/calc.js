/* Elevah — Calculadoras: CAC, Churn, LTV e Fidelização, mais o resumo que leva ao agendamento.
   Os campos começam vazios; o resultado só ganha destaque quando a calculadora está completa. */
(function () {
  'use strict';
  var root = document.querySelector('[data-calc]');
  if (!root) return;
  var E = window.Elevah || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var STORE = 'elevah-calc-v3';
  var TABS = ['cac', 'churn', 'ltv', 'fidelizacao', 'resumo'];
  var NEXT = { cac: 'Churn', churn: 'LTV', ltv: 'Fidelização', fidelizacao: 'Resumo' };

  var st = load() || { v: {} };
  function load() { try { var j = JSON.parse(localStorage.getItem(STORE)); return j && j.v ? j : null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }

  /* ---------- formatação ---------- */
  var nf0 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var money = function (v) { return 'R$ ' + nf0.format(Math.round(v)); };
  var F = { money: money, pct0: function (v) { return nf0.format(v * 100) + '%'; }, pct1: function (v) { return nf1.format(v * 100) + '%'; } };
  function parse(str, kind) {
    if (str == null || str === '') return null;
    var s = String(str).replace(/[^\d,]/g, '');
    if (kind !== 'dec') s = s.replace(/,/g, '');
    var n = parseFloat(s.replace(',', '.'));
    return isFinite(n) ? n : null;
  }
  function show(v, kind) {
    if (v == null || !isFinite(v)) return '';
    return kind === 'dec' ? String(Math.round(v * 10) / 10).replace('.', ',') : nf0.format(Math.round(v));
  }
  var pos = function (x) { return x != null && x > 0; };

  /* ---------- cálculo ---------- */
  function compute() {
    var v = st.v, o = {};
    if (pos(v.gasto) && pos(v.novos)) o.cac = { cac: v.gasto / v.novos, ano: v.gasto * 12 };
    if (pos(v.ativos) && v.saiu != null && v.saiu >= 0 && v.saiu <= v.ativos && pos(v.tm)) {
      var c = v.saiu / v.ativos;
      // receita que deixa de entrar: soma, mês a mês, do que os clientes que saem deixariam de pagar até o mês 12
      var lost = function (cc) { var s = 0; for (var k = 1; k <= 12; k++) s += v.ativos * (1 - Math.pow(1 - cc, k)); return s * v.tm; };
      var nr = lost(c);
      o.churn = { c: c, nr: nr, pres: nr - lost(c * 0.8) };
    }
    if (pos(v.tk) && pos(v.meses) && pos(v.compras)) {
      var l = v.tk * v.compras;
      o.ltv = { ltv: l, novo: l * 1.2, add: l * 0.2, base: l * 0.2 * 100 };
    }
    if (pos(v.base) && v.voltaram != null && v.voltaram >= 0 && v.voltaram <= v.base && pos(v.tk)) {
      o.fid = { taxa: v.voltaram / v.base, pot: (v.base - v.voltaram) * 0.1 * v.tk };
    }
    var pot = (o.churn ? o.churn.pres : 0) + (o.fid ? o.fid.pot : 0);
    o.sum = { pot: pot > 0 ? pot : null };
    return o;
  }
  var KEY = { cac: 'cac', churn: 'churn', ltv: 'ltv', fidelizacao: 'fid' };

  /* ---------- renderização ---------- */
  var o = {}, outs = $$('[data-o]', root), shown = {};
  function put(key, val) {
    outs.forEach(function (el) {
      if (el.dataset.o !== key) return;
      if (val == null) { el.textContent = '—'; return; }
      var f = el.dataset.f, big = el.classList.contains('big'), panel = el.closest('[data-panel]');
      if (big && !reduce && panel && !panel.hidden && !shown[panel.dataset.panel]) countUp(el, val, f);
      else el.textContent = F[f](val);
    });
  }
  function countUp(el, val, f) {
    var t0 = performance.now();
    (function step(now) { var k = Math.min(1, (now - t0) / 700); el.textContent = F[f](val * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function render() {
    o = compute();
    ['cac', 'ano'].forEach(function (k) { put('cac.' + k, o.cac && o.cac[k]); });
    ['c', 'nr', 'pres'].forEach(function (k) { put('churn.' + k, o.churn && o.churn[k]); });
    ['ltv', 'novo', 'add', 'base'].forEach(function (k) { put('ltv.' + k, o.ltv && o.ltv[k]); });
    ['taxa', 'pot'].forEach(function (k) { put('fid.' + k, o.fid && o.fid[k]); });
    put('sum.pot', o.sum.pot);
    Object.keys(KEY).forEach(function (t) {
      var ok = !!o[KEY[t]], box = $('[data-res="' + t + '"]', root);
      if (box) {
        var was = box.classList.contains('is-full');
        box.classList.toggle('is-full', ok);
        if (ok && !was) { box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop'); }
        if (ok) shown[t] = true;
      }
      $('[data-tab="' + t + '"]', root).classList.toggle('is-done', ok);
      var li = $('[data-sum="' + t + '"]', root); if (li) li.classList.toggle('is-empty', !ok);
    });
    save();
  }

  /* ---------- campos ---------- */
  var inputs = $$('[data-k]', root);
  inputs.forEach(function (el) {
    el.value = show(st.v[el.dataset.k], el.dataset.kind);
    el.addEventListener('input', function () {
      var k = el.dataset.k, kind = el.dataset.kind, val = parse(el.value, kind);
      if (kind !== 'dec') {
        var back = el.value.length - el.selectionStart;
        el.value = val == null ? '' : nf0.format(Math.round(val));
        try { var p = Math.max(0, el.value.length - back); el.setSelectionRange(p, p); } catch (e) {}
      }
      st.v[k] = val;
      inputs.forEach(function (x) { if (x !== el && x.dataset.k === k) x.value = show(val, x.dataset.kind); });
      render();
    });
  });

  /* ---------- abas (também abertas pelo menu: /calculadoras#cac, #churn, #ltv, #fidelizacao) ---------- */
  var panels = $$('[data-panel]', root), tabs = $$('[data-tab]', root), cur = 'cac';
  function go(t, scroll) {
    if (TABS.indexOf(t) < 0) t = 'cac';
    cur = t;
    panels.forEach(function (p) { p.hidden = p.dataset.panel !== t; });
    tabs.forEach(function (b) { if (b.dataset.tab === t) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    render();
    if (scroll) {
      var top = $('.steps-nav', root).getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
    var first = $$('[data-panel="' + t + '"] [data-k]', root).filter(function (x) { return !x.value; })[0];
    if (scroll && first && window.matchMedia('(pointer:fine)').matches) first.focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, '', '#' + t);
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.tab, true); }); });
  $$('[data-go]', root).forEach(function (b) { b.addEventListener('click', function () { go(b.dataset.go, true); }); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (TABS.indexOf(h) > -1 && h !== cur) go(h, true); });

  /* ---------- resumo, agendamento e e-mail ---------- */
  function summary() {
    var L = ['Resultado das calculadoras Elevah'];
    if (o.cac) L.push('• CAC: ' + money(o.cac.cac) + ' por cliente (' + money(o.cac.ano) + ' em 12 meses)');
    if (o.churn) L.push('• Churn: ' + F.pct1(o.churn.c) + ' ao mês · ' + money(o.churn.nr) + ' podem deixar de entrar em 12 meses · potencial ' + money(o.churn.pres));
    if (o.ltv) L.push('• LTV: ' + money(o.ltv.ltv) + ' · +20% de permanência: ' + money(o.ltv.novo));
    if (o.fid) L.push('• Fidelização: ' + F.pct0(o.fid.taxa) + ' voltam a comprar · potencial ' + money(o.fid.pot));
    L.push('elevah.tech/calculadoras');
    return L.join('\n');
  }
  var book = $('[data-book]', root);
  book && book.addEventListener('click', function () { var r = $('[data-resumo]'); if (r) r.value = summary(); });
  $('[data-copy]', root).addEventListener('click', function (e) {
    var b = e.currentTarget, old = b.innerHTML, done = function () { b.textContent = 'Resultado copiado'; setTimeout(function () { b.innerHTML = old; }, 1800); };
    navigator.clipboard ? navigator.clipboard.writeText(summary()).then(done, function () { window.prompt('Copie o resultado:', summary()); }) : window.prompt('Copie o resultado:', summary());
  });
  var mail = $('[data-mail]', root);
  if (mail) {
    E.wire && E.wire(mail);
    mail.addEventListener('submit', function (e) {
      e.preventDefault();
      if (E.validate && !E.validate(mail)) return;
      var data = new FormData(mail), status = $('.form-status', mail), btn = $('button', mail);
      data.append('ferramenta', 'Calculadoras (resumo)'); data.append('resumo', summary()); data.append('dados', JSON.stringify(st.v));
      data.append('prioridade', (o.churn && o.churn.nr > 300000) ? 'alta' : 'normal');
      btn.disabled = true; status.className = 'form-status'; status.textContent = '';
      fetch('/api/plano.php', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error(); }); })
        .then(function () { window.elevahTrack && elevahTrack('lead_enviado', { formulario: 'calculadoras', pagina: location.pathname }); status.className = 'form-status is-ok'; status.textContent = 'Recebido. Seu resultado chega no seu e-mail em até 1 dia útil.'; mail.reset(); })
        .catch(function () { status.className = 'form-status is-err'; status.innerHTML = 'Não conseguimos enviar agora. <a href="https://wa.me/' + (E.WHATS || '5511955521350') + '?text=' + encodeURIComponent(summary()) + '" target="_blank" rel="noopener">Envie pelo WhatsApp</a>.'; })
        .finally(function () { btn.disabled = false; });
    });
  }

  /* ---------- início ---------- */
  var h = location.hash.slice(1);
  go(TABS.indexOf(h) > -1 ? h : 'cac', TABS.indexOf(h) > -1);
})();
