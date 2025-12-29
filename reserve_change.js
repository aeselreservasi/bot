// reserve_change.js (FINAL – autoFlags synced)
(function () {
  console.log("[ReserveChange] script loaded");

  /* =====================================================
     HARD GUARD – USER AKTIF
  ===================================================== */
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    console.warn("[ReserveChange] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[ReserveChange] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  let autoFlags = {};
  try {
    autoFlags = JSON.parse(localStorage.getItem("autoFlags") || "{}");
  } catch {}

  const autoChange = autoFlags.autoChange === true;
  const autoReserve = autoFlags.autoReserve === true;

  console.log("[ReserveChange] flags:", { autoChange, autoReserve });

  /* =====================================================
     KONFIG RETRY
  ===================================================== */
  const RETRY_INTERVAL = 400; // ms
  const MAX_RETRY = 15;       // total ±6 detik

  let retryCount = 0;
  let retryTimer = null;

  /* =====================================================
     PROMETRIC TRIGGER
  ===================================================== */
  function tryTriggerReserve() {
    retryCount++;

    const reserveBtn =
      document.getElementById("button") ||
      document.querySelector(`[onclick^="WEB_MoveNewReg"]`);

    const hasFunc = typeof window.WEB_MoveNewReg === "function";

    if (hasFunc) {
      console.log("[ReserveChange] WEB_MoveNewReg ready, trigger");
      clearInterval(retryTimer);
      window.WEB_MoveNewReg();
      return;
    }

    if (reserveBtn) {
      console.log("[ReserveChange] Reserve button found (no func yet)");

      ["mousedown", "mouseup", "click"].forEach((type) => {
        reserveBtn.dispatchEvent(
          new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      });
    }

    if (retryCount >= MAX_RETRY) {
      clearInterval(retryTimer);
      console.warn(
        "[ReserveChange] RETRY STOP – WEB_MoveNewReg tidak tersedia"
      );
    }
  }

  /* =====================================================
     LOGIKA UTAMA
  ===================================================== */

  // ===== RESCHEDULE =====
  if (autoChange && !autoReserve) {
    console.log("[ReserveChange] Auto change ENABLED");

    const changeBtn = document.querySelector(
      `[onclick^="WEB_MoveAddressChange"]`
    );

    if (changeBtn) {
      changeBtn.click();
    } else {
      console.log("[ReserveChange] Change button not found");
    }
    return;
  }

  // ===== RESERVE BARU =====
  if (autoReserve && !autoChange) {
    console.log("[ReserveChange] Auto reserve ENABLED");

    retryTimer = setInterval(tryTriggerReserve, RETRY_INTERVAL);
    tryTriggerReserve(); // immediate try
    return;
  }

  console.log(
    "[ReserveChange] Tidak ada mode aktif (autoChange / autoReserve)"
  );
})();
