/* -------------------------------------------------------------
   Microcontroller Code Vault - Offline PWA Cache
   Author: Adiii
   Version: 2.0
-------------------------------------------------------------- */

const CACHE_NAME = "microcontroller-vault-v2";
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

  // ---- Practicals (all 8) ----
  "/assets/pr_1.txt",
  "/assets/STARTUP.txt",

  // Practical 2 (LED)
  "/assets/Pr_2/Flashing LEDs.txt",
  "/assets/Pr_2/LED Binary Counter.txt",
  "/assets/Pr_2/Ring Counter (Left Rotation).txt",
  "/assets/Pr_2/Ring Counter Left & Right Shift.txt",
  "/assets/Pr_2/Alternate LED Flashing (EvenOdd Pattern).txt",

  // Practical 3 (DAC Waveforms)
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
  "/assets/pr_8.txt"
];

/* ----------------------------
   Install Event
   Precache entire app & codes
----------------------------- */
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Installing...");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching files...");
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

/* ----------------------------
   Activate Event
   Clear old caches
----------------------------- */
self.addEventListener("activate", (e) => {
  console.log("[Service Worker] Activating...");
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

/* ----------------------------
   Fetch Event
   Serve cached files offline
----------------------------- */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Serve cached version if available
      return (
        response ||
        fetch(e.request).then((fetchRes) => {
          // Dynamic cache for new files
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    }).catch(() => {
      // Optional: fallback HTML page if offline and not cached
      if (e.request.destination === "document") {
        return caches.match("/index.html");
      }
    })
  );
});
