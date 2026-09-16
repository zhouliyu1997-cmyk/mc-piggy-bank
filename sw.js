
const CACHE = "mc-piggy-pwa-v22-v9-3-party-revive";
const APP_SHELL = [
  "./",
  "./index.html",
  "./v4.js",
  "./v9.css",
  "./v9.js",
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

  const core = /\/(?:index\.html|v9\.js|v9\.css|v4\.js|sw\.js)(?:\?|$)/.test(url.pathname + url.search);
  if (core) {
    event.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
  })));
});
