document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  setupEnterKeyHandler();
});

/* ======================================================
   STYLING
====================================================== */
const style = document.createElement("style");
style.textContent = `
.loading-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.7);
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}
.loading-spinner {
  width: 50px; height: 50px;
  border: 5px solid #eee;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text { color:#fff; margin-top:10px }
@keyframes spin { to { transform: rotate(360deg) } }
table { width:100%; border-collapse: collapse; margin-top:10px }
td, th { border:1px solid #ccc; padding:6px }
.button-container { margin-top:10px; display:flex; gap:6px }
`;
document.head.appendChild(style);

/* ======================================================
   LOADING OVERLAY
====================================================== */
const loadingOverlay = document.createElement("div");
loadingOverlay.id = "loadingOverlay";
loadingOverlay.className = "loading-overlay";
loadingOverlay.innerHTML = `
  <div class="loading-spinner"></div>
  <div class="loading-text">Memproses JSON...</div>
`;
document.body.prepend(loadingOverlay);

function showLoading() {
  loadingOverlay.style.display = "flex";
}
function hideLoading() {
  loadingOverlay.style.display = "none";
}

/* ======================================================
   UPLOAD JSON
====================================================== */
document.getElementById("processBtn").addEventListener("click", async () => {
  const files = document.getElementById("uploadPdf").files;
  if (!files || files.length === 0) {
    alert("Silakan pilih file JSON");
    return;
  }

  try {
    showLoading();
    const loadingText = document.querySelector(".loading-text");

    let userDataLists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.endsWith(".json")) continue;

      if (files.length > 1) {
        loadingText.textContent = `Memproses file ${i + 1} dari ${files.length}...`;
      }

      const json = JSON.parse(await file.text());
      const records = Array.isArray(json) ? json : [json];

      for (const record of records) {
        const normalized = {};
        validKeys.forEach((k) => {
          if (record[k] !== undefined && record[k] !== null) {
            normalized[k] = record[k];
          }
        });

        let result = orderingJson(normalized);

        // ===== NORMALISASI DATA (AMAN ARRAY / STRING) =====
        result["Tanggal Ujian"] = normalizeTanggal(result["Tanggal Ujian"]);
        result["Lokasi Ujian"] = normalizeArray(result["Lokasi Ujian"]);
        result["Jam Ujian"] = normalizeArray(result["Jam Ujian"], true);

        result.id =
          record.id ||
          Date.now() + Math.random().toString(36).substring(2, 9);

        userDataLists.push(result);
      }
    }

    localStorage.setItem("userDataLists", JSON.stringify(userDataLists));
    hideLoading();
    location.reload();
  } catch (err) {
    hideLoading();
    console.error("UPLOAD ERROR:", err);
    alert(err.message || "JSON error");
  }
});

/* ======================================================
   LOAD DATA KE UI
====================================================== */
function loadSavedData() {
  const container = document.getElementById("dataContainer");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

  if (lists.length > 0) {
    updateDataListDropdown(lists, userData.id);
  }

  const displayData = userData.id
    ? {
        ...userData,
        "Tanggal Ujian": formatDataToTanggal(userData["Tanggal Ujian"]).join(", "),
        "Lokasi Ujian": formatDataToKota(userData["Lokasi Ujian"]).join(", "),
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
  syncExamFromUserData();
}

/* ======================================================
   DROPDOWN DATA LIST
====================================================== */
function updateDataListDropdown(dataLists, selectedId) {
  let box = document.getElementById("dropdownContainer");
  const dataContainer = document.getElementById("dataContainer");

  if (!box) {
    box = document.createElement("div");
    box.id = "dropdownContainer";
    box.innerHTML = `<label>Pilih Data: </label>
      <select id="dataListDropdown"></select>`;
    dataContainer.parentNode.insertBefore(box, dataContainer);
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
    localStorage.setItem("exam", getExamCodeFromJenisUjian(selected["Jenis Ujian"]));
    location.reload();
  };
}

/* ======================================================
   SAVE / EDIT
====================================================== */
function saveEditedData() {
  const inputs = document.querySelectorAll("[id^='input-']");
  const updated = {};
  inputs.forEach((el) => {
    updated[el.id.replace("input-", "")] = el.value.trim();
  });

  updated["Tanggal Ujian"] = formatTanggalToData(
    cleanAndSplit(updated["Tanggal Ujian"])
  );
  updated["Lokasi Ujian"] = formatKotaToData(
    cleanAndSplit(updated["Lokasi Ujian"])
  );
  updated["Jam Ujian"] = cleanAndSplit(updated["Jam Ujian"]);

  let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
  const current = JSON.parse(localStorage.getItem("userData") || "{}");

  updated.id =
    current.id ||
    Date.now() + Math.random().toString(36).substring(2, 9);

  const idx = lists.findIndex((d) => d.id === updated.id);
  if (idx >= 0) lists[idx] = updated;
  else lists.push(updated);

  localStorage.setItem("userData", JSON.stringify(updated));
  localStorage.setItem("userDataLists", JSON.stringify(lists));
  localStorage.setItem("exam", getExamCodeFromJenisUjian(updated["Jenis Ujian"]));

  alert("Data berhasil disimpan");
  location.reload();
}

/* ======================================================
   EXPORT
====================================================== */
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

/* ======================================================
   DELETE & RESET
====================================================== */
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
  if (confirm("Reset semua data?")) {
    localStorage.clear();
    location.reload();
  }
}

/* ======================================================
   TABLE UI
====================================================== */
function createTableInput(data) {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "id")
    .map(([k, v]) => {
      const big = ["Catatan", "Tanggal Ujian", "Lokasi Ujian", "Jam Ujian"].includes(k);
      const input = big
        ? `<textarea id="input-${k}" style="width:100%">${v || ""}</textarea>`
        : `<input id="input-${k}" value="${v || ""}" style="width:100%">`;
      return `<tr><td>${k}</td><td>${input}</td></tr>`;
    })
    .join("");

  return `
    <table>
      <tr><th>Field</th><th>Value</th></tr>
      ${rows}
    </table>
    <div class="button-container">
      <button onclick="saveEditedData()">Simpan</button>
      <button onclick="exportToJSON()">Export</button>
      <button onclick="deleteCurrentData()">Hapus</button>
      <button onclick="resetData()">Reset</button>
    </div>
  `;
}

/* ======================================================
   HELPERS
====================================================== */
const validKeys = [
  "Nama Lengkap",
  "Nomor Telepon",
  "Jenis Ujian",
  "ID Prometrik",
  "Password",
  "Tanggal Lahir",
  "Jenis Kelamin",
  "Lokasi Ujian",
  "Tanggal Ujian",
  "Jam Ujian",
  "Catatan",
];

function normalizeArray(v, defJam = false) {
  if (Array.isArray(v)) return v;
  const arr = cleanAndSplit(v);
  return arr.length ? arr : defJam ? ["09:15"] : [];
}

function normalizeTanggal(v) {
  if (Array.isArray(v)) return v;
  return formatTanggalToData(cleanAndSplit(v));
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

function setupEnterKeyHandler() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName === "INPUT") {
      e.preventDefault();
      saveEditedData();
    }
  });
}
