/* -------------------------------------------------------------
   Microcontroller Code Vault - Full Offline Cache + DOCX Output Support
   Author: Adiii
   Version: 3.0
-------------------------------------------------------------- */

const CACHE_NAME = "microcontroller-vault-v3";
const CACHE_ASSETS = [
  "/",
  "/index.html",
  "/style-v2.css",
  "/script.js",
  "/manifest.json",
  "/favicon.ico",
  "/HD Logo PNG.png",
  "/micro_logo.png",
  "/Caution.png",

  // ---- Practicals ----
  "/assets/pr_1.txt",
  "/assets/STARTUP.txt",

  // Practical 2
  "/assets/Pr_2/Flashing LEDs.txt",
  "/assets/Pr_2/LED Binary Counter.txt",
  "/assets/Pr_2/Ring Counter (Left Rotation).txt",
  "/assets/Pr_2/Ring Counter Left & Right Shift.txt",
  "/assets/Pr_2/Alternate LED Flashing (EvenOdd Pattern).txt",

  // Practical 3
  "/assets/Pr_3/Square_wave.txt",
  "/assets/Pr_3/Triangular_wave.txt",
  "/assets/Pr_3/Ramp_wave.txt",
  "/assets/Pr_3/Staircase_wave.txt",
  "/assets/Pr_3/Trapezoidal_wave.txt",

  // Practical 4
  "/assets/Pr_4/LED_Toggle.txt",
  "/assets/Pr_4/LED_Buzzer_Relay.txt",

  // Practical 5
  "/assets/pr_5.txt",

  // Practical 6
  "/assets/pr_6.txt",

  // Practical 7
  "/assets/pr_7.txt",

  // Practical 8
  "/assets/pr_8.txt",

  // ---- Output DOCX Files ----
  "/assets/Outputs/MC_PRACTICAL_1_out.docx",
  "/assets/Outputs/MC_PRACTICAL_2_out.docx",
  "/assets/Outputs/MC_PRACTICAL_3_out.docx",
  "/assets/Outputs/MC_PRACTICAL_4_out.docx",
  "/assets/Outputs/MC_PRACTICAL_5_out.docx",
  "/assets/Outputs/MC_PRACTICAL_6_out.docx",
  "/assets/Outputs/MC_PRACTICAL_7_out.docx",
  "/assets/Outputs/MC_PRACTICAL_8_out.docx"
];

/* ----------------------------
   INSTALL EVENT - Pre-cache all assets
----------------------------- */
self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching assets...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const total = CACHE_ASSETS.length;
      let done = 0;

      for (const url of CACHE_ASSETS) {
        try {
          await cache.add(url);
          done++;
          // 🔁 Send progress update to all clients
          const clientsList = await self.clients.matchAll();
          clientsList.forEach((client) =>
            client.postMessage({
              type: "CACHE_PROGRESS",
              progress: Math.round((done / total) * 100),
            })
          );
        } catch (err) {
          console.warn("[SW] ⚠️ Failed to cache:", url);
        }
      }
    })()
  );

  self.skipWaiting(); // Activate immediately
});

/* ----------------------------
   ACTIVATE EVENT - Clean old caches
----------------------------- */
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating new service worker...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Start controlling open clients immediately
});

/* ----------------------------
   FETCH EVENT - Serve cached files first
----------------------------- */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) {
        // ✅ Serve from cache
        return cachedRes;
      }

      // 🌐 Otherwise fetch from network and cache dynamically
      return fetch(event.request)
        .then((fetchRes) => {
          if (!fetchRes || fetchRes.status !== 200 || fetchRes.type !== "basic") {
            return fetchRes;
          }

          const resClone = fetchRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          return fetchRes;
        })
        .catch(() => {
          // 🧱 Fallback: return index.html if offline and request is a page
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
