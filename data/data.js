document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  setupEnterKeyHandler();
});

// --- STYLING (DIINJEKSI VIA JS) ---
const style = document.createElement("style");
style.textContent = `
.loading-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
  justify-content: center; align-items: center; z-index: 9999; display: none;
}
.loading-spinner {
  width: 50px; height: 50px; border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db; border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text { color: white; margin-top: 15px; font-size: 16px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
table, th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
.button-container { margin-top: 15px; display: flex; gap: 10px; }
`;
document.head.appendChild(style);

// --- UI LOADING OVERLAY ---
const loadingOverlay = document.createElement("div");
loadingOverlay.id = "loadingOverlay";
loadingOverlay.className = "loading-overlay";
loadingOverlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Memproses JSON...</div>`;
document.body.insertBefore(loadingOverlay, document.body.firstChild);

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}
function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

// --- LOGIKA UTAMA: PROSES FILE JSON ---
document.getElementById("processBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("uploadPdf");
  const files = fileInput.files;

  if (!files || files.length === 0) {
    alert("Silakan pilih file JSON yang valid.");
    return;
  }

  try {
    showLoading();
    const loadingText = document.querySelector(".loading-text");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.endsWith(".json")) continue;

      if (files.length > 1) loadingText.textContent = `Memproses file ${i + 1} dari ${files.length}...`;

      const text = await file.text();
      let jsonData = JSON.parse(text);
      const records = Array.isArray(jsonData) ? jsonData : [jsonData];

      // Ambil data lama dari localStorage
      let userDataLists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

      for (const record of records) {
        const normalized = {};
        validKeys.forEach((key) => {
          if (record[key] !== undefined && record[key] !== null) normalized[key] = record[key];
        });

        let result = orderingJson(normalized);

        // Transformasi Data
        result["Tanggal Ujian"] = formatTanggalToData(cleanAndSplit(String(result["Tanggal Ujian"] || "")));
        result["Lokasi Ujian"] = formatKotaToData(cleanAndSplit(String(result["Lokasi Ujian"] || "")));
        result["Jam Ujian"] = ubahJamUjian(cleanAndSplit(String(result["Jam Ujian"] || "")));

        // Tambahkan ID Unik
        result.id = Date.now() + Math.random().toString(36).substring(2, 9);
        userDataLists.push(result);
      }

      localStorage.setItem("userDataLists", JSON.stringify(userDataLists));
    }

    hideLoading();
    location.reload();
  } catch (error) {
    hideLoading();
    console.error("Error processing JSON:", error);
    alert("Terjadi kesalahan saat memproses file JSON.");
  }
});

// --- FUNGSI LOAD DATA ---
function loadSavedData() {
  const dataContainer = document.getElementById("dataContainer");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userDataLists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

  if (userDataLists.length > 0) {
    updateDataListDropdown(userDataLists, userData.id);
  }

  const displayData =
    Object.keys(userData).length > 0
      ? {
          ...userData,
          "Lokasi Ujian": formatDataToKota(userData["Lokasi Ujian"]),
          "Tanggal Ujian": formatDataToTanggal(userData["Tanggal Ujian"]),
          "Jam Ujian": ubahJamUjian(userData["Jam Ujian"]),
        }
      : {
          "Lokasi Ujian": [],
          "Tanggal Ujian": [],
          "Jam Ujian": [],
          "Nama Lengkap": "",
          "Jenis Ujian": "",
          "Nomor Telepon": "",
          "ID Prometrik": "",
          Password: "",
          "Tanggal Lahir": "",
          "Jenis Kelamin": "",
          Catatan: "",
        };

  dataContainer.innerHTML = createTableInput(orderingJson(displayData));

  // Event Delegation Tombol
  const btnContainer = document.querySelector(".button-container");
  if (btnContainer) {
    btnContainer.onclick = (e) => {
      const id = e.target.id;
      if (id === "saveBtn") saveEditedData();
      else if (id === "exportBtn") exportToJSON();
      else if (id === "resetBtn") {
        if (confirm("Reset semua data?")) resetData();
      } else if (id === "deleteBtn") {
        if (confirm("Hapus data aktif?")) deleteCurrentData();
      }
    };
  }

  syncExamFromUserData();
}

// --- FUNGSI DROPDOWN ---
function updateDataListDropdown(dataLists, selectedId = null) {
  const dataContainer = document.getElementById("dataContainer");
  let container = document.getElementById("dropdownContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "dropdownContainer";
    container.innerHTML = `<label>Pilih Data: </label><select id="dataListDropdown"></select>`;
    dataContainer.parentNode.insertBefore(container, dataContainer);
  }

  const dropdown = document.getElementById("dataListDropdown");
  dropdown.innerHTML = `<option value="">-- Pilih Data --</option>`;

  dataLists.forEach((data, index) => {
    const opt = document.createElement("option");
    opt.value = data.id;
    opt.textContent = `${index + 1}. ${data["Nama Lengkap"] || "Unnamed"} - ${data["Jenis Ujian"] || "Unknown"}`;
    if (selectedId && data.id === selectedId) opt.selected = true;
    dropdown.appendChild(opt);
  });

  dropdown.onchange = (e) => {
    const id = e.target.value;
    const lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
    const selected = lists.find((d) => d.id === id) || {};
    localStorage.setItem("userData", JSON.stringify(selected));
    localStorage.setItem("exam", getExamCodeFromJenisUjian(selected["Jenis Ujian"]));
    location.reload();
  };
}

// --- FUNGSI SAVE & EDIT ---
function saveEditedData() {
  const inputs = document.querySelectorAll("[id^='input-']");
  const updatedData = {};
  inputs.forEach((input) => {
    const key = input.id.replace("input-", "");
    updatedData[key] = input.value.trim();
  });

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  let userDataLists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

  const currentId = userData.id || Date.now() + Math.random().toString(36).substring(2, 9);
  updatedData.id = currentId;

  // Format ke standar storage
  updatedData["Tanggal Ujian"] = formatTanggalToData(cleanAndSplit(updatedData["Tanggal Ujian"]));
  updatedData["Lokasi Ujian"] = formatKotaToData(cleanAndSplit(updatedData["Lokasi Ujian"]));
  updatedData["Jam Ujian"] = ubahJamUjian(cleanAndSplit(updatedData["Jam Ujian"]));

  const idx = userDataLists.findIndex((d) => d.id === currentId);
  if (idx !== -1) userDataLists[idx] = updatedData;
  else userDataLists.push(updatedData);

  localStorage.setItem("userData", JSON.stringify(updatedData));
  localStorage.setItem("userDataLists", JSON.stringify(userDataLists));
  localStorage.setItem("exam", getExamCodeFromJenisUjian(updatedData["Jenis Ujian"]));

  alert("Data Berhasil Disimpan.");
  location.reload();
}

function deleteCurrentData() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
  lists = lists.filter((d) => d.id !== userData.id);
  localStorage.setItem("userDataLists", JSON.stringify(lists));
  localStorage.removeItem("userData");
  localStorage.removeItem("exam");
  location.reload();
}

function resetData() {
  localStorage.clear();
  location.reload();
}

// --- FUNGSI EXPORT ---
function exportToJSON() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!userData.id) return alert("Pilih data dulu!");

  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${userData["Nama Lengkap"] || "data"}.json`;
  a.click();
}

