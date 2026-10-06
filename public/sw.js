const CACHE = "control-plane-v3";
const BASE = new URL(self.registration.scope).pathname;
const PLATFORM_AUTH = new URL(self.location.href).searchParams.get("auth") === "platform";
const APP_SHELL = [`${BASE}manifest.webmanifest`, `${BASE}icon.svg`];

self.addEventListener("install", event => {
  if (!PLATFORM_AUTH) event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || PLATFORM_AUTH) return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.mode === "navigate") return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
