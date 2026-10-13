// Solucionador por vuelta atrás. Cuenta soluciones (hasta un límite) para comprobar
// que cada caso generado tiene exactamente una solución.
import { OBJECTS } from './data.js';

export const UNARY = new Set(['room', 'notRoom', 'on', 'floor', 'next', 'notNext']);
export const BINARY = new Set(['same', 'diff', 'north', 'south', 'west', 'east']);

export function prepare(puz) {
  const { n } = puz;
  const N = n * n;
  const block = puz.objs.map((o) => !!(o && OBJECTS[o].block));
  const adj = [];
  for (let c = 0; c < N; c++) {
    const r = Math.floor(c / n), k = c % n;
    const s = new Set();
    for (const [dr, dk] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const rr = r + dr, kk = k + dk;
      if (rr < 0 || kk < 0 || rr >= n || kk >= n) continue;
      const nb = rr * n + kk;
      // «Junto a» no atraviesa paredes: la casilla vecina tiene que ser de la misma habitación.
      if (puz.rooms[nb] !== puz.rooms[c]) continue;
      const o = puz.objs[nb];
      if (o) s.add(o);
    }
    adj.push(s);
  }
  return { n, N, block, adj };
}

export function evalUnary(cl, c, puz, prep) {
  switch (cl.t) {
    case 'room': return puz.rooms[c] === cl.r;
    case 'notRoom': return puz.rooms[c] !== cl.r;
    case 'on': return puz.objs[c] === cl.o;
    case 'floor': return !puz.objs[c];
    case 'next': return prep.adj[c].has(cl.o);
    case 'notNext': return !prep.adj[c].has(cl.o);
  }
  return true;
}

export function evalBinary(t, a, b, puz) {
  const n = puz.n;
  switch (t) {
    case 'same': return puz.rooms[a] === puz.rooms[b];
    case 'diff': return puz.rooms[a] !== puz.rooms[b];
    case 'north': return Math.floor(a / n) < Math.floor(b / n);
    case 'south': return Math.floor(a / n) > Math.floor(b / n);
    case 'west': return a % n < b % n;
    case 'east': return a % n > b % n;
  }
  return true;
}

export function solve(puz, clues, limit = 2, prep = prepare(puz)) {
  const { n, N, block } = prep;
  const rooms = puz.rooms;
  const P = n, V = puz.victim, R = puz.roomTypes.length;
  const unary = Array.from({ length: P }, () => []);
  const bin = Array.from({ length: P }, () => []);
  const alone = new Array(P).fill(0); // 1 = solo, -1 = acompañado

  for (const cl of clues) {
    if (UNARY.has(cl.t)) unary[cl.p].push(cl);
    else if (BINARY.has(cl.t)) { bin[cl.p].push(cl); bin[cl.q].push(cl); }
    else if (cl.t === 'alone') alone[cl.p] = 1;
    else if (cl.t === 'notAlone') alone[cl.p] = -1;
  }

  const dom = [];
  for (let p = 0; p < P; p++) {
    const d = [];
    for (let c = 0; c < N; c++) {
      if (!block[c] && unary[p].every((cl) => evalUnary(cl, c, puz, prep))) d.push(c);
    }
    if (!d.length) return { count: 0, first: null };
    dom.push(d);
  }

  const order = [...Array(P).keys()].sort((a, b) => dom[a].length - dom[b].length);
  const pos = new Array(P).fill(-1);
  const cnt = new Array(R).fill(0);
  const aloneRoom = new Array(R).fill(false);
  let rowU = 0, colU = 0, count = 0, first = null;

  const binOk = (p, c) => {
    for (const cl of bin[p]) {
      const other = cl.p === p ? cl.q : cl.p;
      const oc = pos[other];
      if (oc < 0) continue;
      const ok = cl.p === p ? evalBinary(cl.t, c, oc, puz) : evalBinary(cl.t, oc, c, puz);
      if (!ok) return false;
    }
    return true;
  };

  const rec = (i) => {
    if (i === P) {
      for (let p = 0; p < P; p++) if (alone[p] === -1 && cnt[rooms[pos[p]]] < 2) return false;
      if (cnt[rooms[pos[V]]] !== 2) return false;
      count++;
      if (!first) first = pos.slice();
      return count >= limit;
    }
    const p = order[i];
    for (const c of dom[p]) {
      const r = Math.floor(c / n), k = c % n;
      if ((rowU >> r) & 1 || (colU >> k) & 1) continue;
      const rm = rooms[c];
      if (aloneRoom[rm]) continue;
      if (alone[p] === 1 && cnt[rm] > 0) continue;
      if (cnt[rm] >= 2 && (p === V || (pos[V] >= 0 && rooms[pos[V]] === rm))) continue;
      if (!binOk(p, c)) continue;
      pos[p] = c; rowU |= 1 << r; colU |= 1 << k; cnt[rm]++;
      if (alone[p] === 1) aloneRoom[rm] = true;
      const stop = rec(i + 1);
      pos[p] = -1; rowU &= ~(1 << r); colU &= ~(1 << k); cnt[rm]--;
      if (alone[p] === 1) aloneRoom[rm] = false;
      if (stop) return true;
    }
    return false;
  };

  rec(0);
  return { count, first };
}