// --- FUNGSI TABEL HTML ---
function createTableInput(data) {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "id")
    .map(([key, val]) => {
      const isBig = ["Catatan", "Tanggal Ujian", "Lokasi Ujian", "Jam Ujian"].includes(key);
      const input = isBig ? `<textarea style="width:100%" id="input-${key}">${val || ""}</textarea>` : `<input type="text" style="width:100%" id="input-${key}" value="${val || ""}" />`;
      return `<tr><td>${key}</td><td>${input}</td></tr>`;
    })
    .join("");

  return `<table><tr><th>Field</th><th>Value</th></tr>${rows}</table>
          <div class='button-container'>
            <button id='saveBtn'>Simpan</button><button id='exportBtn'>Export</button>
            <button id='deleteBtn'>Hapus</button><button id='resetBtn'>Reset Semua</button>
          </div>`;
}

// --- HELPER FUNCTIONS (TANGGAL, KOTA, JAM) ---
const validKeys = ["Nama Lengkap", "Nomor Telepon", "Jenis Ujian", "ID Prometrik", "Password", "Tanggal Lahir", "Jenis Kelamin", "Lokasi Ujian", "Tanggal Ujian", "Jam Ujian", "Catatan"];

const listUjian = {
  "F10-E10J": "JFT",
  "T20-J11J": "PM",
  "T10-J11J": "RESTO",
  "JH0-I11J": "KGINDO",
  "JH0-I12J": "KGJAPAN",
  "NC0-I11J": "PERTANIAN",
  "NC0-I12J": "PETERNAKAN",
  "FS0-J11J": "PERIKANAN",
  "YS0-J11J": "AKUAKULTUR",
};

function getExamCodeFromJenisUjian(jenis) {
  if (!jenis) return "";
  const entry = Object.entries(listUjian).find(([code, name]) => jenis.toUpperCase().includes(name));
  return entry ? entry[0] : "";
}

function formatTanggalToData(arr) {
  const bln = { januari: "01", februari: "02", maret: "03", april: "04", mei: "05", juni: "06", juli: "07", agustus: "08", september: "09", oktober: "10", november: "11", desember: "12" };
  return arr
    .map((s) => {
      const m = s.toLowerCase().match(/(\d{1,2})\s(\w+)\s(\d{4})/);
      return m ? `${m[3]}-${bln[m[2]]}-${m[1].padStart(2, "0")}` : null;
    })
    .filter(Boolean);
}

function formatDataToTanggal(arr) {
  const bln = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return (
    arr?.map((s) => {
      const [y, m, d] = s.split("-");
      return `${parseInt(d)} ${bln[parseInt(m)]} ${y}`;
    }) || []
  );
}

function formatKotaToData(cities) {
  const cityMap = { "Jakarta Timur": "IOJ02", Surabaya: "IOJ03", "Bandung Andir": "IOJ04", Medan: "IOJ06", Denpasar: "IOJ09" }; // Sebagian contoh
  return cities.map((c) => cityMap[c] || c);
}

function formatDataToKota(codes) {
  const cityMap = { IOJ02: "Jakarta Timur", IOJ03: "Surabaya", IOJ04: "Bandung Andir", IOJ06: "Medan", IOJ09: "Denpasar" };
  return codes?.map((c) => cityMap[c] || c) || [];
}

function ubahJamUjian(arr) {
  let def = ["09:15", "10:00", "10:45", "11:30", "13:00", "15:00"];
  return Array.isArray(arr) && arr.length > 0 ? [...new Set(arr)] : def;
}

function orderingJson(json) {
  const out = {};
  validKeys.forEach((k) => {
    if (json[k] !== undefined) out[k] = json[k];
  });
  if (json.id) out.id = json.id;
  return out;
}

function cleanAndSplit(input) {
  return String(input || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function syncExamFromUserData() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const computed = getExamCodeFromJenisUjian(userData["Jenis Ujian"]);
  if (computed) localStorage.setItem("exam", computed);
}

function setupEnterKeyHandler() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      e.preventDefault();
      saveEditedData();
    }
  });
}
