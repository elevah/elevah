/* Elevah · Sistema Editorial — aplicação (sem dependências). */
(function () {
  'use strict';
  const E = window.ELEVAH;
  const KEY = 'elevah-editorial-v1';

  /* ================================================================ */
  /* Helpers                                                           */
  /* ================================================================ */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const D = s => new Date(s + 'T12:00:00');
  const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const TODAY = ymd(new Date());
  const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return ymd(d); };
  const dow = s => (D(s).getDay() + 6) % 7; // 0 = segunda
  const monthStart = s => s.slice(0, 8) + '01';
  const monthEnd = s => { const d = D(monthStart(s)); d.setMonth(d.getMonth() + 1); d.setDate(0); return ymd(d); };
  const weekStart = s => addDays(s, -dow(s));
  const addMonths = (s, n) => { const d = D(monthStart(s)); d.setMonth(d.getMonth() + n); return ymd(d); };
  const fmtD = s => s ? D(s).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '') : 'sem data';
  const fmtDL = s => D(s).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\./g, '');
  const monthName = s => { const t = D(s).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); return t.charAt(0).toUpperCase() + t.slice(1); };
  const WD = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const uid = p => p + Math.random().toString(36).slice(2, 8);
  const clone = o => JSON.parse(JSON.stringify(o));
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
  const nf = n => Number(n || 0).toLocaleString('pt-BR');
  const by = (arr, k = 'id') => Object.fromEntries(arr.map(x => [x[k], x]));
  const M = {
    stage: by(E.stages), pillar: by(E.pillars), fmt: by(E.formats), ch: by(E.channels), role: by(E.roles),
    obj: by(E.objectives), type: by(E.types), fw: by(E.frameworks), assoc: by(E.associations), status: by(E.statuses),
    profile: by(E.profiles), series: by(E.series)
  };
  const THEMES = {}; E.pillars.forEach(p => p.themes.forEach(t => { THEMES[t.id] = Object.assign({ pillar: p.id }, t); }));
  const STATUS_ORDER = E.statuses.map(s => s.id);
  const statusIdx = s => STATUS_ORDER.indexOf(s);
  const LOCKED = ['aprovado', 'agendado', 'publicado'];
  const PRIO_W = { alta: 2, media: 1, baixa: 0 };
  const PRIO_N = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };

  /* ================================================================ */
  /* Estado                                                            */
  /* ================================================================ */
  function itemFromIdea(idea, extra) {
    return Object.assign({
      id: uid('c'), ideaId: idea.id, title: idea.title, angle: idea.angle, date: null,
      channel: idea.channel, format: idea.format, stage: idea.stage, objective: idea.objective,
      pillar: idea.pillar, theme: idea.theme, audience: idea.audience, type: idea.type,
      framework: idea.framework, assoc: idea.assoc, priority: idea.priority, status: 'priorizado',
      owner: '', series: idea.series || '', message: '', brief: {}, metrics: null, review: null, demo: false, ex: idea.ex, src: idea.src || ''
    }, extra || {});
  }

  function seed() {
    const ideas = clone(E.ideas);
    const ideaMap = by(ideas);
    const items = [];
    const histMap = {};
    E.history.forEach(([d, id, m]) => { histMap[d + id] = m; });
    E.plan.forEach(([d, id, st, owner]) => {
      const it = itemFromIdea(ideaMap[id], { date: d, status: st, owner });
      const m = histMap[d + id];
      if (m) { it.metrics = clone(m); it.demo = true; }
      items.push(it);
    });
    E.history.forEach(([d, id, m]) => {
      if (d >= '2026-11-01') return;
      items.push(itemFromIdea(ideaMap[id], { date: d, status: 'publicado', metrics: clone(m), demo: true, owner: 'Conteúdo' }));
    });
    const assocPriority = {}; const assocMsg = {};
    E.associations.forEach(a => { assocPriority[a.id] = a.priority; assocMsg[a.id] = a.message; });
    return {
      v: 1, ideas, items, radar: clone(E.radar),
      targets: clone(E.targetPresets[0].t), useTargets: true, tolerance: 5,
      cadence: { ig: [0, 2, 4], li: [1, 3] },
      owners: ['Conteúdo', 'Design', 'Vídeo', 'Comercial'],
      assocPriority, assocMsg, changeLog: [],
      filters: { audience: '', channel: '', format: '', objective: '', pillar: '', stage: '' },
      period: { mode: 'month', ref: '2026-11-01', from: '2026-11-01', to: '2026-11-30' },
      dashView: 'planned', calView: 'month', calRef: '2026-11-01', perfMode: 'all',
      sim: null
    };
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); if (!raw) return null; const s = JSON.parse(raw); return s && s.v === 1 ? s : null; } catch (e) { return null; }
  }
  let S = load() || seed();
  let saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* armazenamento indisponível */ } }, 120); }
  const UI = { drawer: null, tabs: {}, libQuery: '', libScope: 'all', libSort: 'prio', prodId: null, prodStep: 0, radarFilter: 'todos', open: { p1: true }, confirm: null, perfSort: 'date' };

  /* ================================================================ */
  /* Núcleo de cálculo                                                 */
  /* ================================================================ */
  function getPeriod() {
    const p = S.period; const ref = p.ref || TODAY;
    if (p.mode === 'week') { const f = weekStart(ref); return { from: f, to: addDays(f, 6), label: 'Semana de ' + fmtD(f) }; }
    if (p.mode === 'custom') return { from: p.from, to: p.to, label: fmtD(p.from) + ' – ' + fmtD(p.to) };
    return { from: monthStart(ref), to: monthEnd(ref), label: monthName(ref) };
  }
  function calRange() {
    if (S.calView === 'week') { const f = weekStart(S.calRef); return { from: f, to: addDays(f, 6) }; }
    return { from: monthStart(S.calRef), to: monthEnd(S.calRef) };
  }
  const inRange = (it, r) => it.date && it.date >= r.from && it.date <= r.to;
  function passFilters(x) {
    const f = S.filters;
    return (!f.audience || x.audience === f.audience) && (!f.channel || x.channel === f.channel) && (!f.format || x.format === f.format) &&
      (!f.objective || x.objective === f.objective) && (!f.pillar || x.pillar === f.pillar) && (!f.stage || x.stage === f.stage);
  }
  const activeFilters = () => Object.values(S.filters).filter(Boolean).length;
  function planned(r, items) { return (items || S.items).filter(it => inRange(it, r) && passFilters(it)); }
  function dist(list) {
    const c = {}; E.stages.forEach(s => { c[s.id] = 0; });
    list.forEach(it => { c[it.stage] = (c[it.stage] || 0) + 1; });
    const n = list.length; const p = {};
    E.stages.forEach(s => { p[s.id] = n ? c[s.id] / n * 100 : 0; });
    return { c, p, n };
  }
  /* Quantos conteúdos da etapa faltam para atingir a meta, sem remover outros */
  function needed(count, total, targetPct) {
    const t = targetPct / 100; if (t <= 0) return 0; if (t >= 1) return total - count;
    return Math.max(0, Math.ceil((t * total - count) / (1 - t) - 1e-9));
  }
  function adherence(d) {
    if (!d.n) return 0;
    const dev = E.stages.reduce((a, s) => a + Math.abs(d.p[s.id] - S.targets[s.id]), 0);
    return Math.max(0, Math.round(100 - dev / 2));
  }
  function countBy(list, key) { const c = {}; list.forEach(x => { c[x[key]] = (c[x[key]] || 0) + 1; }); return c; }

  function usedIdeaIds() {
    const used = new Set();
    S.items.forEach(it => { if (it.ideaId && (it.status !== 'publicado' || (it.date && it.date >= addDays(TODAY, -45)))) used.add(it.ideaId); });
    return used;
  }
  function suggestIdeas(crit, k, r) {
    const used = usedIdeaIds();
    const per = planned(r || ctxRange());
    const pc = countBy(per, 'pillar'); const avg = per.length / E.pillars.length; const tcount = countBy(per, 'theme');
    return S.ideas.filter(i => !used.has(i.id) && passFilters(i) && Object.keys(crit).every(key => !crit[key] || i[key] === crit[key]))
      .map(i => ({ i, score: i.priority * 2 + (PRIO_W[S.assocPriority[i.assoc]] || 0) + ((pc[i.pillar] || 0) < avg ? 1 : 0) - ((tcount[i.theme] || 0) >= 2 ? 3 : (tcount[i.theme] || 0)) + (i.note && /segurar|validação|não demonstrar/i.test(i.note) ? -3 : 0) }))
      .sort((a, b) => b.score - a.score).slice(0, k).map(x => x.i);
  }
  function cadenceDays(ch) { return (S.cadence[ch] || []); }
  const ctxRange = () => (location.hash === '#calendario' ? calRange() : getPeriod());
  function nextSlot(ch, r) {
    r = r || ctxRange();
    let start = r.from > TODAY ? r.from : TODAY;
    const taken = d => S.items.some(it => it.date === d && it.channel === ch);
    for (let d = start; d <= r.to; d = addDays(d, 1)) if (cadenceDays(ch).includes(dow(d)) && !taken(d)) return d;
    let best = null, bestN = 1e9;
    for (let d = start; d <= r.to; d = addDays(d, 1)) { if (dow(d) > 4 || taken(d)) continue; const n = S.items.filter(it => it.date === d).length; if (n < bestN) { best = d; bestN = n; } }
    if (best) return best;
    for (let d = start, i = 0; i < 45; d = addDays(d, 1), i++) if (cadenceDays(ch).includes(dow(d)) && !taken(d)) return d;
    return start;
  }
  function openSlots(r) {
    const out = [];
    const start = r.from > TODAY ? r.from : TODAY;
    for (let d = start; d <= r.to; d = addDays(d, 1)) {
      E.channels.forEach(c => { if (cadenceDays(c.id).includes(dow(d)) && !S.items.some(it => it.date === d && it.channel === c.id)) out.push({ date: d, ch: c.id }); });
    }
    return out;
  }
  function adaptFormat(fmt, ch) {
    if (M.fmt[fmt] && M.fmt[fmt].ch.includes(ch)) return fmt;
    const map = ch === 'li' ? { reels: 'video', carrossel: 'documento', stories: 'texto' } : { texto: 'imagem', documento: 'carrossel', artigo: 'carrossel' };
    return map[fmt] || E.formats.find(f => f.ch.includes(ch)).id;
  }

  function recommendations(r) {
    r = r || getPeriod();
    const list = planned(r); const d = dist(list); const recs = [];
    const tol = S.tolerance;
    if (S.useTargets && d.n) {
      const deficits = [];
      E.stages.forEach(s => {
        const diff = d.p[s.id] - S.targets[s.id];
        if (diff < -tol) {
          const need = needed(d.c[s.id], d.n, S.targets[s.id]);
          const band = needed(d.c[s.id], d.n, S.targets[s.id] - tol);
          deficits.push(s.id);
          recs.push({ sev: diff < -10 ? 'crit' : 'warn', key: 'st-' + s.id, title: `${s.name}: ${Math.round(d.p[s.id])}% planejado | Meta: ${S.targets[s.id]}%`,
            text: `Faltam ${need} ${need === 1 ? 'conteúdo' : 'conteúdos'} de ${s.name.toLowerCase()} para chegar a ${S.targets[s.id]}%${band && band < need ? ` (${band} para entrar na faixa de ±${tol} pp)` : ''}.`, sugs: suggestIdeas({ stage: s.id }, 3, r), stage: s.id });
        }
      });
      E.stages.forEach(s => {
        const diff = d.p[s.id] - S.targets[s.id];
        if (diff > tol) {
          const movable = list.filter(it => it.stage === s.id && !LOCKED.includes(it.status));
          recs.push({ sev: 'warn', key: 'ov-' + s.id, title: `${s.name} acima da meta (+${Math.round(diff)} pp)`,
            text: movable.length ? `${movable.length} ${movable.length === 1 ? 'conteúdo ainda pode' : 'conteúdos ainda podem'} ser reclassificados ou trocados${deficits.length ? ' por ' + deficits.map(x => M.stage[x].name.toLowerCase()).join(' ou ') : ''}.` : 'Todos já aprovados. Ajuste nas próximas semanas.',
            items: movable.slice(0, 3) });
        }
      });
    }
    if (list.length >= 6) {
      const pc = countBy(list, 'pillar');
      E.pillars.forEach(p => { if (!pc[p.id]) recs.push({ sev: 'info', key: 'pi-' + p.id, title: `Pilar sem conteúdo: ${p.name}`, text: 'Nenhuma publicação no período.', sugs: suggestIdeas({ pillar: p.id }, 2, r) }); });
      Object.entries(pc).forEach(([pid, n]) => { if (n / list.length > .35) recs.push({ sev: 'warn', key: 'pc-' + pid, title: `Concentração em ${M.pillar[pid].name}`, text: `${pct(n, list.length)}% do período em um só pilar.` }); });
      const tc = countBy(list, 'theme');
      Object.entries(tc).forEach(([tid, n]) => { if (n >= 3) recs.push({ sev: 'warn', key: 'th-' + tid, title: `Tema repetido: ${THEMES[tid] ? THEMES[tid].name : tid}`, text: `${n} publicações no período sobre o mesmo tema.` }); });
      const ac = countBy(list, 'audience');
      ['dono', 'gestor', 'financeiro', 'mkt'].forEach(rid => { if (!ac[rid] && !S.filters.audience) recs.push({ sev: 'info', key: 'au-' + rid, title: `Público sem cobertura: ${M.role[rid].name}`, text: 'Nenhum conteúdo pensado para este decisor.', sugs: suggestIdeas({ audience: rid }, 2, r) }); });
      const asc = countBy(list, 'assoc');
      E.associations.forEach(a => { if (S.assocPriority[a.id] === 'alta' && (asc[a.id] || 0) < 2) recs.push({ sev: 'info', key: 'as-' + a.id, title: `Associação prioritária pouco trabalhada: ${a.name}`, text: `${asc[a.id] || 0} conteúdo(s) no período.`, sugs: suggestIdeas({ assoc: a.id }, 2, r) }); });
    }
    const order = { crit: 0, warn: 1, info: 2 };
    return recs.sort((a, b) => order[a.sev] - order[b.sev]);
  }

  /* ================================================================ */
  /* Mutações                                                          */
  /* ================================================================ */
  let toastT;
  function toast(msg) {
    const el = document.getElementById('toast'); el.textContent = msg; el.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, 2600);
  }
  function commit(msg) { save(); render(); if (UI.drawer) renderDrawer(); if (msg) toast(msg); }
  const getItem = id => S.items.find(x => x.id === id);
  const getIdea = id => S.ideas.find(x => x.id === id);
  function scheduleIdea(ideaId, date, ch) {
    const idea = getIdea(ideaId); if (!idea) return null;
    const channel = ch || idea.channel;
    const d = date || nextSlot(channel);
    const it = itemFromIdea(idea, { date: d, channel, format: adaptFormat(idea.format, channel) });
    S.items.push(it);
    return it;
  }
  function publish(it) { it.status = 'publicado'; if (!it.date) it.date = TODAY; }

  /* ================================================================ */
  /* Componentes                                                       */
  /* ================================================================ */
  const stageChip = id => M.stage[id] ? `<span class="chip"><i class="dot" style="background:${M.stage[id].color}"></i>${M.stage[id].name}</span>` : '';
  const pillarChip = id => M.pillar[id] ? `<span class="chip"><i class="dot" style="background:${M.pillar[id].color}"></i>${esc(M.pillar[id].name)}</span>` : '';
  const chip = (t, cls) => t ? `<span class="chip ${cls || ''}">${esc(t)}</span>` : '';
  const prioDots = n => `<span class="prio" title="Prioridade">${'●'.repeat(n)}${'○'.repeat(3 - n)}</span>`;
  const opts = (arr, sel, empty, nameKey = 'name') => (empty ? `<option value="">${esc(empty)}</option>` : '') + arr.map(x => `<option value="${esc(x.id)}" ${x.id === sel ? 'selected' : ''}>${esc(x[nameKey])}</option>`).join('');
  const seg = (act, items, cur) => `<div class="seg">${items.map(([v, l]) => `<button data-act="${act}" data-v="${v}" class="${v === cur ? 'on' : ''}">${l}</button>`).join('')}</div>`;

  function filterBar(extra) {
    const f = S.filters;
    const sel = (k, arr, label) => `<select data-filter="${k}" class="${f[k] ? 'on' : ''}" aria-label="${label}">${opts(arr, f[k], label)}</select>`;
    return `<div class="filters"><span class="label">Filtros</span>
      ${sel('audience', E.roles, 'Público')}${sel('channel', E.channels, 'Canal')}${sel('format', E.formats, 'Formato')}
      ${sel('objective', E.objectives, 'Objetivo')}${sel('pillar', E.pillars, 'Pilar')}${sel('stage', E.stages, 'Etapa do funil')}
      ${activeFilters() ? `<button class="btn ghost sm" data-act="clear-filters">Limpar</button>` : ''}${extra || ''}</div>`;
  }
  function simBanner() {
    if (!S.sim) return '';
    const base = dist(planned(getPeriod(), S.sim)); const now = dist(planned(getPeriod()));
    const deltas = E.stages.map(s => { const dlt = Math.round(now.p[s.id] - base.p[s.id]); return dlt ? `${s.name} ${dlt > 0 ? '+' : ''}${dlt} pp` : ''; }).filter(Boolean).join(' · ');
    return `<div class="sim-banner"><div><b>Modo simulação.</b> Altere o calendário à vontade: nada é definitivo até aplicar. <span class="small muted">${deltas || 'Sem alterações na distribuição ainda.'}</span></div>
      <div class="row"><button class="btn sm" data-act="sim-discard">Descartar</button><button class="btn primary sm" data-act="sim-apply">Aplicar alterações</button></div></div>`;
  }

  function distBars(list, opts2) {
    opts2 = opts2 || {};
    const d = dist(list);
    const ghost = opts2.ghost ? dist(opts2.ghost) : null;
    const rows = E.stages.map(s => {
      const p = d.p[s.id]; const t = S.targets[s.id];
      const diff = p - t;
      let tag = '';
      const need = S.useTargets && diff < -S.tolerance ? needed(d.c[s.id], d.n, t) : 0;
      if (S.useTargets && d.n) {
        if (diff < -S.tolerance) tag = `<span class="gap-tag under">−${Math.round(-diff)} pp</span>`;
        else if (diff > S.tolerance) tag = `<span class="gap-tag over">+${Math.round(diff)} pp</span>`;
        else tag = `<span class="gap-tag okay">na meta</span>`;
      }
      return `<div class="dist-row">
        <div class="dist-name"><i class="st-dot" style="background:${s.color}"></i>${s.name}</div>
        <div class="bar" title="${s.name}: ${d.c[s.id]} de ${d.n}">
          <div class="bar-fill" style="width:${Math.min(100, p)}%;background:${s.color}"></div>
          ${ghost && Math.round(ghost.p[s.id]) !== Math.round(p) ? `<div class="bar-ghost" style="width:${Math.min(100, ghost.p[s.id])}%"></div>` : ''}
          ${S.useTargets ? `<div class="bar-target" style="left:calc(${t}% - 1px)" data-t="${t}%"></div>` : ''}
        </div>
        <div class="dist-val"><span><b>${Math.round(p)}%</b> <span class="muted">· ${d.c[s.id]}</span></span>${tag}${need && !opts2.compact ? `<span class="tiny muted">+${need} para a meta</span>` : ''}</div>
      </div>`;
    }).join('');
    return `<div class="dist ${opts2.compact ? 'compact' : ''}">${rows}</div>`;
  }

  function hbars(entries, color, max) {
    max = max || Math.max(1, ...entries.map(e => e.v));
    if (!entries.length) return '<div class="empty small">Sem conteúdos no período.</div>';
    return `<div class="hbars">${entries.map(e => `<div class="hbar"><span class="name" title="${esc(e.name)}">${esc(e.name)}</span><span class="track"><span class="fill" style="display:block;width:${e.v / max * 100}%;background:${e.color || color || 'var(--accent)'}"></span></span><span class="v">${e.label != null ? e.label : e.v}</span></div>`).join('')}</div>`;
  }

  function recCard(rc) {
    return `<div class="rec"><div class="rec-head"><span class="rec-sev ${rc.sev}"></span><div class="stack" style="gap:3px;flex:1;min-width:0"><span class="rec-title">${esc(rc.title)}</span><span class="small muted">${esc(rc.text)}</span></div></div>
      ${rc.sugs && rc.sugs.length ? `<div class="rec-sugs">${rc.sugs.map(i => `<div class="rec-sug"><span><span class="small" style="font-weight:550">${esc(i.title)}</span><br><span class="tiny muted">${M.fmt[i.format].name} · ${M.ch[i.channel].name} · ${esc(M.pillar[i.pillar].name)}</span></span>
        <button class="btn sm" data-act="add-idea" data-id="${i.id}" title="Agendar no próximo espaço livre">Adicionar em ${fmtD(nextSlot(i.channel))}</button></div>`).join('')}</div>` : ''}
      ${rc.items && rc.items.length ? `<div class="rec-sugs">${rc.items.map(it => `<div class="rec-sug"><span class="small">${esc(it.title)} <span class="tiny muted">· ${fmtD(it.date)}</span></span><button class="btn sm" data-act="open-item" data-id="${it.id}">Reclassificar</button></div>`).join('')}</div>` : ''}
    </div>`;
  }

  function itemCard(it, big) {
    const st = M.stage[it.stage];
    return `<div class="item ${it.status === 'publicado' ? 'pub' : ''}" draggable="true" data-drag="${it.id}" data-act="open-item" data-id="${it.id}" style="--c:${st ? st.color : 'var(--muted)'}" title="${esc(it.title)}">
      ${it.review ? '<span class="rv" title="Revisar alinhamento"></span>' : ''}
      <span class="item-t">${esc(it.title)}</span>
      <span class="item-m"><span class="ch">${M.ch[it.channel] ? M.ch[it.channel].short : ''}</span><span>${M.fmt[it.format] ? M.fmt[it.format].name.split(' ')[0] : ''}</span><span>· ${M.status[it.status].name.split(' ')[0]}</span></span>
      ${big ? `<span class="chips">${stageChip(it.stage)}${pillarChip(it.pillar)}</span><span class="tiny muted">${esc(M.obj[it.objective] ? M.obj[it.objective].name : '')} · ${esc(M.role[it.audience] ? M.role[it.audience].name : '')}${it.owner ? ' · ' + esc(it.owner) : ''}</span>` : ''}
    </div>`;
  }

  /* ================================================================ */
  /* Páginas                                                           */
  /* ================================================================ */
  const views = {};

  /* ---------- Painel ---------- */
  views.painel = function () {
    const r = getPeriod();
    const all = planned(r);
    const pub = all.filter(it => it.status === 'publicado');
    const list = S.dashView === 'published' ? pub : all;
    const d = dist(all);
    const late = all.filter(it => it.status !== 'publicado' && it.date < TODAY);
    const pending = all.filter(it => it.status !== 'publicado');
    const recs = recommendations(r);
    const pc = countBy(list, 'pillar'); const oc = countBy(list, 'objective'); const fc = countBy(list, 'format'); const cc = countBy(list, 'channel');
    const scoreAdh = adherence(d);
    const customInputs = S.period.mode === 'custom' ? `<input type="date" data-period="from" value="${S.period.from}" aria-label="Início"><input type="date" data-period="to" value="${S.period.to}" aria-label="Fim">` : '';
    // semanas do período
    const weeks = []; for (let w = weekStart(r.from); w <= r.to; w = addDays(w, 7)) weeks.push(w);
    const perWeek = weeks.map(w => { const wl = list.filter(it => it.date >= w && it.date <= addDays(w, 6)); return { w, ig: wl.filter(i => i.channel === 'ig').length, li: wl.filter(i => i.channel === 'li').length }; });
    const cadN = cadenceDays('ig').length + cadenceDays('li').length;
    const maxW = Math.max(cadN, ...perWeek.map(x => x.ig + x.li), 1);
    const consistent = perWeek.filter(x => x.ig + x.li >= cadN).length;
    // públicos × etapas
    const heat = E.roles.map(rl => ({ rl, cells: E.stages.map(s => list.filter(it => it.audience === rl.id && it.stage === s.id).length) }));
    const asc = countBy(list, 'assoc');
    const allPub = S.items.filter(it => it.status === 'publicado' && it.metrics && inRange(it, r));
    const reach = allPub.reduce((a, it) => a + (it.metrics.alcance || 0), 0);
    const topPub = allPub.slice().sort((a, b) => (b.metrics.alcance || 0) - (a.metrics.alcance || 0))[0];
    const tc = countBy(list, 'theme');
    const reps = Object.entries(tc).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);

    return `<div class="page-head"><div><h1>Painel editorial</h1><p>${esc(r.label)} · ${d.n} conteúdos planejados${activeFilters() ? ' (filtrado)' : ''}</p></div>
      <div class="head-actions">${seg('period', [['week', 'Semana'], ['month', 'Mês'], ['custom', 'Período']], S.period.mode)}
        <button class="btn sm ghost" data-act="period-prev" aria-label="Período anterior">‹</button><button class="btn sm ghost" data-act="period-next" aria-label="Próximo período">›</button>${customInputs}
        <button class="btn sm" data-act="${S.sim ? 'sim-discard' : 'sim-start'}">${S.sim ? 'Sair da simulação' : 'Simular alterações'}</button></div></div>
      ${simBanner()}${filterBar()}

      <div class="label">Cobertura planejada</div>
      <div class="grid g4">
        <div class="card kpi"><span class="label">Planejados</span><b>${d.n}</b><span class="sub">${pub.length} publicados · ${pending.length} pendentes</span></div>
        <div class="card kpi"><span class="label">Aderência às metas</span><b>${S.useTargets ? scoreAdh + '%' : '—'}</b><span class="sub">${S.useTargets ? '100% = distribuição igual à meta' : 'Metas desativadas'}</span></div>
        <div class="card kpi"><span class="label">Etapa com maior lacuna</span><b style="font-size:20px">${(() => { if (!S.useTargets || !d.n) return '—'; const w = E.stages.map(s => [s, d.p[s.id] - S.targets[s.id]]).sort((a, b) => a[1] - b[1])[0]; return w[1] < -S.tolerance ? w[0].name : 'Nenhuma'; })()}</b><span class="sub">Tolerância de ±${S.tolerance} pp</span></div>
        <div class="card kpi"><span class="label">Atrasados</span><b style="color:${late.length ? 'var(--crit)' : 'inherit'}">${late.length}</b><span class="sub">Data passada sem publicação</span></div>
      </div>

      <div class="grid g-main">
        <div class="card"><div class="card-head"><div><h2>Distribuição do funil</h2><p>Cada conteúdo conta uma vez, pela etapa primária. Base: ${S.dashView === 'published' ? `${pub.length} publicados` : `${d.n} planejados`} no período.</p></div>
          ${seg('dash-view', [['planned', 'Planejado'], ['published', 'Publicado']], S.dashView)}</div>
          ${distBars(list, { ghost: S.sim ? planned(r, S.sim).filter(it => S.dashView !== 'published' || it.status === 'publicado') : null })}
          <div class="spread" style="margin-top:16px"><div class="legend"><span><i style="background:var(--ink);width:2px"></i>Meta</span>${S.sim ? '<span><i style="border:1.5px dashed var(--ink-2)"></i>Antes da simulação</span>' : ''}</div>
          <a class="small" href="#ajustes">Editar metas</a></div>
        </div>
        <div class="card"><div class="card-head"><div><h2>Recomendações</h2><p>Com base no planejado do período.</p></div><span class="chip">${recs.length}</span></div>
          <div class="stack">${recs.length ? recs.slice(0, 5).map(recCard).join('') : '<div class="empty small">Distribuição equilibrada. Nada a corrigir agora.</div>'}</div>
        </div>
      </div>

      <div class="grid g3">
        <div class="card"><div class="card-head"><h2>Pilares editoriais</h2></div>${hbars(E.pillars.map(p => ({ name: p.name, v: pc[p.id] || 0, color: p.color })))}</div>
        <div class="card"><div class="card-head"><h2>Objetivos</h2></div>${hbars(E.objectives.filter(o => oc[o.id]).map(o => ({ name: o.name, v: oc[o.id] })).sort((a, b) => b.v - a.v))}</div>
        <div class="card"><div class="card-head"><h2>Formatos e canais</h2><span class="tiny muted">${E.channels.map(c => `${c.name} ${cc[c.id] || 0}`).join(' · ')}</span></div>${hbars(E.formats.filter(f => fc[f.id]).map(f => ({ name: f.name, v: fc[f.id] })).sort((a, b) => b.v - a.v))}</div>
      </div>

      <div class="grid g2">
        <div class="card"><div class="card-head"><div><h2>Cobertura de públicos</h2><p>Conteúdos por decisor e etapa.</p></div></div>
          <div class="tbl-wrap"><table class="heat"><thead><tr><th>Público</th>${E.stages.map(s => `<th title="${s.name}">${s.name.slice(0, 4)}.</th>`).join('')}<th class="n">Total</th></tr></thead>
          <tbody>${heat.map(h => { const tot = h.cells.reduce((a, b) => a + b, 0); return `<tr><td>${esc(h.rl.name)}</td>${h.cells.map(v => `<td class="h${Math.min(3, v)}">${v || '·'}</td>`).join('')}<td class="n">${tot}</td></tr>`; }).join('')}</tbody></table></div></div>
        <div class="card"><div class="card-head"><div><h2>Associações de marca</h2><p>Cobertura no período × prioridade definida.</p></div><a class="small" href="#estrategia" data-act="tab" data-tab-key="estrategia" data-v="prioridades">Prioridades</a></div>
          <div class="stack">${E.associations.map(a => { const n = asc[a.id] || 0; return `<div class="cov"><span style="width:150px;flex:none">${esc(a.name)}</span>${chip(PRIO_N[S.assocPriority[a.id]], S.assocPriority[a.id] === 'alta' ? 'acc' : '')}<span class="track"><span class="fill" style="display:block;width:${pct(n, Math.max(1, list.length))}%"></span></span><span class="num" style="width:28px;text-align:right">${n}</span></div>`; }).join('')}</div></div>
      </div>

      <div class="label">Execução</div>
      <div class="grid g2">
        <div class="card"><div class="card-head"><div><h2>Planejado × publicado</h2><p>Por etapa do funil, no período.</p></div></div>
          <div class="tbl-wrap"><table><thead><tr><th>Etapa</th><th class="n">Planejado</th><th class="n">Publicado</th><th class="n">%</th></tr></thead><tbody>
          ${E.stages.map(s => { const a = all.filter(i => i.stage === s.id).length; const b = pub.filter(i => i.stage === s.id).length; return `<tr><td>${stageChip(s.id)}</td><td class="n">${a}</td><td class="n">${b}</td><td class="n">${a ? pct(b, a) + '%' : '—'}</td></tr>`; }).join('')}
          </tbody></table></div>
          <div class="row" style="margin-top:12px">${E.statuses.map(s => { const n = all.filter(i => i.status === s.id).length; return n ? chip(`${s.name}: ${n}`) : ''; }).join('')}</div></div>
        <div class="card"><div class="card-head"><div><h2>Frequência por semana</h2><p>${consistent} de ${weeks.length} semanas atingem a cadência de ${cadN} publicações.</p></div><div class="legend"><span><i style="background:var(--st-int)"></i>Instagram</span><span><i style="background:var(--st-desc)"></i>LinkedIn</span></div></div>
          <div class="colbars">${perWeek.map(x => `<div class="colbar"><span class="num tiny">${x.ig + x.li}</span><div class="stk" style="height:${(x.ig + x.li) / maxW * 90 + 2}px"><div style="flex:${x.li};background:var(--st-desc)"></div><div style="flex:${x.ig};background:var(--st-int)"></div></div><small>${fmtD(x.w)}</small></div>`).join('')}</div>
          ${reps.length ? `<div class="divider" style="margin:12px 0"></div><span class="label">Temas mais repetidos</span><div class="chips" style="margin-top:6px">${reps.slice(0, 5).map(([t, n]) => chip(`${THEMES[t] ? THEMES[t].name : t} · ${n}`, n >= 3 ? 'flag' : '')).join('')}</div>` : ''}</div>
      </div>

      <div class="label">Desempenho</div>
      <div class="card"><div class="spread"><div class="stack" style="gap:4px"><h2>Resultados do período</h2><span class="small muted">Cobertura alinhada à meta não garante resultado. Desempenho é analisado à parte.</span></div>
        <div class="row" style="gap:28px"><div class="kpi"><span class="label">Com métricas</span><b>${allPub.length}</b></div><div class="kpi"><span class="label">Alcance somado</span><b>${nf(reach)}</b></div>
        <div class="kpi" style="max-width:260px"><span class="label">Maior alcance</span><span class="small">${topPub ? esc(topPub.title) : '—'}</span></div>
        <a class="btn" href="#desempenho">Abrir desempenho</a></div></div>${allPub.some(i => i.demo) ? '<div class="notice demo" style="margin-top:12px">Inclui dados de demonstração.</div>' : ''}</div>`;
  };

  /* ---------- Calendário ---------- */
  views.calendario = function () {
    const r = calRange();
    const list = planned(r);
    const label = S.calView === 'week' ? `${fmtD(r.from)} – ${fmtD(r.to)}` : monthName(S.calRef);
    let body = '';
    if (S.calView === 'month' || S.calView === 'week') {
      const start = weekStart(r.from); const end = addDays(weekStart(r.to), 6);
      const days = []; for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
      const big = S.calView === 'week';
      body = `<div class="cal-scroll"><div><div class="cal-head">${WD.map(w => `<div>${w}</div>`).join('')}</div>
        <div class="${big ? 'week-grid' : 'cal-grid'}">${days.map(d => {
          const its = list.filter(it => it.date === d);
          const slots = d >= TODAY && d >= r.from && d <= r.to ? E.channels.filter(c => cadenceDays(c.id).includes(dow(d)) && !S.items.some(it => it.date === d && it.channel === c.id)) : [];
          return `<div class="day ${d < r.from || d > r.to ? 'out' : ''} ${d === TODAY ? 'today' : ''}" data-drop-date="${d}">
            <div class="day-n"><span>${big ? WD[dow(d)] + ' ' : ''}${D(d).getDate()}</span><button data-act="pick" data-date="${d}" aria-label="Adicionar em ${fmtD(d)}">+</button></div>
            ${its.map(it => itemCard(it, big)).join('')}
            ${slots.map(c => `<button class="slot-hint" data-act="pick" data-date="${d}" data-ch="${c.id}">+ ${c.name} livre</button>`).join('')}
          </div>`; }).join('')}</div></div></div>`;
    } else if (S.calView === 'list') {
      const undated = S.items.filter(it => !it.date && passFilters(it));
      const rows = list.slice().sort((a, b) => a.date.localeCompare(b.date)).concat(undated);
      body = `<div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Conteúdo</th><th>Etapa</th><th>Pilar</th><th>Objetivo</th><th>Público</th><th>Canal</th><th>Formato</th><th>Status</th><th>Prio.</th><th>Resp.</th></tr></thead><tbody>
        ${rows.map(it => `<tr class="click" data-act="open-item" data-id="${it.id}"><td class="num">${fmtD(it.date)}</td><td style="min-width:240px">${it.review ? '<span class="chip flag">Revisar</span> ' : ''}${esc(it.title)}</td><td>${stageChip(it.stage)}</td><td class="small">${esc(M.pillar[it.pillar].name)}</td><td class="small">${esc(M.obj[it.objective].name)}</td><td class="small">${esc(M.role[it.audience].name)}</td><td>${M.ch[it.channel].short}</td><td class="small">${esc(M.fmt[it.format].name)}</td><td class="small">${M.status[it.status].name}</td><td>${prioDots(it.priority)}</td><td class="small">${esc(it.owner)}</td></tr>`).join('') || '<tr><td colspan="11" class="muted">Nenhum conteúdo.</td></tr>'}
      </tbody></table></div></div>`;
    } else {
      const pool = list.concat(S.items.filter(it => !it.date && passFilters(it)));
      body = `<div class="kanban">${E.statuses.map(s => { const its = pool.filter(it => it.status === s.id).sort((a, b) => (a.date || '9').localeCompare(b.date || '9')); return `<div class="col" data-drop-status="${s.id}"><div class="col-h"><span>${s.name}</span><span class="num">${its.length}</span></div>${its.map(it => itemCard(it, true)).join('')}</div>`; }).join('')}</div>`;
    }
    const slots = openSlots(r);
    const recs = recommendations(r).filter(x => x.key.startsWith('st-') || x.key.startsWith('ov-'));
    return `<div class="page-head"><div><h1>Calendário editorial</h1><p>Arraste para reagendar${S.calView === 'pipeline' ? ' ou mudar de status' : ''}. Clique para abrir o detalhe.</p></div>
      <div class="head-actions">${seg('cal-view', [['month', 'Mês'], ['week', 'Semana'], ['list', 'Lista'], ['pipeline', 'Pipeline']], S.calView)}
        <button class="btn sm ghost" data-act="cal-prev" aria-label="Anterior">‹</button><button class="btn sm" data-act="cal-today">Hoje</button><button class="btn sm ghost" data-act="cal-next" aria-label="Próximo">›</button>
        <span style="font-weight:600;min-width:130px">${esc(label)}</span>
        <button class="btn sm" data-act="${S.sim ? 'sim-discard' : 'sim-start'}">${S.sim ? 'Sair da simulação' : 'Simular'}</button>
        <button class="btn primary sm" data-act="new-item">Nova pauta</button></div></div>
      ${simBanner()}${filterBar()}
      <div class="grid" style="grid-template-columns:minmax(0,1fr) 300px;align-items:start" id="cal-layout">
        <div style="min-width:0">${body}</div>
        <aside class="stack">
          <div class="card"><div class="card-head"><h3>Distribuição do funil</h3><span class="tiny muted">${list.length} no período</span></div>${distBars(list, { compact: true, ghost: S.sim ? planned(r, S.sim) : null })}</div>
          ${recs.length ? `<div class="stack">${recs.slice(0, 2).map(recCard).join('')}</div>` : ''}
          <div class="card"><div class="card-head"><h3>Espaços livres</h3><span class="tiny muted">${slots.length}</span></div>
            ${slots.length ? `<div class="stack" style="gap:6px">${slots.slice(0, 6).map(s => `<button class="slot-hint" data-act="pick" data-date="${s.date}" data-ch="${s.ch}">${fmtDL(s.date)} · ${M.ch[s.ch].name}</button>`).join('')}</div>` : '<p class="small muted">Cadência completa no período.</p>'}
            <p class="tiny muted" style="margin-top:8px">Cadência: Instagram ${cadenceDays('ig').map(i => WD[i]).join(', ')} · LinkedIn ${cadenceDays('li').map(i => WD[i]).join(', ')}. <a href="#ajustes">Alterar</a></p></div>
        </aside></div>`;
  };

  /* ---------- Biblioteca ---------- */
  views.biblioteca = function () {
    const used = new Set(S.items.filter(it => it.ideaId && it.status !== 'publicado').map(it => it.ideaId));
    const q = UI.libQuery.trim().toLowerCase();
    let list = S.ideas.filter(i => passFilters(i) && (!q || [i.title, i.angle, i.sub, i.problem, M.pillar[i.pillar].name, THEMES[i.theme] ? THEMES[i.theme].name : ''].join(' ').toLowerCase().includes(q)));
    if (UI.libScope === 'out') list = list.filter(i => !used.has(i.id));
    if (UI.libScope === 'in') list = list.filter(i => used.has(i.id));
    list.sort(UI.libSort === 'prio' ? (a, b) => (b.priority + (PRIO_W[S.assocPriority[b.assoc]] || 0) * .5) - (a.priority + (PRIO_W[S.assocPriority[a.assoc]] || 0) * .5) : (a, b) => (a.pillar + a.title).localeCompare(b.pillar + b.title));
    const d = dist(list);
    return `<div class="page-head"><div><h1>Biblioteca de pautas</h1><p>${S.ideas.length} pautas organizadas por pilar, público, objetivo e etapa. Comece por aqui em vez da página em branco.</p></div>
      <div class="head-actions"><button class="btn primary sm" data-act="new-idea">Nova pauta</button></div></div>
      ${filterBar(`<input type="search" id="lib-q" placeholder="Buscar tema, ângulo, problema" value="${esc(UI.libQuery)}" style="width:220px;padding:5px 9px;font-size:12.5px">`)}
      <div class="spread">${seg('lib-scope', [['all', 'Todas'], ['out', 'Fora do calendário'], ['in', 'No calendário']], UI.libScope)}
        <div class="row"><span class="small muted">${list.length} pautas · ${E.stages.map(s => `${s.name} ${d.c[s.id]}`).join(' · ')}</span>${seg('lib-sort', [['prio', 'Prioridade'], ['pillar', 'Pilar']], UI.libSort)}</div></div>
      <div class="lib">${list.map(i => `<article class="idea">
        <div class="chips">${stageChip(i.stage)}${pillarChip(i.pillar)}${i.ex ? chip('números ilustrativos', 'flag') : ''}</div>
        <h3 data-act="open-idea" data-id="${i.id}">${esc(i.title)}</h3><p>${esc(i.angle)}</p>
        <div class="chips">${chip(M.fmt[i.format].name)}${chip(M.ch[i.channel].name)}${chip(M.role[i.audience].name)}${chip(M.obj[i.objective].name)}</div>
        ${i.note ? `<span class="tiny" style="color:var(--warn)">${esc(i.note)}</span>` : ''}
        <div class="idea-foot">${used.has(i.id) ? '<span class="in-cal">No calendário</span>' : prioDots(i.priority)}
          <div class="row"><button class="btn ghost sm" data-act="open-idea" data-id="${i.id}">Detalhes</button><button class="btn sm" data-act="add-idea" data-id="${i.id}">Agendar</button></div></div>
      </article>`).join('') || '<div class="empty">Nenhuma pauta com esses filtros.</div>'}</div>`;
  };

  /* ---------- Produção ---------- */
  const STEPS = ['Objetivo', 'Público', 'Mensagem', 'Ângulo', 'Estrutura', 'Formato', 'Roteiro', 'Distribuição'];
  function rankFrameworks(it) {
    return E.frameworks.map(f => ({ f, s: (f.types.includes(it.type) ? 2 : 0) + (f.stages.includes(it.stage) ? 1 : 0) + (M.type[it.type] && M.type[it.type].fw[0] === f.id ? 1 : 0) })).sort((a, b) => b.s - a.s);
  }
  function hooks(it) {
    const b = it.brief || {}; const prob = (getIdea(it.ideaId) || {}).problem || it.title;
    return [
      { k: 'Cena', t: `Dia 30. ${prob}. E agora não dá mais tempo de agir.` },
      { k: 'Pergunta', t: `${prob}: você sabe quanto isso custa por mês?` },
      { k: 'Afirmação', t: it.title },
      { k: 'Número', t: b.evidence ? `Um número muda essa decisão: ${b.evidence.split('.')[0]}.` : 'Um número muda essa decisão. Fica até o fim para fazer a conta.' }
    ];
  }
  function altAngles(it) {
    const idea = getIdea(it.ideaId) || {}; const prob = idea.problem || 'o problema';
    return [
      { k: 'Ângulo da pauta', t: it.angle || idea.angle || '' },
      { k: 'Identificação', t: `Abrir com a cena de quem vive "${prob.toLowerCase()}" e mostrar o custo que ninguém calcula.` },
      { k: 'Conta aberta', t: `Fazer a conta em R$ de "${prob.toLowerCase()}" com números ilustrativos sinalizados, passo a passo.` },
      { k: 'Contraintuitivo', t: `Defender a ideia oposta ao senso comum sobre "${prob.toLowerCase()}" e sustentar com evidência.` }
    ];
  }
  function briefText(it) {
    const b = it.brief || {}; const fw = M.fw[b.framework || it.framework]; const fo = M.fmt[b.format || it.format];
    const st = M.stage[it.stage]; const idea = getIdea(it.ideaId) || {};
    const script = fw ? fw.steps.map((s, i) => `  ${i + 1}. ${s}: ${(b.script && b.script[s]) || '—'}`).join('\n') : '';
    const other = it.channel === 'ig' ? 'li' : 'ig';
    return `BRIEFING · ${it.title}
${it.date ? fmtDL(it.date) : 'Sem data'} · ${M.ch[it.channel].name} · ${fo ? fo.name : ''} · Status: ${M.status[it.status].name}

1. OBJETIVO
  ${M.obj[it.objective].name} · Etapa primária: ${st.name}
  Ação esperada: ${st.action}
  Medir por: ${st.metrics.join(', ')}

2. PÚBLICO
  ${M.role[it.audience].name}${b.level ? ' · nível ' + b.level : ''}${idea.profiles ? ' · perfis: ' + idea.profiles.map(p => p === 'todos' ? 'todos' : (M.profile[p] || {}).name).join(', ') : ''}
  Contexto: ${b.context || M.role[it.audience].pains}

3. MENSAGEM CENTRAL
  ${b.message || it.message || '(definir no passo 3)'}
  Associação de marca: ${M.assoc[it.assoc] ? M.assoc[it.assoc].name + ' — ' + S.assocMsg[it.assoc] : '—'}

4. ÂNGULO
  ${b.angle || it.angle || '(definir no passo 4)'}

5. ESTRUTURA: ${fw ? fw.name : '—'}
6. FORMATO: ${fo ? fo.name + ' — ' + fo.spec : '—'}

7. ROTEIRO
  Gancho: ${b.hook || '(escolher no passo 7)'}
${script}
  Evidência / fonte: ${b.evidence || it.src || idea.src || '—'}
  CTA: ${b.cta || (M.type[it.type] ? M.type[it.type].cta : '—')}

8. DISTRIBUIÇÃO
  ${M.ch[it.channel].name}, ${it.date ? fmtDL(it.date) : 'sem data'}
  Adaptação para ${M.ch[other].name}: ${b.adapt || adaptNote(it, other)}

CUIDADOS
${[it.ex || idea.ex ? '  · Usa números ilustrativos: sinalizar na peça.' : '', idea.note ? '  · ' + idea.note : '', '  · A IA nunca cria número: todo dado com fonte.', it.stage !== 'conversao' ? '  · Conteúdo de valor: produto só como exemplo, sem venda direta.' : ''].filter(Boolean).join('\n')}`;
  }
  function adaptNote(it, ch) {
    const f = adaptFormat(it.format, ch);
    return ch === 'li' ? `${M.fmt[f].name}. Primeira linha como gancho, mais contexto e a conta aberta; tom de análise.` : `${M.fmt[f].name}. Gancho visual nos primeiros 2 segundos ou na capa; uma ideia por tela; linguagem direta.`;
  }
  views.producao = function () {
    const queue = S.items.filter(it => ['ideia', 'priorizado', 'roteiro', 'producao'].includes(it.status)).sort((a, b) => (a.date || '9').localeCompare(b.date || '9'));
    if (!UI.prodId || !getItem(UI.prodId)) UI.prodId = queue[0] ? queue[0].id : null;
    const it = getItem(UI.prodId);
    let panel = '<div class="empty">Nenhum conteúdo na fila. Agende uma pauta da biblioteca.</div>';
    if (it) {
      it.brief = it.brief || {};
      const b = it.brief; const step = UI.prodStep; const k = `brief:${it.id}`;
      let content = '';
      if (step === 0) content = `<div class="form-grid"><label class="field"><span>Objetivo</span><select data-bind="item:${it.id}:objective">${opts(E.objectives, it.objective)}</select></label>
        <label class="field"><span>Etapa primária do funil</span><select data-bind="item:${it.id}:stage">${opts(E.stages, it.stage)}</select><small>Define onde o conteúdo conta na distribuição.</small></label>
        <div class="field full"><span>Ação esperada</span><p class="small">${M.stage[it.stage].action} Medir por: ${M.stage[it.stage].metrics.join(', ')}.</p></div></div>`;
      if (step === 1) content = `<div class="form-grid"><label class="field"><span>Público principal</span><select data-bind="item:${it.id}:audience">${opts(E.roles, it.audience)}</select></label>
        <div class="field"><span>Nível de conhecimento</span>${seg('brief-level', [['iniciante', 'Iniciante'], ['intermediário', 'Intermediário'], ['avançado', 'Avançado']], b.level || 'intermediário')}</div>
        <label class="field full"><span>Contexto e dor</span><textarea data-bind="${k}:context">${esc(b.context || M.role[it.audience].pains)}</textarea></label></div>`;
      if (step === 2) content = `<label class="field"><span>Ideia central (o que a pessoa deve lembrar)</span><textarea data-bind="${k}:message" placeholder="Uma frase.">${esc(b.message || '')}</textarea></label>
        <label class="field"><span>Associação de marca</span><select data-bind="item:${it.id}:assoc">${opts(E.associations, it.assoc)}</select><small>${esc(S.assocMsg[it.assoc] || '')}</small></label>`;
      if (step === 3) content = `<div class="opts">${altAngles(it).map(a => `<button class="opt ${b.angle === a.t ? 'on' : ''}" data-act="brief-set" data-k="angle" data-v="${esc(a.t)}"><span class="label">${a.k}</span><span class="small">${esc(a.t)}</span></button>`).join('')}</div>
        <label class="field"><span>Ângulo escolhido</span><textarea data-bind="${k}:angle">${esc(b.angle || it.angle || '')}</textarea></label>`;
      if (step === 4) { const rk = rankFrameworks(it); content = `<div class="opts">${rk.slice(0, 6).map((x, i) => `<button class="opt ${(b.framework || it.framework) === x.f.id ? 'on' : ''}" data-act="brief-set" data-k="framework" data-v="${x.f.id}">${i === 0 ? '<span class="rec-b">Recomendado</span>' : ''}<b class="small">${esc(x.f.name)}</b><span class="tiny muted">${esc(x.f.when)}</span><span class="tiny">+ ${esc(x.f.pros)}</span><span class="tiny muted">− ${esc(x.f.cons)}</span></button>`).join('')}</div>`; }
      if (step === 5) content = `<div class="opts">${E.formats.filter(f => f.ch.includes(it.channel)).map(f => `<button class="opt ${(b.format || it.format) === f.id ? 'on' : ''}" data-act="brief-set" data-k="format" data-v="${f.id}"><b class="small">${esc(f.name)}</b><span class="tiny muted">${esc(f.spec)}</span><span class="tiny">Esforço ${'●'.repeat(f.effort)}${'○'.repeat(3 - f.effort)} · ${esc(f.good)}</span></button>`).join('')}</div>`;
      if (step === 6) { const fw = M.fw[b.framework || it.framework]; content = `<div class="field"><span>Gancho</span><div class="opts">${hooks(it).map(h => `<button class="opt ${b.hook === h.t ? 'on' : ''}" data-act="brief-set" data-k="hook" data-v="${esc(h.t)}"><span class="label">${h.k}</span><span class="small">${esc(h.t)}</span></button>`).join('')}</div><textarea data-bind="${k}:hook" style="margin-top:6px">${esc(b.hook || '')}</textarea></div>
        ${fw.steps.map(s => `<label class="field"><span>${esc(s)}</span><textarea data-bind="${k}:script.${esc(s)}" rows="2">${esc((b.script || {})[s] || '')}</textarea></label>`).join('')}
        <div class="form-grid"><label class="field"><span>Evidência e fonte</span><textarea data-bind="${k}:evidence" rows="2">${esc(b.evidence || it.src || '')}</textarea></label><label class="field"><span>CTA</span><textarea data-bind="${k}:cta" rows="2">${esc(b.cta || M.type[it.type].cta)}</textarea></label></div>`; }
      if (step === 7) { const other = it.channel === 'ig' ? 'li' : 'ig'; content = `<div class="form-grid"><label class="field"><span>Canal</span><select data-bind="item:${it.id}:channel" data-rerender>${opts(E.channels, it.channel)}</select></label>
        <label class="field"><span>Data</span><input type="date" data-bind="item:${it.id}:date" value="${it.date || ''}"></label>
        <label class="field"><span>Responsável</span><select data-bind="item:${it.id}:owner">${opts(S.owners.map(o => ({ id: o, name: o })), it.owner, 'Sem responsável')}</select></label>
        <label class="field"><span>Status</span><select data-bind="item:${it.id}:status">${opts(E.statuses, it.status)}</select></label>
        <label class="field full"><span>Adaptação para ${M.ch[other].name}</span><textarea data-bind="${k}:adapt">${esc(b.adapt || adaptNote(it, other))}</textarea></label></div>
        <button class="btn sm" data-act="repurpose" data-id="${it.id}">Criar versões em outros formatos</button>`; }
      panel = `<div class="card stack"><div class="spread"><div class="stack" style="gap:4px"><span class="label">${fmtD(it.date)} · ${M.ch[it.channel].name} · ${M.status[it.status].name}</span><h2>${esc(it.title)}</h2></div><button class="btn sm ghost" data-act="open-item" data-id="${it.id}">Detalhe</button></div>
        <div class="steps">${STEPS.map((s, i) => `<button data-act="prod-step" data-v="${i}" class="${i === step ? 'on' : ''}"><span class="n">${i + 1}</span>${s}</button>`).join('')}</div>
        <div class="stack">${content}</div>
        <div class="spread"><button class="btn sm" data-act="prod-step" data-v="${Math.max(0, step - 1)}" ${step === 0 ? 'disabled' : ''}>Voltar</button><button class="btn primary sm" data-act="prod-step" data-v="${Math.min(7, step + 1)}" ${step === 7 ? 'disabled' : ''}>Próximo</button></div></div>
        <div class="card stack"><div class="spread"><h2>Briefing</h2><div class="row"><button class="btn sm" data-act="copy-brief" data-id="${it.id}">Copiar briefing</button>${statusIdx(it.status) < statusIdx('aprovado') ? `<button class="btn primary sm" data-act="advance" data-id="${it.id}">Avançar para ${M.status[STATUS_ORDER[statusIdx(it.status) + 1]].name}</button>` : ''}</div></div>
        <pre class="brief" id="brief-text">${esc(briefText(it))}</pre></div>`;
    }
    return `<div class="page-head"><div><h1>Produção</h1><p>Da pauta ao briefing em oito passos. Os campos chegam preenchidos pela estratégia; ajuste só o necessário.</p></div></div>
      <div class="grid" style="grid-template-columns:280px minmax(0,1fr);align-items:start" id="prod-layout">
        <div class="card" style="padding:8px"><div class="label" style="padding:6px 8px">Fila de produção · ${queue.length}</div><p class="tiny muted" style="padding:0 8px 6px">De Ideia a Produção. Aprovados saem da fila.</p>
          ${queue.map(q => `<div class="queue-item ${q.id === UI.prodId ? 'on' : ''}" data-act="prod-pick" data-id="${q.id}"><span class="small" style="font-weight:550">${esc(q.title)}</span><span class="row tiny muted"><i class="st-dot" style="background:${M.stage[q.stage].color}"></i>${fmtD(q.date)} · ${M.status[q.status].name}</span></div>`).join('')}</div>
        <div class="stack">${panel}</div></div>`;
  };

  /* ---------- Radar ---------- */
  function radarScore(n) {
    const tw = E.radarCriteria.reduce((a, c) => a + c.w * 3, 0);
    return Math.round(E.radarCriteria.reduce((a, c) => a + c.w * (n.scores[c.id] || 0), 0) / tw * 100);
  }
  function radarClass(n) {
    const s = n.scores; const sc = radarScore(n);
    let cls;
    if (!s.conexao || !s.relevancia || sc < 40) cls = 'descartar';
    else if (s.credibilidade <= 1) cls = 'acompanhar';
    else if (sc >= 60 && s.analise >= 2 && s.atualidade >= 2) cls = 'analisar';
    else if (sc >= 70 && s.atualidade >= 2) cls = 'publicar';
    else if (sc >= 55 && s.duradouro >= 2) cls = 'educativo';
    else cls = 'acompanhar';
    const prio = (cls === 'analisar' || cls === 'publicar') && sc >= 75 ? 'alta' : (cls !== 'descartar' && sc >= 55 ? 'media' : 'baixa');
    return { cls, sc, prio };
  }
  const RCLASS = {
    publicar: { s: 'Publicar', n: 'Publicar como notícia', d: 'Atual e relevante: comentar rápido.', c: 'okc', stage: 'descoberta', type: 'noticia', fw: 'dados' },
    analisar: { s: 'Analisar', n: 'Merece análise', d: 'Dá para agregar leitura própria e implicação prática.', c: 'acc', stage: 'consideracao', type: 'analise', fw: 'dados' },
    educativo: { s: 'Educativo', n: 'Base para educativo', d: 'Pouco atual, mas útil e duradouro.', c: '', stage: 'interesse', type: 'educativo', fw: 'pis' },
    acompanhar: { s: 'Acompanhar', n: 'Acompanhar', d: 'Ainda não: fonte a verificar ou ligação fraca.', c: 'flag', stage: 'descoberta', type: 'tendencia', fw: 'tese' },
    descartar: { s: 'Descartar', n: 'Não faz sentido para a marca', d: 'Sem ligação com o posicionamento.', c: 'crit', stage: 'descoberta', type: 'noticia', fw: 'tese' }
  };
  views.radar = function () {
    const list = S.radar.map(n => Object.assign({ c: radarClass(n) }, { n }));
    const counts = countBy(list.map(x => ({ k: x.c.cls })), 'k');
    const shown = list.filter(x => UI.radarFilter === 'todos' || x.c.cls === UI.radarFilter).sort((a, b) => b.c.sc - a.c.sc);
    return `<div class="page-head"><div><h1>Radar de pautas</h1><p>Notícias, estudos e tendências avaliados por relevância e posicionamento antes de virar conteúdo. Em alta não é critério.</p></div>
      <div class="head-actions"><button class="btn primary sm" data-act="radar-new">Cadastrar fonte</button></div></div>
      <div class="notice">Itens marcados como <b>exemplo simulado</b> servem só para demonstrar o filtro. Os demais vêm das fontes citadas no documento de 04/11.</div>
      <div class="row">${seg('radar-filter', [['todos', `Todos ${list.length}`]].concat(Object.entries(RCLASS).map(([k, v]) => [k, `${v.s} ${counts[k] || 0}`])), UI.radarFilter)}</div>
      <div class="stack">${shown.map(({ n, c }) => `<div class="card flat" style="padding:14px 16px"><div class="spread" style="align-items:flex-start">
        <div class="stack" style="gap:6px;flex:1;min-width:0"><div class="chips">${chip(RCLASS[c.cls].n, RCLASS[c.cls].c)}${chip('Prioridade ' + PRIO_N[c.prio])}${n.simulated ? chip('exemplo simulado', 'crit') : ''}${n.status === 'convertido' ? chip('virou pauta', 'okc') : ''}${chip(n.kind)}</div>
          <h3 style="font-size:14.5px">${esc(n.title)}</h3><span class="small muted">${esc(n.source)} · ${fmtD(n.date)}${n.url ? ` · <a href="${esc(n.url)}" target="_blank" rel="noopener">abrir fonte</a>` : ''}</span>${n.notes ? `<span class="tiny" style="color:var(--warn)">${esc(n.notes)}</span>` : ''}</div>
        <div class="stack" style="align-items:flex-end;gap:8px"><span class="score">${c.sc}<span class="tiny muted">/100</span></span><div class="row"><button class="btn sm" data-act="radar-eval" data-id="${n.id}">Avaliar</button>${c.cls !== 'descartar' ? `<button class="btn primary sm" data-act="radar-convert" data-id="${n.id}">Transformar em pauta</button>` : ''}</div></div></div></div>`).join('') || '<div class="empty">Nada nesta classificação.</div>'}</div>
      <div class="card"><div class="card-head"><h2>Como a pontuação funciona</h2></div><div class="grid g2"><div class="hbars">${E.radarCriteria.map(c => `<div class="hbar"><span class="name">${c.name}</span><span class="track"><span class="fill" style="display:block;width:${c.w / 2 * 100}%"></span></span><span class="v">×${c.w}</span></div>`).join('')}</div>
        <div class="stack small">${Object.values(RCLASS).map(v => `<div>${chip(v.n, v.c)} <span class="muted">${v.d}</span></div>`).join('')}<p class="tiny muted">Cada critério vale de 0 a 3. Sem conexão com os territórios ou sem relevância, descarta. Fonte com credibilidade baixa nunca passa de "Acompanhar".</p></div></div></div>`;
  };

  /* ---------- Desempenho ---------- */
  const engRate = m => m && m.alcance ? (m.salvamentos + m.compartilhamentos + m.comentarios) / m.alcance * 100 : 0;
  const PRIMARY = { descoberta: ['alcance', 'Alcance'], interesse: ['salvamentos', 'Salvamentos'], consideracao: ['visitasPerfil', 'Visitas ao perfil'], conversao: ['leads', 'Leads'], relacionamento: ['comentarios', 'Comentários'] };
  views.desempenho = function () {
    const mode = S.perfMode;
    let pubAll = S.items.filter(it => it.status === 'publicado' && passFilters(it));
    if (mode === '30') pubAll = pubAll.filter(it => it.date >= addDays(TODAY, -30));
    if (mode === 'month') pubAll = pubAll.filter(it => it.date >= monthStart(TODAY) && it.date <= monthEnd(TODAY));
    const pub = pubAll.filter(it => it.metrics);
    const noData = pubAll.filter(it => !it.metrics);
    const sum = k => pub.reduce((a, it) => a + (it.metrics[k] || 0), 0);
    const avgEng = pub.length ? pub.reduce((a, it) => a + engRate(it.metrics), 0) / pub.length : 0;
    const group = key => { const g = {}; pub.forEach(it => { (g[it[key]] = g[it[key]] || []).push(it); }); return g; };
    const gp = group('pillar'); const gf = group('format'); const gs = group('stage');
    const avg = (arr, f) => arr.length ? arr.reduce((a, x) => a + f(x), 0) / arr.length : 0;
    const fmtRows = Object.entries(gf).map(([f, arr]) => ({ f, n: arr.length, reach: avg(arr, x => x.metrics.alcance), eng: avg(arr, x => engRate(x.metrics)), saves: avg(arr, x => x.metrics.salvamentos) })).sort((a, b) => b.eng - a.eng);
    // insights
    const ins = [];
    const fBest = fmtRows.filter(x => x.n >= 2)[0];
    if (fBest && avgEng) ins.push({ t: `${M.fmt[fBest.f].name}: engajamento médio de ${fBest.eng.toFixed(1)}% (${(fBest.eng / avgEng).toFixed(1)}× a média).`, a: 'Testar o formato em outro pilar na próxima semana.' });
    else if (fmtRows.length) ins.push({ t: 'Amostra pequena por formato (menos de 2 publicações). Comparações ainda não são confiáveis.', a: 'Manter a mistura de formatos por mais 4 semanas.' });
    const topSave = pub.slice().sort((a, b) => b.metrics.salvamentos - a.metrics.salvamentos)[0];
    if (topSave) ins.push({ t: `Mais salvo: "${topSave.title}" (${topSave.metrics.salvamentos} salvamentos).`, a: 'Conteúdo de referência: reaproveitar em outro formato.', btn: `<button class="btn sm" data-act="repurpose" data-id="${topSave.id}">Reaproveitar</button>` });
    const topNon = pub.slice().sort((a, b) => b.metrics.naoSeguidores - a.metrics.naoSeguidores)[0];
    if (topNon) ins.push({ t: `Maior alcance fora da base: "${topNon.title}" (${topNon.metrics.naoSeguidores}% de não seguidores).`, a: 'Ângulo com potencial de descoberta: criar variação.', btn: topNon.ideaId ? `<button class="btn sm" data-act="idea-variant" data-id="${topNon.ideaId}" data-stage="descoberta">Criar variação</button>` : '' });
    const dReach = avg(gs.descoberta || [], x => x.metrics.alcance); const cvReach = avg(gs.conversao || [], x => x.metrics.alcance);
    if (dReach && cvReach) ins.push({ t: `Conteúdos de descoberta alcançaram ${(dReach / cvReach).toFixed(1)}× mais pessoas que os de conversão.`, a: 'Coerente com a função de cada etapa: não comparar alcance entre etapas diferentes.' });
    const leadsBy = {}; pub.forEach(it => { leadsBy[it.stage] = (leadsBy[it.stage] || 0) + (it.metrics.leads || 0); });
    const totalLeads = sum('leads');
    if (totalLeads) ins.push({ t: `${totalLeads} leads registrados: ${Object.entries(leadsBy).filter(([, v]) => v).map(([k, v]) => `${M.stage[k].name} ${v}`).join(', ')}.`, a: 'Leads de conteúdo orgânico são contagem de contatos, não receita atribuída.' });
    const sorted = pub.slice().sort(UI.perfSort === 'reach' ? (a, b) => b.metrics.alcance - a.metrics.alcance : UI.perfSort === 'eng' ? (a, b) => engRate(b.metrics) - engRate(a.metrics) : (a, b) => b.date.localeCompare(a.date));
    return `<div class="page-head"><div><h1>Desempenho</h1><p>O que os conteúdos publicados geraram. Cada etapa é avaliada pela métrica da sua função.</p></div>
      <div class="head-actions">${seg('perf-mode', [['all', 'Tudo'], ['30', 'Últimos 30 dias'], ['month', 'Mês atual']], mode)}</div></div>
      ${pub.some(i => i.demo) ? '<div class="notice demo"><b>Dados de demonstração.</b> As métricas de outubro e da primeira semana de novembro são fictícias, para mostrar a análise. Registre os números reais no detalhe de cada conteúdo publicado; a estrutura já está pronta para receber dados das redes.</div>' : ''}
      ${filterBar()}
      <div class="grid g4">
        <div class="card kpi"><span class="label">Publicados com métricas</span><b>${pub.length}</b><span class="sub">${noData.length ? `${noData.length} sem métricas registradas` : 'Todos com dados'}</span></div>
        <div class="card kpi"><span class="label">Alcance somado</span><b>${nf(sum('alcance'))}</b><span class="sub">${nf(sum('novosSeguidores'))} novos seguidores</span></div>
        <div class="card kpi"><span class="label">Engajamento médio</span><b>${avgEng.toFixed(1)}%</b><span class="sub">(salv. + compart. + coment.) ÷ alcance</span></div>
        <div class="card kpi"><span class="label">Leads e conversas</span><b>${nf(totalLeads)} · ${nf(sum('conversas'))}</b><span class="sub">Receita atribuível: dados insuficientes</span></div>
      </div>
      <div class="grid g2">
        <div class="card"><div class="card-head"><div><h2>Por etapa do funil</h2><p>Métrica principal de cada função.</p></div></div>
          <div class="tbl-wrap"><table><thead><tr><th>Etapa</th><th class="n">Publ.</th><th>Métrica principal</th><th class="n">Média</th><th>Melhor conteúdo</th></tr></thead><tbody>
          ${E.stages.map(s => { const arr = gs[s.id] || []; const [k, l] = PRIMARY[s.id]; const best = arr.slice().sort((a, b) => b.metrics[k] - a.metrics[k])[0]; return `<tr><td>${stageChip(s.id)}</td><td class="n">${arr.length}</td><td class="small">${l}</td><td class="n">${arr.length ? nf(Math.round(avg(arr, x => x.metrics[k]))) : '—'}</td><td class="small">${best ? esc(best.title) : '<span class="muted">sem dados</span>'}</td></tr>`; }).join('')}
          </tbody></table></div></div>
        <div class="card"><div class="card-head"><div><h2>Padrões e próximos testes</h2><p>Hipóteses a partir dos dados disponíveis.</p></div></div>
          <div class="stack">${ins.map(x => `<div class="rec"><div class="spread" style="align-items:flex-start"><div class="stack" style="gap:3px;flex:1;min-width:0"><span class="small" style="font-weight:550">${esc(x.t)}</span><span class="tiny muted">${esc(x.a)}</span></div>${x.btn || ''}</div></div>`).join('') || '<div class="empty small">Sem dados suficientes.</div>'}
          <div class="rec"><span class="small" style="font-weight:550">Atribuição de receita</span><span class="tiny muted">Sem UTM no link da bio e sem CRM conectado não há como ligar receita a um conteúdo. Próximo passo: links rastreados por série e campo "origem" no formulário de diagnóstico.</span></div></div></div>
      </div>
      <div class="grid g2">
        <div class="card"><div class="card-head"><h2>Pilares · alcance médio</h2></div>${hbars(Object.entries(gp).map(([p, arr]) => ({ name: M.pillar[p].name, v: Math.round(avg(arr, x => x.metrics.alcance)), label: nf(Math.round(avg(arr, x => x.metrics.alcance))), color: M.pillar[p].color })).sort((a, b) => b.v - a.v))}</div>
        <div class="card"><div class="card-head"><h2>Formatos</h2></div><div class="tbl-wrap"><table><thead><tr><th>Formato</th><th class="n">Publ.</th><th class="n">Alcance médio</th><th class="n">Engaj.</th><th class="n">Salv. médios</th></tr></thead><tbody>
          ${fmtRows.map(x => `<tr><td>${esc(M.fmt[x.f].name)}${x.n < 2 ? ' <span class="chip flag">amostra pequena</span>' : ''}</td><td class="n">${x.n}</td><td class="n">${nf(Math.round(x.reach))}</td><td class="n">${x.eng.toFixed(1)}%</td><td class="n">${Math.round(x.saves)}</td></tr>`).join('')}</tbody></table></div></div>
      </div>
      <div class="card"><div class="card-head"><h2>Conteúdos publicados</h2>${seg('perf-sort', [['date', 'Data'], ['reach', 'Alcance'], ['eng', 'Engajamento']], UI.perfSort)}</div>
        <div class="tbl-wrap"><table><thead><tr><th>Data</th><th>Conteúdo</th><th>Etapa</th><th>Formato</th><th class="n">Alcance</th><th class="n">% não seg.</th><th class="n">Salv.</th><th class="n">Compart.</th><th class="n">Coment.</th><th class="n">Visitas</th><th class="n">Leads</th><th class="n">Engaj.</th></tr></thead><tbody>
        ${sorted.map(it => { const m = it.metrics; return `<tr class="click" data-act="open-item" data-id="${it.id}"><td class="num">${fmtD(it.date)}</td><td style="min-width:220px">${esc(it.title)}${it.demo ? ' <span class="chip flag">demo</span>' : ''}</td><td>${stageChip(it.stage)}</td><td class="small">${esc(M.fmt[it.format].name)}</td><td class="n">${nf(m.alcance)}</td><td class="n">${m.naoSeguidores || 0}%</td><td class="n">${m.salvamentos}</td><td class="n">${m.compartilhamentos}</td><td class="n">${m.comentarios}</td><td class="n">${m.visitasPerfil}</td><td class="n">${m.leads}</td><td class="n">${engRate(m).toFixed(1)}%</td></tr>`; }).join('')}
        ${noData.map(it => `<tr class="click" data-act="open-item" data-id="${it.id}"><td class="num">${fmtD(it.date)}</td><td>${esc(it.title)}</td><td>${stageChip(it.stage)}</td><td class="small">${esc(M.fmt[it.format].name)}</td><td colspan="8" class="muted small">Sem métricas. Clique para registrar.</td></tr>`).join('')}
        </tbody></table></div></div>`;
  };

  /* ---------- Estratégia ---------- */
  function tabs(key, list) {
    const cur = UI.tabs[key] || list[0][0];
    return { cur, html: `<div class="tabs">${list.map(([v, l]) => `<button data-act="tab" data-tab-key="${key}" data-v="${v}" class="${v === cur ? 'on' : ''}">${l}</button>`).join('')}</div>` };
  }
  views.estrategia = function () {
    const t = tabs('estrategia', [['posicionamento', 'Posicionamento'], ['associacoes', 'Associações mentais'], ['lembranca', 'Situações de lembrança'], ['prioridades', 'Prioridades'], ['crescimento', 'Plano de crescimento']]);
    const P = E.positioning; let body = '';
    const month = { from: monthStart(S.calRef), to: monthEnd(S.calRef) };
    const calMonth = planned(month, S.items.filter(() => true));
    if (t.cur === 'posicionamento') body = `
      <div class="card stack" style="gap:14px"><span class="label">Promessa</span><p style="font-size:30px;font-weight:650;letter-spacing:-.02em;line-height:1.1">${esc(P.promise)}</p><p class="prose" style="font-size:15px">${esc(P.statement)}</p></div>
      <div class="grid g2"><div class="card stack"><span class="label">Categoria</span><h2>${esc(P.category)}</h2><p class="prose small">${esc(P.categoryWhy)}</p></div>
        <div class="card stack"><span class="label">Arquitetura da comunicação</span>${P.layers.map(l => `<div><b class="small">${esc(l.k)}</b><p class="small muted">${esc(l.v)}</p></div>`).join('')}</div></div>
      <div class="grid g3">${[['Benefícios funcionais', P.functional], ['Benefícios financeiros', P.financial], ['Benefícios emocionais', P.emotional]].map(([h, arr]) => `<div class="card"><div class="card-head"><h3>${h}</h3></div><ul class="small" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;color:var(--ink-2)">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>
      <div class="card"><div class="card-head"><h2>Diferenciais a reforçar</h2><div class="chips"><span class="tiny muted">Pronto hoje:</span>${P.readyToday.map(x => chip(x, 'okc')).join('')}</div></div><div class="grid g3">${P.differentials.map(d => `<div class="stack" style="gap:4px"><b class="small">${esc(d.t)}</b><span class="small muted">${esc(d.d)}</span></div>`).join('')}</div></div>
      <div class="card"><div class="card-head"><h2>Riscos de posicionamento</h2></div><div class="grid g2">${P.risks.map(r => `<div class="rec"><div class="rec-head"><span class="rec-sev ${r.lvl === 'alto' ? 'crit' : 'warn'}"></span><div class="stack" style="gap:3px"><b class="small">${esc(r.t)}</b><span class="small muted">${esc(r.d)}</span></div></div></div>`).join('')}</div></div>`;
    if (t.cur === 'associacoes') body = `<p class="small muted">Associação desejada → mensagem central → temas que reforçam → provas necessárias → tipos de conteúdo. Cobertura conta pautas da biblioteca e conteúdos no calendário de ${monthName(S.calRef)}.</p>
      <div class="amap">${E.associations.map(a => { const nI = S.ideas.filter(i => i.assoc === a.id).length; const nC = calMonth.filter(i => i.assoc === a.id).length; const pils = E.pillars.filter(p => p.assoc.includes(a.id)); return `<div class="assoc"><div class="spread"><div><span class="label">${esc(a.short)}</span><h2>${esc(a.name)}</h2></div>${chip('Prioridade ' + PRIO_N[S.assocPriority[a.id]], S.assocPriority[a.id] === 'alta' ? 'acc' : '')}</div>
        <p class="msg">${esc(S.assocMsg[a.id])}</p>
        <dl class="flow"><dt>Temas</dt><dd>${a.themes.map(esc).join(' · ')}</dd><dt>Provas</dt><dd>${a.proofs.map(esc).join(' · ')}</dd><dt>Tipos</dt><dd>${a.types.map(x => M.type[x].name).join(' · ')}</dd><dt>Pilares</dt><dd>${pils.map(p => esc(p.name)).join(' · ')}</dd></dl>
        <div class="row tiny muted"><span>${nI} pautas na biblioteca</span><span>·</span><span>${nC} no calendário do mês</span><a href="#biblioteca" data-act="lib-assoc" data-v="${a.id}" style="margin-left:auto">Ver pautas</a></div></div>`; }).join('')}</div>`;
    if (t.cur === 'lembranca') body = `<p class="small muted">Situações em que o público deve lembrar da Elevah (category entry points). São hipóteses a validar em entrevistas com clientes e leads.</p>
      <div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Situação de necessidade</th><th>Associação</th><th>Pilar</th><th>Quem vive</th><th class="n">Pautas</th><th></th></tr></thead><tbody>
      ${E.entryPoints.map(e => { const n = S.ideas.filter(i => i.pillar === e.pillar && i.assoc === e.assoc).length; return `<tr><td style="min-width:260px">"${esc(e.s)}"</td><td>${chip(M.assoc[e.assoc].name)}</td><td>${pillarChip(e.pillar)}</td><td class="small">${esc(M.role[e.who].name)}</td><td class="n">${n}</td><td><button class="btn ghost sm" data-act="lib-pillar" data-v="${e.pillar}">Ver pautas</button></td></tr>`; }).join('')}</tbody></table></div></div>`;
    if (t.cur === 'prioridades') {
      const last = S.changeLog[S.changeLog.length - 1];
      let impact = '<div class="empty small">Altere a prioridade ou a mensagem de uma associação para ver o que muda.</div>';
      if (last) {
        const a = M.assoc[last.assoc]; const pils = E.pillars.filter(p => p.assoc.includes(a.id));
        const ideas = S.ideas.filter(i => i.assoc === a.id);
        const items = S.items.filter(i => i.assoc === a.id && i.status !== 'publicado' && i.date);
        const adj = items.filter(i => !LOCKED.includes(i.status)); const locked = items.filter(i => LOCKED.includes(i.status));
        impact = `<div class="stack"><p class="small"><b>${esc(a.name)}</b>: ${esc(last.what)} <span class="muted">(${esc(last.at)})</span></p>
          <div class="grid g3"><div><span class="label">Pilares relacionados</span><div class="chips" style="margin-top:6px">${pils.map(p => pillarChip(p.id)).join('')}</div></div>
          <div><span class="label">Pautas na biblioteca</span><p class="num" style="font-size:22px">${ideas.length}</p><a class="small" href="#biblioteca" data-act="lib-assoc" data-v="${a.id}">Revisar pautas</a></div>
          <div><span class="label">No calendário</span><p class="small">${adj.length} ajustáveis · <b style="color:var(--warn)">${locked.length} aprovados para revisar</b></p></div></div>
          ${adj.length ? `<div><span class="label">Ainda em planejamento (podem ser ajustados)</span><div class="stack" style="gap:4px;margin-top:6px">${adj.map(i => `<div class="rec-sug"><span class="small">${esc(i.title)} <span class="tiny muted">· ${fmtD(i.date)} · ${M.status[i.status].name}</span></span><button class="btn sm" data-act="open-item" data-id="${i.id}">Abrir</button></div>`).join('')}</div></div>` : ''}
          ${locked.length ? `<div><span class="label">Aprovados ou agendados: marcados para revisão, nada foi alterado</span><div class="stack" style="gap:4px;margin-top:6px">${locked.map(i => `<div class="rec-sug"><span class="small">${esc(i.title)} <span class="tiny muted">· ${fmtD(i.date)} · ${M.status[i.status].name}</span></span><button class="btn sm" data-act="open-item" data-id="${i.id}">Revisar</button></div>`).join('')}</div></div>` : ''}</div>`;
      }
      body = `<p class="small muted">Mudanças de prioridade reordenam as sugestões da biblioteca e do painel. Conteúdos aprovados nunca são alterados automaticamente: recebem uma marca de revisão.</p>
        <div class="grid g-main" style="align-items:start"><div class="stack">${E.associations.map(a => `<div class="card flat stack" style="gap:10px"><div class="spread"><h3>${esc(a.name)}</h3>${seg('assoc-prio-' + a.id, [['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa']], S.assocPriority[a.id])}</div>
          <label class="field"><span>Mensagem central</span><textarea data-bind="assocmsg:${a.id}" rows="2">${esc(S.assocMsg[a.id])}</textarea></label></div>`).join('')}</div>
        <div class="stack"><div class="card"><div class="card-head"><h2>Impacto da mudança</h2></div>${impact}</div>
          <div class="card"><div class="card-head"><h3>Histórico</h3></div>${S.changeLog.length ? `<div class="stack small">${S.changeLog.slice().reverse().slice(0, 8).map(c => `<div><b>${esc(M.assoc[c.assoc].name)}</b> · ${esc(c.what)} <span class="muted tiny">${esc(c.at)}</span></div>`).join('')}</div>` : '<p class="small muted">Sem mudanças registradas.</p>'}</div></div></div>`;
    }
    if (t.cur === 'crescimento') body = growthPlan();
    return `<div class="page-head"><div><h1>Posicionamento e marca</h1><p>A base que orienta cada pauta. Uma marca para todos os perfis; segmentos entram como exemplos de problemas comuns.</p></div></div>${t.html}${body}`;
  };
  function growthPlan() {
    const tp = E.targetPresets[0];
    return `<div class="grid g2">
      <div class="card stack"><h2>Prioridades editoriais (próximos 90 dias)</h2><ol class="small" style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;color:var(--ink-2)">
        <li><b>Disponibilidade mental antes de conversão.</b> Fixar a promessa "Ver antes. Saber o impacto. Agir." por repetição em séries reconhecíveis.</li>
        <li><b>Três territórios-âncora compartilhados por todos os perfis:</b> previsibilidade (P1), margem (P2) e base de clientes (P3). Segmentos entram como exemplos.</li>
        <li><b>Contas abertas como ativo distintivo.</b> Todo conteúdo de descoberta traz uma conta ou um dado com fonte.</li>
        <li><b>Produto só onde está pronto.</b> Demonstrações limitadas a forecast, origem, agendamento e margem.</li></ol></div>
      <div class="card stack"><h2>Distribuição recomendada</h2>${hbars(E.stages.map(s => ({ name: s.name, v: tp.t[s.id], label: tp.t[s.id] + '%', color: s.color })), null, 50)}<p class="small muted">${esc(tp.why)}</p></div>
      <div class="card stack"><h2>Frequência inicial</h2><p class="small prose">5 publicações por semana: Instagram 3 (seg, qua, sex) e LinkedIn 2 (ter, qui). Viável para uma equipe pequena, com um formato de alto esforço (Reels ou vídeo) por semana. Stories diários de relacionamento não entram na distribuição.</p>
        <p class="small prose">Reservar 1 a 2 espaços por mês para pautas do Radar. Rever a cadência após 8 semanas.</p></div>
      <div class="card stack"><h2>Direcionamento por canal</h2><p class="small prose"><b>Instagram:</b> descoberta e interesse. Reels de conta aberta e identificação; carrosséis salváveis. Tom direto, visual limpo.</p><p class="small prose"><b>LinkedIn:</b> autoridade e consideração. Teses, Raio-X de pesquisas em documento, artigos. Fala com donos, gestores, agências e contadores. Fundadores publicando em perfil pessoal ampliam o alcance da página.</p></div>
      <div class="card stack"><h2>Séries recorrentes</h2><div class="stack" style="gap:8px">${E.series.map(s => `<div><b class="small">${esc(s.name)}</b> <span class="tiny muted">· ${s.freq} · ${M.ch[s.ch].name} · ${M.fmt[s.fo].name}</span><p class="small muted">${esc(s.desc)}</p></div>`).join('')}</div></div>
      <div class="card stack"><h2>Papel do conteúdo comercial</h2><p class="small prose">Cerca de 10% da produção, sempre depois de conteúdos de consideração no mesmo período. Um convite claro (diagnóstico de 20 minutos), perguntas reais respondidas com honestidade (para quem é, para quem não é) e demonstração do que está pronto. Preço só depois de validado em venda.</p>
        <h2 style="margin-top:8px">Mensuração e aprendizado</h2><p class="small prose">Cada etapa tem sua métrica principal (veja Referências › Funil). Revisão quinzenal: o que repetir, o que reaproveitar, o que cortar. Após 8 semanas, revisar a hipótese de distribuição com dados reais de alcance, salvamentos e leads.</p></div></div>`;
  }

  /* ---------- Públicos ---------- */
  views.publicos = function () {
    const t = tabs('publicos', [['matriz', 'Matriz de públicos'], ['papeis', 'Papéis decisores'], ['perfis', 'Perfis atendidos'], ['territorios', 'Territórios compartilhados']]);
    let body = '';
    if (t.cur === 'matriz') body = `<p class="small muted">Perfil → papel decisor → problema → desejo → associação → tema → abordagem → solução.</p><div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Perfil</th><th>Papel</th><th>Problema</th><th>Desejo</th><th>Associação</th><th>Tema</th><th>Abordagem</th><th>Solução Elevah</th></tr></thead><tbody>
      ${E.audienceMatrix.map(r => `<tr><td><b class="small">${r.profile === 'todos' ? 'Todos' : esc(M.profile[r.profile].name)}</b></td><td class="small">${esc(M.role[r.role].name)}</td><td class="small">${esc(r.problem)}</td><td class="small">${esc(r.desire)}</td><td>${chip(M.assoc[r.assoc].name)}</td><td class="small">${esc(r.theme)}</td><td class="small">${esc(r.approach)}</td><td class="small muted">${esc(r.solution)}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (t.cur === 'papeis') { const month = { from: monthStart(S.calRef), to: monthEnd(S.calRef) }; body = `<div class="grid g3">${E.roles.map(r => { const nI = S.ideas.filter(i => i.audience === r.id).length; const nC = planned(month).filter(i => i.audience === r.id).length; return `<div class="card stack"><h3>${esc(r.name)}</h3><div><span class="label">Dores</span><p class="small">${esc(r.pains)}</p></div><div><span class="label">Quer</span><p class="small">${esc(r.wants)}</p></div><div class="row tiny muted"><span>${nI} pautas</span>·<span>${nC} no mês</span><a href="#biblioteca" data-act="lib-audience" data-v="${r.id}" style="margin-left:auto">Ver pautas</a></div></div>`; }).join('')}</div>`; }
    if (t.cur === 'perfis') body = `<p class="small muted">Perfis do documento de ofertas. Na comunicação, servem de exemplo e de campanha dirigida, sem fragmentar a marca. Preços são hipóteses comerciais.</p><div class="grid g3">${E.profiles.map(p => `<div class="card stack"><div><span class="label">${esc(p.who)}</span><h3>${esc(p.name)}</h3></div><p class="small"><b>Papel da Elevah:</b> ${esc(p.role)}</p><p class="small"><b>Gancho de conteúdo:</b> ${esc(p.hook)}</p><p class="tiny muted">Preço sugerido (hipótese): ${esc(p.price)}</p></div>`).join('')}</div>`;
    if (t.cur === 'territorios') body = `<p class="small muted">Relevância de cada tema por perfil (0–3). Para descoberta, prefira temas fortes em vários perfis ao mesmo tempo: ampliam alcance sem perder clareza.</p><div class="card flat"><div class="tbl-wrap"><table class="heat"><thead><tr><th>Tema</th>${E.profiles.map(p => `<th>${esc(p.name)}</th>`).join('')}<th class="n">Alcance</th></tr></thead><tbody>
      ${E.sharedTerritories.map(t2 => { const tot = Object.values(t2.rel).filter(v => v >= 2).length; return `<tr><td>${esc(t2.theme)}</td>${E.profiles.map(p => `<td class="h${t2.rel[p.id]}">${t2.rel[p.id] || '·'}</td>`).join('')}<td class="n">${tot}/7</td></tr>`; }).join('')}</tbody></table></div></div>`;
    return `<div class="page-head"><div><h1>Públicos</h1><p>Quem decide, o que sente e quais interesses são compartilhados entre os perfis.</p></div></div>${t.html}${body}`;
  };

  /* ---------- Pilares ---------- */
  views.pilares = function () {
    const month = { from: monthStart(S.calRef), to: monthEnd(S.calRef) }; const cm = planned(month);
    return `<div class="page-head"><div><h1>Pilares editoriais</h1><p>Pilar → tema → subtema → pauta → ângulo → conteúdo. Clique num subtema para ver as pautas.</p></div></div>
      <div class="stack">${E.pillars.map(p => { const nI = S.ideas.filter(i => i.pillar === p.id).length; const nC = cm.filter(i => i.pillar === p.id).length; const open = UI.open[p.id]; return `<div class="pillar">
        <div class="pillar-h" data-act="toggle-pillar" data-v="${p.id}"><span class="pillar-sw" style="background:${p.color}"></span><div style="flex:1;min-width:0"><h2>${esc(p.name)}</h2><p class="small muted">${esc(p.goal)}</p></div>
          <div class="stack" style="align-items:flex-end;gap:2px"><span class="small num">${nI} pautas</span><span class="tiny muted">${nC} no mês</span></div><span class="muted">${open ? '−' : '+'}</span></div>
        ${open ? `<div class="pillar-body"><div class="grid g3 small">
          <div><span class="label">Associação</span><p>${p.assoc.map(a => M.assoc[a].name).join(', ')}</p></div><div><span class="label">Público principal</span><p>${p.audience.map(a => M.role[a].name).join(', ')}</p></div><div><span class="label">Etapas</span><div class="chips" style="margin-top:4px">${p.stages.map(stageChip).join('')}</div></div>
          <div><span class="label">Problemas</span><p>${p.problems.map(esc).join(' · ')}</p></div><div><span class="label">Abordagens</span><p>${p.approaches.map(esc).join(' · ')}</p></div><div><span class="label">Formatos</span><p>${p.formats.map(f => M.fmt[f].name).join(', ')}</p></div>
          <div><span class="label">Resultado esperado</span><p>${esc(p.results)}</p></div><div><span class="label">Conexão com a solução</span><p>${esc(p.solution)}</p></div></div>
          <div class="tree">${p.themes.map(th => { const n = S.ideas.filter(i => i.theme === th.id).length; return `<div class="tree-theme"><div class="spread"><b class="small">${esc(th.name)}</b><span class="tiny muted">${n}</span></div><ul>${th.subs.map(s => `<li><button data-act="lib-search" data-v="${esc(s)}">${esc(s)} <span class="tiny muted">(${S.ideas.filter(i => i.sub === s).length})</span></button></li>`).join('')}</ul></div>`; }).join('')}</div></div>` : ''}
      </div>`; }).join('')}</div>`;
  };

  /* ---------- Referências ---------- */
  views.referencias = function () {
    const t = tabs('ref', [['fund', 'Fundamentação'], ['funil', 'Funil e objetivos'], ['tipos', 'Tipos editoriais'], ['formatos', 'Formatos'], ['frameworks', 'Frameworks'], ['regras', 'Regras de cálculo']]);
    let body = '';
    if (t.cur === 'fund') body = `<p class="small muted">Cada referência indica o tipo de evidência. Modelo e recomendação não são lei; hipóteses precisam de dados da própria Elevah.</p><div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Referência</th><th>Tipo</th><th>Contribuição para a estratégia</th><th>Limites</th></tr></thead><tbody>
      ${E.references.map(r => `<tr><td style="min-width:200px"><b class="small">${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.ref)}</a>` : esc(r.ref)}</b></td><td>${chip(r.kind, /Hipótese/.test(r.kind) ? 'flag' : /científica|empírica|experimental/i.test(r.kind) ? 'okc' : '')}</td><td class="small">${esc(r.use)}</td><td class="small muted">${esc(r.limit)}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (t.cur === 'funil') body = `<div class="notice">Etapa do funil, objetivo, tema e formato são dimensões diferentes. Um carrossel pode ser descoberta ou conversão: classifique pela intenção, pela mensagem e pela ação esperada.</div>
      <div class="grid g2"><div class="card"><div class="card-head"><h2>Funil de comunicação</h2></div><div class="stack">${E.stages.map(s => `<div class="stack" style="gap:3px">${stageChip(s.id)}<span class="small">${esc(s.fn)}</span><span class="tiny muted">Ação: ${esc(s.action)} · Métricas: ${s.metrics.join(', ')}</span></div>`).join('')}</div></div>
      <div class="stack"><div class="card"><div class="card-head"><h2>Funil comercial</h2></div><div class="row small">${['Seguidor ou visitante', 'Lead (pediu diagnóstico)', 'Conversa', 'Proposta', 'Cliente', 'Receita'].map((x, i) => `${i ? '<span class="muted">→</span>' : ''}<span class="chip">${x}</span>`).join(' ')}</div><p class="small muted" style="margin-top:10px">Relacionados, não equivalentes. O conteúdo alimenta o topo do funil comercial; a conversão comercial depende de atendimento, diagnóstico e proposta. Só conteúdos com link rastreado podem ter receita atribuída.</p></div>
      <div class="card"><div class="card-head"><h2>Objetivos</h2></div><div class="tbl-wrap"><table><thead><tr><th>Objetivo</th><th>Etapa mais comum</th></tr></thead><tbody>${E.objectives.map(o => `<tr><td class="small">${esc(o.name)}</td><td>${stageChip(o.stage)}</td></tr>`).join('')}</tbody></table></div></div></div></div>`;
    if (t.cur === 'tipos') body = `<div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Tipo</th><th>Objetivo</th><th>Etapa</th><th>Público</th><th>Quando funciona</th><th>Estruturas</th><th>Formatos</th><th>Exemplo</th><th>CTA</th><th>Métricas</th></tr></thead><tbody>
      ${E.types.map(x => `<tr><td><b class="small">${esc(x.name)}</b></td><td class="small">${esc(x.goal)}</td><td>${stageChip(x.stage)}</td><td class="small">${esc(x.who)}</td><td class="small">${esc(x.when)}</td><td class="small">${x.fw.map(f => M.fw[f].name.split(' (')[0]).join(', ')}</td><td class="small">${x.fo.map(f => M.fmt[f].name).join(', ')}</td><td class="small muted">${esc(x.ex)}</td><td class="small">${esc(x.cta)}</td><td class="small muted">${esc(x.kpi)}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (t.cur === 'formatos') body = `<div class="card flat" style="padding:0"><div class="tbl-wrap"><table><thead><tr><th>Formato</th><th>Canais</th><th>Esforço</th><th>Especificação</th><th>Bom para</th><th>Cuidados</th></tr></thead><tbody>
      ${E.formats.map(f => `<tr><td><b class="small">${esc(f.name)}</b></td><td class="small">${f.ch.map(c => M.ch[c].name).join(', ')}</td><td class="prio">${'●'.repeat(f.effort)}${'○'.repeat(3 - f.effort)}</td><td class="small">${esc(f.spec)}</td><td class="small">${esc(f.good)}</td><td class="small muted">${esc(f.care)}</td></tr>`).join('')}</tbody></table></div></div>`;
    if (t.cur === 'frameworks') body = `<div class="grid g3">${E.frameworks.map(f => `<div class="card stack"><h3>${esc(f.name)}</h3><p class="small">${esc(f.goal)}. <span class="muted">${esc(f.when)}.</span></p><div class="chips">${f.steps.map(s => chip(s)).join('')}</div><p class="tiny"><b>+</b> ${esc(f.pros)}</p><p class="tiny muted"><b>−</b> ${esc(f.cons)}</p><p class="tiny"><span class="label">Exemplo Elevah</span><br>${esc(f.ex)}</p></div>`).join('')}</div>`;
    if (t.cur === 'regras') body = `<div class="card stack prose"><h2>Regras de cálculo</h2>
      <p><b>Denominador.</b> Distribuição percentual = conteúdos da etapa ÷ total de conteúdos com data no período, depois dos filtros ativos. Cada publicação conta uma vez, pela etapa primária.</p>
      <p><b>Planejado</b> inclui todos os conteúdos com data no período, de "Priorizado" a "Publicado". <b>Publicado</b> considera só o status Publicado. Ideias sem data não entram.</p>
      <p><b>Metas</b> somam 100% obrigatoriamente. A tolerância (padrão ±5 pp) define quando uma etapa é marcada como abaixo ou acima da meta.</p>
      <p><b>Conteúdos necessários.</b> Para atingir a meta t sem remover nada: x = ⌈(t × total − atuais) ÷ (1 − t)⌉.</p>
      <p><b>Aderência às metas</b> = 100 − (soma das diferenças absolutas entre planejado e meta ÷ 2).</p>
      <p><b>Esforço</b> (1 a 3 por formato) é uma métrica complementar de capacidade e não entra na distribuição.</p>
      <p><b>Engajamento</b> = (salvamentos + compartilhamentos + comentários) ÷ alcance. Curtidas não entram.</p>
      <p><b>Radar.</b> Pontuação ponderada de 9 critérios (0–3), normalizada para 0–100.</p></div>`;
    return `<div class="page-head"><div><h1>Referências</h1><p>Fundamentação, classificações e regras que a ferramenta usa.</p></div></div>${t.html}${body}`;
  };

  /* ---------- Ajustes ---------- */
  views.ajustes = function () {
    const total = E.stages.reduce((a, s) => a + Number(S.targets[s.id] || 0), 0);
    return `<div class="page-head"><div><h1>Ajustes</h1><p>Metas de distribuição, cadência, equipe e dados.</p></div></div>
      <div class="grid g2" style="align-items:start">
        <div class="card stack"><div class="spread"><h2>Metas do funil</h2><label class="row small"><input type="checkbox" data-act="toggle-targets" ${S.useTargets ? 'checked' : ''}> Usar metas</label></div>
          <p class="small muted">${S.useTargets ? 'O painel compara o planejado com estas metas.' : 'Sem metas: o painel só mostra a distribuição observada.'}</p>
          <div class="stack" style="${S.useTargets ? '' : 'opacity:.5;pointer-events:none'}">${E.stages.map(s => `<div class="spread"><span class="row">${stageChip(s.id)}</span><span class="row"><input type="number" min="0" max="100" step="5" data-target="${s.id}" value="${S.targets[s.id]}" style="width:80px;text-align:right" aria-label="Meta ${s.name}"> %</span></div>`).join('')}
            <div class="spread"><b>Total</b><b class="num" style="color:${total === 100 ? 'var(--ok)' : 'var(--crit)'}">${total}%</b></div>
            ${total !== 100 ? `<div class="confirm">A soma precisa ser 100%: ${total < 100 ? `faltam ${100 - total}` : `sobram ${total - 100}`} pp. Enquanto isso, o painel compara com os valores digitados.</div>` : ''}
            <label class="field"><span>Tolerância (pp)</span><input type="number" min="0" max="20" data-tol value="${S.tolerance}" style="width:100px"></label></div>
          <div class="divider"></div><span class="label">Modelos</span>${E.targetPresets.map(p => `<div class="rec"><div class="spread"><b class="small">${esc(p.name)}</b><button class="btn sm" data-act="preset" data-v="${p.id}">Aplicar</button></div><span class="tiny muted">${E.stages.map(s => `${s.name} ${p.t[s.id]}%`).join(' · ')}</span><span class="small muted">${esc(p.why)}</span></div>`).join('')}</div>
        <div class="stack">
          <div class="card stack"><h2>Cadência</h2><p class="small muted">Dias de publicação por canal. Define os espaços livres do calendário e as datas sugeridas.</p>
            ${E.channels.map(c => `<div class="spread"><b class="small">${c.name}</b><div class="row">${WD.map((w, i) => `<label class="row small" style="gap:3px"><input type="checkbox" data-cad="${c.id}" data-v="${i}" ${cadenceDays(c.id).includes(i) ? 'checked' : ''}>${w}</label>`).join('')}</div></div>`).join('')}</div>
          <div class="card stack"><h2>Responsáveis</h2><label class="field"><span>Separados por vírgula</span><input type="text" data-owners value="${esc(S.owners.join(', '))}"></label></div>
          <div class="card stack"><h2>Dados</h2><p class="small muted">O planejamento fica salvo neste navegador. Para levar para outro lugar, copie o JSON; para restaurar, cole e importe.</p>
            <div class="row"><button class="btn sm" data-act="export">Copiar JSON</button><button class="btn sm" data-act="import">Importar JSON colado</button>
            ${UI.confirm === 'reset' ? `<span class="confirm">Apagar alterações e voltar aos dados iniciais? <button class="btn sm danger" data-act="reset-yes">Restaurar</button><button class="btn sm" data-act="reset-no">Cancelar</button></span>` : '<button class="btn sm danger" data-act="reset">Restaurar dados iniciais</button>'}</div>
            <textarea id="json-io" rows="5" placeholder="Cole aqui o JSON para importar" style="font-family:var(--f-num);font-size:11.5px"></textarea></div>
        </div></div>`;
  };

  /* ================================================================ */
  /* Drawers                                                           */
  /* ================================================================ */
  function openDrawer(d) { UI.drawer = d; UI.confirm = null; renderDrawer(); }
  function closeDrawer() { UI.drawer = null; document.getElementById('drawer-root').innerHTML = ''; }
  function renderDrawer() {
    const root = document.getElementById('drawer-root'); const d = UI.drawer; if (!d) { root.innerHTML = ''; return; }
    let html = '';
    try { html = drawers[d.kind](d); } catch (e) { console.error(e); html = '<p>Não foi possível abrir.</p>'; }
    if (html === null) { closeDrawer(); return; }
    const scroll = root.querySelector('.drawer') ? root.querySelector('.drawer').scrollTop : 0;
    root.innerHTML = `<div class="overlay" data-act="overlay"><div class="drawer ${d.wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    root.querySelector('.drawer').scrollTop = scroll;
  }
  const head = (eyebrow, title) => `<div class="drawer-head"><div class="stack" style="gap:4px"><span class="label">${eyebrow}</span><h2 style="font-size:19px">${title}</h2></div><button class="x" data-act="close" aria-label="Fechar">×</button></div>`;
  const drawers = {};

  drawers.item = function ({ id }) {
    const it = getItem(id); if (!it) return null;
    const idea = getIdea(it.ideaId) || {};
    const b = `item:${it.id}`;
    const typeStage = M.type[it.type] ? M.type[it.type].stage : null;
    const m = it.metrics || {};
    const MF = [['alcance', 'Alcance'], ['visualizacoes', 'Visualizações'], ['naoSeguidores', '% não seguidores'], ['visitasPerfil', 'Visitas ao perfil'], ['novosSeguidores', 'Novos seguidores'], ['salvamentos', 'Salvamentos'], ['compartilhamentos', 'Compartilhamentos'], ['comentarios', 'Comentários'], ['cliques', 'Cliques'], ['leads', 'Leads'], ['conversas', 'Conversas']];
    return `${head(`${fmtD(it.date)} · ${M.status[it.status].name}`, esc(it.title))}
      <div class="chips">${stageChip(it.stage)}${pillarChip(it.pillar)}${it.ex ? chip('números ilustrativos', 'flag') : ''}${it.demo ? chip('métricas demo', 'flag') : ''}${it.series ? chip('Série: ' + (M.series[it.series] ? M.series[it.series].name : it.series), 'acc') : ''}</div>
      ${it.review ? `<div class="sim-banner"><div class="small"><b>Revisar alinhamento.</b> ${esc(it.review)} Nada foi alterado.</div><button class="btn sm" data-act="clear-review" data-id="${it.id}">Marcar como revisado</button></div>` : ''}
      <label class="field"><span>Título</span><input type="text" data-bind="${b}:title" value="${esc(it.title)}"></label>
      <div class="form-grid">
        <label class="field"><span>Data</span><input type="date" data-bind="${b}:date" value="${it.date || ''}"></label>
        <label class="field"><span>Status</span><select data-bind="${b}:status" data-rerender>${opts(E.statuses, it.status)}</select></label>
        <label class="field"><span>Canal</span><select data-bind="${b}:channel" data-rerender>${opts(E.channels, it.channel)}</select></label>
        <label class="field"><span>Formato</span><select data-bind="${b}:format">${opts(E.formats.filter(f => f.ch.includes(it.channel)), it.format)}</select></label>
        <label class="field"><span>Etapa primária do funil</span><select data-bind="${b}:stage" data-rerender>${opts(E.stages, it.stage)}</select>${typeStage && typeStage !== it.stage ? `<small>O tipo "${M.type[it.type].name}" costuma servir a ${M.stage[typeStage].name.toLowerCase()}. Mantenha se a intenção for outra.</small>` : '<small>Conta uma vez na distribuição.</small>'}</label>
        <label class="field"><span>Objetivo</span><select data-bind="${b}:objective">${opts(E.objectives, it.objective)}</select></label>
        <label class="field"><span>Pilar</span><select data-bind="${b}:pillar" data-rerender>${opts(E.pillars, it.pillar)}</select></label>
        <label class="field"><span>Tema</span><select data-bind="${b}:theme">${opts(M.pillar[it.pillar].themes, it.theme)}</select></label>
        <label class="field"><span>Público</span><select data-bind="${b}:audience">${opts(E.roles, it.audience)}</select></label>
        <label class="field"><span>Associação de marca</span><select data-bind="${b}:assoc">${opts(E.associations, it.assoc)}</select></label>
        <label class="field"><span>Tipo editorial</span><select data-bind="${b}:type" data-rerender>${opts(E.types, it.type)}</select></label>
        <label class="field"><span>Estrutura narrativa</span><select data-bind="${b}:framework">${opts(E.frameworks, it.framework)}</select></label>
        <label class="field"><span>Prioridade</span><select data-bind="${b}:priority" data-num>${opts([{ id: 3, name: 'Alta' }, { id: 2, name: 'Média' }, { id: 1, name: 'Baixa' }], it.priority)}</select></label>
        <label class="field"><span>Responsável</span><select data-bind="${b}:owner">${opts(S.owners.map(o => ({ id: o, name: o })), it.owner, 'Sem responsável')}</select></label>
        <label class="field full"><span>Ângulo</span><textarea data-bind="${b}:angle">${esc(it.angle)}</textarea></label>
      </div>
      ${idea.src || it.src ? `<p class="tiny muted">Fonte: ${esc(it.src || idea.src)}</p>` : ''}${idea.note ? `<p class="tiny" style="color:var(--warn)">${esc(idea.note)}</p>` : ''}
      <div class="row"><button class="btn primary sm" data-act="to-prod" data-id="${it.id}">Abrir na produção</button>
        ${it.status !== 'publicado' ? `<button class="btn sm" data-act="publish" data-id="${it.id}">Marcar como publicado</button>` : ''}
        <button class="btn sm" data-act="dup-item" data-id="${it.id}">Duplicar</button><button class="btn sm" data-act="repurpose" data-id="${it.id}">Reaproveitar</button><button class="btn sm" data-act="series" data-id="${it.id}">Criar série</button>
        ${UI.confirm === 'del-' + it.id ? `<span class="confirm">Excluir este conteúdo? <button class="btn sm danger" data-act="del-item-yes" data-id="${it.id}">Excluir</button><button class="btn sm" data-act="confirm-no">Cancelar</button></span>` : `<button class="btn sm danger ghost" data-act="del-item" data-id="${it.id}">Excluir</button>`}</div>
      ${it.status === 'publicado' ? `<div class="divider"></div><div class="spread"><h3>Métricas</h3><span class="tiny muted">${it.demo ? 'Valores de demonstração. Substitua pelos reais.' : 'Registre após 7 dias da publicação.'}</span></div>
        <div class="form-grid">${MF.map(([k, l]) => `<label class="field"><span>${l}</span><input type="number" min="0" data-metric="${it.id}:${k}" value="${m[k] != null ? m[k] : ''}"></label>`).join('')}</div>` : ''}`;
  };

  drawers.idea = function ({ id }) {
    const i = getIdea(id); if (!i) return null; const b = `idea:${i.id}`;
    const VAR = {
      descoberta: `Identificação: abrir com a cena "${i.problem.toLowerCase()}" e fechar com uma pergunta. Formato curto.`,
      interesse: 'Útil: transformar o ângulo em passos ou numa conta aplicável. CTA: salvar.',
      consideracao: 'Método e prova: mostrar a decisão com dado (efetivo → vigente → projeção → ação) e uma evidência.',
      conversao: `Convite: mostrar o recurso pronto que resolve "${i.problem.toLowerCase()}" e oferecer o diagnóstico.`,
      relacionamento: `Conversa: perguntar à audiência como lida com "${i.problem.toLowerCase()}" e responder nos stories.`
    };
    const inCal = S.items.filter(it => it.ideaId === i.id);
    return `${head('Pauta da biblioteca', esc(i.title))}
      <div class="chips">${stageChip(i.stage)}${pillarChip(i.pillar)}${i.ex ? chip('números ilustrativos', 'flag') : ''}${inCal.length ? chip(`${inCal.length} no calendário`, 'okc') : ''}</div>
      <div class="row"><input type="date" id="sched-date" value="${nextSlot(i.channel)}" style="width:auto" aria-label="Data"><button class="btn primary sm" data-act="sched-idea" data-id="${i.id}">Agendar</button><button class="btn sm" data-act="repurpose-idea" data-id="${i.id}">Reaproveitar em formatos</button><button class="btn sm" data-act="series-idea" data-id="${i.id}">Criar série</button><button class="btn sm" data-act="dup-idea" data-id="${i.id}">Duplicar</button>
        ${UI.confirm === 'deli-' + i.id ? `<span class="confirm">Excluir a pauta? <button class="btn sm danger" data-act="del-idea-yes" data-id="${i.id}">Excluir</button><button class="btn sm" data-act="confirm-no">Cancelar</button></span>` : `<button class="btn sm danger ghost" data-act="del-idea" data-id="${i.id}">Excluir</button>`}</div>
      <label class="field"><span>Título sugerido</span><input type="text" data-bind="${b}:title" value="${esc(i.title)}"></label>
      <label class="field"><span>Ângulo editorial</span><textarea data-bind="${b}:angle">${esc(i.angle)}</textarea></label>
      <div class="form-grid">
        <label class="field"><span>Problema abordado</span><input type="text" data-bind="${b}:problem" value="${esc(i.problem)}"></label>
        <label class="field"><span>Subtema</span><input type="text" data-bind="${b}:sub" value="${esc(i.sub)}"></label>
        <label class="field"><span>Pilar</span><select data-bind="${b}:pillar" data-rerender>${opts(E.pillars, i.pillar)}</select></label>
        <label class="field"><span>Tema</span><select data-bind="${b}:theme">${opts(M.pillar[i.pillar].themes, i.theme)}</select></label>
        <label class="field"><span>Etapa do funil</span><select data-bind="${b}:stage">${opts(E.stages, i.stage)}</select></label>
        <label class="field"><span>Objetivo</span><select data-bind="${b}:objective">${opts(E.objectives, i.objective)}</select></label>
        <label class="field"><span>Público principal</span><select data-bind="${b}:audience">${opts(E.roles, i.audience)}</select></label>
        <label class="field"><span>Associação de marca</span><select data-bind="${b}:assoc">${opts(E.associations, i.assoc)}</select></label>
        <label class="field"><span>Canal</span><select data-bind="${b}:channel" data-rerender>${opts(E.channels, i.channel)}</select></label>
        <label class="field"><span>Formato recomendado</span><select data-bind="${b}:format">${opts(E.formats.filter(f => f.ch.includes(i.channel)), i.format)}</select></label>
        <label class="field"><span>Tipo editorial</span><select data-bind="${b}:type">${opts(E.types, i.type)}</select></label>
        <label class="field"><span>Estrutura narrativa</span><select data-bind="${b}:framework">${opts(E.frameworks, i.framework)}</select></label>
        <label class="field"><span>Prioridade</span><select data-bind="${b}:priority" data-num>${opts([{ id: 3, name: 'Alta' }, { id: 2, name: 'Média' }, { id: 1, name: 'Baixa' }], i.priority)}</select></label>
        <label class="field"><span>Fonte ou referência</span><input type="text" data-bind="${b}:src" value="${esc(i.src)}"></label>
      </div>
      <p class="small muted">Perfis em que funciona: ${i.profiles.map(p => p === 'todos' ? 'todos' : M.profile[p].name).join(', ')}</p>
      <div class="divider"></div><h3>A mesma pauta em outras etapas</h3>
      <div class="stack" style="gap:6px">${E.stages.filter(s => s.id !== i.stage).map(s => `<div class="rec-sug"><span class="small">${stageChip(s.id)} ${esc(VAR[s.id])}</span><button class="btn sm" data-act="idea-variant" data-id="${i.id}" data-stage="${s.id}">Criar variação</button></div>`).join('')}</div>`;
  };

  drawers.pick = function ({ date, ch }) {
    const r = calRange(); const d = dist(planned(r));
    const deficit = S.useTargets ? E.stages.map(s => [s.id, d.p[s.id] - S.targets[s.id]]).sort((a, b) => a[1] - b[1])[0] : null;
    const q = (UI.pickQ || '').toLowerCase();
    const used = usedIdeaIds();
    let list = S.ideas.filter(i => !used.has(i.id) && (!ch || M.fmt[adaptFormat(i.format, ch)]) && (!q || (i.title + ' ' + i.angle).toLowerCase().includes(q)));
    list = list.map(i => ({ i, s: i.priority + (deficit && i.stage === deficit[0] && deficit[1] < 0 ? 3 : 0) + (ch && i.channel === ch ? 1 : 0) + (PRIO_W[S.assocPriority[i.assoc]] || 0) * .5 })).sort((a, b) => b.s - a.s).slice(0, 14).map(x => x.i);
    return `${head(`${fmtDL(date)}${ch ? ' · ' + M.ch[ch].name : ''}`, 'Escolher pauta')}
      ${deficit && deficit[1] < -S.tolerance ? `<div class="notice">Prioridade para este espaço: <b>${M.stage[deficit[0]].name}</b> está ${Math.round(-deficit[1])} pp abaixo da meta. As sugestões abaixo já consideram isso.</div>` : ''}
      <div class="row"><input type="search" id="pick-q" placeholder="Buscar na biblioteca" value="${esc(UI.pickQ || '')}" style="flex:1"><button class="btn sm" data-act="new-item" data-date="${date}" data-ch="${ch || ''}">Pauta nova</button></div>
      <div class="stack" style="gap:6px">${list.map(i => `<div class="rec-sug"><span><span class="small" style="font-weight:550">${esc(i.title)}</span><br><span class="chips" style="margin-top:4px">${stageChip(i.stage)}${chip(M.fmt[adaptFormat(i.format, ch || i.channel)].name)}${chip(M.pillar[i.pillar].name)}</span></span><button class="btn primary sm" data-act="pick-idea" data-id="${i.id}" data-date="${date}" data-ch="${ch || ''}">Usar</button></div>`).join('') || '<div class="empty small">Nada encontrado.</div>'}</div>`;
  };

  drawers.newitem = function ({ date, ch, mode }) {
    const isIdea = mode === 'idea';
    const f = UI.form = UI.form || { title: '', angle: '', problem: '', channel: ch || 'ig', format: 'carrossel', stage: 'descoberta', objective: 'audiencia', pillar: 'p1', theme: 'p1-forecast', audience: 'dono', assoc: 'antecipacao', type: 'educativo', framework: 'howto', priority: 2, date: date || nextSlot(ch || 'ig'), src: '' };
    if (!M.fmt[f.format].ch.includes(f.channel)) f.format = adaptFormat(f.format, f.channel);
    if (THEMES[f.theme].pillar !== f.pillar) f.theme = M.pillar[f.pillar].themes[0].id;
    const b = 'form';
    return `${head(isIdea ? 'Biblioteca' : 'Calendário', isIdea ? 'Nova pauta' : 'Novo conteúdo')}
      <label class="field"><span>Título</span><input type="text" data-bind="${b}:title" value="${esc(f.title)}" placeholder="Uma frase com ângulo concreto"></label>
      <label class="field"><span>Ângulo</span><textarea data-bind="${b}:angle" placeholder="Qual perspectiva torna isso interessante?">${esc(f.angle)}</textarea></label>
      <div class="form-grid">
        ${isIdea ? `<label class="field"><span>Problema abordado</span><input type="text" data-bind="${b}:problem" value="${esc(f.problem)}"></label>` : `<label class="field"><span>Data</span><input type="date" data-bind="${b}:date" value="${f.date}"></label>`}
        <label class="field"><span>Etapa primária do funil</span><select data-bind="${b}:stage">${opts(E.stages, f.stage)}</select></label>
        <label class="field"><span>Canal</span><select data-bind="${b}:channel" data-rerender>${opts(E.channels, f.channel)}</select></label>
        <label class="field"><span>Formato</span><select data-bind="${b}:format">${opts(E.formats.filter(x => x.ch.includes(f.channel)), f.format)}</select></label>
        <label class="field"><span>Objetivo</span><select data-bind="${b}:objective">${opts(E.objectives, f.objective)}</select></label>
        <label class="field"><span>Público</span><select data-bind="${b}:audience">${opts(E.roles, f.audience)}</select></label>
        <label class="field"><span>Pilar</span><select data-bind="${b}:pillar" data-rerender>${opts(E.pillars, f.pillar)}</select></label>
        <label class="field"><span>Tema</span><select data-bind="${b}:theme">${opts(M.pillar[f.pillar].themes, f.theme)}</select></label>
        <label class="field"><span>Associação</span><select data-bind="${b}:assoc">${opts(E.associations, f.assoc)}</select></label>
        <label class="field"><span>Tipo editorial</span><select data-bind="${b}:type">${opts(E.types, f.type)}</select></label>
        <label class="field"><span>Estrutura</span><select data-bind="${b}:framework">${opts(E.frameworks, f.framework)}</select></label>
        <label class="field"><span>Fonte</span><input type="text" data-bind="${b}:src" value="${esc(f.src)}"></label>
      </div>
      <div class="row"><button class="btn primary" data-act="save-new" data-mode="${isIdea ? 'idea' : 'item'}">${isIdea ? 'Salvar na biblioteca' : 'Adicionar ao calendário'}</button>${!isIdea ? '<button class="btn" data-act="save-new" data-mode="both">Salvar na biblioteca e agendar</button>' : ''}</div>`;
  };

  drawers.repurpose = function ({ id, fromIdea }) {
    const src = fromIdea ? getIdea(id) : getItem(id); if (!src) return null;
    const sel = UI.repSel = UI.repSel || {};
    const opts2 = E.formats.flatMap(f => f.ch.map(c => ({ f, c }))).filter(x => !(x.f.id === src.format && x.c === src.channel));
    return `${head('Reaproveitar', esc(src.title))}
      <p class="small muted">Cada versão nasce como ideia no pipeline (sem data), ligada à original, com a adaptação de linguagem do canal. Ajuste o ângulo antes de produzir para evitar repetição mecânica.</p>
      <div class="opts">${opts2.map(x => { const k = x.f.id + '|' + x.c; return `<button class="opt ${sel[k] ? 'on' : ''}" data-act="rep-toggle" data-v="${k}"><b class="small">${esc(x.f.name)} · ${M.ch[x.c].name}</b><span class="tiny muted">${esc(x.c === 'li' ? 'Mais contexto, tom de análise, conta aberta.' : 'Gancho visual, uma ideia por tela, linguagem direta.')}</span><span class="tiny">${esc(x.f.spec)}</span></button>`; }).join('')}</div>
      <button class="btn primary" data-act="rep-create" data-id="${id}" data-from-idea="${fromIdea ? 1 : ''}" ${Object.values(sel).some(Boolean) ? '' : 'disabled'}>Criar ${Object.values(sel).filter(Boolean).length || ''} ${Object.values(sel).filter(Boolean).length === 1 ? 'versão' : 'versões'}</button>`;
  };

  drawers.series = function ({ id, fromIdea }) {
    const src = fromIdea ? getIdea(id) : getItem(id); if (!src) return null;
    const f = UI.sform = UI.sform || { series: src.series || 'conta', n: 4, every: 7, start: nextSlot(src.channel) };
    return `${head('Criar série', esc(src.title))}
      <p class="small muted">Séries criam familiaridade e expectativa. Cada episódio entra no calendário como Priorizado; refine o ângulo de cada um na produção.</p>
      <div class="form-grid"><label class="field"><span>Série</span><select data-bind="sform:series">${opts(E.series, f.series)}</select></label>
        <label class="field"><span>Episódios</span><input type="number" min="2" max="12" data-bind="sform:n" data-num value="${f.n}"></label>
        <label class="field"><span>Primeira data</span><input type="date" data-bind="sform:start" value="${f.start}"></label>
        <label class="field"><span>Intervalo</span><select data-bind="sform:every" data-num>${opts([{ id: 7, name: 'Semanal' }, { id: 14, name: 'Quinzenal' }], f.every)}</select></label></div>
      <p class="small">${M.series[f.series] ? esc(M.series[f.series].desc) : ''}</p>
      <button class="btn primary" data-act="series-create" data-id="${id}" data-from-idea="${fromIdea ? 1 : ''}">Criar ${f.n} episódios</button>`;
  };

  drawers.radar = function ({ id }) {
    const n = S.radar.find(x => x.id === id); if (!n) return null; const c = radarClass(n);
    return `${head('Avaliar fonte', esc(n.title))}
      <div class="spread"><div class="chips">${chip(RCLASS[c.cls].n, RCLASS[c.cls].c)}${chip('Prioridade ' + PRIO_N[c.prio])}${n.simulated ? chip('exemplo simulado', 'crit') : ''}</div><span class="score">${c.sc}<span class="tiny muted">/100</span></span></div>
      <p class="small muted">${RCLASS[c.cls].d}</p>
      <div class="form-grid"><label class="field full"><span>Título</span><input type="text" data-bind="radar:${n.id}:title" value="${esc(n.title)}"></label>
        <label class="field"><span>Fonte</span><input type="text" data-bind="radar:${n.id}:source" value="${esc(n.source)}"></label>
        <label class="field"><span>Link</span><input type="url" data-bind="radar:${n.id}:url" value="${esc(n.url)}" placeholder="https://"></label>
        <label class="field"><span>Data</span><input type="date" data-bind="radar:${n.id}:date" value="${n.date}"></label>
        <label class="field"><span>Tipo</span><input type="text" data-bind="radar:${n.id}:kind" value="${esc(n.kind)}"></label></div>
      <div><span class="label">Critérios (0 a 3)</span>${E.radarCriteria.map(cr => `<div class="crit-row"><span>${cr.name} <span class="tiny muted">×${cr.w}</span></span><span class="dots">${[0, 1, 2, 3].map(v => `<button data-act="radar-score" data-id="${n.id}" data-k="${cr.id}" data-v="${v}" class="${(n.scores[cr.id] || 0) === v ? 'on' : ''}">${v}</button>`).join('')}</span></div>`).join('')}</div>
      <label class="field"><span>Notas</span><textarea data-bind="radar:${n.id}:notes">${esc(n.notes)}</textarea></label>
      <div class="row">${c.cls !== 'descartar' ? `<button class="btn primary sm" data-act="radar-convert" data-id="${n.id}">Transformar em pauta</button>` : ''}${UI.confirm === 'delr-' + n.id ? `<span class="confirm">Excluir? <button class="btn sm danger" data-act="radar-del-yes" data-id="${n.id}">Excluir</button><button class="btn sm" data-act="confirm-no">Cancelar</button></span>` : `<button class="btn sm danger ghost" data-act="radar-del" data-id="${n.id}">Excluir</button>`}</div>`;
  };

  drawers.convert = function ({ id }) {
    const n = S.radar.find(x => x.id === id); if (!n) return null; const c = radarClass(n); const rc = RCLASS[c.cls];
    const f = UI.cform = UI.cform && UI.cform.rid === id ? UI.cform : { rid: id, title: n.title.replace(/^EXEMPLO SIMULADO — /, ''), angle: `O que "${n.title.slice(0, 80)}" significa na prática para quem gere um negócio, e qual decisão muda.`, pillar: n.pillar || 'p5', stage: rc.stage, type: rc.type, framework: rc.fw, channel: 'li', format: 'texto', audience: 'dono', assoc: 'rigor', schedule: true, date: nextSlot('li') };
    if (!M.fmt[f.format].ch.includes(f.channel)) f.format = adaptFormat(f.format, f.channel);
    return `${head('Do radar para a pauta', esc(n.title))}
      <div class="notice">Classificação: <b>${rc.n}</b>. Sugestão: ${M.stage[rc.stage].name.toLowerCase()}, tipo ${M.type[rc.type].name.toLowerCase()}, estrutura ${M.fw[rc.fw].name}.</div>
      <label class="field"><span>Título da pauta</span><input type="text" data-bind="cform:title" value="${esc(f.title)}"></label>
      <label class="field"><span>Ângulo (análise própria)</span><textarea data-bind="cform:angle">${esc(f.angle)}</textarea></label>
      <div class="form-grid"><label class="field"><span>Pilar</span><select data-bind="cform:pillar">${opts(E.pillars, f.pillar)}</select></label>
        <label class="field"><span>Etapa</span><select data-bind="cform:stage">${opts(E.stages, f.stage)}</select></label>
        <label class="field"><span>Canal</span><select data-bind="cform:channel" data-rerender>${opts(E.channels, f.channel)}</select></label>
        <label class="field"><span>Formato</span><select data-bind="cform:format">${opts(E.formats.filter(x => x.ch.includes(f.channel)), f.format)}</select></label>
        <label class="field"><span>Público</span><select data-bind="cform:audience">${opts(E.roles, f.audience)}</select></label>
        <label class="field"><span>Associação</span><select data-bind="cform:assoc">${opts(E.associations, f.assoc)}</select></label>
        <label class="field"><span>Data</span><input type="date" data-bind="cform:date" value="${f.date}"></label>
        <label class="field row" style="align-self:end"><input type="checkbox" data-bind="cform:schedule" data-bool ${f.schedule ? 'checked' : ''}> Agendar no calendário</label></div>
      <button class="btn primary" data-act="convert-save" data-id="${id}">Criar pauta${f.schedule ? ' e agendar' : ''}</button>`;
  };

  drawers.radarnew = function () {
    const f = UI.rform = UI.rform || { title: '', source: '', url: '', date: TODAY, kind: 'Notícia', simulated: false };
    return `${head('Radar', 'Cadastrar fonte')}
      <p class="small muted">Registre notícia, estudo ou tendência com fonte verificável. A avaliação vem em seguida.</p>
      <label class="field"><span>Título ou manchete</span><input type="text" data-bind="rform:title" value="${esc(f.title)}"></label>
      <div class="form-grid"><label class="field"><span>Fonte</span><input type="text" data-bind="rform:source" value="${esc(f.source)}"></label><label class="field"><span>Link</span><input type="url" data-bind="rform:url" value="${esc(f.url)}" placeholder="https://"></label>
        <label class="field"><span>Data</span><input type="date" data-bind="rform:date" value="${f.date}"></label><label class="field"><span>Tipo</span><select data-bind="rform:kind">${opts(['Notícia', 'Pesquisa setorial', 'Estudo científico', 'Relatório empresarial', 'Dado econômico', 'Tendência de redes'].map(x => ({ id: x, name: x })), f.kind)}</select></label>
        <label class="field row full"><input type="checkbox" data-bind="rform:simulated" data-bool ${f.simulated ? 'checked' : ''}> É um exemplo simulado (não publicar como fato)</label></div>
      <button class="btn primary" data-act="radar-save" ${f.title.trim() ? '' : 'disabled'}>Salvar e avaliar</button>`;
  };

  /* ================================================================ */
  /* Ações                                                             */
  /* ================================================================ */
  const A = {};
  A['period'] = el => { S.period.mode = el.dataset.v; if (el.dataset.v === 'custom' && !S.period.from) { const r = getPeriod(); S.period.from = r.from; S.period.to = r.to; } commit(); };
  A['period-prev'] = () => { shiftPeriod(-1); }; A['period-next'] = () => { shiftPeriod(1); };
  function shiftPeriod(n) {
    const p = S.period;
    if (p.mode === 'week') p.ref = addDays(p.ref, 7 * n);
    else if (p.mode === 'month') p.ref = addMonths(p.ref, n);
    else { const len = (D(p.to) - D(p.from)) / 864e5 + 1; p.from = addDays(p.from, len * n); p.to = addDays(p.to, len * n); }
    commit();
  }
  A['dash-view'] = el => { S.dashView = el.dataset.v; commit(); };
  A['clear-filters'] = () => { Object.keys(S.filters).forEach(k => { S.filters[k] = ''; }); commit(); };
  A['sim-start'] = () => { S.sim = clone(S.items); commit('Simulação iniciada'); };
  A['sim-discard'] = () => { if (S.sim) S.items = S.sim; S.sim = null; commit('Simulação descartada'); };
  A['sim-apply'] = () => { S.sim = null; commit('Alterações aplicadas'); };
  A['add-idea'] = el => { const it = scheduleIdea(el.dataset.id); if (it) commit(`Agendado para ${fmtDL(it.date)} · ${M.ch[it.channel].name}`); };
  A['open-item'] = (el, ev) => { if (ev && ev.target.closest('a')) return; openDrawer({ kind: 'item', id: el.dataset.id }); };
  A['open-idea'] = el => openDrawer({ kind: 'idea', id: el.dataset.id });
  A['close'] = () => closeDrawer();
  A['overlay'] = (el, ev) => { if (ev.target === el) closeDrawer(); };
  A['cal-view'] = el => {
    if (el.dataset.v === 'week' && S.calView !== 'week') { const m = { from: monthStart(S.calRef), to: monthEnd(S.calRef) }; S.calRef = TODAY >= m.from && TODAY <= m.to ? TODAY : (dow(m.from) === 0 ? m.from : addDays(weekStart(m.from), 7)); }
    if (el.dataset.v !== 'week' && S.calView === 'week') S.calRef = monthStart(addDays(weekStart(S.calRef), 3));
    S.calView = el.dataset.v; commit();
  };
  A['cal-prev'] = () => { S.calRef = S.calView === 'week' ? addDays(S.calRef, -7) : addMonths(S.calRef, -1); commit(); };
  A['cal-next'] = () => { S.calRef = S.calView === 'week' ? addDays(S.calRef, 7) : addMonths(S.calRef, 1); commit(); };
  A['cal-today'] = () => { S.calRef = TODAY; commit(); };
  A['pick'] = el => { UI.pickQ = ''; openDrawer({ kind: 'pick', date: el.dataset.date, ch: el.dataset.ch || '' }); };
  A['pick-idea'] = el => { const it = scheduleIdea(el.dataset.id, el.dataset.date, el.dataset.ch || null); closeDrawer(); commit(`Agendado para ${fmtDL(it.date)}`); };
  A['new-item'] = el => { UI.form = null; openDrawer({ kind: 'newitem', date: el.dataset.date, ch: el.dataset.ch || '', mode: 'item' }); };
  A['new-idea'] = () => { UI.form = null; openDrawer({ kind: 'newitem', mode: 'idea' }); };
  A['save-new'] = el => {
    const f = UI.form; if (!f.title.trim()) { toast('Dê um título à pauta.'); return; }
    const mode = el.dataset.mode;
    const idea = { id: uid('k'), pillar: f.pillar, theme: f.theme, sub: THEMES[f.theme].subs[0], title: f.title.trim(), angle: f.angle, audience: f.audience, profiles: ['todos'], problem: f.problem || f.title, assoc: f.assoc, objective: f.objective, stage: f.stage, format: f.format, channel: f.channel, type: f.type, framework: f.framework, priority: f.priority, src: f.src, ex: false, note: '' };
    if (mode === 'idea' || mode === 'both') S.ideas.unshift(idea);
    let it = null;
    if (mode === 'item' || mode === 'both') { it = itemFromIdea(idea, { date: f.date, ideaId: mode === 'both' ? idea.id : null }); S.items.push(it); }
    UI.form = null; closeDrawer(); commit(mode === 'idea' ? 'Pauta salva na biblioteca' : `Adicionado em ${fmtDL(it.date)}`);
  };
  A['sched-idea'] = el => { const d = document.getElementById('sched-date').value; const it = scheduleIdea(el.dataset.id, d || null); commit(`Agendado para ${fmtDL(it.date)}`); };
  A['dup-idea'] = el => { const i = getIdea(el.dataset.id); const c = Object.assign(clone(i), { id: uid('k'), title: i.title + ' (cópia)' }); S.ideas.splice(S.ideas.indexOf(i) + 1, 0, c); openDrawer({ kind: 'idea', id: c.id }); commit('Pauta duplicada'); };
  A['idea-variant'] = el => {
    const i = getIdea(el.dataset.id); if (!i) return; const st = el.dataset.stage;
    const fmtFor = { descoberta: 'reels', interesse: 'carrossel', consideracao: i.channel === 'li' ? 'documento' : 'carrossel', conversao: i.channel === 'li' ? 'texto' : 'video', relacionamento: i.channel === 'li' ? 'texto' : 'stories' };
    const typeFor = { descoberta: 'identificacao', interesse: 'educativo', consideracao: 'analise', conversao: 'comercial', relacionamento: 'relacionamento' };
    const objFor = { descoberta: 'audiencia', interesse: 'educacao', consideracao: 'autoridade', conversao: 'leads', relacionamento: 'relacionamento' };
    const ty = typeFor[st];
    const c = Object.assign(clone(i), { id: uid('k'), stage: st, format: adaptFormat(fmtFor[st], i.channel), type: ty, framework: M.type[ty].fw[0], objective: objFor[st], title: i.title + ` (versão ${M.stage[st].name.toLowerCase()})` });
    S.ideas.splice(S.ideas.indexOf(i) + 1, 0, c); openDrawer({ kind: 'idea', id: c.id }); commit('Variação criada na biblioteca');
  };
  A['del-idea'] = el => { UI.confirm = 'deli-' + el.dataset.id; renderDrawer(); };
  A['del-idea-yes'] = el => { S.ideas = S.ideas.filter(i => i.id !== el.dataset.id); closeDrawer(); commit('Pauta excluída'); };
  A['del-item'] = el => { UI.confirm = 'del-' + el.dataset.id; renderDrawer(); };
  A['del-item-yes'] = el => { S.items = S.items.filter(i => i.id !== el.dataset.id); closeDrawer(); commit('Conteúdo excluído'); };
  A['confirm-no'] = () => { UI.confirm = null; renderDrawer(); };
  A['dup-item'] = el => { const it = getItem(el.dataset.id); const c = Object.assign(clone(it), { id: uid('c'), title: it.title + ' (cópia)', status: 'ideia', date: null, metrics: null, demo: false, review: null }); S.items.push(c); openDrawer({ kind: 'item', id: c.id }); commit('Duplicado como ideia (sem data)'); };
  A['publish'] = el => { const it = getItem(el.dataset.id); publish(it); commit('Publicado. Agora conta na execução.'); };
  A['clear-review'] = el => { getItem(el.dataset.id).review = null; commit('Marcado como revisado'); };
  A['to-prod'] = el => { UI.prodId = el.dataset.id; UI.prodStep = 0; closeDrawer(); location.hash = 'producao'; };
  A['repurpose'] = el => { UI.repSel = {}; openDrawer({ kind: 'repurpose', id: el.dataset.id, fromIdea: false, wide: true }); };
  A['repurpose-idea'] = el => { UI.repSel = {}; openDrawer({ kind: 'repurpose', id: el.dataset.id, fromIdea: true, wide: true }); };
  A['rep-toggle'] = el => { UI.repSel[el.dataset.v] = !UI.repSel[el.dataset.v]; renderDrawer(); };
  A['rep-create'] = el => {
    const fromIdea = !!el.dataset.fromIdea; const src = fromIdea ? getIdea(el.dataset.id) : getItem(el.dataset.id);
    const base = fromIdea ? itemFromIdea(src) : src;
    const keys = Object.keys(UI.repSel).filter(k => UI.repSel[k]);
    keys.forEach(k => { const [f, c] = k.split('|'); S.items.push(Object.assign(clone(base), { id: uid('c'), ideaId: fromIdea ? src.id : base.ideaId, parent: fromIdea ? null : src.id, channel: c, format: f, status: 'ideia', date: null, metrics: null, demo: false, review: null, brief: { adapt: '' }, title: `${src.title} · ${M.fmt[f].name.split(' ')[0]} ${M.ch[c].short}`, angle: `${src.angle || ''}\nAdaptação: ${adaptNote({ format: f }, c)}` })); });
    UI.repSel = {}; closeDrawer(); commit(`${keys.length} ${keys.length === 1 ? 'versão criada' : 'versões criadas'} no pipeline (Ideia)`);
  };
  A['series'] = el => { UI.sform = null; openDrawer({ kind: 'series', id: el.dataset.id, fromIdea: false }); };
  A['series-idea'] = el => { UI.sform = null; openDrawer({ kind: 'series', id: el.dataset.id, fromIdea: true }); };
  A['series-create'] = el => {
    const fromIdea = !!el.dataset.fromIdea; const src = fromIdea ? getIdea(el.dataset.id) : getItem(el.dataset.id); const f = UI.sform;
    const base = fromIdea ? itemFromIdea(src) : src;
    for (let k = 0; k < f.n; k++) S.items.push(Object.assign(clone(base), { id: uid('c'), ideaId: fromIdea ? src.id : base.ideaId, series: f.series, date: addDays(f.start, k * f.every), status: 'priorizado', metrics: null, demo: false, review: null, brief: {}, title: `${M.series[f.series].name} #${k + 1}: ${src.title}` }));
    UI.sform = null; closeDrawer(); commit(`${f.n} episódios agendados`);
  };
  A['prod-pick'] = el => { UI.prodId = el.dataset.id; UI.prodStep = 0; render(); };
  A['prod-step'] = el => { UI.prodStep = Number(el.dataset.v); render(); };
  A['brief-set'] = el => { const it = getItem(UI.prodId); it.brief = it.brief || {}; it.brief[el.dataset.k] = el.dataset.v; if (el.dataset.k === 'framework') it.framework = el.dataset.v; if (el.dataset.k === 'format') it.format = el.dataset.v; if (el.dataset.k === 'angle') it.angle = el.dataset.v; commit(); };
  A['brief-level'] = el => { const it = getItem(UI.prodId); it.brief.level = el.dataset.v; commit(); };
  A['copy-brief'] = el => copyText(briefText(getItem(el.dataset.id)), 'Briefing copiado');
  A['advance'] = el => { const it = getItem(el.dataset.id); it.status = STATUS_ORDER[statusIdx(it.status) + 1]; commit(`Status: ${M.status[it.status].name}`); };
  A['radar-filter'] = el => { UI.radarFilter = el.dataset.v; render(); };
  A['radar-eval'] = el => { UI.confirm = null; openDrawer({ kind: 'radar', id: el.dataset.id }); };
  A['radar-score'] = el => { const n = S.radar.find(x => x.id === el.dataset.id); n.scores[el.dataset.k] = Number(el.dataset.v); commit(); };
  A['radar-convert'] = el => { UI.cform = null; openDrawer({ kind: 'convert', id: el.dataset.id }); };
  A['convert-save'] = el => {
    const f = UI.cform; const n = S.radar.find(x => x.id === el.dataset.id);
    const th = M.pillar[f.pillar].themes[0];
    const idea = { id: uid('k'), pillar: f.pillar, theme: th.id, sub: th.subs[0], title: f.title, angle: f.angle, audience: f.audience, profiles: ['todos'], problem: f.title, assoc: f.assoc, objective: M.stage[f.stage] && f.stage === 'descoberta' ? 'audiencia' : f.stage === 'consideracao' ? 'autoridade' : 'educacao', stage: f.stage, format: f.format, channel: f.channel, type: f.type, framework: f.framework, priority: radarClass(n).prio === 'alta' ? 3 : 2, src: `${n.source}${n.url ? ' — ' + n.url : ''}`, ex: false, note: n.simulated ? 'Origem em exemplo simulado: não publicar como fato.' : '' };
    S.ideas.unshift(idea); n.status = 'convertido'; n.ideaId = idea.id;
    let msg = 'Pauta criada na biblioteca';
    if (f.schedule) { const it = scheduleIdea(idea.id, f.date, f.channel); msg = `Pauta criada e agendada para ${fmtDL(it.date)}`; }
    UI.cform = null; closeDrawer(); commit(msg);
  };
  A['radar-new'] = () => { UI.rform = null; openDrawer({ kind: 'radarnew' }); };
  A['radar-save'] = () => { const f = UI.rform; const n = Object.assign({ id: uid('n'), pillar: 'p5', notes: '', status: 'novo', scores: { relevancia: 2, conexao: 2, interesse: 2, atualidade: 2, credibilidade: 2, analise: 1, associacao: 1, canal: 2, duradouro: 1 } }, clone(f)); S.radar.unshift(n); UI.rform = null; openDrawer({ kind: 'radar', id: n.id }); commit('Fonte cadastrada. Ajuste os critérios.'); };
  A['radar-del'] = el => { UI.confirm = 'delr-' + el.dataset.id; renderDrawer(); };
  A['radar-del-yes'] = el => { S.radar = S.radar.filter(x => x.id !== el.dataset.id); closeDrawer(); commit('Fonte excluída'); };
  A['perf-mode'] = el => { S.perfMode = el.dataset.v; commit(); };
  A['perf-sort'] = el => { UI.perfSort = el.dataset.v; render(); };
  A['tab'] = (el, ev) => { UI.tabs[el.dataset.tabKey] = el.dataset.v; if (el.tagName === 'A') { ev.preventDefault(); location.hash = el.dataset.tabKey; } render(); };
  A['toggle-pillar'] = el => { UI.open[el.dataset.v] = !UI.open[el.dataset.v]; render(); };
  const toLib = (patch, q) => { Object.keys(S.filters).forEach(k => { S.filters[k] = ''; }); Object.assign(S.filters, patch); UI.libQuery = q || ''; UI.libScope = 'all'; save(); if (location.hash === '#biblioteca') render(); else location.hash = 'biblioteca'; };
  A['lib-search'] = el => toLib({}, el.dataset.v);
  A['lib-pillar'] = el => toLib({ pillar: el.dataset.v });
  A['lib-audience'] = (el, ev) => { ev.preventDefault(); toLib({ audience: el.dataset.v }); };
  A['lib-assoc'] = (el, ev) => { ev.preventDefault(); toLib({}); UI.assocFilter = el.dataset.v; render(); };
  A['lib-scope'] = el => { UI.libScope = el.dataset.v; render(); };
  A['lib-sort'] = el => { UI.libSort = el.dataset.v; render(); };
  A['preset'] = el => { S.targets = clone(E.targetPresets.find(p => p.id === el.dataset.v).t); S.useTargets = true; commit('Metas aplicadas'); };
  A['toggle-targets'] = el => { S.useTargets = el.checked; commit(); };
  A['export'] = () => { const ta = document.getElementById('json-io'); const json = JSON.stringify(S); ta.value = json; copyText(json, 'JSON copiado'); };
  A['import'] = () => { const ta = document.getElementById('json-io'); try { const s = JSON.parse(ta.value); if (!s || s.v !== 1 || !Array.isArray(s.items)) throw new Error(); S = s; commit('Planejamento importado'); } catch (e) { toast('JSON inválido. Cole o conteúdo exportado por esta ferramenta.'); } };
  A['reset'] = () => { UI.confirm = 'reset'; render(); };
  A['reset-no'] = () => { UI.confirm = null; render(); };
  A['reset-yes'] = () => { S = seed(); UI.confirm = null; commit('Dados iniciais restaurados'); };
  E.associations.forEach(a => {
    A['assoc-prio-' + a.id] = el => {
      const from = S.assocPriority[a.id]; const to = el.dataset.v; if (from === to) return;
      S.assocPriority[a.id] = to; logAssocChange(a.id, `prioridade ${PRIO_N[from]} → ${PRIO_N[to]}`); commit('Prioridade alterada. Veja o impacto.');
    };
  });
  function logAssocChange(aid, what) {
    const at = new Date().toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    S.changeLog.push({ assoc: aid, what, at });
    S.items.forEach(it => { if (it.assoc === aid && ['aprovado', 'agendado'].includes(it.status)) it.review = `A associação "${M.assoc[aid].name}" mudou (${what}) depois da aprovação.`; });
  }

  function copyText(text, msg) {
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(msg); } catch (e) { toast('Selecione e copie manualmente.'); } ta.remove(); };
    try { navigator.clipboard.writeText(text).then(() => toast(msg), fallback); } catch (e) { fallback(); }
  }

  /* ================================================================ */
  /* Ligação de campos                                                 */
  /* ================================================================ */
  function setPath(obj, path, val) { const ks = path.split('.'); let o = obj; ks.slice(0, -1).forEach(k => { o[k] = o[k] || {}; o = o[k]; }); o[ks[ks.length - 1]] = val; }
  function onBind(el) {
    const [scope, id, ...rest] = el.dataset.bind.split(':');
    let val = el.type === 'checkbox' ? el.checked : el.value;
    if (el.hasAttribute('data-num')) val = Number(val);
    if (scope === 'item') {
      const it = getItem(id); const field = rest.join(':');
      const prev = it[field];
      if (field === 'date') val = val || null;
      it[field] = val;
      if (field === 'channel') it.format = adaptFormat(it.format, val);
      if (field === 'pillar' && THEMES[it.theme].pillar !== val) it.theme = M.pillar[val].themes[0].id;
      if (field === 'status' && val === 'publicado' && !it.date) it.date = TODAY;
      save(); render(); if (el.hasAttribute('data-rerender')) renderDrawer();
      if (field === 'stage' && prev !== val) toast('Etapa alterada: distribuição recalculada');
      return;
    }
    if (scope === 'idea') {
      const i = getIdea(id); const field = rest.join(':'); i[field] = val;
      if (field === 'channel') i.format = adaptFormat(i.format, val);
      if (field === 'pillar' && THEMES[i.theme].pillar !== val) { i.theme = M.pillar[val].themes[0].id; i.sub = M.pillar[val].themes[0].subs[0]; }
      save(); render(); if (el.hasAttribute('data-rerender')) renderDrawer(); return;
    }
    if (scope === 'brief') { const it = getItem(id); it.brief = it.brief || {}; setPath(it.brief, rest.join(':'), val); save(); const pre = document.getElementById('brief-text'); if (pre) pre.textContent = briefText(it); return; }
    if (scope === 'radar') { const n = S.radar.find(x => x.id === id); n[rest.join(':')] = val; save(); render(); return; }
    if (scope === 'assocmsg') { if (S.assocMsg[id] !== val) { S.assocMsg[id] = val; logAssocChange(id, 'mensagem central reescrita'); commit('Mensagem atualizada. Aprovados marcados para revisão.'); } return; }
    const forms = { form: 'form', sform: 'sform', cform: 'cform', rform: 'rform' };
    if (forms[scope]) {
      const field = [id].concat(rest).join(':'); UI[forms[scope]][field] = val;
      if (el.hasAttribute('data-rerender') || el.type === 'checkbox' || el.tagName === 'SELECT') renderDrawer();
      else if (scope === 'sform' && field === 'n') { const btn = document.querySelector('[data-act="series-create"]'); if (btn) btn.textContent = `Criar ${val} episódios`; }
    }
  }

  /* ================================================================ */
  /* Render + roteamento                                               */
  /* ================================================================ */
  const NAV = [
    ['Planejar', [['painel', 'Painel', 'M3 13h4v8H3zM10 3h4v18h-4zM17 9h4v12h-4z'], ['calendario', 'Calendário', 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4'], ['biblioteca', 'Biblioteca de pautas', 'M5 4h4v16H5zM11 4h4v16h-4zM17 5l3 1-3 14-3-1z'], ['producao', 'Produção', 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4'], ['radar', 'Radar de pautas', 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M12 12l6-6']]],
    ['Estratégia', [['estrategia', 'Posicionamento', 'M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z'], ['publicos', 'Públicos', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 20c0-2.5-1.5-4-4-4.5'], ['pilares', 'Pilares e temas', 'M4 20V10M10 20V4M16 20v-7M22 20H2']]],
    ['Medir', [['desempenho', 'Desempenho', 'M3 17l6-6 4 4 8-8M15 7h6v6']]],
    ['Base', [['referencias', 'Referências', 'M4 4h11l5 5v11H4zM14 4v6h6'], ['ajustes', 'Ajustes', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z']]]
  ];
  function route() { const h = (location.hash || '').replace('#', ''); return views[h] ? h : 'painel'; }
  function renderNav() {
    const cur = route();
    const newRadar = S.radar.filter(n => n.status === 'novo' && radarClass(n).cls !== 'descartar').length;
    const reviews = S.items.filter(i => i.review).length;
    const badge = id => id === 'radar' && newRadar ? `<span class="badge">${newRadar}</span>` : id === 'calendario' && reviews ? `<span class="badge" title="Conteúdos para revisar">${reviews}</span>` : '';
    document.getElementById('nav').innerHTML = NAV.map(([g, items]) => `<div class="nav-group">${g}</div>${items.map(([id, l, d]) => `<a href="#${id}" class="${id === cur ? 'on' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>${l}${badge(id)}</a>`).join('')}`).join('');
    document.getElementById('topbar').innerHTML = NAV.flatMap(([, items]) => items).map(([id, l]) => `<a href="#${id}" class="${id === cur ? 'on' : ''}">${l}</a>`).join('');
  }
  function render() {
    // filtro auxiliar por associação vindo de outras páginas (biblioteca)
    const view = document.getElementById('view');
    let html = views[route()]();
    if (route() === 'biblioteca' && UI.assocFilter) {
      html = html.replace('<div class="lib">', `<div class="notice spread"><span>Mostrando pautas que reforçam <b>${esc(M.assoc[UI.assocFilter].name)}</b>.</span><button class="btn sm" data-act="clear-assoc">Mostrar todas</button></div><div class="lib">`);
    }
    view.innerHTML = `<div class="wrap">${html}</div>`;
    if (route() === 'biblioteca' && UI.assocFilter) view.querySelectorAll('.idea').forEach(card => { const id = card.querySelector('[data-id]').dataset.id; if (getIdea(id).assoc !== UI.assocFilter) card.hidden = true; });
    renderNav();
    const lay = document.getElementById('cal-layout'); if (lay && window.innerWidth < 1180) lay.style.gridTemplateColumns = 'minmax(0,1fr)';
    const pl = document.getElementById('prod-layout'); if (pl && window.innerWidth < 900) pl.style.gridTemplateColumns = 'minmax(0,1fr)';
  }
  A['clear-assoc'] = () => { UI.assocFilter = null; render(); };

  /* Eventos delegados */
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]'); if (!el) return;
    if (el.type === 'checkbox') return;
    const fn = A[el.dataset.act]; if (!fn) return;
    fn(el, ev);
  });
  document.addEventListener('change', ev => {
    const el = ev.target;
    if (el.dataset.filter) { S.filters[el.dataset.filter] = el.value; commit(); return; }
    if (el.dataset.period) { S.period[el.dataset.period] = el.value; if (S.period.from > S.period.to) S.period.to = S.period.from; commit(); return; }
    if (el.dataset.target) { S.targets[el.dataset.target] = Math.max(0, Math.min(100, Number(el.value) || 0)); commit(); return; }
    if (el.hasAttribute('data-tol')) { S.tolerance = Math.max(0, Number(el.value) || 0); commit(); return; }
    if (el.dataset.cad) { const c = el.dataset.cad; const v = Number(el.dataset.v); const set = new Set(S.cadence[c]); el.checked ? set.add(v) : set.delete(v); S.cadence[c] = Array.from(set).sort(); commit(); return; }
    if (el.hasAttribute('data-owners')) { S.owners = el.value.split(',').map(x => x.trim()).filter(Boolean); commit(); return; }
    if (el.dataset.metric) { const [id, k] = el.dataset.metric.split(':'); const it = getItem(id); it.metrics = it.metrics || { alcance: 0, visualizacoes: 0, naoSeguidores: 0, visitasPerfil: 0, novosSeguidores: 0, salvamentos: 0, compartilhamentos: 0, comentarios: 0, cliques: 0, leads: 0, conversas: 0 }; it.metrics[k] = Number(el.value) || 0; it.demo = false; commit(); return; }
    if (el.dataset.act === 'toggle-targets') { A['toggle-targets'](el); return; }
    if (el.dataset.bind) onBind(el);
  });
  document.addEventListener('input', ev => {
    const el = ev.target;
    if (el.id === 'lib-q') { UI.libQuery = el.value; const pos = el.selectionStart; render(); const n = document.getElementById('lib-q'); n.focus(); n.setSelectionRange(pos, pos); }
    if (el.id === 'pick-q') { UI.pickQ = el.value; const pos = el.selectionStart; renderDrawer(); const n = document.getElementById('pick-q'); n.focus(); n.setSelectionRange(pos, pos); }
    if (el.dataset.bind && el.dataset.bind.startsWith('rform:title')) { UI.rform.title = el.value; const btn = document.querySelector('[data-act="radar-save"]'); if (btn) btn.disabled = !el.value.trim(); }
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && UI.drawer) closeDrawer(); });

  /* Arrastar e soltar */
  let dragId = null;
  document.addEventListener('dragstart', ev => { const el = ev.target.closest && ev.target.closest('[data-drag]'); if (!el) return; dragId = el.dataset.drag; el.classList.add('dragging'); try { ev.dataTransfer.setData('text/plain', dragId); ev.dataTransfer.effectAllowed = 'move'; } catch (e) { /* */ } });
  document.addEventListener('dragend', ev => { const el = ev.target.closest && ev.target.closest('[data-drag]'); if (el) el.classList.remove('dragging'); document.querySelectorAll('.drop').forEach(x => x.classList.remove('drop')); });
  document.addEventListener('dragover', ev => { const z = ev.target.closest && ev.target.closest('[data-drop-date],[data-drop-status]'); if (!z || !dragId) return; ev.preventDefault(); document.querySelectorAll('.drop').forEach(x => x !== z && x.classList.remove('drop')); z.classList.add('drop'); });
  document.addEventListener('drop', ev => {
    const z = ev.target.closest && ev.target.closest('[data-drop-date],[data-drop-status]'); if (!z || !dragId) return; ev.preventDefault();
    const it = getItem(dragId); dragId = null; if (!it) return;
    if (z.dataset.dropDate) { if (it.date === z.dataset.dropDate) return render(); it.date = z.dataset.dropDate; if (it.status === 'ideia') it.status = 'priorizado'; commit(`Reagendado para ${fmtDL(it.date)}`); }
    else { const st = z.dataset.dropStatus; if (it.status === st) return render(); it.status = st; if (st === 'publicado' && !it.date) it.date = TODAY; commit(`Status: ${M.status[st].name}`); }
  });

  window.addEventListener('hashchange', () => { closeDrawer(); if (route() !== 'biblioteca') UI.assocFilter = null; render(); window.scrollTo(0, 0); });
  window.addEventListener('resize', () => { clearTimeout(window.__rz); window.__rz = setTimeout(render, 150); });
  render();
  window.__elevah = { S: () => S, recommendations, dist, planned, getPeriod, needed };
})();
