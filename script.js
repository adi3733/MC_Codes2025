// 🧩 Microcontroller Code Vault v5.0 — Full Offline + DOCX Download from Cache

const practicals = [
  { id: 1, name: "Practical 1", desc: "Simple Program on Memory Transfer", 
    files: [{ name: "pr_1.txt", path: "/assets/pr_1.txt" }, { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }],
    output: "/assets/Outputs/MC_PRACTICAL_1_out.docx"
  },
  { id: 2, name: "Practical 2", desc: "Parallel Port Interfacing of LEDs",
    files: [
      { name: "Flashing LEDs.txt", path: "/assets/Pr_2/Flashing LEDs.txt" },
      { name: "LED Binary Counter.txt", path: "/assets/Pr_2/LED Binary Counter.txt" },
      { name: "Ring Counter (Left Rotation).txt", path: "/assets/Pr_2/Ring Counter (Left Rotation).txt" },
      { name: "Ring Counter Left & Right Shift.txt", path: "/assets/Pr_2/Ring Counter Left & Right Shift.txt" },
      { name: "Alternate LED Flashing (EvenOdd Pattern).txt", path: "/assets/Pr_2/Alternate LED Flashing (EvenOdd Pattern).txt" },
      { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }
    ],
    output: "/assets/Outputs/MC_PRACTICAL_2_out.docx"
  },
  { id: 3, name: "Practical 3", desc: "Waveform Generation using DAC",
    files: [
      { name: "Square_wave.txt", path: "/assets/Pr_3/Square_wave.txt" },
      { name: "Triangular_wave.txt", path: "/assets/Pr_3/Triangular_wave.txt" },
      { name: "Ramp_wave.txt", path: "/assets/Pr_3/Ramp_wave.txt" },
      { name: "Staircase_wave.txt", path: "/assets/Pr_3/Staircase_wave.txt" },
      { name: "Trapezoidal_wave.txt", path: "/assets/Pr_3/Trapezoidal_wave.txt" },
      { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }
    ],
    output: "/assets/Outputs/MC_PRACTICAL_3_out.docx"
  },
  { id: 4, name: "Practical 4", desc: "Interfacing Push Buttons, LEDs, Relay & Buzzer",
    files: [
      { name: "LED_Toggle.txt", path: "/assets/Pr_4/LED_Toggle.txt" },
      { name: "LED_Buzzer_Relay.txt", path: "/assets/Pr_4/LED_Buzzer_Relay.txt" }
    ],
    output: "/assets/Outputs/MC_PRACTICAL_4_out.docx"
  },
  { id: 5, name: "Practical 5", desc: "Interfacing LCD to Display Message", 
    files: [{ name: "pr_5.txt", path: "/assets/pr_5.txt" }],
    output: "/assets/Outputs/MC_PRACTICAL_5_out.docx"
  },
  { id: 6, name: "Practical 6", desc: "Generate square wave using timer with interrupt", 
    files: [{ name: "pr_6.txt", path: "/assets/pr_6.txt" }],
    output: "/assets/Outputs/MC_PRACTICAL_6_out.docx"
  },
  { id: 7, name: "Practical 7", desc: "Interfacing serial port with PC (both side communication)", 
    files: [{ name: "pr_7.txt", path: "/assets/pr_7.txt" }],
    output: "/assets/Outputs/MC_PRACTICAL_7_out.docx"
  },
  { id: 8, name: "Practical 8", desc: "Interface analog voltage 0-5V to ADC and display value on LCD", 
    files: [{ name: "pr_8.txt", path: "/assets/pr_8.txt" }],
    output: "/assets/Outputs/MC_PRACTICAL_8_out.docx"
  }
];

// 🌟 DOM Elements
const list = document.getElementById("practicalList");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const fileTabs = document.getElementById("fileTabs");
const closeBtn = document.getElementById("closeBtn");
const cacheProgress = document.getElementById("cacheProgress");

// 🧱 Render Practical Cards
practicals.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";
  const count = p.files.length;
  card.innerHTML = `<h3>${p.name}</h3><span>${p.desc} — ${count} file${count > 1 ? "s" : ""}</span>`;
  card.onclick = () => openPopup(p);
  list.appendChild(card);
});

// 🌐 Popup Logic
let currentCode = "";
let currentFontSize = 0.95;

function openPopup(p) {
  popup.style.display = "flex";
  popupTitle.textContent = `${p.name}: ${p.desc}`;
  fileTabs.innerHTML = "";

  p.files.forEach((f, idx) => {
    const btn = document.createElement("button");
    btn.className = "file-tab";
    btn.textContent = f.name;
    btn.onclick = (e) => { e.stopPropagation(); setActiveFile(p, idx); };
    fileTabs.appendChild(btn);
  });

  const controls = document.querySelector(".popup-controls");
  controls.innerHTML = "";

  // 📘 Offline Download Button (DOCX)
  if (p.output) {
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "⬇️ Download Output (.docx)";
    downloadBtn.className = "copy-btn";
    downloadBtn.onclick = async () => {
      try {
        // Try to get from cache first
        const cache = await caches.open("microcontroller-vault-v4");
        const cachedResponse = await cache.match(p.output);
        let blob;

        if (cachedResponse) {
          blob = await cachedResponse.blob(); // ✅ offline mode
        } else {
          const res = await fetch(p.output); // online fallback
          blob = await res.blob();
          cache.put(p.output, res.clone());
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = p.output.split("/").pop();
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        alert("⚠️ File not available offline yet. Please open online once to cache it.");
        console.error("Download failed:", err);
      }
    };
    controls.appendChild(downloadBtn);
  }

  // 🔤 Font & Copy Buttons
  const fontMinus = document.createElement("button");
  fontMinus.textContent = "−";
  fontMinus.className = "font-btn";
  fontMinus.onclick = () => {
    if (currentFontSize > 0.6) {
      currentFontSize -= 0.1;
      popupCode.style.fontSize = `${currentFontSize}rem`;
    }
  };

  const fontPlus = document.createElement("button");
  fontPlus.textContent = "+";
  fontPlus.className = "font-btn";
  fontPlus.onclick = () => {
    currentFontSize += 0.1;
    popupCode.style.fontSize = `${currentFontSize}rem`;
  };

  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋 Copy Code";
  copyBtn.className = "copy-btn";
  copyBtn.onclick = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy Code"), 1500);
  };

  controls.appendChild(fontMinus);
  controls.appendChild(fontPlus);
  controls.appendChild(copyBtn);

  setActiveFile(p, 0);
}

function setActiveFile(practical, index) {
  const tabs = Array.from(fileTabs.children);
  tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
  const file = practical.files[index];

  fetch(file.path)
    .then((res) => res.text())
    .then((code) => {
      currentCode = code;
      popupCode.textContent = code;
      popupCode.style.fontSize = `${currentFontSize}rem`;
    })
    .catch(() => (popupCode.textContent = `⚠️ Unable to load file: ${file.name}`));
}

closeBtn.onclick = () => (popup.style.display = "none");

// 🕒 Build Timestamp
document.getElementById("buildVersion").textContent = new Date().toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short"
});

// 🧱 Cache Progress from Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "CACHE_PROGRESS") {
      const percent = event.data.progress;
      cacheProgress.style.display = "block";
      cacheProgress.textContent = `Downloading for offline use: ${percent}%`;
      if (percent >= 100) {
        setTimeout(() => (cacheProgress.textContent = "✅ Ready to use offline!"), 800);
      }
    }
  });
}
