/* =========================================================================
   KISAN KALYAN PWA SERVICE WORKER
   - Static Shell & Asset Caching for fast offline-capable mobile/tablet PWA
   - STRICT SAFETY: API, Live Queue, OTP, Auth, and DBT endpoints are NEVER cached
========================================================================= */

const CACHE_NAME = 'kisan-kalyan-static-v1';

const STATIC_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/emblem_of_india_gold.svg',
  '/kisan_kalyan_official_logo.png'
];

// 1. Install Event: Pre-cache static shell & activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL).catch((err) => {
        console.warn('[SW] Some precache items skipped:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up outdated caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Safe Network-First for APIs / Dynamic Data, Cache-First for static
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // RULE A: ALL LIVE APIS, WEBSOCKETS, AND NON-GET REQUESTS ARE NETWORK-ONLY
  // Never cache live booking, queue, payments, user state, auth, or staff consoles
  if (
    req.method !== 'GET' ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/ws') ||
    url.pathname.includes('/auth') ||
    url.pathname.includes('/queue') && url.search.length > 0 ||
    url.protocol.startsWith('ws')
  ) {
    // Pure network request without caching
    return;
  }

  // RULE B: HTML Navigation Requests (Page Load / Reload / Route change)
  // Network-First with offline shell fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          // If valid response, cache copy of index.html for offline SPA routing
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', resClone);
            });
          }
          return networkRes;
        })
        .catch(async () => {
          // If network failed (Offline), attempt to serve cached SPA shell or offline page
          const cache = await caches.open(CACHE_NAME);
          const cachedShell = await cache.match('/index.html');
          if (cachedShell) return cachedShell;
          const cachedOffline = await cache.match('/offline.html');
          if (cachedOffline) return cachedOffline;
          return new Response('Offline - No connection available', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // RULE C: Static Assets (JS, CSS, Images, Fonts)
  // Stale-While-Revalidate: Fast instant load from cache, update in background
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, resClone);
              });
            }
            return networkRes;
          })
          .catch(() => cachedRes); // Fall back gracefully if network fails

        return cachedRes || fetchPromise;
      })
    );
    return;
  }
});
