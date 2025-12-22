document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  setupEnterKeyHandler();
});

/* =====================================================
   STYLE & LOADING
===================================================== */
const style = document.createElement("style");
style.textContent = `
.loading-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:none;justify-content:center;align-items:center;flex-direction:column;z-index:9999}
.loading-spinner{width:50px;height:50px;border:5px solid #eee;border-top:5px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}
.loading-text{color:#fff;margin-top:10px}
@keyframes spin{to{transform:rotate(360deg)}}
table{width:100%;border-collapse:collapse;margin-top:10px}
td,th{border:1px solid #ccc;padding:6px}
.button-container{margin-top:10px;display:flex;gap:6px}
`;
document.head.appendChild(style);

const overlay = document.createElement("div");
overlay.id = "loadingOverlay";
overlay.className = "loading-overlay";
overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Memproses JSON...</div>`;
document.body.prepend(overlay);

const showLoading = () => (overlay.style.display = "flex");
const hideLoading = () => (overlay.style.display = "none");

/* =====================================================
   CONSTANTS
===================================================== */
const validKeys = ["Nama Lengkap", "Nomor Telepon", "Jenis Ujian", "ID Prometrik", "Password", "Tanggal Lahir", "Jenis Kelamin", "Lokasi Ujian", "Tanggal Ujian", "Jam Ujian", "Catatan"];

/* =====================================================
   UPLOAD / IMPORT JSON
===================================================== */
document.getElementById("processBtn").addEventListener("click", async () => {
  const files = document.getElementById("uploadPdf").files;
  if (!files || files.length === 0) return alert("Pilih file JSON");

  try {
    showLoading();
    let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

    for (const file of files) {
      if (!file.name.endsWith(".json")) continue;

      const json = JSON.parse(await file.text());
      const records = Array.isArray(json) ? json : [json];

      for (const record of records) {
        const normalized = {};
        validKeys.forEach((k) => {
          if (record[k] !== undefined && record[k] !== null) {
            normalized[k] = record[k];
          }
        });

        const result = orderingJson(normalized);

        // 🔒 NORMALISASI AMAN
        result["Tanggal Ujian"] = normalizeTanggal(result["Tanggal Ujian"]);
        result["Lokasi Ujian"] = normalizeArray(result["Lokasi Ujian"]);
        result["Jam Ujian"] = normalizeArray(result["Jam Ujian"]);

        result.id = record.id || Date.now() + Math.random().toString(36).substring(2, 9);

        lists.push(result);
      }
    }

    localStorage.setItem("userDataLists", JSON.stringify(lists));
    hideLoading();
    loadSavedData();
  } catch (err) {
    hideLoading();
    console.error("IMPORT ERROR:", err);
    alert(err.message || "JSON error");
  }
});

/* =====================================================
   LOAD DATA TO UI
===================================================== */
function loadSavedData() {
  const container = document.getElementById("dataContainer");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

  if (lists.length) updateDataListDropdown(lists, userData.id);

  const displayData = userData.id
    ? {
        ...userData,
        "Tanggal Ujian": formatDataToTanggal(userData["Tanggal Ujian"]).join(", "),
        "Lokasi Ujian": (userData["Lokasi Ujian"] || []).join(", "),
        "Jam Ujian": (userData["Jam Ujian"] || []).join(", "),
      }
    : {
        "Nama Lengkap": "",
        "Nomor Telepon": "",
        "Jenis Ujian": "",
        "ID Prometrik": "",
        Password: "",
        "Tanggal Lahir": "",
        "Jenis Kelamin": "",
        "Lokasi Ujian": "",
        "Tanggal Ujian": "",
        "Jam Ujian": "",
        Catatan: "",
      };

  container.innerHTML = createTableInput(orderingJson(displayData));
}

/* =====================================================
   DROPDOWN
===================================================== */
function updateDataListDropdown(dataLists, selectedId) {
  let wrap = document.getElementById("dropdownContainer");
  const dataContainer = document.getElementById("dataContainer");

  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "dropdownContainer";
    wrap.innerHTML = `<label>Pilih Data: </label><select id="dataListDropdown"></select>`;
    dataContainer.parentNode.insertBefore(wrap, dataContainer);
  }

  const dropdown = document.getElementById("dataListDropdown");
  dropdown.innerHTML = `<option value="">-- Pilih Data --</option>`;

  dataLists.forEach((d, i) => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${i + 1}. ${d["Nama Lengkap"] || "Unnamed"} - ${d["Jenis Ujian"] || "-"}`;
    if (d.id === selectedId) opt.selected = true;
    dropdown.appendChild(opt);
  });

  dropdown.onchange = (e) => {
    const id = e.target.value;
    const selected = dataLists.find((d) => d.id === id);
    if (!selected) return;
    localStorage.setItem("userData", JSON.stringify(selected));
    loadSavedData();
  };
}

