const CACHE_NAME = 'produk-cache-v2';
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

// Saat pertama install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching awal');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Langsung aktif
});

// Saat aktif, hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Hapus cache lama:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Tangani permintaan (fetch)
self.addEventListener('fetch', event => {
  const req = event.request;
  
  // Hanya cache GET request
  if (req.method !== 'GET') return;
  
  event.respondWith(
    caches.match(req).then(cacheRes => {
      // Jika ada di cache, gunakan
      if (cacheRes) return cacheRes;
      
      // Jika tidak, fetch dari jaringan
      return fetch(req)
        .then(netRes => {
          // Hanya simpan gambar dari /images/
          if (req.url.includes('/images/') && netRes.status === 200) {
            const copy = netRes.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return netRes;
        })
        .catch(() => {
          // Jika offline dan file gambar tidak ada
          if (req.destination === 'image') {
            return caches.match('/gbS.png');
          }
        });
    })
  );
});