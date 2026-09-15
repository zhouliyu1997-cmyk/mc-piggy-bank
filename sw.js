
const CACHE = "mc-piggy-pwa-v17-v81-p1-p2-final";
const APP_SHELL = [
  "./",
  "./index.html",
  "./v4.js",
  "./assets/guild_hub.jpg",
  "./assets/battle_bg.jpg",
  "./assets/recruit_bg.jpg",
  "./config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // Keep Supabase, exchange-rate API and CDN requests live.
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
