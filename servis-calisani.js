// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = 'pwabuilder-offline-page';

// Load Workbox from Google's CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Use your actual offline fallback page
const offlineFallbackPage = 'offline.html';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Pre-cache the offline fallback page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});

// Enable navigation preload if supported
if (self.workbox && workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Runtime caching for same-origin requests (offline copy of pages/assets)
if (self.workbox) {
  workbox.routing.registerRoute(
    ({ url }) => url.origin === self.location.origin,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE
    })
  );
}

// Offline fallback for navigations
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;
        if (preloadResp) {
          return preloadResp;
        }
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});