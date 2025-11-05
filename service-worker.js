// ⚡ Microcontroller Code Vault - Offline Cache & Auto-Update with Progress Tracker
const CACHE_NAME = "mc-code-vault-v1";

// 🧱 Core UI files
const CORE_FILES = [
  "/",
  "/index.html",
  "/style-v2.css",
  "/script.js",
  "/manifest.json",
  "/assets/favicon.png",
  "/assets/micro_logo.png",
  "/assets/Caution.png",
  "/assets/HD Logo PNG.png"
];

// ✅ Pre-cache all practical .txt files
const PRACTICAL_FILES = [
  "/assets/pr_1.txt",
  "/assets/pr_2.txt",
  "/assets/pr_3.txt",
  "/assets/pr_4.txt",
  "/assets/pr_5.txt",
  "/assets/pr_6.txt",
  "/assets/pr_7.txt",
  "/assets/pr_8.txt"
];

const ALL_CACHE_FILES = [...CORE_FILES, ...PRACTICAL_FILES];

// 🧱 INSTALL EVENT — Precache and send progress
self.addEventListener("install", event => {
  console.log("📦 Installing service worker & caching all files...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      let cachedCount = 0;
      const totalFiles = ALL_CACHE_FILES.length;

      for (const file of ALL_CACHE_FILES) {
        try {
          await cache.add(file);
        } catch (error) {
          console.warn("⚠️ Failed to cache:", file, error);
        } finally {
          cachedCount++;
          const progress = Math.round((cachedCount / totalFiles) * 100);
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({ type: "CACHE_PROGRESS", progress });
            });
          });
        }
      }

      self.skipWaiting();
    })()
  );
});

// ♻️ ACTIVATE EVENT — Clean old caches
self.addEventListener("activate", event => {
  console.log("♻️ Activating new service worker...");
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 🌐 FETCH EVENT — Serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);
      return cachedResponse || fetchPromise;
    })
  );
});

// 🔄 MESSAGE LISTENER — Trigger immediate update
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
