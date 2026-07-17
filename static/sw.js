const CACHE_NAME = "luminadeen-cache-v4"; // Bumped cache version to invalidate old client caches [1.2.6]
const ASSETS_TO_CACHE = [
  "/",
  "/static/manifest.json",
  "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap",
];

// Install Event: Initialize active app shell caches [1.2.6]
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Initializing active app shell caches");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate Event: Clear legacy cache versions [1.2.6]
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(
              "[Service Worker] Clearing legacy cache version:",
              cache,
            );
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event: Network-First strategy to allow instant live updates [1.2.6]
self.addEventListener("fetch", (event) => {
  // Safe validation whitelisting: bypass cache completely for dynamic endpoints [1.2.6]
  if (
    event.request.url.includes("/ask") ||
    event.request.url.includes("/fetch_daily_topics") || // Bypass cache on daily topics to allow live fetches [1.2.6]
    event.request.method === "POST" ||
    event.request.url.includes("/ping")
  ) {
    return; // Propagate directly to the network without caching [1.2.6]
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If the request succeeds, clone and update the cache dynamically [1.2.6]
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network is unreachable (offline or server down), fall back to cache [1.2.6]
        console.log(
          "[Service Worker] Network unreachable. Serving asset from local cache fallback.",
        );
        return caches.match(event.request);
      }),
  );
});
