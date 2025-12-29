// reserve_change.js (FINAL – standard helper)
(function () {
  console.log("[ReserveChange] script loaded");

  /* ================= FLAG HELPER ================= */
  function getFlag(name) {
    try {
      const flags = JSON.parse(localStorage.getItem("autoFlags") || "{}");
      return flags[name] === true;
    } catch {
      return false;
    }
  }

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
     FLAGS (SYNCED – FINAL)
  ===================================================== */
  const autoChange = getFlag("autoChange");
  const autoReserve = getFlag("autoReserve");

  console.log("[ReserveChange] flags:", { autoChange, autoReserve });

  /* =====================================================
     KONFIG RETRY
  ===================================================== */
  const RETRY_INTERVAL = 400;
  const MAX_RETRY = 15;

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

    if (typeof window.WEB_MoveNewReg === "function") {
      console.log("[ReserveChange] WEB_MoveNewReg ready, trigger");
      clearInterval(retryTimer);
      window.WEB_MoveNewReg();
      return;
    }

    if (reserveBtn) {
      console.log("[ReserveChange] Reserve button found (no func yet)");
      ["mousedown", "mouseup", "click"].forEach((type) =>
        reserveBtn.dispatchEvent(
          new MouseEvent(type, { bubbles: true, cancelable: true })
        )
      );
    }

    if (retryCount >= MAX_RETRY) {
      clearInterval(retryTimer);
      console.warn("[ReserveChange] RETRY STOP – WEB_MoveNewReg tidak tersedia");
    }
  }

  /* =====================================================
     LOGIKA UTAMA
  ===================================================== */

  // ===== RESCHEDULE =====
  if (autoChange && !autoReserve) {
    console.log("[ReserveChange] Auto change ENABLED");
    document
      .querySelector(`[onclick^="WEB_MoveAddressChange"]`)
      ?.click();
    return;
  }

  // ===== RESERVE BARU =====
  if (autoReserve && !autoChange) {
    console.log("[ReserveChange] Auto reserve ENABLED");
    retryTimer = setInterval(tryTriggerReserve, RETRY_INTERVAL);
    tryTriggerReserve();
    return;
  }

  console.log("[ReserveChange] Tidak ada mode aktif");
})();
