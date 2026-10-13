import { generate, clueText, DIFFICULTIES } from './generator.js?v=7';
import { OBJECTS } from './data.js?v=7';
import { SCENARIOS, SCENARIO_IDS } from './scenarios.js?v=7';

/* ============================================================
   Utilidades
   ============================================================ */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const COLS = 'ABCDEFG';
const coord = (c, n) => `${COLS[c % n]}${Math.floor(c / n) + 1}`;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const store = {
  get(k, d) { try { const v = localStorage.getItem('murdokus:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('murdokus:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
  del(k) { try { localStorage.removeItem('murdokus:' + k); } catch { /* sin almacenamiento */ } },
};

const dateStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// Lunes y martes fácil, de miércoles a viernes medio, fin de semana difícil.
const dailyDiff = (d = new Date()) => ['dificil', 'facil', 'facil', 'medio', 'medio', 'medio', 'dificil'][d.getDay()];
const caseNumber = (d = new Date()) => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(2026, 0, 1)) / 86400000) + 1;
const niceDate = (d = new Date()) => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
const randomCode = () => Array.from({ length: 5 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('');
const dots = (d) => ({ facil: '●○○', medio: '●●○', dificil: '●●●' }[d]);

function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toast.h);
  toast.h = setTimeout(() => t.classList.remove('show'), ms);
}

/* ============================================================
   Estado
   ============================================================ */
let G = null;          // partida en curso
let selected = null;   // índice de persona elegida
let undoStack = [];
let tick = null;
let lastFullKey = '';

function blankState(n) {
  return { pos: new Array(n).fill(-1), marks: [], elapsed: 0, hints: 0, mistakes: 0, hinted: [], solved: false, accused: [] };
}

function save() {
  if (!G) return;
  const { pos, marks, elapsed, hints, mistakes, hinted, solved, accused } = G;
  const state = { pos, marks, elapsed, hints, mistakes, hinted, solved, accused };
  if (G.mode === 'daily') store.set('daily:' + G.date, state);
  else store.set('free', { code: G.code, diff: G.puz.diff, scen: G.puz.scenario, state });
}

/* ============================================================
   Inicio
   ============================================================ */
function renderHome() {
  const today = new Date();
  const date = dateStr(today);
  const diff = dailyDiff(today);
  const st = store.get('daily:' + date, null);
  const streak = computeStreak();
  const cfg = DIFFICULTIES[diff];
  const scen = SCENARIOS[generate('daily-' + date, diff).scenario];
  let action = 'Abrir el caso';
  let status = '';
  if (st?.solved) {
    status = `<span class="stamp solved">Resuelto</span>`;
    action = 'Ver el caso';
  } else if (st && (st.pos.some((c) => c >= 0) || st.elapsed > 5)) action = 'Continuar investigación';

  $('#dailyCard').innerHTML = `
    <div class="folder-tab">Caso del día</div>
    ${status}
    <h2 class="folder-title">Expediente nº ${String(caseNumber(today)).padStart(3, '0')}</h2>
    <div class="daily-meta">
      <span>📅 <b>${niceDate(today)}</b></span>
      <span>Escenario: <b>${scen.emoji} ${scen.name}</b></span>
      <span>Dificultad: <b>${cfg.label} ${cfg.n}×${cfg.n}</b></span>
      <span>Racha: <b>${streak} ${streak === 1 ? 'día' : 'días'}</b></span>
    </div>
    <div class="daily-row">
      <button class="btn btn-red" id="btnDaily">${action}</button>
      ${st?.solved ? `<span class="countdown">Resuelto en <b>${fmt(st.elapsed)}</b> · Siguiente caso en <b id="countdown"></b></span>` : `<span class="countdown">El mismo caso para todos los detectives, hoy.</span>`}
    </div>`;
  $('#btnDaily').onclick = () => startDaily();
  updateCountdown();

  $('#diffGrid').innerHTML = Object.entries(DIFFICULTIES).map(([k, c]) => `
    <button class="diff-btn" data-diff="${k}">
      <span class="d-name">${c.label}</span>
      <span class="d-size">${c.n}×${c.n}<span class="d-sus"> · ${c.n - 1} sospechosos</span></span>
      <span class="d-dots">${dots(k)}</span>
    </button>`).join('');
  $('#diffGrid').querySelectorAll('.diff-btn').forEach((b) => (b.onclick = () => startFree(b.dataset.diff, null, pickScenario())));

  const pref = store.get('scen', 'random');
  $('#scenGrid').innerHTML = [['random', '🎲', 'Al azar'], ...SCENARIO_IDS.map((id) => [id, SCENARIOS[id].emoji, SCENARIOS[id].name])]
    .map(([id, e, name]) => `<button class="scen-chip${id === pref ? ' on' : ''}" data-s="${id}" aria-pressed="${id === pref}"><span class="s-e">${e}</span><span class="s-n">${esc(name)}</span></button>`).join('');
  $('#scenGrid').querySelectorAll('.scen-chip').forEach((b) => (b.onclick = () => {
    store.set('scen', b.dataset.s);
    $('#scenGrid').querySelectorAll('.scen-chip').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  }));

  const free = store.get('free', null);
  $('#resumeFree').innerHTML = free && !free.state.solved
    ? `<div class="resume"><span>${SCENARIOS[free.scen]?.emoji || ''} Caso abierto <b>#${esc(free.code)}</b> · ${DIFFICULTIES[free.diff].label} · ${fmt(free.state.elapsed)}</span><button class="btn btn-paper btn-sm" id="btnResume">Continuar</button></div>`
    : '';
  if ($('#btnResume')) $('#btnResume').onclick = () => startFree(free.diff, free.code, free.scen);
}

function pickScenario() {
  const pref = store.get('scen', 'random');
  return SCENARIOS[pref] ? pref : SCENARIO_IDS[Math.floor(Math.random() * SCENARIO_IDS.length)];
}

function updateCountdown() {
  const el = $('#countdown');
  if (!el) return;
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const s = Math.floor((next - now) / 1000);
  el.textContent = `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`;
}

function computeStreak() {
  const d = new Date();
  if (!store.get('daily:' + dateStr(d), null)?.solved) d.setDate(d.getDate() - 1);
  let n = 0;
  while (store.get('daily:' + dateStr(d), null)?.solved) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function showScreen(id) {
  $('#home').hidden = id !== 'home';
  $('#game').hidden = id !== 'game';
  window.scrollTo(0, 0);
}

function goHome() {
  stopTimer();
  G = null;
  selected = null;
  history.replaceState(null, '', location.pathname);
  renderHome();
  showScreen('home');
}

/* ============================================================
   Abrir partidas
   ============================================================ */
function startDaily() {
  const today = new Date();
  const date = dateStr(today);
  const diff = dailyDiff(today);
  const puz = generate('daily-' + date, diff);
  const saved = store.get('daily:' + date, null);
  openGame({ puz, mode: 'daily', date, num: caseNumber(today), ...(saved || blankState(puz.n)) });
}

function startFree(diff, code, scen) {
  const saved = store.get('free', null);
  if (!code) code = randomCode();
  if (!SCENARIOS[scen]) scen = pickScenario();
  const puz = generate('free-' + code, diff, scen);
  const state = saved && saved.code === code && saved.diff === diff && saved.scen === scen ? saved.state : blankState(puz.n);
  openGame({ puz, mode: 'free', code, ...state });
  history.replaceState(null, '', freeLink());
}

function freeLink() {
  return `${location.pathname}?caso=${G.code}&d=${G.puz.diff}&e=${G.puz.scenario}`;
}

function openGame(game) {
  G = game;
  selected = null;
  undoStack = [];
  lastFullKey = G.pos.join(',');
  const { puz } = G;
  const cfg = DIFFICULTIES[puz.diff];
  const V = puz.people[puz.victim];

  const scen = SCENARIOS[puz.scenario];
  $('#caseKicker').textContent = `${G.mode === 'daily' ? 'Caso del día' : 'Modo ilimitado'} · ${scen.emoji} ${scen.name} · ${cfg.label} ${cfg.n}×${cfg.n}`;
  $('#caseTitle').textContent = G.mode === 'daily' ? `Expediente nº ${String(G.num).padStart(3, '0')}` : `Expediente #${G.code}`;
  $('#story').innerHTML = `${esc(V.short)}, ${esc(V.role)}, fue ${V.f ? 'hallada' : 'hallado'} sin vida en ${esc(puz.place)}. ` +
    `Hay ${puz.n - 1} sospechosos y una sola verdad: el asesino estaba a solas con su víctima.`;

  if (!G.solved) syncVictim();
  buildBoard();
  renderAll();
  $('#stampBig').hidden = !G.solved;
  showScreen('game');
  startTimer();
}

/* ============================================================
   Tablero
   ============================================================ */
let boardEl = null;
let resizeObs = null;

function buildBoard() {
  const { puz } = G;
  const n = puz.n;
  const frame = $('#boardFrame');
  frame.style.setProperty('--n', n);
  const scen = SCENARIOS[puz.scenario];
  frame.className = `board-frame floor-${scen.floor}`;
  scen.palette.forEach((col, i) => frame.style.setProperty(`--r${i}`, col));

  const labelCells = new Set();
  puz.roomTypes.forEach((_, id) => {
    const first = puz.rooms.findIndex((r) => r === id);
    labelCells.add(first);
  });

  let cells = '';
  for (let c = 0; c < n * n; c++) {
    const r = Math.floor(c / n), k = c % n, rm = puz.rooms[c];
    const o = puz.objs[c] ? OBJECTS[puz.objs[c]] : null;
    const cls = [`cell`, `room-${rm % 6}`];
    if (r > 0 && puz.rooms[c - n] !== rm) cls.push('wt');
    if (r < n - 1 && puz.rooms[c + n] !== rm) cls.push('wb');
    if (k > 0 && puz.rooms[c - 1] !== rm) cls.push('wl');
    if (k < n - 1 && puz.rooms[c + 1] !== rm) cls.push('wr');
    if (o?.block) cls.push('blocked');
    else if (o?.rug) cls.push('rug');
    else if (o) cls.push('seat');
    cells += `<button class="${cls.join(' ')}" data-c="${c}" aria-label="${coord(c, n)}">` +
      (labelCells.has(c) ? `<span class="lbl">${esc(puz.roomTypes[rm].name)}</span>` : '') +
      (o?.emoji ? `<span class="obj">${o.emoji}</span>` : '') +
      `<span class="mark"></span><span class="ghost"></span><span class="tok"></span></button>`;
  }

  frame.innerHTML = `
    <div class="compass" title="Norte arriba">N↑</div>
    <div class="coords-top">${Array.from({ length: n }, (_, i) => `<span class="coord">${COLS[i]}</span>`).join('')}</div>
    <div class="coords-left">${Array.from({ length: n }, (_, i) => `<span class="coord">${i + 1}</span>`).join('')}</div>
    <div class="board" id="board">${cells}</div>`;
  boardEl = $('#board');

  boardEl.addEventListener('click', (e) => {
    const b = e.target.closest('.cell');
    if (b) onCell(Number(b.dataset.c));
  });
  boardEl.addEventListener('mouseover', (e) => {
    const b = e.target.closest('.cell');
    if (b) describeCell(Number(b.dataset.c));
  });

  resizeObs?.disconnect();
  resizeObs = new ResizeObserver(() => boardEl.style.setProperty('--cs', `${boardEl.clientWidth / n}px`));
  resizeObs.observe(boardEl);
}

function describeCell(c) {
  const { puz } = G;
  const o = puz.objs[c] ? OBJECTS[puz.objs[c]] : null;
  const who = G.pos.indexOf(c);
  let txt = `<b>${coord(c, puz.n)}</b> · ${esc(puz.roomTypes[puz.rooms[c]].name)}`;
  if (o) txt += ` · ${o.emoji || '▦'} ${o.name} ${o.block ? '<i>(no se puede ocupar)</i>' : '<i>(se puede ocupar)</i>'}`;
  else txt += ' · suelo libre';
  if (who >= 0) txt += ` · ${puz.people[who].emoji} ${esc(puz.people[who].short)}`;
  $('#cellInfo').innerHTML = txt;
}

function renderAll() {
  renderBoard();
  renderTray();
  renderDossier();
}

function renderBoard() {
  const { puz } = G;
  const n = puz.n;
  const conflicts = new Set();
  const placed = G.pos.map((c, p) => [p, c]).filter(([, c]) => c >= 0);
  for (const [p, c] of placed) for (const [q, d] of placed) {
    if (p !== q && (Math.floor(c / n) === Math.floor(d / n) || c % n === d % n)) conflicts.add(c);
  }
  const takenRows = new Set(), takenCols = new Set();
  for (const [p, c] of placed) if (p !== selected) { takenRows.add(Math.floor(c / n)); takenCols.add(c % n); }

  boardEl.classList.toggle('has-sel', selected !== null && !G.solved);
  boardEl.querySelectorAll('.cell').forEach((el) => {
    const c = Number(el.dataset.c);
    const who = G.pos.indexOf(c);
    const tok = el.querySelector('.tok');
    const newTok = who >= 0 ? puz.people[who].emoji : '';
    if (tok.textContent !== newTok) tok.textContent = newTok;
    el.querySelector('.ghost').textContent = selected !== null && who < 0 ? puz.people[selected].emoji : '';
    el.querySelector('.mark').textContent = who < 0 && G.marks.includes(c) ? '✕' : '';
    el.classList.toggle('occ', who >= 0);
    el.classList.toggle('victim', who === puz.victim);
    el.classList.toggle('conflict', conflicts.has(c) && !G.solved);
    el.classList.toggle('sel-cell', who >= 0 && who === selected);
    el.classList.toggle('hinted', who >= 0 && G.hinted.includes(who));
    el.classList.toggle('taken', selected !== null && (takenRows.has(Math.floor(c / n)) || takenCols.has(c % n)));
    el.setAttribute('aria-label', `${coord(c, n)}${who >= 0 ? ', ' + puz.people[who].short : ''}`);
  });
}

function renderTray() {
  const { puz } = G;
  const order = trayOrder();
  $('#tray').innerHTML = order.map((p) => {
    const pe = puz.people[p];
    const c = G.pos[p];
    return `<button class="token${p === puz.victim ? ' victim' : ''}${c >= 0 ? ' placed' : ''}${p === selected ? ' sel' : ''}" data-p="${p}" title="${esc(pe.short)}">
      ${c >= 0 ? `<span class="t-pos">${coord(c, puz.n)}</span>` : ''}
      <span class="t-face">${pe.emoji}</span><span class="t-name">${esc(pe.short)}</span></button>`;
  }).join('');
  $('#tray').querySelectorAll('.token').forEach((b) => (b.onclick = () => selectPerson(Number(b.dataset.p))));
}

function suspects() {
  const { puz } = G;
  return [...Array(puz.n).keys()].filter((p) => p !== puz.victim);
}

function trayOrder() {
  return [G.puz.victim, ...suspects()];
}

function renderDossier() {
  const { puz } = G;
  const cards = trayOrder().map((p) => {
    const pe = puz.people[p];
    const clues = p === puz.victim
      ? `<li class="none">No puede declarar. Aparecerá sola en la única casilla libre cuando hayas situado a todos los sospechosos.</li>`
      : puz.clues.filter((cl) => cl.p === p).map((cl) => `<li>${esc(clueText(cl, puz))}</li>`).join('') || `<li class="none">No ha querido declarar.</li>`;
    const c = G.pos[p];
    return `<div class="card${p === puz.victim ? ' victim' : ''}${p === selected ? ' sel' : ''}" data-p="${p}" role="button" tabindex="0">
      <div class="mug">${pe.emoji}</div>
      <div>
        <p class="c-name">${esc(pe.short)}${c >= 0 ? ` <span class="c-pos">📍 ${coord(c, puz.n)}</span>` : ''}</p>
        <p class="c-role">${esc(pe.role)}</p>
        <ul class="c-clues">${clues}</ul>
      </div>
      ${p === puz.victim ? '<span class="stamp">Víctima</span>' : ''}
    </div>`;
  }).join('');
  $('#dossier').innerHTML = `
    <p class="rule-box"><b>Regla de oro:</b> una persona por fila y por columna. La víctima ocupa la única casilla que queda libre, y estaba a solas con su asesino: en su habitación había exactamente dos personas.</p>
    <div class="cards">${cards}</div>`;
  $('#dossier').querySelectorAll('.card').forEach((el) => {
    el.onclick = () => selectPerson(Number(el.dataset.p));
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPerson(Number(el.dataset.p)); } };
  });
}

