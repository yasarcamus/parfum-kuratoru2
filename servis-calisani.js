// Önbellek adını değiştirerek tarayıcının yeni bir önbellek oluşturmasını sağlıyoruz.
const CACHE_NAME = 'parfum-kuratoru-cache-v3.0';

const PRECACHE_ASSETS = [
  '/',
  '/?source=pwa',
  'index.html',
  'offline.html',
  'style.css?v=1.2', // Yeni versiyon adı
  'script.js?v=1.2', // Yeni versiyon adı
  'parfumler.json',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'background.jpg'
];

const OFFLINE_FALLBACK_PAGE = 'offline.html';

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
});

self.addEventListener('activate', event => {
  const whitelist = [CACHE_NAME, workbox.core.cacheNames.precache];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(name => {
        if (!whitelist.includes(name)) {
          return caches.delete(name);
        }
        return undefined;
      })
    )).then(() => self.clients.claim())
  );
});

if (workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'parfum-kuratoru' });
  workbox.precaching.precacheAndRoute(PRECACHE_ASSETS.map(url => ({ url })), {
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
  });

  if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
  }

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_NAME}-pages`,
      networkTimeoutSeconds: 5
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `${CACHE_NAME}-assets`
    })
  );

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `${CACHE_NAME}-images`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('parfumler.json'),
    new workbox.strategies.NetworkFirst({
      cacheName: `${CACHE_NAME}-data`
    })
  );

  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(OFFLINE_FALLBACK_PAGE);
      if (cached) {
        return cached;
      }
      return caches.match(OFFLINE_FALLBACK_PAGE);
    }
    return Response.error();
  });
}