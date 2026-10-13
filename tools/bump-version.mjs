// Sube la versión de todos los archivos del juego para que el navegador no mezcle
// archivos nuevos con archivos antiguos guardados en caché.
// Uso: node tools/bump-version.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const files = ['index.html', 'sw.js', ...readdirSync(new URL('js/', root)).map((f) => `js/${f}`)];
const current = Number(readFileSync(new URL('sw.js', root), 'utf8').match(/murdokus-v(\d+)/)[1]);
const next = current + 1;

for (const f of files) {
  const url = new URL(f, root);
  const src = readFileSync(url, 'utf8');
  const out = src
    .replace(/(\.(?:js|css))(\?v=\d+)?(['"])/g, `$1?v=${next}$3`)
    .replace(/murdokus-v\d+/g, `murdokus-v${next}`);
  if (out !== src) writeFileSync(url, out);
}
console.log(`Versión ${current} → ${next}`);
