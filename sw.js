// Offline support. Pages: network first (always newest when online). Everything else: cache first.
const CACHE = 'gym-plan-v1';
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "img/0018-a.webp", "img/0018-b.webp", "img/0025-a.webp", "img/0025-b.webp", "img/0048-a.webp", "img/0048-b.webp", "img/0055-a.webp", "img/0055-b.webp", "img/0066-a.webp", "img/0066-b.webp", "img/0080-a.webp", "img/0080-b.webp", "img/0081-a.webp", "img/0081-b.webp", "img/0103-a.webp", "img/0103-b.webp", "img/0117-a.webp", "img/0117-b.webp", "img/0118-a.webp", "img/0118-b.webp", "img/0119-a.webp", "img/0119-b.webp", "img/0123-a.webp", "img/0123-b.webp", "img/0124-a.webp", "img/0124-b.webp", "img/0127-a.webp", "img/0127-b.webp", "img/butterfly-machine-a.webp", "img/butterfly-machine-b.webp", "img/wide-grip-lat-pull-down-a.webp", "img/wide-grip-lat-pull-down-b.webp"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res; })
      .catch(() => caches.match('index.html')));
    return;
  }
  const sameOrigin = url.origin === location.origin;
  const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !fonts) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
