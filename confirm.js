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
    console.warn("[confirm] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[confirm] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  const autoConfirm = getFlag("autoConfirm");

  console.log("[confirm] autoConfirm =", autoConfirm);

  /* =====================================================
     INPUT NOMOR TELEPON
  ===================================================== */
  const phoneValue = userData["Nomor Telepon"] || "0";

  const telInput =
    document.querySelector("input[name='tel_1']") ||
    document.querySelector("[name='tel_1']");

  if (telInput) {
    telInput.value = phoneValue;
    telInput.dispatchEvent(new Event("input", { bubbles: true }));
    telInput.dispatchEvent(new Event("change", { bubbles: true }));
  } else {
    console.warn("[confirm] input nomor telepon tidak ditemukan");
  }

  /* =====================================================
     CONFIRM BUTTON
  ===================================================== */
  const confirmBtn = document.getElementById("next");

  if (!confirmBtn) {
    console.warn("[confirm] tombol confirm tidak ditemukan");
    return;
  }

  if (confirmBtn.disabled) {
    console.warn("[confirm] tombol confirm disabled, reload");
    location.reload();
    return;
  }

  console.log("[confirm] tombol confirm aktif");

  if (autoConfirm) {
    try {
      console.log("[confirm] autoConfirm ENABLED, click");
      confirmBtn.click();
    } catch (e) {
      console.warn("[confirm] gagal klik confirm", e);
    }
  } else {
    console.log("[confirm] autoConfirm disabled");
  }
})();
