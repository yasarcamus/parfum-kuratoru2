// Önbellek adını değiştirerek tarayıcının yeni bir önbellek oluşturmasını sağlıyoruz.
const CACHE_NAME = 'parfum-kuratoru-cache-v2.1'; 

const urlsToCache = [
  '/',
  '/?source=pwa',
  'index.html',
  'style.css?v=1.2', // Yeni versiyon adı
  'script.js?v=1.2', // Yeni versiyon adı
  'parfumler.json',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'background.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı ve yeni dosyalar ekleniyor.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true })
          .then(match => match || caches.match('index.html')))
    );
    return;
  }

  if (!isSameOrigin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {
            const responseClone = networkResponse.clone();
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone)).catch(() => {});
            }
            return networkResponse;
          })
          .catch(() => caches.match(event.request, { ignoreSearch: true }));
      })
  );
});

// Eski önbellekleri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});