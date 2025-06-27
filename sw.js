const CACHE_NAME = 'produk-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/index.js',
  '/manifest.json',
  '/gbS.png',
  '/sounds/klik.wav',
  '/sounds/adamJualan.mp3'
  // Tambahkan gambar utama lain jika perlu: misal '/images/gerinda/gerinda1.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('📦 Caching semua file statis');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('🧹 Hapus cache lama:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      // Jika ada di cache, ambil dari cache
      if (response) return response;
      // Jika tidak, ambil dari internet
      return fetch(event.request);
    })
    .catch(() => {
      // Fallback jika offline dan file tidak ada
      if (event.request.destination === 'image') {
        return caches.match('/gbS.png');
      }
    })
  );
});