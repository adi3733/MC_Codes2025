// 🧩 Microcontroller Code Vault by TechhBuddies
// Supports multi-file practicals (txt/asm/c files) with file switching tabs

const practicals = [
{
  id: 1,
  name: "Practical 1",
  desc: "Simple Program on Memory Transfer",
  files: [
    { name: "pr_1.txt", path: "/assets/pr_1.txt" },
    { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }
  ]
},

{
  id: 2,
  name: "Practical 2",
  desc: "Parallel Port Interfacing of LEDs",
  files: [
    { name: "Flashing LEDs.txt", path: "/assets/Pr_2/Flashing LEDs.txt" },
    { name: "LED Binary Counter.txt", path: "/assets/Pr_2/LED Binary Counter.txt" },
    { name: "Ring Counter (Left Rotation).txt", path: "/assets/Pr_2/Ring Counter (Left Rotation).txt" },
    { name: "Ring Counter Left & Right Shift.txt", path: "/assets/Pr_2/Ring Counter Left & Right Shift.txt" },
    { name: "Alternate LED Flashing (EvenOdd Pattern).txt", path: "/assets/Pr_2/Alternate LED Flashing (EvenOdd Pattern).txt" },
    { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }
  ]
},

{
  id: 3,
  name: "Practical 3",
  desc: "Waveform Generation using DAC",
  files: [
    { name: "Square_wave.txt", path: "/assets/Pr_3/Square_wave.txt" },
    { name: "Triangular_wave.txt", path: "/assets/Pr_3/Triangular_wave.txt" },
    { name: "Ramp_wave.txt", path: "/assets/Pr_3/Ramp_wave.txt" },
    { name: "Staircase_wave.txt", path: "/assets/Pr_3/Staircase_wave.txt" },
    { name: "Trapezoidal_wave.txt", path: "/assets/Pr_3/Trapezoidal_wave.txt" },
    { name: "STARTUP.txt", path: "/assets/STARTUP.txt" }
  ]
},
{
  id: 4,
  name: "Practical 4",
  desc: "Interfacing Push Buttons, LEDs, Relay & Buzzer",
  files: [
    { name: "LED Blinking Only", path: "/assets/Pr_4/LED_Toggle.txt" },
    { name: "LED_Buzzer_Relay.txt", path: "/assets/Pr_4/LED_Buzzer_Relay.txt" }
  ]
},

  {
    id: 5,
    name: "Practical 5",
    desc: "Interfacing LCD to Display Message",
    files: [
      { name: "pr_5.txt", path: "/assets/pr_5.txt" }
    ]
  },
  {
    id: 6,
    name: "Practical 6",
    desc: "Generate square wave using timer with interrupt",
    files: [
      { name: "pr_6.txt", path: "/assets/pr_6.txt" }
    ]
  },
  {
    id: 7,
    name: "Practical 7",
    desc: "Interfacing serial port with PC (both side communication)",
    files: [
      { name: "pr_7.txt", path: "/assets/pr_7.txt" }
    ]
  },
  {
    id: 8,
    name: "Practical 8",
    desc: "Interface analog voltage 0-5V to ADC and display value on LCD",
    files: [
      { name: "pr_8.txt", path: "/assets/pr_8.txt" }
    ]
  }
];

// 🌟 DOM Elements
const list = document.getElementById("practicalList");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const copyBtn = document.getElementById("copyBtn");
const closeBtn = document.getElementById("closeBtn");
const fileTabs = document.getElementById("fileTabs");

// 🧱 Render Practical Cards
practicals.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";
  const count = p.files.length;
  card.innerHTML = `
    <h3>${p.name}</h3>
    <span>${p.desc} — ${count} file${count > 1 ? "s" : ""}</span>
  `;
  card.onclick = () => openPopup(p);
  list.appendChild(card);
});

// 🌐 Popup Logic
let currentCode = "";
let currentFontSize = 0.95;

function openPopup(p) {
  popupTitle.textContent = `${p.name}: ${p.desc}`;
  popup.style.display = "flex";

  // Create file tabs
  fileTabs.innerHTML = "";
  p.files.forEach((f, idx) => {
    const btn = document.createElement("button");
    btn.className = "file-tab";
    btn.textContent = f.name;
    btn.onclick = (e) => {
      e.stopPropagation();
      setActiveFile(p, idx);
    };
    fileTabs.appendChild(btn);
  });

  // Load first file by default
  setActiveFile(p, 0);
}

function setActiveFile(practical, index) {
  const tabs = Array.from(fileTabs.children);
  tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
  const file = practical.files[index];

  fetch(file.path)
    .then(res => {
      if (!res.ok) throw new Error("File not found");
      return res.text();
    })
    .then(code => {
      currentCode = code;
      popupCode.textContent = code;
      copyBtn.textContent = "📋 Copy Code";
      popupCode.style.fontSize = `${currentFontSize}rem`;
    })
    .catch(() => {
      popupCode.textContent = `⚠️ Unable to load file: ${file.name}`;
    });
}

// 📋 Copy Function
copyBtn.onclick = () => {
  if (!currentCode) return;
  navigator.clipboard.writeText(currentCode);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => (copyBtn.textContent = "📋 Copy Code"), 1500);
};

// 🔤 Font Size Controls
const fontPlus = document.getElementById("fontPlus");
const fontMinus = document.getElementById("fontMinus");

fontPlus.onclick = () => {
  currentFontSize += 0.1;
  popupCode.style.fontSize = `${currentFontSize}rem`;
};

fontMinus.onclick = () => {
  if (currentFontSize > 0.6) {
    currentFontSize -= 0.1;
    popupCode.style.fontSize = `${currentFontSize}rem`;
  }
};

// ❌ Close Popup
closeBtn.onclick = () => {
  popup.style.display = "none";
};

// 🕒 Build Timestamp
const buildVersion = document.getElementById("buildVersion");
const now = new Date();
buildVersion.textContent = now.toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});


// 📱 Layout Switch (1-column ↔ 2-column for mobile)
const toggleBtn = document.getElementById("toggleLayout");
const layoutContainer = document.getElementById("layoutToggleContainer");
const grid = document.getElementById("practicalList");

if (window.innerWidth <= 600) {
  layoutContainer.style.display = "block";
  let isTwoColumn = false;

  toggleBtn.addEventListener("click", () => {
    isTwoColumn = !isTwoColumn;

    if (isTwoColumn) {
      grid.style.gridTemplateColumns = "repeat(2, 1fr)";
      toggleBtn.textContent = "📋 Switch to 1-Column Layout";
    } else {
      grid.style.gridTemplateColumns = "1fr";
      toggleBtn.textContent = "🔳 Switch to 2-Column Layout";
    }
  });
} else {
  layoutContainer.style.display = "none";
}


// 🧱 Listen for cache progress messages from service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data && event.data.type === "CACHE_PROGRESS") {
      const percent = event.data.progress;
      const progressEl = document.getElementById("cacheProgress");

      if (progressEl) {
        progressEl.style.display = "block";
        progressEl.textContent = `Downloading for offline use: ${percent}%`;

        if (percent >= 100) {
          setTimeout(() => {
            progressEl.textContent = "✅ Ready to use offline!";
          }, 500);
        }
      }
    }
  });
}
