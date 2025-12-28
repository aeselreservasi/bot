(function () {
  "use strict";

  /* ============ CONFIG ============ */
  const appData =
    window.myAppData ||
    JSON.parse(localStorage.getItem("bot_master_data") || "{}");

  const ENABLED = appData?.auto_flags?.autoCheck;

  if (!ENABLED) {
    console.log("[Check] autoCheck disabled");
    return;
  }

  const path = location.pathname.toLowerCase();
  console.log("[Check] Running on:", path);

  /* ============ HELPER ============ */
  function retry(fn, times = 10, delay = 500) {
    const timer = setInterval(() => {
      try {
        if (fn()) clearInterval(timer);
      } catch (e) {
        console.log("[Check] retry error:", e);
      }
      if (--times <= 0) clearInterval(timer);
    }, delay);
  }

  function humanClick(btn, label) {
    const delay = 1200 + Math.random() * 800;
    console.log(`[Check] ${label} → waiting ${Math.round(delay)}ms`);
    setTimeout(() => {
      btn.click();
      console.log(`[Check] ${label} clicked`);
    }, delay);
  }

  /* ============ POLICY ============ */
  if (path.includes("/reserve/policy")) {
    retry(() => {
      const chk = document.getElementById("chkPL");
      if (!chk) return false;

      chk.click();
      console.log("[Check] Policy checkbox checked");

      const btn =
        document.querySelector(`input[onclick*="checkPolicy"]`) ||
        document.querySelector(`button[onclick*="checkPolicy"]`);

      if (!btn) return false;

      humanClick(btn, "Go to PrivateChk");
      return true;
    });
  }

  /* ============ PRIVATE CHECK ============ */
  else if (path.includes("/reserve/privatechk")) {
    retry(() => {
      const btn =
        document.querySelector(`input[onclick*="Next('./Attention')"]`) ||
        document.querySelector(`button[onclick*="Next('./Attention')"]`);

      if (!btn) return false;

      humanClick(btn, "Go to Attention");
      return true;
    });
  }

  /* ============ ATTENTION ============ */
  else if (path.includes("/reserve/attention")) {
    retry(() => {
      const btn =
        document.querySelector(`button[onclick="agree('ExamSelect')"]`) ||
        document.querySelector(`input[onclick="agree('ExamSelect')"]`);

      if (!btn) return false;

      humanClick(btn, "Agree & go to ExamSelect");
      return true;
    });
  }
})();
