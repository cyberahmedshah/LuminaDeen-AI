// LuminaDeen AI — minimal service worker.
// Caches the app shell so it can be installed and reopened offline.
// Live questions to /ask always go to the network (never cached).

const CACHE_NAME = "luminadeen-shell-v1";
const APP_SHELL = [
  "/",
  "/zakat-calculator",
  "/zakat-guide",
  "/manifest.json",
  "/static/icons/icon-192.png",
  "/static/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never cache API calls — always hit the network for live answers.
  if (request.method !== "GET" || request.url.includes("/ask")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached)
      );
    })
  );
});
