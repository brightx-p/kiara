const CACHE_NAME = 'kiara-love-v2';
const urlsToCache = [
  '/',
  '/index.html',
  // Add more static assets if you want better offline support
  // e.g., '/assets/images/0.jpeg', etc. (optional)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Optional: fallback page if offline and not cached
        // return caches.match('/offline.html');
      })
  );
});