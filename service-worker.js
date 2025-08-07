const CACHE = 'pq-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/theme.css',
  '/styles/components.css',
  '/scripts/app.js',
  '/scripts/data.js',
  '/scripts/storage.js',
  '/scripts/ui.js',
  '/scripts/progress.js',
  '/scripts/charts.js',
  '/scripts/flashcards.js',
  '/scripts/quiz.js',
  '/scripts/guessing.js',
  '/scripts/snake.js',
  '/scripts/audio.js',
  '/data/presidents.json',
  '/assets/cheese.svg',
  '/assets/mouse.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(e.request);
      if (cached) return cached;
      try {
        const fresh = await fetch(e.request);
        const cache = await caches.open(CACHE);
        cache.put(e.request, fresh.clone());
        return fresh;
      } catch {
        return cached || Response.error();
      }
    })());
  }
});