/* ============================================================
   Interacción
   ============================================================ */
function selectPerson(p) {
  if (G.solved) return;
  if (p === G.puz.victim) {
    toast('La víctima no se sitúa a mano: aparecerá sola en la única casilla libre cuando hayas colocado a todos los sospechosos.', 3600);
    return;
  }
  selected = selected === p ? null : p;
  const pe = G.puz.people[p];
  if (selected !== null) {
    const clues = G.puz.clues.filter((cl) => cl.p === p).map((cl) => `<li>${esc(clueText(cl, G.puz))}</li>`).join('');
    $('#cellInfo').innerHTML = `<span class="ac-head">${pe.emoji} <b>${esc(pe.short)}</b> · toca una casilla` +
      (G.pos[p] >= 0 ? ' (su casilla actual lo retira)' : '') + `</span>` +
      (clues ? `<ul class="ac-clues">${clues}</ul>` : '');
  } else {
    $('#cellInfo').innerHTML = 'Elige un sospechoso y toca una casilla para situarlo. Sin nadie elegido, tocar una casilla la tacha.';
  }
  renderAll();
}

function pushUndo() {
  undoStack.push({ pos: G.pos.slice(), marks: G.marks.slice() });
  if (undoStack.length > 200) undoStack.shift();
}

function onCell(c) {
  if (!G || G.solved) return;
  const { puz } = G;
  const o = puz.objs[c] ? OBJECTS[puz.objs[c]] : null;
  const who = G.pos.indexOf(c);
  describeCell(c);

  if (selected !== null) {
    if (o?.block) {
      flash(c);
      $('#cellInfo').innerHTML = `Nadie puede estar sobre ${o.un} ${o.emoji}.`;
      return;
    }
    pushUndo();
    if (who === selected) {
      G.pos[selected] = -1;
    } else {
      if (who >= 0) G.pos[who] = -1;
      G.pos[selected] = c;
      G.marks = G.marks.filter((m) => m !== c);
      selected = null;
    }
    afterChange();
    return;
  }

  if (who >= 0) { selectPerson(who); return; }
  if (o?.block) { flash(c); return; }
  pushUndo();
  G.marks = G.marks.includes(c) ? G.marks.filter((m) => m !== c) : [...G.marks, c];
  afterChange();
}

