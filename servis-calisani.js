// Önbellek adını değiştirerek tarayıcının yeni bir önbellek oluşturmasını sağlıyoruz.
const CACHE_NAME = 'parfum-kuratoru-cache-v-final'; 

const urlsToCache = [
  '/',
  'index.html',
  'style.css?v=final', // Yeni versiyon adı
  'script.js?v=final', // Yeni versiyon adı
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
    caches.match(event.request)
      .then(response => {
        // Önbellekte varsa, onu döndür. Yoksa, internetten çek.
        return response || fetch(event.request);
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