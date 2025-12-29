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

  /* ================= USER GUARD ================= */
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    console.warn("[check] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[check] user tidak aktif, STOP");
    return;
  }

  /* ================= FLAGS (SYNCED) ================= */
  const autoCheck = getFlag("autoCheck");
  if (!autoCheck) {
    console.log("[check] autoCheck disabled");
    return;
  }

  const path = location.pathname;

  /* ================= POLICY ================= */
  if (path.startsWith("/Reserve/Policy")) {
    document.getElementById("chkPL")?.click();
    window.open("https://www.example.com/", "_blank");
    try {
      document.querySelector(`[onclick^="checkPolicy"]`)?.click();
      console.log("[check] Policy accepted");
    } catch (e) {
      console.warn("[check] gagal klik Policy", e);
    }
  }

  /* ================= PRIVATE ================= */
  else if (path.startsWith("/Reserve/PrivateChk")) {
    try {
      document.querySelector(`[onclick^="javascript:Next"]`)?.click();
      console.log("[check] PrivateChk next");
    } catch (e) {
      console.warn("[check] gagal klik PrivateChk", e);
    }
  }

  /* ================= ATTENTION ================= */
  else if (path.startsWith("/Reserve/Attention")) {
    try {
      document.querySelector(`[onclick^="agree"]`)?.click();
      console.log("[check] Attention agreed");
    } catch (e) {
      console.warn("[check] gagal klik Attention", e);
    }
  }
})();
