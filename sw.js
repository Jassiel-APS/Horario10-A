const CACHE = 'horario-cache-v1';
const ASSETS = ['./','./index.html','./horario.html','./style.css','./horario.js','./manifest.json','./offline.html','./icons/icon-192x192.png','./icons/icon-512x512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=> Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

// Estrategia: network-first, fallback a cache, finalmente offline.html
self.addEventListener('fetch', e=>{
  if(e.request.method !== 'GET') return;
  const req = e.request;
  e.respondWith(
    fetch(req).then(res=>{
      // actualizar cache en segundo plano
      const copy = res.clone();
      caches.open(CACHE).then(cache=>{ cache.put(req, copy).catch(()=>{}); });
      return res;
    }).catch(()=> caches.match(req).then(r=> r || caches.match('./offline.html') ))
  );
});