/* Elevah — Conteúdos: busca, filtro por categoria e barra de leitura nos artigos. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };

  var list = $('[data-posts]');
  if (list) {
    var posts = $$('[data-post]', list), q = $('[data-q]'), cats = $$('[data-cat]'), count = $('[data-count]'), empty = $('[data-empty]'), cur = '';
    function apply() {
      var term = norm(q.value.trim()), n = 0;
      posts.forEach(function (p) {
        var ok = (!cur || p.dataset.cats.indexOf(cur) > -1) && (!term || norm(p.dataset.text).indexOf(term) > -1);
        p.hidden = !ok; if (ok) n++;
      });
      // o destaque grande só faz sentido quando a lista está completa
      list.classList.toggle('is-filtered', !!(cur || term));
      empty.hidden = n > 0;
      count.textContent = (cur || term) ? n + (n === 1 ? ' conteúdo' : ' conteúdos') + (cur ? ' em ' + cur : '') : '';
      cats.forEach(function (b) { b.classList.toggle('is-on', b.dataset.cat === cur); });
    }
    cats.forEach(function (b) { b.addEventListener('click', function () { cur = b.dataset.cat; apply(); if (history.replaceState) history.replaceState(null, '', cur ? '#' + encodeURIComponent(cur) : location.pathname); }); });
    q.addEventListener('input', apply);
    $('[data-reset]').addEventListener('click', function () { cur = ''; q.value = ''; apply(); });
    var h = decodeURIComponent(location.hash.slice(1));
    if (h && cats.some(function (b) { return b.dataset.cat === h; })) cur = h;
    apply();
  }

  var bar = $('[data-read-bar]'), body = $('[data-progress-body]');
  if (bar && body) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var r = body.getBoundingClientRect(), h = window.innerHeight;
        bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (h * .35 - r.top) / (r.height - h * .4))).toFixed(4) + ')';
      });
    }, { passive: true });
  }
})();
