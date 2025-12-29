(function () {
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
    console.warn("[payMethod] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[payMethod] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  const autoPayMethod = getFlag("autoPayMethod");
  console.log("[payMethod] autoPayMethod =", autoPayMethod);

  if (!autoPayMethod) {
    console.log("[payMethod] autoPayMethod disabled");
    return;
  }

  /* =====================================================
     SELECT PAYMENT METHOD
  ===================================================== */
  const payRadio = document.querySelector(`input[value="zotapay"]`);
  if (!payRadio) {
    console.warn("[payMethod] zotapay option not found");
    return;
  }

  payRadio.click();
  console.log("[payMethod] zotapay selected");

  /* =====================================================
     NEXT
  ===================================================== */
  try {
    document.querySelector(`input[onclick="nextPay();"]`)?.click();
  } catch (e) {
    document.querySelector(`button[onclick="nextPay();"]`)?.click();
  }
})();
