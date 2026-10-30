/* Service worker: membuat aplikasi bisa dibuka tanpa internet. Letakkan di folder yang sama dengan index.html */
var CACHE='jamul-barakat-v1';
var CORE=['./','./index.html'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){if(res&&res.ok&&res.type==='basic')c.put(r,res.clone());return res}).catch(function(){return hit||(r.mode==='navigate'?c.match('./index.html'):undefined)});
      return hit||net;
    });
  }));
});
