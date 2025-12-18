/* =========================
   STORAGE WRAPPER
========================= */
const storage = {
  get(key, defaultValue = null) {
    const val = GM_getValue(key);
    return val === undefined ? defaultValue : val;
  },
  set(key, value) {
    GM_setValue(key, value);
  },
  remove(key) {
    GM_setValue(key, undefined);
  }
};

/* =========================
   STYLE INJECTION
========================= */
GM_addStyle(`
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 999999;
}
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #eee;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text {
  color: white;
  margin-top: 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.container {
  background: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  max-width: 600px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
td, th {
  border: 1px solid #ccc;
  padding: 6px;
}
.button-container button {
  margin-right: 5px;
}
`);

/* =========================
   UI INJECTION
========================= */
function injectUI() {
  if (document.getElementById("userscript-data-ui")) return;

  const wrapper = document.createElement("div");
  wrapper.id = "userscript-data-ui";
  wrapper.innerHTML = `
    <div class="container">
      <label>Upload data</label>
      <input type="file" id="uploadPdf" accept="application/json" multiple />
      <button id="processBtn">Process</button>
    </div>
    <div id="dataContainer"></div>
    <div class="loading-overlay" id="loadingOverlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">Processing...</div>
    </div>
  `;
  document.body.prepend(wrapper);
}

injectUI();

/* =========================
   LOADING
========================= */
function showLoading(text = "Processing...") {
  const overlay = document.getElementById("loadingOverlay");
  overlay.querySelector(".loading-text").textContent = text;
  overlay.style.display = "flex";
}
function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

/* =========================
   CONSTANTS
========================= */
const validKeys = [
  "Nama Lengkap","Nomor Telepon","Jenis Ujian","ID Prometrik",
  "Password","Tanggal Lahir","Jenis Kelamin",
  "Lokasi Ujian","Tanggal Ujian","Jam Ujian","Catatan"
];

const listUjian = {
  "F10-E10J": "JFT",
  "T20-J11J": "PM",
  "T10-J11J": "RESTO"
};

const reverseListUjian = Object.entries(listUjian)
  .reduce((a,[k,v]) => (a[v.toLowerCase()] = k, a), {});

/* =========================
   HELPERS
========================= */
function orderingJson(json) {
  const out = {};
  validKeys.forEach(k => json[k] !== undefined && (out[k] = json[k]));
  return out;
}

function cleanAndSplit(v) {
  if (!v) return [];
  if (Array.isArray(v)) v = v.join(",");
  return String(v).replace(/\s*,\s*/g, ",").split(",");
}

function getExamCodeFromJenisUjian(jenis) {
  if (!jenis) return "";
  const lower = jenis.toLowerCase();
  return Object.entries(reverseListUjian)
    .find(([k]) => lower.includes(k))?.[1] || "";
}

/* =========================
   LOAD & SAVE
========================= */
function loadSavedData() {
  const data = storage.get("userData", {});
  const lists = storage.get("userDataLists", []);

  if (lists.length) updateDropdown(lists, data.id);

  const display = Object.keys(data).length ? data : {
    "Nama Lengkap": "",
    "Jenis Ujian": "",
    "Nomor Telepon": "",
    "ID Prometrik": "",
    "Password": "",
    "Tanggal Lahir": "",
    "Jenis Kelamin": "",
    "Lokasi Ujian": "",
    "Tanggal Ujian": "",
    "Jam Ujian": "",
    "Catatan": ""
  };

  document.getElementById("dataContainer").innerHTML =
    createTableInput(orderingJson(display));
}

function saveEditedData() {
  const inputs = [...document.querySelectorAll("[id^='input-']")];
  const updated = {};
  inputs.forEach(i => updated[i.id.replace("input-","")] = i.value.trim());

  const lists = storage.get("userDataLists", []);
  updated.id = updated.id || Date.now().toString();

  const idx = lists.findIndex(d => d.id === updated.id);
  idx >= 0 ? lists[idx] = updated : lists.push(updated);

  storage.set("userData", updated);
  storage.set("userDataLists", lists);

  alert("Data saved");
  loadSavedData();
}

/* =========================
   UI RENDER
========================= */
function createTableInput(data) {
  const rows = Object.entries(data)
    .filter(([k]) => k !== "id")
    .map(([k,v]) => `
      <tr>
        <td>${k}</td>
        <td>
          ${["Catatan","Tanggal Ujian","Lokasi Ujian","Jam Ujian"].includes(k)
            ? `<textarea id="input-${k}">${v || ""}</textarea>`
            : `<input id="input-${k}" value="${v || ""}">`}
        </td>
      </tr>
    `).join("");

  return `
    <table>
      <tr><th>Key</th><th>Value</th></tr>
      ${rows}
    </table>
    <div class="button-container">
      <button id="saveBtn">Save</button>
    </div>
  `;
}

function updateDropdown(lists, selectedId) {
  let sel = document.getElementById("dataListDropdown");
  if (!sel) {
    sel = document.createElement("select");
    sel.id = "dataListDropdown";
    document.body.prepend(sel);
  }
  sel.innerHTML = `<option value="">Pilih Data</option>`;
  lists.forEach((d,i)=>{
    const o = document.createElement("option");
    o.value = d.id;
    o.textContent = `${i+1}. ${d["Nama Lengkap"] || "Unnamed"}`;
    if (d.id === selectedId) o.selected = true;
    sel.appendChild(o);
  });
  sel.onchange = () => {
    const d = lists.find(x=>x.id===sel.value);
    storage.set("userData", d || {});
    loadSavedData();
  };
}

/* =========================
   EVENTS
========================= */
document.addEventListener("click", e => {
  if (e.target.id === "saveBtn") saveEditedData();
});

document.getElementById("processBtn").onclick = async () => {
  const files = document.getElementById("uploadPdf").files;
  if (!files.length) return alert("No file");

  showLoading(`Processing ${files.length} file(s)...`);

  const lists = storage.get("userDataLists", []);

  for (const file of files) {
    const json = JSON.parse(await file.text());
    const records = Array.isArray(json) ? json : [json];
    records.forEach(r=>{
      const n = orderingJson(r);
      n.id = Date.now() + Math.random();
      lists.push(n);
    });
  }

  storage.set("userDataLists", lists);
  hideLoading();
  loadSavedData();
};

/* =========================
   INIT
========================= */
loadSavedData();
