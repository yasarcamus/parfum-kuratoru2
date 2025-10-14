// Önbellek adını değiştirerek tarayıcının yeni bir önbellek oluşturmasını sağlıyoruz.
const CACHE_NAME = 'parfum-kuratoru-cache-v2.0'; 

const urlsToCache = [
  '/',
  'index.html',
  'style.css?v=2.0', // Yeni versiyon adı
  'script.js?v=2.0', // Yeni versiyon adı
  'parfumler.json',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'background.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı ve yeni dosyalar ekleniyor.');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const networkFetch = fetch(event.request)
        .then(networkResponse => {
          const responseClone = networkResponse.clone();
          if (event.request.method === 'GET' && networkResponse.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(() => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return new Response(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Çevrimdışı</title><style>body{font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:20px;background:#2C2A2E;color:#D4D4D4} .card{max-width:600px;margin:40px auto;background:#3E3B40;border:1px solid #4a474c;border-radius:12px;padding:20px} a{color:#D4AF37}</style></head><body><div class="card"><h1>Çevrimdışısınız</h1><p>İnternet bağlantısı yokken bu sayfa yüklenemedi. Bağlantı kurduktan sonra <a href="/">ana sayfaya</a> dönmeyi deneyin.</p></div></body></html>`, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
          }
        });
      return cachedResponse || networkFetch;
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
    })
  );
});