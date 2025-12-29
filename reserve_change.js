// reserve_change.js (FINAL – FIX PROMETRIC CLICK)
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
     FLAG
  ===================================================== */
  const autoChange = localStorage.getItem("autoChange") === "true";
  const autoReserve = localStorage.getItem("autoReserve") === "true";

  /* =====================================================
     UTIL: PROMETRIC SAFE CLICK
  ===================================================== */
  function prometricClick(el) {
    if (!el) return false;

    try {
      // 1️⃣ direct call (PALING KUAT)
      if (typeof window.WEB_MoveNewReg === "function") {
        console.log("[ReserveChange] call WEB_MoveNewReg()");
        window.WEB_MoveNewReg();
        return true;
      }

      // 2️⃣ native mouse events
      ["mousedown", "mouseup", "click"].forEach((type) => {
        el.dispatchEvent(
          new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );
      });

      return true;
    } catch (e) {
      console.error("[ReserveChange] click error", e);
      return false;
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
      console.log("[ReserveChange] Change button found");
      changeBtn.click();
    } else {
      console.log("[ReserveChange] Change button not found");
    }
    return;
  }

  // ===== RESERVE BARU =====
  if (autoReserve && !autoChange) {
    console.log("[ReserveChange] Auto reserve ENABLED");

    const reserveBtn =
      document.getElementById("button") ||
      document.querySelector(`[onclick^="WEB_MoveNewReg"]`);

    if (!reserveBtn) {
      console.log("[ReserveChange] Reserve button not found");
      return;
    }

    console.log("[ReserveChange] Reserve button found, trying to click…");

    // TUNGGU SEDIKIT (PROMETRIC SERING TELAT INIT)
    setTimeout(() => {
      const success = prometricClick(reserveBtn);
      console.log(
        success
          ? "[ReserveChange] Reserve triggered"
          : "[ReserveChange] Reserve failed"
      );
    }, 300);

    return;
  }

  console.log(
    "[ReserveChange] Tidak ada mode aktif (autoChange / autoReserve)"
  );
})();