function flash(c) {
  const el = boardEl.querySelector(`[data-c="${c}"]`);
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

// La víctima no se coloca a mano: aparece en la única fila y columna libres cuando todos los sospechosos están situados.
function syncVictim() {
  const { puz } = G;
  const n = puz.n, V = puz.victim;
  G.pos[V] = -1;
  const others = G.pos.filter((c, p) => p !== V);
  if (others.some((c) => c < 0)) return null;
  const rows = new Set(others.map((c) => Math.floor(c / n)));
  const cols = new Set(others.map((c) => c % n));
  if (rows.size !== n - 1 || cols.size !== n - 1) return null;
  const r = [...Array(n).keys()].find((i) => !rows.has(i));
  const k = [...Array(n).keys()].find((i) => !cols.has(i));
  const c = r * n + k;
  const o = puz.objs[c] ? OBJECTS[puz.objs[c]] : null;
  if (o?.block) return { blocked: c, o };
  G.pos[V] = c;
  G.marks = G.marks.filter((m) => m !== c);
  return null;
}

function afterChange() {
  const V = G.puz.victim;
  const before = G.pos[V];
  const res = syncVictim();
  renderAll();
  if (G.pos[V] >= 0 && G.pos[V] !== before) {
    boardEl.querySelector(`[data-c="${G.pos[V]}"]`)?.classList.add('reveal');
    $('#cellInfo').innerHTML = `${G.puz.people[V].emoji} La víctima aparece en la única casilla libre: <b>${coord(G.pos[V], G.puz.n)}</b>.`;
  }
  if (res?.blocked != null) {
    flash(res.blocked);
    toast(`🧐 La única casilla libre (${coord(res.blocked, G.puz.n)}) tiene ${res.o.un} ${res.o.emoji}: ahí no puede estar la víctima. Algo no encaja.`, 4200);
  }
  save();
  checkComplete();
}

function checkComplete() {
  if (G.solved || G.pos.some((c) => c < 0)) { lastFullKey = ''; return; }
  const key = G.pos.join(',');
  if (key === lastFullKey) return;
  lastFullKey = key;
  const correct = G.pos.every((c, p) => c === G.puz.solution[p]);
  if (correct) {
    setTimeout(openAccuse, 350);
  } else {
    G.mistakes++;
    save();
    toast('🧐 Las piezas no encajan. Alguna declaración no se cumple: repasa el plano.');
  }
}

function undo() {
  if (!G || G.solved) return;
  const s = undoStack.pop();
  if (!s) { toast('Nada que deshacer.'); return; }
  G.pos = s.pos;
  G.marks = s.marks;
  selected = null;
  syncVictim();
  renderAll();
  save();
}

function hint() {
  if (!G || G.solved) return;
  const { puz } = G;
  const wrong = G.pos.findIndex((c, p) => p !== puz.victim && c >= 0 && c !== puz.solution[p]);
  G.hints++;
  if (wrong >= 0) {
    const pe = puz.people[wrong];
    toast(`🔎 ${pe.emoji} <b>${esc(pe.short)}</b> no estaba en ${coord(G.pos[wrong], puz.n)}. Lo devuelvo a la bandeja.`, 3600);
    pushUndo();
    G.pos[wrong] = -1;
  } else {
    // Revela la posición de una persona que aún no está en el plano.
    const missing = suspects().filter((p) => G.pos[p] < 0);
    if (!missing.length) return;
    const p = missing[Math.floor(Math.random() * missing.length)];
    const c = puz.solution[p];
    pushUndo();
    const occupant = G.pos.indexOf(c);
    if (occupant >= 0) G.pos[occupant] = -1;
    G.pos[p] = c;
    G.marks = G.marks.filter((m) => m !== c);
    G.hinted.push(p);
    const pe = puz.people[p];
    toast(`🔎 Un testigo sitúa a ${pe.emoji} <b>${esc(pe.short)}</b> en ${coord(c, puz.n)}.`, 3600);
    setTimeout(() => boardEl.querySelector(`[data-c="${c}"]`)?.classList.add('reveal'), 0);
  }
  selected = null;
  afterChange();
}

function resetGame() {
  if (!G || G.solved) return;
  modal(`
    <h3>¿Reiniciar el caso?</h3>
    <p>Se retirarán todos los sospechosos y las marcas del plano. El tiempo sigue corriendo.</p>
    <div class="modal-actions">
      <button class="btn btn-red" id="mYes">Reiniciar</button>
      <button class="btn btn-paper" data-close>Cancelar</button>
    </div>`);
  $('#mYes').onclick = () => {
    pushUndo();
    G.pos = new Array(G.puz.n).fill(-1);
    G.marks = [];
    G.hinted = [];
    selected = null;
    closeModal();
    afterChange();
  };
}

/* ============================================================
   Acusación y cierre del caso
   ============================================================ */
function openAccuse() {
  const { puz } = G;
  const suspects = [...Array(puz.n).keys()].filter((p) => p !== puz.victim);
  modal(`
    <h3>Reconstrucción completa</h3>
    <p>Todas las declaraciones encajan. Mira el plano: ¿quién estuvo a solas con ${esc(puz.people[puz.victim].short)}?</p>
    <div class="accuse-grid">${suspects.map((p) => `
      <button class="accuse-btn${G.accused.includes(p) ? ' nope' : ''}" data-p="${p}">
        <span class="a-face">${puz.people[p].emoji}</span><span class="a-name">${esc(puz.people[p].short)}</span>
      </button>`).join('')}
    </div>
    <p class="small" style="margin-top:14px">Señala al culpable.</p>`, { closable: false });
  $('#modalCard').querySelectorAll('.accuse-btn').forEach((b) => (b.onclick = () => accuse(Number(b.dataset.p))));
}

function accuse(p) {
  const { puz } = G;
  if (p !== puz.murderer) {
    G.mistakes++;
    G.accused.push(p);
    save();
    const pe = puz.people[p];
    toast(`❌ ${pe.emoji} ${esc(pe.short)} tiene coartada: no estuvo a solas con la víctima.`);
    openAccuse();
    return;
  }
  G.solved = true;
  selected = null;
  stopTimer();
  save();
  if (G.mode === 'free') recordFree();
  renderAll();
  $('#stampBig').hidden = false;
  closeModal();
  setTimeout(showVerdict, 900);
}

function recordFree() {
  const s = store.get('stats', {});
  const d = (s[G.puz.diff] ||= { solved: 0, best: null, total: 0 });
  d.solved++;
  d.total += G.elapsed;
  if (d.best === null || G.elapsed < d.best) d.best = G.elapsed;
  store.set('stats', s);
}

function verdictText() {
  const { puz } = G;
  const M = puz.people[puz.murderer], V = puz.people[puz.victim];
  const room = puz.roomTypes[puz.rooms[puz.solution[puz.victim]]];
  return `${M.emoji} <b>${esc(M.short)}</b>, ${esc(M.role)}, asesinó a ${esc(V.short)} en ${esc(room.art)} con ${esc(puz.weapon[0])} ${puz.weapon[1]}.`;
}

function showVerdict() {
  const isDaily = G.mode === 'daily';
  modal(`
    <h3>Caso cerrado</h3>
    <div class="verdict">${verdictText()}</div>
    <div class="stats-row">
      <div><b>${fmt(G.elapsed)}</b><small>Tiempo</small></div>
      <div><b>${G.hints}</b><small>Pistas</small></div>
      <div><b>${G.mistakes}</b><small>Errores</small></div>
    </div>
    ${isDaily ? `<p class="small">Racha actual: <b>${computeStreak()}</b> ${computeStreak() === 1 ? 'día' : 'días'}. Mañana habrá un nuevo crimen.</p>` : ''}
    <div class="modal-actions">
      <button class="btn btn-red" id="mShare">📋 Compartir</button>
      ${isDaily ? '' : `<button class="btn btn-paper" id="mNext">Nuevo caso</button>`}
      <button class="btn btn-paper" id="mHome">Archivo</button>
    </div>`);
  $('#mShare').onclick = share;
  $('#mHome').onclick = () => { closeModal(); goHome(); };
  if ($('#mNext')) $('#mNext').onclick = () => { closeModal(); startFree(G.puz.diff, null, pickScenario()); };
}

async function share() {
  const cfg = DIFFICULTIES[G.puz.diff];
  const url = location.origin + location.pathname;
  const head = G.mode === 'daily'
    ? `🔍 MURDOKUS · Expediente nº ${String(G.num).padStart(3, '0')}`
    : `🔍 MURDOKUS · Expediente #${G.code}`;
  const link = G.mode === 'daily' ? url : location.origin + freeLink();
  const scen = SCENARIOS[G.puz.scenario];
  const text = `${head}\n${scen.emoji} ${scen.name} · ${cfg.label} ${cfg.n}×${cfg.n} ${dots(G.puz.diff)}\n⏱️ ${fmt(G.elapsed)} · 🔎 ${G.hints} · ❌ ${G.mistakes}\n${link}`;
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ text });
    else { await navigator.clipboard.writeText(text); toast('Resultado copiado al portapapeles.'); }
  } catch { /* cancelado */ }
}

