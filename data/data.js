document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  setupEnterKeyHandler();
});

/* ================== LOADING UI ================== */
const style = document.createElement("style");
style.textContent = `
.loading-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:none;z-index:9999;justify-content:center;align-items:center;flex-direction:column}
.loading-spinner{width:50px;height:50px;border:5px solid #eee;border-top:5px solid #3498db;border-radius:50%;animation:spin 1s linear infinite}
.loading-text{color:#fff;margin-top:10px}
@keyframes spin{to{transform:rotate(360deg)}}
table{width:100%;border-collapse:collapse}
td,th{border:1px solid #ccc;padding:6px}
.button-container{margin-top:10px;display:flex;gap:6px}
`;
document.head.appendChild(style);

const overlay = document.createElement("div");
overlay.id = "loadingOverlay";
overlay.className = "loading-overlay";
overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Memproses...</div>`;
document.body.prepend(overlay);

const showLoading = () => (overlay.style.display = "flex");
const hideLoading = () => (overlay.style.display = "none");

/* ================== UPLOAD JSON ================== */
document.getElementById("processBtn").addEventListener("click", async () => {
  const files = document.getElementById("uploadPdf").files;
  if (!files.length) return alert("Pilih file JSON");

  try {
    showLoading();
    let list = JSON.parse(localStorage.getItem("userDataLists") || "[]");

    for (const file of files) {
      if (!file.name.endsWith(".json")) continue;
      const raw = JSON.parse(await file.text());
      const records = Array.isArray(raw) ? raw : [raw];

      for (const r of records) {
        const o = orderingJson(r);

        o["Tanggal Ujian"] = normalizeTanggal(o["Tanggal Ujian"]);
        o["Lokasi Ujian"] = normalizeArray(o["Lokasi Ujian"]);
        o["Jam Ujian"] = normalizeArray(o["Jam Ujian"], true);

        o.id = Date.now() + Math.random().toString(36).slice(2);
        list.push(o);
      }
    }

    localStorage.setItem("userDataLists", JSON.stringify(list));
    hideLoading();
    location.reload();
  } catch (e) {
    hideLoading();
    console.error(e);
    alert("JSON error");
  }
});

/* ================== LOAD UI ================== */
function loadSavedData() {
  const active = JSON.parse(localStorage.getItem("userData") || "{}");
  const lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");

  if (lists.length) updateDataListDropdown(lists, active.id);

  const uiData = active.id
    ? {
        ...active,
        "Tanggal Ujian": formatDataToTanggal(active["Tanggal Ujian"]).join(", "),
        "Lokasi Ujian": formatDataToKota(active["Lokasi Ujian"]).join(", "),
        "Jam Ujian": (active["Jam Ujian"] || []).join(", "),
      }
    : {};

  document.getElementById("dataContainer").innerHTML = createTableInput(orderingJson(uiData));
}

/* ================== SAVE ================== */
function saveEditedData() {
  const inputs = document.querySelectorAll("[id^=input-]");
  const data = {};
  inputs.forEach((i) => (data[i.id.replace("input-", "")] = i.value));

  data["Tanggal Ujian"] = formatTanggalToData(cleanAndSplit(data["Tanggal Ujian"]));
  data["Lokasi Ujian"] = formatKotaToData(cleanAndSplit(data["Lokasi Ujian"]));
  data["Jam Ujian"] = cleanAndSplit(data["Jam Ujian"]);

  let lists = JSON.parse(localStorage.getItem("userDataLists") || "[]");
  const id = JSON.parse(localStorage.getItem("userData") || "{}").id || Date.now();
  data.id = id;

  const idx = lists.findIndex((d) => d.id === id);
  idx >= 0 ? (lists[idx] = data) : lists.push(data);

  localStorage.setItem("userData", JSON.stringify(data));
  localStorage.setItem("userDataLists", JSON.stringify(lists));
  localStorage.setItem("exam", getExamCodeFromJenisUjian(data["Jenis Ujian"]));
  alert("Disimpan");
  location.reload();
}

/* ================== EXPORT ================== */
function exportToJSON() {
  const d = JSON.parse(localStorage.getItem("userData") || "{}");
  if (!d.id) return alert("Pilih data dulu");
  downloadJSON(d, `${d["Nama Lengkap"] || "data"}.json`);
}

/* ================== HELPERS ================== */
function normalizeArray(v, defJam = false) {
  if (Array.isArray(v)) return v;
  const arr = cleanAndSplit(v);
  return arr.length ? arr : defJam ? ["09:15"] : [];
}

function normalizeTanggal(v) {
  if (Array.isArray(v) && v[0]?.includes("-")) return v;
  return formatTanggalToData(cleanAndSplit(v));
}
