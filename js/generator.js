// Generador de casos: plano de habitaciones, muebles, colocación secreta y pistas
// mínimas que conducen a una única solución.
import { makeRng } from './rng.js';
import { OBJECTS, ROOM_TYPES, PEOPLE, PLACES, WEAPONS } from './data.js';
import { prepare, solve } from './solver.js';

const W = (o) => ({ room: 0, notRoom: 0, on: 0, floor: 0, next: 0, notNext: 0, alone: 0, notAlone: 0, same: 0, diff: 0, north: 0, south: 0, west: 0, east: 0, ...o });

export const DIFFICULTIES = {
  facil: {
    label: 'Fácil', n: 5, rooms: [4, 4], density: [0.28, 0.4], minimize: 0.45,
    weights: W({ room: 8, on: 6, floor: 1, next: 4, notRoom: 1.5, alone: 1, notAlone: 0.5, same: 1, north: 0.4, south: 0.4, west: 0.4, east: 0.4 }),
  },
  medio: {
    label: 'Medio', n: 6, rooms: [4, 5], density: [0.3, 0.42], minimize: 0.85,
    weights: W({ room: 3, on: 3, floor: 1, next: 4, notRoom: 3, notNext: 1, alone: 1.5, notAlone: 1, same: 2, diff: 1, north: 1, south: 1, west: 1, east: 1 }),
  },
  dificil: {
    label: 'Difícil', n: 7, rooms: [5, 6], density: [0.3, 0.44], minimize: 1,
    weights: W({ room: 1, on: 2, floor: 1, next: 4, notRoom: 4, notNext: 2.5, alone: 2, notAlone: 1, same: 2, diff: 2, north: 1.5, south: 1.5, west: 1.5, east: 1.5 }),
  },
};

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function neighbors(c, n) {
  const r = Math.floor(c / n), k = c % n, out = [];
  for (const [dr, dk] of DIRS) {
    const rr = r + dr, kk = k + dk;
    if (rr >= 0 && kk >= 0 && rr < n && kk < n) out.push(rr * n + kk);
  }
  return out;
}

function connected(g, n, id) {
  const cells = [];
  g.forEach((v, i) => v === id && cells.push(i));
  if (!cells.length) return false;
  const seen = new Set([cells[0]]);
  const stack = [cells[0]];
  while (stack.length) {
    const c = stack.pop();
    for (const nb of neighbors(c, n)) if (g[nb] === id && !seen.has(nb)) { seen.add(nb); stack.push(nb); }
  }
  return seen.size === cells.length;
}

function splitOptions(x) {
  const res = [];
  for (let at = 1; at < x.h; at++) if (at * x.w >= 2 && (x.h - at) * x.w >= 2) res.push({ dir: 'h', at });
  for (let at = 1; at < x.w; at++) if (at * x.h >= 2 && (x.w - at) * x.h >= 2) res.push({ dir: 'v', at });
  if (x.h === x.w) return res;
  const longer = x.h > x.w ? 'h' : 'v';
  const pref = res.filter((s) => s.dir === longer);
  return pref.length ? pref : res;
}

// Divide la casa en rectángulos y luego deforma un poco los muros para que haya habitaciones en L.
function makeRooms(rng, n, k) {
  let rects = [{ r: 0, c: 0, h: n, w: n }];
  while (rects.length < k) {
    const opts = rects.map((x, i) => ({ x, i, s: splitOptions(x) })).filter((o) => o.s.length);
    if (!opts.length) break;
    opts.sort((a, b) => b.x.h * b.x.w - a.x.h * a.x.w);
    const o = opts[rng.int(Math.min(2, opts.length))];
    const s = rng.pick(o.s);
    const x = o.x;
    const parts = s.dir === 'h'
      ? [{ r: x.r, c: x.c, h: s.at, w: x.w }, { r: x.r + s.at, c: x.c, h: x.h - s.at, w: x.w }]
      : [{ r: x.r, c: x.c, h: x.h, w: s.at }, { r: x.r, c: x.c + s.at, h: x.h, w: x.w - s.at }];
    rects.splice(o.i, 1, ...parts);
  }
  const g = new Array(n * n);
  rects.forEach((x, id) => {
    for (let r = x.r; r < x.r + x.h; r++) for (let c = x.c; c < x.c + x.w; c++) g[r * n + c] = id;
  });
  const size = (id) => g.filter((v) => v === id).length;
  for (let t = 0; t < n * 3; t++) {
    const i = rng.int(n * n);
    const nb = neighbors(i, n).filter((j) => g[j] !== g[i]);
    if (!nb.length) continue;
    const from = g[i], to = g[rng.pick(nb)];
    if (size(from) <= 3) continue;
    g[i] = to;
    if (!connected(g, n, from)) g[i] = from;
  }
  return { grid: g, count: rects.length };
}

