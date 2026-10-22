/* Elevah — página inicial V2: abas "Da informação à decisão", FAQ com uma pergunta aberta
   e eventos de conversão. Complementa site.js sem alterar o que ele já faz. */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var track = function (n, p) { if (window.elevahTrack) window.elevahTrack(n, p || {}); };

  /* ---------- abas acessíveis ---------- */
  $$('[data-demo]').forEach(function (demo) {
    var tabs = $$('[role="tab"]', demo);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panel) panel.classList.toggle('is-active', on);
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        if (tab.getAttribute('aria-selected') === 'true') return;
        select(tab, false);
        track('exemplo_decisao', { exemplo: (tab.querySelector('strong') || tab).textContent.trim() });
      });
      tab.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length, j = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = n - 1;
        if (j === null) return;
        e.preventDefault();
        select(tabs[j], true);
      });
    });
  });

  /* ---------- FAQ: uma pergunta aberta por vez (navegadores sem <details name>) ---------- */
  $$('[data-faq]').forEach(function (list) {
    var items = $$('details', list);
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) items.forEach(function (o) { if (o !== d && o.open) o.open = false; });
      });
    });
  });

  /* ---------- conversão: cliques nos CTAs e envio da demonstração ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cta]');
    if (a) track('cta_click', { cta: a.getAttribute('data-cta'), texto: (a.textContent || '').trim().slice(0, 60), pagina: location.pathname });
  }, true);

  var form = document.querySelector('#conversa [data-form]');
  if (form && 'MutationObserver' in window) {
    var status = form.querySelector('.form-status'), interesse = '';
    form.addEventListener('submit', function () { var f = form.querySelector('[data-interest]'); interesse = f ? f.value : ''; }, true);
    new MutationObserver(function () {
      if (status.classList.contains('is-ok') && /demonstra/i.test(interesse)) {
        track('demonstracao_solicitada', { interesse: interesse, pagina: location.pathname });
        interesse = '';
      }
    }).observe(status, { attributes: true, attributeFilter: ['class'] });
  }
})();
