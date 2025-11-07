/* -------------------------------------------------------------
   Microcontroller Code Vault - Offline Ready + Manual ZIP Support
   Author: Adiii | Version: 7.0
-------------------------------------------------------------- */

const CACHE_NAME = "microcontroller-vault-v6";
const CACHE_ASSETS = [
  "/", "/index.html", "/style-v2.css", "/script.js", "/manifest.json",
  "/favicon.ico", "/HD Logo PNG.png", "/micro_logo.png", "/Caution.png",

  // Practicals + DOCX
  "/assets/pr_1.txt", "/assets/STARTUP.txt",
  "/assets/Pr_2/Flashing LEDs.txt",
  "/assets/Pr_2/LED Binary Counter.txt",
  "/assets/Pr_2/Ring Counter (Left Rotation).txt",
  "/assets/Pr_2/Ring Counter Left & Right Shift.txt",
  "/assets/Pr_2/Alternate LED Flashing (EvenOdd Pattern).txt",
  "/assets/Pr_3/Square_wave.txt",
  "/assets/Pr_3/Triangular_wave.txt",
  "/assets/Pr_3/Ramp_wave.txt",
  "/assets/Pr_3/Staircase_wave.txt",
  "/assets/Pr_3/Trapezoidal_wave.txt",
  "/assets/Pr_4/LED_Toggle.txt",
  "/assets/Pr_4/LED_Buzzer_Relay.txt",
  "/assets/pr_5.txt", "/assets/pr_6.txt", "/assets/pr_7.txt", "/assets/pr_8.txt",
  "/assets/Outputs/MC_PRACTICAL_1_out.docx",
  "/assets/Outputs/MC_PRACTICAL_2_out.docx",
  "/assets/Outputs/MC_PRACTICAL_3_out.docx",
  "/assets/Outputs/MC_PRACTICAL_4_out.docx",
  "/assets/Outputs/MC_PRACTICAL_5_out.docx",
  "/assets/Outputs/MC_PRACTICAL_6_out.docx",
  "/assets/Outputs/MC_PRACTICAL_7_out.docx",
  "/assets/Outputs/MC_PRACTICAL_8_out.docx",

  // ZIP File
  // ZIP File (renamed to remove space)
"/assets/MC_Dtaa.zip"

];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing assets...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(CACHE_ASSETS);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match("/index.html"));
    })
  );
});
