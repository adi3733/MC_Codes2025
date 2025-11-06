/* -------------------------------------------------------------
   Microcontroller Code Vault - Full Offline Ready (with User Complete Message)
   Author: Adiii
   Version: 6.0
-------------------------------------------------------------- */

const CACHE_NAME = "microcontroller-vault-v6";
const CACHE_ASSETS = [
  "/", "/index.html", "/style-v2.css", "/script.js", "/manifest.json",
  "/favicon.ico", "/HD Logo PNG.png", "/micro_logo.png", "/Caution.png",

  // ---- Practicals ----
  "/assets/pr_1.txt", "/assets/STARTUP.txt",

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

  // Practical 5–8
  "/assets/pr_5.txt",
  "/assets/pr_6.txt",
  "/assets/pr_7.txt",
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
   INSTALL EVENT - Cache everything with progress
----------------------------- */
self.addEventListener("install", (event) => {
  console.log("[SW] Installing and caching all assets...");

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const total = CACHE_ASSETS.length;
      let done = 0;

      for (const url of CACHE_ASSETS) {
        try {
          await cache.add(url);
          done++;
          const percent = Math.round((done / total) * 100);
          // Send progress update
          const clientsList = await self.clients.matchAll();
          clientsList.forEach(client => client.postMessage({
            type: "CACHE_PROGRESS",
            progress: percent
          }));

          // When done 100% → send "CACHE_COMPLETE"
          if (done === total) {
            clientsList.forEach(client => client.postMessage({
              type: "CACHE_COMPLETE"
            }));
          }
        } catch (err) {
          console.warn("[SW] ⚠️ Failed to cache:", url);
        }
      }
    })()
  );

  self.skipWaiting();
});

/* ----------------------------
   ACTIVATE EVENT
----------------------------- */
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated new version:", CACHE_NAME);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  self.clients.claim();
});

/* ----------------------------
   FETCH EVENT
----------------------------- */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      if (cachedRes) return cachedRes;
      return fetch(event.request)
        .then(fetchRes => {
          const clone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return fetchRes;
        })
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
