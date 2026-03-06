var C = 'codeqr-v3';
var CORE = ['./app.html','./manifest.json','./icon.svg','./apple-touch-icon.png'];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(C).then(function(ca){ return ca.addAll(CORE); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== C; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  e.respondWith(caches.match(e.request).then(function(cached){
    if (cached) return cached;
    return fetch(e.request).then(function(r){
      var cl = r.clone();
      caches.open(C).then(function(ca){ ca.put(e.request, cl); });
      return r;
    });
  }));
});
self.addEventListener('message', function(e){ if (e.data==='SKIP_WAITING') self.skipWaiting(); });
