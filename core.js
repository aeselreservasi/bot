/* ======================================================
   STORAGE
====================================================== */
const storage = {
  get(key, def = null) {
    const v = GM_getValue(key);
    return v === undefined ? def : v;
  },
  set(key, v) {
    GM_setValue(key, v);
  }
};

/* ======================================================
   STYLE
====================================================== */
GM_addStyle(`
#userscript-data-ui {
  position: fixed;
  width: 380px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,.3);
  z-index: 9999999;
  font-family: Arial, sans-serif;
}
#dm-header {
  background: #2c3e50;
  color: white;
  padding: 8px 10px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}
#dm-header button {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}
#dm-body {
  padding: 10px;
  max-height: 70vh;
  overflow: auto;
}
#dm-body input,
#dm-body textarea,
#dm-body button,
#dm-body select {
  width: 100%;
  margin-bottom: 6px;
  box-sizing: border-box;
}
#dm-body table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
#dm-body td, #dm-body th {
  border: 1px solid #ccc;
  padding: 4px;
}
.button-container button {
  margin-right: 5px;
}
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.7);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 99999999;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 5px solid #eee;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loading-text {
  color: white;
  margin-top: 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }
`);

/* ======================================================
   UI INJECTION
====================================================== */
function injectUI() {
  if (document.getElementById("userscript-data-ui")) return;

  const pos = storage.get("ui-pos", { top: 120, left: 40 });
  const minimized = storage.get("ui-min", false);

  const ui = document.createElement("div");
  ui.id = "userscript-data-ui";
  ui.style.top = pos.top + "px";
  ui.style.left = pos.left + "px";

  ui.innerHTML = `
    <div id="dm-header">
      <span>📦 Data Manager</span>
      <button id="dm-toggle">—</button>
    </div>
    <div id="dm-body" style="${minimized ? "display:none" : ""}">
      <label>Upload JSON</label>
      <input type="file" id="uploadPdf" accept="application/json" multiple>
      <button id="processBtn">Process</button>
      <hr>
      <div id="dataContainer"></div>
    </div>
    <div class="loading-overlay" id="loadingOverlay">
      <div>
        <div class="loading-spinner"></div>
        <div class="loading-text">Processing...</div>
      </div>
    </div>
  `;

  document.body.appendChild(ui);
  enableDrag(ui);
  setupToggle();
}

injectUI();

/* ======================================================
   DRAG
====================================================== */
function enableDrag(panel) {
  const header = panel.querySelector("#dm-header");
  let dragging = false, x, y;

  header.addEventListener("mousedown", e => {
    dragging = true;
    x = e.clientX - panel.offsetLeft;
    y = e.clientY - panel.offsetTop;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", e => {
    if (!dragging) return;
    panel.style.left = e.clientX - x + "px";
    panel.style.top = e.clientY - y + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = "";
    storage.set("ui-pos", {
      top: panel.offsetTop,
      left: panel.offsetLeft
    });
  });
}

/* ======================================================
   TOGGLE
====================================================== */
function setupToggle() {
  const btn = document.getElementById("dm-toggle");
  const body = document.getElementById("dm-body");

  btn.onclick = () => {
    const hidden = body.style.display === "none";
    body.style.display = hidden ? "block" : "none";
    storage.set("ui-min", !hidden);
  };
}

/* ======================================================
   DATA LOGIC (SIMPLIFIED & STABLE)
====================================================== */
const validKeys = [
  "Nama Lengkap","Nomor Telepon","Jenis Ujian","ID Prometrik",
  "Password","Tanggal Lahir","Jenis Kelamin",
  "Lokasi Ujian","Tanggal Ujian","Jam Ujian","Catatan"
];

function orderingJson(j) {
  const o = {};
  validKeys.forEach(k => j[k] !== undefined && (o[k] = j[k]));
  return o;
}

function loadSavedData() {
  const data = storage.get("userData", {});
  document.getElementById("dataContainer").innerHTML =
    createTable(orderingJson(data));
}

function saveData() {
  const obj = {};
  document.querySelectorAll("[id^='input-']").forEach(i => {
    obj[i.id.replace("input-","")] = i.value.trim();
  });
  storage.set("userData", obj);
  alert("Data saved");
}

function createTable(data) {
  const rows = Object.entries(data).map(([k,v]) => `
    <tr>
      <td>${k}</td>
      <td>
        ${["Catatan","Tanggal Ujian","Lokasi Ujian","Jam Ujian"].includes(k)
          ? `<textarea id="input-${k}">${v||""}</textarea>`
          : `<input id="input-${k}" value="${v||""}">`}
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

/* ======================================================
   EVENTS
====================================================== */
document.addEventListener("click", e => {
  if (e.target.id === "saveBtn") saveData();
});

document.getElementById("processBtn").onclick = async () => {
  const files = document.getElementById("uploadPdf").files;
  if (!files.length) return alert("No file selected");

  const overlay = document.getElementById("loadingOverlay");
  overlay.style.display = "flex";

  for (const f of files) {
    const json = JSON.parse(await f.text());
    storage.set("userData", orderingJson(json));
  }

  overlay.style.display = "none";
  loadSavedData();
};

/* ======================================================
   INIT
====================================================== */
loadSavedData();