function randomPerm(rng, n, free) {
  const cols = new Array(n), used = new Array(n).fill(false);
  const rec = (r) => {
    if (r === n) return true;
    for (const c of rng.shuffle([...Array(n).keys()])) {
      if (used[c] || !free[r * n + c]) continue;
      used[c] = true; cols[r] = c;
      if (rec(r + 1)) return true;
      used[c] = false;
    }
    return false;
  };
  return rec(0) ? cols : null;
}

// Todas las afirmaciones verdaderas sobre la solución, agrupadas por tipo y persona.
function allFacts(puz, prep) {
  const { n, solution: pos, victim: V, murderer: M } = puz;
  const R = puz.roomTypes.length;
  const roomOf = pos.map((c) => puz.rooms[c]);
  const countIn = new Array(R).fill(0);
  roomOf.forEach((r) => countIn[r]++);
  const present = [...new Set(puz.objs.filter(Boolean))];
  const out = [];
  for (let p = 0; p < n; p++) {
    const c = pos[p], r = roomOf[p], o = puz.objs[c];
    out.push({ t: 'room', p, r });
    for (let r2 = 0; r2 < R; r2++) if (r2 !== r) out.push({ t: 'notRoom', p, r: r2 });
    out.push(o ? { t: 'on', p, o } : { t: 'floor', p });
    for (const o2 of prep.adj[c]) out.push({ t: 'next', p, o: o2 });
    for (const o2 of present) if (!prep.adj[c].has(o2)) out.push({ t: 'notNext', p, o: o2 });
    if (p !== V) out.push(countIn[r] === 1 ? { t: 'alone', p } : { t: 'notAlone', p });
    for (let q = 0; q < n; q++) {
      if (q === p) continue;
      const isPair = (p === V && q === M) || (p === M && q === V);
      if (roomOf[p] === roomOf[q]) { if (!isPair) out.push({ t: 'same', p, q }); }
      else out.push({ t: 'diff', p, q });
      out.push({ t: Math.floor(c / n) < Math.floor(pos[q] / n) ? 'north' : 'south', p, q });
      out.push({ t: c % n < pos[q] % n ? 'west' : 'east', p, q });
    }
  }
  return out;
}

// Orden aleatorio ponderado: primero se elige el tipo de pista según su peso, luego una al azar de ese tipo.
function orderFacts(rng, facts, weights) {
  const byType = {};
  for (const f of facts) if (weights[f.t] > 0) (byType[f.t] ||= []).push(f);
  for (const t in byType) byType[t] = rng.shuffle(byType[t]);
  const out = [];
  for (;;) {
    const types = Object.keys(byType).filter((t) => byType[t].length);
    if (!types.length) break;
    const total = types.reduce((s, t) => s + weights[t], 0);
    let x = rng.next() * total, chosen = types[0];
    for (const t of types) { x -= weights[t]; if (x <= 0) { chosen = t; break; } }
    out.push(byType[chosen].pop());
  }
  return out;
}

