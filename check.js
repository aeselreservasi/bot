(function () {
  "use strict";

  const ENABLED = window.myAppData?.flags?.autoCheck;
  if (!ENABLED) {
    console.log("[Check] autoCheck disabled");
    return;
  }

  const path = location.pathname;
  console.log("[Check] Running on:", path);

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

  /* ========= POLICY ========= */
  if (path.includes("/Reserve/Policy")) {
    retry(() => {
      const chk = document.getElementById("chkPL");
      if (!chk) return false;

      chk.click();

      const btn =
        document.querySelector(`input[onclick^="checkPolicy"]`) ||
        document.querySelector(`button[onclick^="checkPolicy"]`);

      if (!btn) return false;

      btn.click();
      console.log("[Check] Policy accepted");
      return true;
    });
  }

  /* ========= PRIVATE CHECK ========= */
  else if (path.includes("/Reserve/PrivateChk")) {
    retry(() => {
      const btn =
        document.querySelector(`input[onclick="javascript:Next('./Attention')"]`) ||
        document.querySelector(`button[onclick="javascript:Next('./Attention')"]`);

      if (!btn) return false;

      btn.click();
      console.log("[Check] PrivateChk passed");
      return true;
    });
  }

  /* ========= ATTENTION ========= */
  else if (path.includes("/Reserve/Attention")) {
    retry(() => {
      const btn =
        document.querySelector(`input[onclick="agree('ExamSelect')"]`) ||
        document.querySelector(`button[onclick="agree('ExamSelect')"]`);

      if (!btn) return false;

      btn.click();
      console.log("[Check] Attention agreed");
      return true;
    });
  }
})();
