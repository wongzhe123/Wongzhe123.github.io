const CACHE_NAME = 'produk-cache-v6';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/index.js',
  '/manifest.json',
  '/gbS.png',
  '/sounds/klik.wav',
  '/sounds/promo.mp3',
  '/images/Icon-192.png',
  '/images/Icon-512.png'
];

// Saat install: simpan file awal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Saat aktif: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Saat fetch: ambil dari cache dulu
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  
  event.respondWith(
    caches.match(req).then(cacheRes => {
      if (cacheRes) return cacheRes;
      
      return fetch(req)
        .then(netRes => {
          const isImage = req.url.includes('/images/');
          const isDataJson = req.url.endsWith('/data.json');
          const isSameOrigin = req.url.startsWith(self.location.origin);
          const isStatusOK = netRes && netRes.ok && netRes.type === 'basic';
          
          if ((isImage || isDataJson) && isSameOrigin && isStatusOK) {
            const copy = netRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          
          return netRes;
        })
        .catch(() => {
          if (req.url.includes('/images/')) {
            return caches.match('/gbS.png');
          } else if (req.url.endsWith('/data.json')) {
            return new Response('{}', {
              headers: { 'Content-Type': 'application/json' }
            });
          }
        });
    })
  );
});