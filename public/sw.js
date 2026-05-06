const CACHE_NAME = 'aroma-ar-v1';

// We explicitly cache the heavy 8th Wall engine and 3D models
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/ar.html',
  '/Images/AromaLogo.jpeg',
  // 8th Wall Engine
  '/external/xr/xr.js',
  '/external/xr/xr-slam.js',
  '/external/xr/resources/media-worker.js',
  '/external/xr/resources/semantics-worker.js',
  // Dependencies from CDN (8th Wall)
  'https://cdn.8thwall.com/web/aframe/8frame-1.5.0.min.js',
  'https://cdn.8thwall.com/web/xrextras/xrextras.js'
];

self.addEventListener('install', (event) => {
  // Only cache very critical core UI assets during install
  const CRITICAL_ASSETS = ['/', '/index.html', '/Images/AromaLogo.jpeg'];
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('🧊 Service Worker: Pre-caching critical assets...');
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Cache heavy engine assets in the background after activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Background pre-cache heavy assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('🧊 Service Worker: Background caching heavy AR engine...');
        // We use individual add calls to avoid one failure blocking everything
        ASSETS_TO_CACHE.forEach(asset => {
          cache.add(asset).catch(err => console.warn('Failed to background cache:', asset));
        });
      })
    ])
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only cache GET requests
  if (event.request.method !== 'GET') return;

  // For 8th Wall engine and 3D models, we use a "Cache First" strategy
  const url = new URL(event.request.url);
  const isEngineOrModel = 
    url.pathname.includes('/external/xr/') || 
    url.pathname.includes('/Models/') ||
    url.hostname.includes('cdn.8thwall.com');

  if (isEngineOrModel) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    // For other assets, use "Network First, falling back to cache"
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});