/* ============================================================
   Temporizador
   ============================================================ */
function startTimer() {
  stopTimer();
  $('#timer').textContent = fmt(G.elapsed);
  tick = setInterval(() => {
    if (!G || G.solved || document.hidden || !$('#modal').hidden) return;
    G.elapsed++;
    $('#timer').textContent = fmt(G.elapsed);
    if (G.elapsed % 5 === 0) save();
  }, 1000);
}
function stopTimer() { clearInterval(tick); tick = null; }

/* ============================================================
   Modales
   ============================================================ */
function modal(html, { closable = true } = {}) {
  const card = $('#modalCard');
  card.innerHTML = (closable ? '<button class="modal-close" data-close aria-label="Cerrar">×</button>' : '') + html;
  $('#modal').hidden = false;
  $('#modal').dataset.closable = closable ? '1' : '';
  card.querySelectorAll('[data-close]').forEach((b) => (b.onclick = closeModal));
}
function closeModal() { $('#modal').hidden = true; }
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && $('#modal').dataset.closable) closeModal(); });

function showHelp() {
  // En partida, solo los muebles de ese escenario; en el archivo, los de la mansión clásica.
  const scen = SCENARIOS[G?.puz.scenario] || SCENARIOS.mansion;
  const used = [...new Set(scen.rooms.flatMap((r) => r.objs))].map((k) => OBJECTS[k]);
  const seats = used.filter((o) => !o.block);
  const blocks = used.filter((o) => o.block);
  const item = (o) => `<span>${o.rug ? '<span class="rugsw"></span>' : o.emoji} ${o.name}</span>`;
  modal(`
    <h3>Cómo se juega</h3>
    <ol class="rules">
      <li>Cada caso es un plano dividido en habitaciones. Debes situar a <b>todos los sospechosos</b> según sus declaraciones.</li>
      <li>Hay <b>exactamente una persona por fila y una por columna</b>.</li>
      <li>Cada declaración es verdad. <i>«Junto a»</i> significa en una casilla contigua horizontal o vertical (no en diagonal) y <b>sin pared en medio</b>: las dos casillas tienen que estar en la misma habitación.</li>
      <li><i>«Más al norte»</i> significa en una fila superior del plano; <i>«más al oeste»</i>, en una columna más a la izquierda.</li>
      <li>La víctima <b>no declara</b>: cuando sitúes a todos los sospechosos, aparecerá sola en la única casilla que quede libre.</li>
      <li>La víctima estaba <b>a solas con su asesino</b>: en su habitación había exactamente dos personas. Cuando lo tengas todo, señala al culpable.</li>
    </ol>
    <p><b>${`Muebles ${G ? `de ${scen.name.toLowerCase()}` : 'de la mansión'}`.replace(' de el ', ' del ')} ${scen.emoji}.</b> Se puede estar sobre:</p>
    <div class="legend">${seats.map(item).join('')}</div>
    <p><b>No se puede estar sobre</b> (casillas sombreadas):</p>
    <div class="legend">${blocks.map(item).join('')}</div>
    <p class="small">Controles: elige un sospechoso (en la bandeja o en su ficha) y toca una casilla. Sin nadie elegido, tocar una casilla vacía la tacha con ✕. Toca a alguien en el plano para moverlo.</p>
    <p class="small">Caso del día: lunes y martes fácil, de miércoles a viernes medio, fines de semana difícil. El escenario cambia cada día: hay ${SCENARIO_IDS.length} distintos.</p>`);
}

