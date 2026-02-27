const CACHE_NAME = "daily-task-cache-v4"; // غير الرقم كل مرة تعدل

self.addEventListener("install", event => {
  self.skipWaiting(); // يجبره يحدث فوراً

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(["./"]);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // يمسح الكاش القديم
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// 👇 ده مهم عشان الكود اللي حطيته في index يشتغل
self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
