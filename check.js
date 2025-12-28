(function () {
  "use strict";

  /* ============ CONFIG ============ */
  const ENABLED = window.myAppData?.flags?.autoCheck;

  if (!ENABLED) {
    console.log("[Check] autoCheck disabled");
    return;
  }

  const path = location.pathname;
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

  /* ============ POLICY ============ */
  if (path.includes("/Reserve/Policy")) {
    retry(() => {
      const chk = document.getElementById("chkPL");
      if (!chk) return false;

      chk.click();
      console.log("[Check] Policy checkbox checked");

      const btn = document.querySelector(`input[onclick*="checkPolicy"]`) || document.querySelector(`button[onclick*="checkPolicy"]`);

      if (btn) {
        btn.click();
        console.log("[Check] Go to PrivateChk");
        return true;
      }
      return false;
    });
  } else if (path.includes("/Reserve/PrivateChk")) {
    /* ============ PRIVATE CHECK ============ */
    retry(() => {
      const btn = document.querySelector(`input[onclick*="Next('./Attention')"]`) || document.querySelector(`button[onclick*="Next('./Attention')"]`);

      if (!btn) return false;

      btn.click();
      console.log("[Check] Go to Attention");
      return true;
    });
  }
    } else if (path.includes("/Reserve/Attention")) {
      /* ============ ATTENTION ============ */
      retry(() => {
        const btn = document.querySelector(`input[onclick*="agree"]`) || document.querySelector(`button[onclick*="agree"]`);

        if (!btn) return false;

        btn.click();
        console.log("[Check] Agree clicked (delayed)");
        return true;
      });
    }
})();
