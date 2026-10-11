// Bump this version string whenever you redeploy index.html / assets,
// so returning visitors get the update instead of a stale cache.
//
// IMPORTANT: every app hosted on the same github.io account shares ONE cache
// storage (same origin). This worker therefore only ever touches caches whose
// name starts with CACHE_PREFIX, so it can't wipe the offline copies of your
// other apps (Commissioning, SLD, etc.).
const CACHE_PREFIX = 'cable-select-';
const CACHE_VERSION = CACHE_PREFIX + 'v3';
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
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

function fromOwnCache(req, opts) {
  return caches.open(CACHE_VERSION).then((cache) => cache.match(req, opts));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // App shell: cache-first, refresh the cache in the background.
    event.respondWith(
      fromOwnCache(req, { ignoreSearch: req.mode === 'navigate' }).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.ok && networkRes.type === 'basic') {
              const clone = networkRes.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
            }
            return networkRes;
          })
          .catch(() =>
            cached ||
            (req.mode === 'navigate'
              ? fromOwnCache('./index.html')
              : new Response('', { status: 504, statusText: 'Offline' }))
          );
        return cached || fetchPromise;
      })
    );
  } else {
    // Third-party (Google Fonts, PDF engine from cdnjs): network-first,
    // fall back to the cached copy so PDF export keeps working offline.
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && (networkRes.ok || networkRes.type === 'opaque')) {
            const clone = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() =>
          fromOwnCache(req).then((r) => r || new Response('', { status: 504, statusText: 'Offline' }))
        )
    );
  }
});
