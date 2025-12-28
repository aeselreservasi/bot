(function () {
  const data = window.__BOT_DATA__;
  if (!data) return;

  const path = location.pathname.toLowerCase();
  console.log("[BOT] Logic running on", path);

  /* ============ LOGIN ============ */
  if (path.includes("/reserve/login")) {
    const t = setInterval(() => {
      const id = document.querySelector("#inputPrometricID");
      const pw = document.querySelector("#inputPassword");
      const btn = document.querySelector("button[name='B1']");
      if (!id || !pw || !btn) return;

      id.value = data.id_prometrik;
      pw.value = data.password;
      id.dispatchEvent(new Event("input", { bubbles: true }));
      pw.dispatchEvent(new Event("input", { bubbles: true }));

      if (!btn.disabled) {
        btn.click();
        clearInterval(t);
        console.log("[BOT] Login submitted");
      }
    }, 300);
  }

  /* ============ POLICY ============ */
  if (path.includes("/reserve/policy")) {
    const t = setInterval(() => {
      const chk = document.getElementById("chkPL");
      const btn = document.querySelector("[onclick*='checkPolicy']");
      if (!chk || !btn) return;

      chk.click();
      btn.click();
      clearInterval(t);
      console.log("[BOT] Policy accepted");
    }, 300);
  }

  /* ============ PRIVATE ============ */
  if (path.includes("/reserve/privatechk")) {
    const t = setInterval(() => {
      const btn = document.querySelector("[onclick*=\"Next('./Attention')\"]");
      if (!btn) return;
      btn.click();
      clearInterval(t);
      console.log("[BOT] PrivateChk done");
    }, 300);
  }

  /* ============ ATTENTION (FULL AUTO) ============ */
  if (path.includes("/reserve/attention")) {
    const t = setInterval(() => {
      const btn = document.querySelector("button[onclick=\"agree('ExamSelect')\"]");
      if (!btn) return;
      btn.click();
      clearInterval(t);
      console.log("[BOT] Attention agreed (native)");
    }, 300);
  }

  /* ============ TEST LIST ============ */
  if (path.includes("/reserve/testlist")) {
    if (data.layanan === "reservasi") {
      document.querySelector("#button")?.click();
      console.log("[BOT] Reservasi baru");
    } else if (data.layanan === "reschedule") {
      document.querySelector("[onclick^='WEB_MoveAddressChange']")?.click();
      console.log("[BOT] Reschedule");
    }
  }
})();
