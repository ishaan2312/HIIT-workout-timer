// Service Worker for Workout Timer PWA
// Handles caching and offline functionality

const CACHE_NAME = 'workout-timer-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './timer.js',
  './speech.js',
  './storage.js',
  './manifest.json'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('Cache addAll error (some files may not exist yet):', err);
        // Continue even if some files aren't found
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline fallback if available
        return caches.match('./index.html');
      });
    })
  );
});

// Handle background sync if needed
self.addEventListener('sync', (event) => {
  // Background sync would be used for syncing data if we had a backend
  // For now, this is a placeholder
  console.log('Background sync event:', event.tag);
});
