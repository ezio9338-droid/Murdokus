// Solucionador independiente (no reutiliza el del juego): comprueba que cada caso tiene una única
// solución con «junto a» sin atravesar paredes. Uso: node tools/check-adjacency.mjs
import { generate } from '../js/generator.js';
import { SCENARIO_IDS } from '../js/scenarios.js';
import { OBJECTS } from '../js/data.js';

function nearSameRoom(z, c, o) {
  const n = z.n, r = Math.floor(c / n), k = c % n;
  return [[-1,0],[1,0],[0,-1],[0,1]].some(([a,b]) => {
    const rr = r + a, kk = k + b;
    if (rr < 0 || kk < 0 || rr >= n || kk >= n) return false;
    const nb = rr * n + kk;
    return z.rooms[nb] === z.rooms[c] && z.objs[nb] === o;
  });
}
function holds(z, cl, pos) {
  const n = z.n, a = pos[cl.p], b = cl.q != null ? pos[cl.q] : null;
  const cnt = (c) => pos.filter((x) => z.rooms[x] === z.rooms[c]).length;
  switch (cl.t) {
    case 'room': return z.rooms[a] === cl.r;
    case 'notRoom': return z.rooms[a] !== cl.r;
    case 'on': return z.objs[a] === cl.o;
    case 'floor': return !z.objs[a];
    case 'next': return nearSameRoom(z, a, cl.o);
    case 'notNext': return !nearSameRoom(z, a, cl.o);
    case 'alone': return cnt(a) === 1;
    case 'notAlone': return cnt(a) >= 2;
    case 'same': return z.rooms[a] === z.rooms[b];
    case 'diff': return z.rooms[a] !== z.rooms[b];
    case 'north': return Math.floor(a / n) < Math.floor(b / n);
    case 'south': return Math.floor(a / n) > Math.floor(b / n);
    case 'west': return a % n < b % n;
    case 'east': return a % n > b % n;
  }
  throw new Error('tipo ' + cl.t);
}
function count(z) {
  const n = z.n, P = n, pos = new Array(P).fill(-1);
  const free = z.objs.map((o) => !o || !OBJECTS[o].block);
  const unary = (p, c) => z.clues.every((cl) => cl.p !== p || cl.q != null || ['alone','notAlone'].includes(cl.t) || holds(z, cl, Object.assign([], { [p]: c })));
  let sols = 0, found = null;
  const usedR = new Set(), usedC = new Set();
  const rec = (p) => {
    if (sols > 1) return;
    if (p === P) {
      if (!z.clues.every((cl) => holds(z, cl, pos))) return;
      const vr = pos.filter((x) => z.rooms[x] === z.rooms[pos[z.victim]]).length;
      if (vr !== 2) return;
      sols++; found = pos.slice(); return;
    }
    for (let c = 0; c < n * n; c++) {
      const r = Math.floor(c / n), k = c % n;
      if (!free[c] || usedR.has(r) || usedC.has(k) || !unary(p, c)) continue;
      pos[p] = c; usedR.add(r); usedC.add(k);
      rec(p + 1);
      usedR.delete(r); usedC.delete(k); pos[p] = -1;
    }
  };
  rec(0);
  return { sols, found };
}
let bad = 0, total = 0, nextClues = 0;
for (let i = 0; i < 90; i++) {
  const d = ['facil', 'medio', 'dificil'][i % 3];
  const z = generate('indep' + i, d, SCENARIO_IDS[i % SCENARIO_IDS.length]);
  nextClues += z.clues.filter((c) => c.t === 'next' || c.t === 'notNext').length;
  const { sols, found } = count(z);
  total++;
  const same = found && found.every((c, p) => c === z.solution[p]);
  if (sols !== 1 || !same) { bad++; console.log('FALLO', i, d, z.scenario, 'soluciones:', sols); }
}
console.log(`casos: ${total}, pistas junto a/no junto a: ${nextClues}, fallos: ${bad}`);
process.exit(bad ? 1 : 0);
