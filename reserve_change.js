// reserve_change.js (FINAL – bot baru compatible)
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
     AMBIL FLAG (STRING BASED)
  ===================================================== */
  const autoChange = localStorage.getItem("autoChange") === "true";
  const autoReserve = localStorage.getItem("autoReserve") === "true";

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
      console.log("[ReserveChange] Change button found, clicking...");
      changeBtn.click();
    } else {
      console.log("[ReserveChange] Change button not found");
    }

    return;
  }

  // ===== RESERVE BARU / CEK DALAM =====
  if (autoReserve && !autoChange) {
    console.log("[ReserveChange] Auto reserve ENABLED");

    try {
      const reserveBtn1 = document.getElementById("button");
      const reserveBtn2 = document.querySelector(
        `[onclick^="WEB_MoveNewReg"]`
      );

      if (reserveBtn1) {
        console.log("[ReserveChange] Reserve button #1 found");
        // reserveBtn1.click();
        return;
      }

      if (reserveBtn2) {
        console.log("[ReserveChange] Reserve button #2 found");
        // reserveBtn2.click();
        return;
      }

      console.log("[ReserveChange] Reserve button not found");
    } catch (err) {
      console.error("[ReserveChange] error:", err);
    }

    return;
  }

  /* =====================================================
     DEFAULT
  ===================================================== */
  console.log(
    "[ReserveChange] Tidak ada mode aktif (autoChange / autoReserve)"
  );
})();
