// Bump this version string whenever you redeploy index.html / assets,
// so returning visitors get the update instead of a stale cache.
const CACHE_VERSION = 'cable-select-flat-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon-16.png',
  './mobile-1.png',
  './mobile-2.png',
  './desktop.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // App shell: cache-first, refresh cache in the background.
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.ok) {
              const clone = networkRes.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
            }
            return networkRes;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    // Third-party (Google Fonts, etc.): network-first, fall back to cache, fail silently offline.
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          const clone = networkRes.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
  }
});
