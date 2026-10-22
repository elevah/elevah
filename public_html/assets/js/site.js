(function () {
  'use strict';
  var WHATS = '5511955521350';
  var EMAIL = 'contato@elevah.tech';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
  function onView(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(el); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }); }, opts || { threshold: .35 });
    io.observe(el);
  }
  window.Elevah = { onView: onView, reduce: reduce, WHATS: WHATS, EMAIL: EMAIL };

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- hero da home ---------- */
  var hero = $('.hero');
  var h1 = $('[data-words]');
  if (h1) { // cada palavra sobe da própria linha de base
    var wi = 0;
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    Array.prototype.slice.call(h1.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var f = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
          var o = document.createElement('span'); o.className = 'wd'; o.setAttribute('aria-hidden', 'true');
          var i = document.createElement('span'); i.textContent = w; i.style.setProperty('--i', wi++); o.appendChild(i); f.appendChild(o);
        });
        h1.replaceChild(f, node);
      } else if (node.nodeType === 1) {
        if (node.tagName === 'BR') return;
        var o = document.createElement('span'); o.className = 'wd'; o.setAttribute('aria-hidden', 'true');
        node.style.setProperty('--i', wi++); node.style.display = 'inline-block';
        h1.replaceChild(o, node); o.appendChild(node);
      }
    });
  }
  if (hero) setTimeout(function () { hero.classList.add('is-ready'); }, 80);
  var spot = $('.hero-spot');
  if (hero && spot && window.matchMedia('(pointer:fine)').matches && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      spot.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      spot.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }
  var heroBg = $('.hero-bg');

  /* ---------- cabeçalho e menus ---------- */
  var header = $('.header'), bar = $('.progress i'), lastY = window.scrollY;
  var sheet = $('#menu'), openBtn = $('.menu-btn'), closeBtn = $('.sheet-close');
  function setMenu(open) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    (open ? closeBtn : openBtn).focus();
  }
  openBtn && openBtn.addEventListener('click', function () { setMenu(true); });
  closeBtn && closeBtn.addEventListener('click', function () { setMenu(false); });
  sheet && sheet.addEventListener('click', function (e) { if (e.target.closest('a') && sheet.classList.contains('is-open')) setMenu(false); });

  $$('[data-dd]').forEach(function (dd) {
    var btn = $('.dd-btn', dd), t;
    function set(open) { dd.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); }
    // botão abre/fecha; link (ex.: Calculadoras) navega e abre o submenu ao passar o mouse ou focar
    if (btn.tagName === 'BUTTON') btn.addEventListener('click', function () { set(!dd.classList.contains('is-open')); });
    else dd.addEventListener('focusin', function () { set(true); });
    dd.addEventListener('mouseenter', function () { clearTimeout(t); set(true); });
    dd.addEventListener('mouseleave', function () { t = setTimeout(function () { set(false); }, 180); });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) set(false); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) set(false); });
    if (/^\/servicos\//.test(location.pathname)) btn.setAttribute('aria-current', 'page');
  });

  /* ---------- luz que segue o mouse nos pilares ---------- */
  $$('.pillar').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* ---------- sistema integrado: cada capacidade "acende" conforme o vídeo avança ---------- */
  var sys = $('[data-sys]');
  if (sys) {
    var vid = $('[data-sys-video]', sys), caps = $$('[data-cap]', sys).sort(function (a, b) { return a.dataset.cap - b.dataset.cap; }), lit = 0, cycled = false;
    var light = function (n) { caps.forEach(function (c, i) { c.classList.toggle('is-on', i < n || cycled); c.classList.toggle('is-live', i === n - 1); }); };
    var all = function () { cycled = true; light(caps.length); };
    if (reduce || !vid) all();
    else {
      vid.addEventListener('timeupdate', function () {
        if (!vid.duration) return;
        var n = Math.min(caps.length, Math.floor(vid.currentTime / vid.duration * (caps.length + 1)) + 0);
        if (n < lit) cycled = true;          // o vídeo recomeçou: todas ficam visíveis, o destaque segue o vídeo
        lit = n; light(Math.max(n, 1));
      });
      setTimeout(function () { if (!lit) all(); }, 6000); // se o vídeo não tocar, mostra tudo
    }
  }

  /* ---------- blocos empilhados (páginas de serviço) ---------- */
  $$('[data-stack]').forEach(function (box) {
    var items = Array.prototype.slice.call(box.children), tk = false;
    items.forEach(function (el, i) { el.style.setProperty('--n', i); });
    function upd() {
      tk = false;
      items.forEach(function (el, i) {
        var nx = items[i + 1]; if (!nx || reduce) { el.style.setProperty('--cover', 0); return; }
        var a = el.getBoundingClientRect(), b = nx.getBoundingClientRect();
        el.style.setProperty('--cover', Math.max(0, Math.min(1, (a.bottom - b.top) / Math.max(1, a.height))).toFixed(3));
      });
    }
    window.addEventListener('scroll', function () { if (!tk) { tk = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  });

  /* ---------- revelação ---------- */
  var reveals = $$('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else reveals.forEach(function (el) { el.classList.add('is-in'); });

  /* ---------- texto que acende ---------- */
  var stmt = $('[data-scrub]'), words = [];
  if (stmt) {
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(stmt.childNodes).forEach(function (node) {
      var hi = node.nodeType === 1;
      node.textContent.split(/(\s+)/).forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span'); s.className = 'w' + (hi ? ' hi' : ''); s.textContent = w; frag.appendChild(s); words.push(s);
      });
    });
    stmt.setAttribute('aria-label', stmt.textContent.replace(/\s+/g, ' ').trim());
    stmt.textContent = ''; stmt.appendChild(frag);
    if (reduce) words.forEach(function (w) { w.classList.add('on'); });
  }

  /* ---------- contadores ---------- */
  $$('[data-countup]').forEach(function (el) {
    var to = +el.dataset.countup;
    if (reduce) return;
    el.textContent = '0';
    onView(el, function () {
      var t0 = performance.now();
      (function f(t) { var k = clamp((t - t0) / 1600, 0, 1); el.textContent = Math.round(to * ease(k)).toLocaleString('pt-BR'); if (k < 1) requestAnimationFrame(f); })(t0);
    }, { threshold: .8 });
  });

  /* ---------- laço de rolagem ---------- */
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, h = vh(), max = document.documentElement.scrollHeight - h;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = sheet && sheet.classList.contains('is-open');
      if (!menuOpen && y > h * .9 && y > lastY + 4) header.classList.add('is-hidden');
      if (y < lastY - 4 || y < h * .9) header.classList.remove('is-hidden');
    }
    lastY = y;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0).toFixed(4) + ')';
    if (heroBg && !reduce && y < h * 1.2) heroBg.style.transform = 'translate3d(0,' + (y * .18).toFixed(1) + 'px,0) scale(1.04)';
    if (words.length && !reduce) {
      var r = stmt.getBoundingClientRect(), p = clamp((h * .85 - r.top) / (h * .45), 0, 1), n = Math.round(p * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ---------- formulário de conversa (modal) ---------- */
  var modal = $('#conversa'), lastFocus = null;
  function focusables() { return $$('button, [href], input:not([type=hidden]), select, textarea', modal).filter(function (el) { return !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null; }); }
  function openModal(src) {
    lastFocus = src || document.activeElement;
    var interest = (src && src.dataset && src.dataset.interest) || 'Conversa estratégica';
    $('[data-interest]', modal).value = interest;
    $('input[name="pagina"]', modal).value = location.pathname;
    if (sheet && sheet.classList.contains('is-open')) { sheet.classList.remove('is-open'); openBtn.setAttribute('aria-expanded', 'false'); }
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    setTimeout(function () { var f = $('#f-nome'); f && f.focus(); }, 60);
  }
  function closeModal() {
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (location.hash === '#conversa' && history.replaceState) history.replaceState(null, '', location.pathname);
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  window.Elevah.openModal = openModal;
  if (modal) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-open="conversa"]');
      if (a) { e.preventDefault(); openModal(a); }
    });
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modal.classList.contains('is-open')) closeModal();
        else if (sheet && sheet.classList.contains('is-open')) setMenu(false);
        $$('[data-dd].is-open').forEach(function (d) { d.classList.remove('is-open'); $('.dd-btn', d).setAttribute('aria-expanded', 'false'); });
      }
      if (e.key === 'Tab' && modal.classList.contains('is-open')) {
        var f = focusables(); if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    if (location.hash === '#conversa' || location.hash === '#contato') openModal();
  }

  /* ---------- validação compartilhada ---------- */
  function maskTel(tel) {
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      tel.value = d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4) : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d;
    });
  }
  function check(el) {
    var err = el.parentElement.querySelector('.err'), ok = el.checkValidity(), msg = '';
    if (el.type === 'tel' && el.value && el.value.replace(/\D/g, '').length < 10) ok = false;
    if (!ok) msg = el.validity.valueMissing ? 'Preencha este campo.' : el.type === 'email' ? 'Informe um e-mail válido.' : el.type === 'tel' ? 'Informe o WhatsApp com DDD.' : 'Confira este campo.';
    el.setAttribute('aria-invalid', String(!ok));
    if (err) err.textContent = msg;
    return ok;
  }
  function wire(form) {
    $$('input[required], select[required]', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid') === 'true') check(el); });
    });
    $$('input[type="tel"]', form).forEach(maskTel);
  }
  function validate(scope) {
    var first = null;
    $$('input[required], select[required]', scope).forEach(function (el) { if (el.offsetParent !== null && !check(el) && !first) first = el; });
    if (first) first.focus();
    return !first;
  }
  window.Elevah.wire = wire; window.Elevah.validate = validate;

  $$('[data-form]').forEach(function (form) {
    var status = $('.form-status', form), btn = $('button[type="submit"]', form);
    wire(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var data = new FormData(form);
      btn.disabled = true; status.className = 'form-status'; status.textContent = '';
      function fallback() {
        var txt = encodeURIComponent('Olá, quero falar com a Elevah (' + data.get('interesse') + ').\n\nNome: ' + data.get('nome') + '\nEmpresa: ' + data.get('empresa') + '\nCargo: ' + data.get('cargo'));
        status.className = 'form-status is-err';
        status.innerHTML = 'Não conseguimos enviar agora. <a href="https://wa.me/' + WHATS + '?text=' + txt + '" target="_blank" rel="noopener">Envie pelo WhatsApp</a> ou escreva para <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
      }
      fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (j) {
          if (!j.ok) return fallback();
          form.reset(); $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
          window.elevahTrack && elevahTrack('lead_enviado', { formulario: 'conversa', pagina: location.pathname });
          status.className = 'form-status is-ok';
          status.textContent = 'Recebemos sua solicitação. A equipe Elevah entra em contato para agendar a conversa.';
        })
        .catch(fallback)
        .finally(function () { btn.disabled = false; });
    });
  });
})();

/* rastreamento: cliques em WhatsApp, e-mail e telefone (todas as páginas) */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a || !window.elevahTrack) return;
  var h = a.getAttribute('href'), kind = /wa\.me|whatsapp/.test(h) ? 'whatsapp_click' : /^mailto:/.test(h) ? 'email_click' : /^tel:/.test(h) ? 'telefone_click' : '';
  if (kind) elevahTrack(kind, { local: a.getAttribute('data-track') || '', texto: (a.textContent || '').trim().slice(0, 60), pagina: location.pathname });
}, true);
