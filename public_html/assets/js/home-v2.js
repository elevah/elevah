/* Elevah V2 — abas acessíveis (soluções e exemplos de decisão), FAQ com uma pergunta aberta
   e eventos de conversão. Complementa site.js sem alterar o que ele já faz. */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var track = function (n, p) { if (window.elevahTrack) window.elevahTrack(n, p || {}); };

  /* ---------- abas: [data-tabs="evento"] com role=tab / role=tabpanel ---------- */
  $$('[data-tabs]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box), evt = box.getAttribute('data-tabs');
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panel) panel.classList.toggle('is-active', on);
        $$('[data-for="' + t.getAttribute('aria-controls') + '"]', box).forEach(function (el) { el.classList.toggle('is-active', on); });
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        if (tab.getAttribute('aria-selected') === 'true') return;
        select(tab, false);
        if (evt) track(evt, { item: (tab.querySelector('[data-tab-name]') || tab).textContent.trim(), pagina: location.pathname });
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

  /* ---------- navegação interna da página (seção ativa + respeito ao cabeçalho) ---------- */
  var sub = document.querySelector('.pp-subnav');
  if (sub) {
    var links = $$('a[data-spy]', sub), header = document.querySelector('.header');
    var syncTop = function () { sub.classList.toggle('is-up', !!(header && header.classList.contains('is-hidden'))); };
    if (header && 'MutationObserver' in window) new MutationObserver(syncTop).observe(header, { attributes: true, attributeFilter: ['class'] });
    if ('IntersectionObserver' in window) {
      var current = '';
      var io = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) current = e.target.id; });
        links.forEach(function (a) { var on = a.getAttribute('data-spy') === current; a.classList.toggle('is-active', on); if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main > section[id], main > div > section[id]').forEach(function (t) { io.observe(t); }); // seções fora da lista limpam o destaque
    }
  }

  /* ---------- ampliação das capturas (só quando há imagem real) ---------- */
  $$('[data-zoom]').forEach(function (fig) {
    var img = fig.querySelector('.visual-img');
    if (!img) return;
    fig.classList.add('is-zoomable');
    fig.setAttribute('tabindex', '0'); fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Ampliar imagem: ' + (img.alt || ''));
    function open() {
      var box = document.createElement('div');
      box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', img.alt || 'Imagem ampliada');
      box.innerHTML = '<button class="iconbtn lightbox-close" type="button" aria-label="Fechar">×</button>';
      var big = img.cloneNode(); big.removeAttribute('loading'); big.className = 'lightbox-img'; box.appendChild(big);
      function close() { box.remove(); document.removeEventListener('keydown', esc); fig.focus(); }
      function esc(e) { if (e.key === 'Escape') close(); }
      box.addEventListener('click', function (e) { if (e.target !== big) close(); });
      document.addEventListener('keydown', esc);
      document.body.appendChild(box); box.querySelector('button').focus();
    }
    fig.addEventListener('click', open);
    fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
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