function showStats() {
  const s = store.get('stats', {});
  let dailySolved = 0, dailyTime = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith('murdokus:daily:')) {
        const v = JSON.parse(localStorage.getItem(k));
        if (v?.solved) { dailySolved++; dailyTime += v.elapsed; }
      }
    }
  } catch { /* sin almacenamiento */ }
  const rows = Object.entries(DIFFICULTIES).map(([k, c]) => {
    const d = s[k];
    return `<tr><td>${c.label} ${c.n}×${c.n}</td><td>${d?.solved || 0}</td><td>${d?.best != null ? fmt(d.best) : '—'}</td><td>${d?.solved ? fmt(Math.round(d.total / d.solved)) : '—'}</td></tr>`;
  }).join('');
  modal(`
    <h3>Historial del detective</h3>
    <div class="stats-row">
      <div><b>${dailySolved}</b><small>Casos diarios</small></div>
      <div><b>${computeStreak()}</b><small>Racha</small></div>
      <div><b>${dailySolved ? fmt(Math.round(dailyTime / dailySolved)) : '—'}</b><small>Media diaria</small></div>
    </div>
    <p><b>Modo ilimitado</b></p>
    <table class="hist"><thead><tr><th>Dificultad</th><th>Resueltos</th><th>Récord</th><th>Media</th></tr></thead><tbody>${rows}</tbody></table>`);
}

/* ============================================================
   Arranque
   ============================================================ */
$('#btnBack').onclick = () => { save(); goHome(); };
$('#btnUndo').onclick = undo;
$('#btnHint').onclick = hint;
$('#btnReset').onclick = resetGame;
$('#btnRules').onclick = showHelp;
$('#btnHelp').onclick = showHelp;
$('#btnStats').onclick = showStats;

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!$('#modal').hidden && $('#modal').dataset.closable) closeModal();
    else if (G && selected !== null) { selected = null; renderAll(); }
  }
  if (!G || !$('#modal').hidden) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  const num = Number(e.key);
  if (num >= 1 && num < G.puz.n && !e.ctrlKey && !e.metaKey) selectPerson(suspects()[num - 1]);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
setInterval(updateCountdown, 30000);

(function init() {
  const params = new URLSearchParams(location.search);
  const code = params.get('caso');
  const d = params.get('d');
  renderHome();
  if (code && DIFFICULTIES[d] && /^[A-Z0-9]{3,12}$/i.test(code)) startFree(d, code.toUpperCase(), params.get('e') || 'mansion');
  else if (!store.get('seen-help', false)) { store.set('seen-help', true); showHelp(); }
})();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js?v=7').catch(() => {});
}
