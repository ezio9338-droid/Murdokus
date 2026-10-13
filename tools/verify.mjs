// Comprueba que el generador produce casos válidos y con solución única.
// Uso: node tools/verify.mjs [casos por dificultad]
import { generate, DIFFICULTIES, clueText } from '../js/generator.js';
import { solve } from '../js/solver.js';

const count = Number(process.argv[2] || 30);
let failures = 0;
for (const diff of Object.keys(DIFFICULTIES)) {
  const times = [], clues = [];
  for (let i = 0; i < count; i++) {
    const t0 = performance.now();
    const puz = generate(`test-${i}`, diff);
    times.push(performance.now() - t0);
    clues.push(puz.clues.length);
    const res = solve(puz, puz.clues, 2);
    const ok = res.count === 1 && res.first.every((c, p) => c === puz.solution[p]);
    const rows = new Set(puz.solution.map((c) => Math.floor(c / puz.n)));
    const cols = new Set(puz.solution.map((c) => c % puz.n));
    if (!ok || rows.size !== puz.n || cols.size !== puz.n) { failures++; console.log('FALLO', diff, i); }
    for (const cl of puz.clues) if (!clueText(cl, puz)) { failures++; console.log('Pista sin texto', cl); }
  }
  times.sort((a, b) => a - b);
  const avg = (a) => (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1);
  console.log(`${diff}: media ${avg(times)} ms, máx ${times.at(-1).toFixed(0)} ms, pistas media ${avg(clues)}`);
}
const d = generate('ejemplo', 'medio');
console.log(`\nEjemplo (${d.place}):`);
for (const cl of d.clues) console.log(' ', d.people[cl.p].short.padEnd(16), clueText(cl, d));
if (failures) { console.log(`\n${failures} fallos`); process.exit(1); }
console.log('\nTodo correcto');
