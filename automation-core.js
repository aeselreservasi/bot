(function () {
  /* ================= CONFIG ================= */

  const col1 = ["autoLogin", "autoExam", "autoReserve", "autoTarget", "autoPayMethod", "autoConfirm"];
  const col2 = ["autoCheck", "autoInput", "autoChange", "autoFastTarget", "autoPayCC", "autoBegal"];
  const settingsKeys = [...col1, ...col2];

  // Mapping nama checkbox ke label tampilannya
  const labelMap = {
    autoLogin: "LOGIN",
    autoCheck: "SKIP CHECK",
    autoExam: "EXAM SELECT",
    autoInput: "DATA INPUT",
    autoReserve: "RESERVATION",
    autoChange: "RESCHEDULE",
    autoTarget: "NORMAL TARGET",
    autoFastTarget: "FAST TARGET",
    autoPayMethod: "PAYMENT METHOD",
    autoPayCC: "PAYMENT CC",
    autoConfirm: "CONFIRM",
    autoBegal: "STANDBY CONFIRM",
  };

  /* ================= STYLE ================= */

  const style = `
    * { box-sizing: border-box; }
    #panel { position: fixed; top: 120px; left: 40px; width: 340px; background: #121212; color: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.4); font-family: Arial, sans-serif; z-index: 999999; }
    #header { cursor: move; background: #1e1e1e; padding: 10px; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0; font-weight: bold; }
    #header button { background: none; border: none; color: #aaa; cursor: pointer; font-size: 14px; }
    #header button:hover { color: #fff; }
    #content { padding: 10px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .col { display: flex; flex-direction: column; }
    .item { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 13px; cursor: pointer; user-select: none; }
    .item input { cursor: pointer; }
    .btns { display: flex; gap: 6px; margin-top: 10px; }
    .btns button { flex: 1; cursor: pointer; padding: 6px; border-radius: 6px; border: none; background: #2a2a2a; color: #fff; }
    .btns button:hover { background: #3a3a3a; }
    #mini { position: fixed; width: 44px; height: 44px; border-radius: 50%; background: #1e1e1e; color: #fff; display: none; align-items: center; justify-content: center; cursor: pointer; z-index: 999999; box-shadow: 0 5px 15px rgba(0,0,0,.4); font-size: 18px; }
  `;

  /* ================= DRAG ================= */

  function makeDraggable(el, handle, Storage, key) {
    const pos = Storage.get(key, { top: 120, left: 40 });
    el.style.top = pos.top + "px";
    el.style.left = pos.left + "px";

    let sx, sy, st, sl;

    handle.onmousedown = (e) => {
      sx = e.clientX;
      sy = e.clientY;
      st = el.offsetTop;
      sl = el.offsetLeft;
      document.onmousemove = move;
      document.onmouseup = up;
    };

    function move(e) {
      el.style.top = st + (e.clientY - sy) + "px";
      el.style.left = sl + (e.clientX - sx) + "px";
    }

    function up() {
      Storage.set(key, { top: el.offsetTop, left: el.offsetLeft });
      document.onmousemove = document.onmouseup = null;
    }
  }

  /* ================= INIT ================= */

  window.AutomationCore = {
    initAutomationUI(Storage) {
      const host = document.createElement("div");
      const shadow = host.attachShadow({ mode: "open" });

      shadow.innerHTML = `
        <style>${style}</style>

        <div id="panel">
          <div id="header">
            <span>AUTO</span>
            <button id="min">_</button>
          </div>

          <div id="content">
            <div class="grid">
              <div class="col">
                ${col1
                  .map(
                    (k) => `
                    <label class="item">
                      <input type="checkbox" name="${k}">
                      <span>${labelMap[k]}</span>
                    </label>
                  `,
                  )
                  .join("")}
              </div>

              <div class="col">
                ${col2
                  .map(
                    (k) => `
                    <label class="item">
                      <input type="checkbox" name="${k}">
                      <span>${labelMap[k]}</span>
                    </label>
                  `,
                  )
                  .join("")}
              </div>
            </div>

            <div class="btns">
              <button id="on">ALL</button>
              <button id="off">OFF</button>
            </div>
          </div>
        </div>

        <div id="mini">⚙</div>
      `;

      document.body.appendChild(host);

      const panel = shadow.getElementById("panel");
      const header = shadow.getElementById("header");
      const mini = shadow.getElementById("mini");

      makeDraggable(panel, header, Storage, "panelPos");
      makeDraggable(mini, mini, Storage, "miniPos");

      /* ===== LOAD STATE ===== */
      settingsKeys.forEach((k) => {
        shadow.querySelector(`[name="${k}"]`).checked = Storage.get(k, false);
      });

      shadow.addEventListener("change", (e) => {
        if (e.target.name) {
          Storage.set(e.target.name, e.target.checked);
        }
      });

      shadow.getElementById("on").onclick = () =>
        settingsKeys.forEach((k) => {
          const el = shadow.querySelector(`[name="${k}"]`);
          el.checked = true;
          Storage.set(k, true);
        });

      shadow.getElementById("off").onclick = () =>
        settingsKeys.forEach((k) => {
          const el = shadow.querySelector(`[name="${k}"]`);
          el.checked = false;
          Storage.set(k, false);
        });

      /* ===== MINIMIZE ===== */
      shadow.getElementById("min").onclick = () => {
        panel.style.display = "none";
        mini.style.display = "flex";
      };

      mini.onclick = () => {
        mini.style.display = "none";
        panel.style.display = "block";
      };

      console.log("AutomationCore initialized (FIX 2 COLUMN with custom labels)");
    },
  };
})();
