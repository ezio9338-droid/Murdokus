// Comprueba que los escenarios estén completos y coherentes.
import { SCENARIOS } from '../js/scenarios.js';
import { OBJECTS } from '../js/data.js';
let bad = 0;
const fail = (m) => { bad++; console.log('✗', m); };
for (const s of Object.values(SCENARIOS)) {
  if (s.rooms.length < 6) fail(`${s.id}: menos de 6 habitaciones`);
  if (s.people.length < 7) fail(`${s.id}: menos de 7 personajes`);
  if (new Set(s.rooms.map((r) => r.name)).size !== s.rooms.length) fail(`${s.id}: habitaciones repetidas`);
  for (const r of s.rooms) for (const o of r.objs) if (!OBJECTS[o]) fail(`${s.id}/${r.name}: objeto desconocido ${o}`);
  for (const k of ['es', 'en']) {
    const names = s.people.map((p) => p.names[k]);
    if (new Set(names).size !== names.length) fail(`${s.id}: nombres ${k} repetidos`);
    if (!s.places[k]?.length) fail(`${s.id}: sin lugares ${k}`);
  }
  if (!s.weapons?.length) fail(`${s.id}: sin armas`);
  if (s.palette?.length !== 6) fail(`${s.id}: paleta incompleta`);
}
console.log(`${Object.keys(SCENARIOS).length} escenarios`, bad ? `· ${bad} problemas` : '· todo correcto');
process.exit(bad ? 1 : 0);
