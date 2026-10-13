// Red primero y caché como respaldo: siempre la última versión, y funciona sin conexión.
const CACHE = 'murdokus-v7';
const CORE = ['./', 'index.html', 'css/style.css?v=7', 'js/app.js?v=7', 'manifest.webmanifest', 'icons/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // no-cache: siempre pregunta al servidor si hay versión nueva antes de usar la caché del navegador.
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match(e.request, { ignoreSearch: true }))),
  );
});
