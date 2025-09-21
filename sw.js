const CACHE_NAME = 'mtg-life-tracker-v1';
const urlsToCache = [
  '/Simple_Life_Tracker/',
  '/Simple_Life_Tracker/index.html',
  '/Simple_Life_Tracker/styles.css',
  '/Simple_Life_Tracker/script.js',
  '/Simple_Life_Tracker/manifest.json',
  '/Simple_Life_Tracker/audio/roar1.mp3',
  '/Simple_Life_Tracker/audio/roar2.mp3',
  '/Simple_Life_Tracker/audio/roar3.mp3'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