function tryGenerate(rng, cfg) {
  const n = cfg.n, N = n * n;
  const k = cfg.rooms[0] + rng.int(cfg.rooms[1] - cfg.rooms[0] + 1);
  const { grid: rooms, count: R } = makeRooms(rng, n, k);
  const roomTypes = rng.shuffle(ROOM_TYPES).slice(0, R).map(({ name, art }, i) => ({ name, art, objs: ROOM_TYPES.find((t) => t.name === name).objs }));

  const objs = new Array(N).fill(null);
  for (let id = 0; id < R; id++) {
    const cells = rng.shuffle([...Array(N).keys()].filter((c) => rooms[c] === id));
    const dens = cfg.density[0] + rng.next() * (cfg.density[1] - cfg.density[0]);
    const cnt = Math.max(1, Math.round(cells.length * dens));
    for (let i = 0; i < cnt && i < cells.length - 1; i++) objs[cells[i]] = rng.pick(roomTypes[id].objs);
  }
  const free = objs.map((o) => !o || !OBJECTS[o].block);

  let cells = null, pair = null;
  for (let t = 0; t < 20 && !pair; t++) {
    const perm = randomPerm(rng, n, free);
    if (!perm) return null;
    cells = perm.map((c, r) => r * n + c);
    const byRoom = {};
    for (const c of cells) (byRoom[rooms[c]] ||= []).push(c);
    const pairs = Object.values(byRoom).filter((l) => l.length === 2);
    if (pairs.length) pair = rng.pick(pairs);
  }
  if (!pair) return null;

  const origin = rng.next() < 0.5 ? 'es' : 'en';
  const people = rng.shuffle(PEOPLE).slice(0, n).map(({ names, ...rest }) => ({ ...rest, short: names[origin] }));
  const V = rng.int(n);
  let M = rng.int(n - 1); if (M >= V) M++;
  const solution = new Array(n);
  const [a, b] = rng.shuffle(pair);
  solution[V] = a; solution[M] = b;
  const rest = rng.shuffle(cells.filter((c) => c !== a && c !== b));
  for (let p = 0; p < n; p++) if (p !== V && p !== M) solution[p] = rest.pop();

  const puz = {
    n, rooms, roomTypes: roomTypes.map(({ name, art }) => ({ name, art })), objs, people,
    victim: V, murderer: M, solution,
    origin, place: rng.pick(PLACES[origin]), weapon: rng.pick(WEAPONS),
  };
  const prep = prepare(puz);

  // Selección de pistas: una por persona y luego se añaden hasta que la solución sea única.
  const ordered = orderFacts(rng, allFacts(puz, prep), cfg.weights);
  const chosen = [];
  for (let p = 0; p < n; p++) {
    const f = ordered.find((x) => x.p === p);
    if (f) chosen.push(f);
  }
  const unique = (cl) => solve(puz, cl, 2, prep).count === 1;
  let done = unique(chosen);
  for (const f of ordered) {
    if (done) break;
    if (chosen.includes(f)) continue;
    chosen.push(f);
    if (chosen.length % 2 === 0 || chosen.length > 3 * n) done = unique(chosen);
  }
  if (!done && !unique(chosen)) return null;

  // Poda: se quitan pistas redundantes (todas en difícil, algunas en fácil).
  for (const f of rng.shuffle(chosen)) {
    if (rng.next() > cfg.minimize) continue;
    if (chosen.filter((x) => x.p === f.p).length < 2) continue;
    const without = chosen.filter((x) => x !== f);
    if (unique(without)) chosen.splice(chosen.indexOf(f), 1);
  }

  const typeOrder = ['room', 'notRoom', 'on', 'floor', 'next', 'notNext', 'alone', 'notAlone', 'same', 'diff', 'north', 'south', 'west', 'east'];
  puz.clues = chosen.sort((x, y) => x.p - y.p || typeOrder.indexOf(x.t) - typeOrder.indexOf(y.t));
  return puz;
}

export function generate(seed, diff) {
  const cfg = DIFFICULTIES[diff];
  const rng = makeRng(`${seed}|${diff}`);
  for (let attempt = 0; attempt < 300; attempt++) {
    const puz = tryGenerate(rng, cfg);
    if (puz) return { ...puz, seed, diff };
  }
  throw new Error('No se pudo generar el caso');
}

export function clueText(cl, puz) {
  const P = puz.people;
  const g = P[cl.p].f;
  const sol = (m, f) => (g ? f : m);
  const who = (q) => (q === puz.victim ? `${P[q].short} (la víctima)` : P[q].short);
  switch (cl.t) {
    case 'room': return `Estaba en ${puz.roomTypes[cl.r].art}.`;
    case 'notRoom': return `No estaba en ${puz.roomTypes[cl.r].art}.`;
    case 'on': return `Estaba ${OBJECTS[cl.o].on[g]}.`;
    case 'floor': return 'No estaba sobre ningún mueble ni alfombra.';
    case 'next': return `Estaba junto a ${OBJECTS[cl.o].un}.`;
    case 'notNext': return `No estaba junto a ${OBJECTS[cl.o].ningun}.`;
    case 'alone': return `Estaba ${sol('solo', 'sola')} en su habitación.`;
    case 'notAlone': return `No estaba ${sol('solo', 'sola')} en su habitación.`;
    case 'same': return `Estaba en la misma habitación que ${who(cl.q)}.`;
    case 'diff': return `No estaba en la misma habitación que ${who(cl.q)}.`;
    case 'north': return `Estaba más al norte que ${who(cl.q)}.`;
    case 'south': return `Estaba más al sur que ${who(cl.q)}.`;
    case 'west': return `Estaba más al oeste que ${who(cl.q)}.`;
    case 'east': return `Estaba más al este que ${who(cl.q)}.`;
  }
  return '';
}