/* =====================================================
   SAVE / EDIT
===================================================== */
function saveEditedData() {
  const inputs = document.querySelectorAll("[id^='input-']");
  const updated = {};
  inputs.forEach((el) => {
    updated[el.id.replace("input-", "")] = el.value.trim();
  });

  updated["Tanggal Ujian"] = normalizeTanggal(updated["Tanggal Ujian"]);
  updated["Lokasi Ujian"] = cleanAndSplit(updated["Lokasi Ujian"]);
  updated["Jam Ujian"] = cleanAndSplit(updated["Jam Ujian"]);

  let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
  const current = JSON.parse(localStorage.getItem("userData") || "{}");

  updated.id = current.id || Date.now() + Math.random().toString(36).substring(2, 9);

  const idx = lists.findIndex((d) => d.id === updated.id);
  idx >= 0 ? (lists[idx] = updated) : lists.push(updated);

  localStorage.setItem("userData", JSON.stringify(updated));
  localStorage.setItem("userDataLists", JSON.stringify(lists));

  alert("Data berhasil disimpan");
  loadSavedData();
}

/* =====================================================
   EXPORT
===================================================== */
function exportToJSON() {
  const data = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!data.id) return alert("Pilih data dulu!");
  downloadJSON(data, `${data["Nama Lengkap"] || "data"}.json`);
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* =====================================================
   DELETE FUNCTIONS
===================================================== */
function deleteCurrentData() {
  const current = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!current.id) {
    alert("Tidak ada data yang dipilih");
    return;
  }

  if (!confirm("Hapus data ini?")) return;

  let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
  lists = lists.filter((d) => d.id !== current.id);

  localStorage.setItem("userDataLists", JSON.stringify(lists));
  localStorage.removeItem("userData");

  alert("Data berhasil dihapus");
  loadSavedData();
}

function deleteAllData() {
  if (!confirm("HAPUS SEMUA DATA?\nTindakan ini tidak bisa dibatalkan!")) return;

  localStorage.removeItem("userDataLists");
  localStorage.removeItem("userData");

  alert("Semua data berhasil dihapus");
  loadSavedData();
}

/* =====================================================
   TABLE UI
===================================================== */
function createTableInput(data) {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "id")
    .map(([k, v]) => {
      const big = ["Catatan", "Tanggal Ujian", "Lokasi Ujian", "Jam Ujian"].includes(k);
      const input = big ? `<textarea id="input-${k}" style="width:100%">${v || ""}</textarea>` : `<input id="input-${k}" value="${v || ""}" style="width:100%">`;
      return `<tr><td>${k}</td><td>${input}</td></tr>`;
    })
    .join("");

  return `
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      ${rows}
    </table>
    <div class="button-container">
      <button onclick="saveEditedData()">💾 Simpan</button>
      <button onclick="exportToJSON()">📤 Export</button>
      <button onclick="deleteCurrentData()">🗑 Delete</button>
      <button onclick="deleteAllData()">💣 Delete All</button>
    </div>
  `;
}

/* =====================================================
   HELPERS (AMAN & FINAL)
===================================================== */
function normalizeArray(v) {
  if (Array.isArray(v)) return v;
  return cleanAndSplit(v);
}

function normalizeTanggal(v) {
  // ⛔ NULL / UNDEFINED → AMAN
  if (!v) return [];

  // ✅ SUDAH ISO ARRAY
  if (Array.isArray(v) && v.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))) {
    return v;
  }

  // ✅ STRING UI → PARSE
  if (typeof v === "string") {
    return formatTanggalToData(cleanAndSplit(v));
  }

  return [];
}

function cleanAndSplit(input) {
  return String(input || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function orderingJson(json) {
  const out = {};
  validKeys.forEach((k) => {
    if (json[k] !== undefined) out[k] = json[k];
  });
  if (json.id) out.id = json.id;
  return out;
}

/* =====================================================
   TANGGAL FORMATTER
===================================================== */
function formatTanggalToData(arr) {
  const bln = {
    januari: "01",
    februari: "02",
    maret: "03",
    april: "04",
    mei: "05",
    juni: "06",
    juli: "07",
    agustus: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
  };

  return arr
    .map((s) => {
      const m = s.toLowerCase().match(/(\d{1,2})\s(\w+)\s(\d{4})/);
      return m ? `${m[3]}-${bln[m[2]]}-${m[1].padStart(2, "0")}` : null;
    })
    .filter(Boolean);
}

function formatDataToTanggal(arr = []) {
  const bln = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return arr.map((s) => {
    const [y, m, d] = s.split("-");
    return `${parseInt(d)} ${bln[parseInt(m)]} ${y}`;
  });
}

function setupEnterKeyHandler() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      e.preventDefault();
      saveEditedData();
    }
  });
}
