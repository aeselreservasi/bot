(function () {
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

  /* ================= FLAGS ================= */
  const autoCheck = localStorage.getItem("autoCheck") === "true";
  if (!autoCheck) return;

  const path = location.pathname;

  /* ================= POLICY ================= */
  if (path.startsWith("/Reserve/Policy")) {
    document.getElementById("chkPL")?.click();
    window.open("https://www.example.com/", "_blank");
    try {
      document.querySelector(`[onclick^="checkPolicy"]`)?.click();
    } catch (e) {
      console.warn("[check] gagal klik Policy", e);
    }
  } else if (path.startsWith("/Reserve/PrivateChk")) {

  /* ================= PRIVATE ================= */
    try {
      document.querySelector(`[onclick^="javascript:Next"]`)?.click();
    } catch (e) {
      console.warn("[check] gagal klik PrivateChk", e);
    }
  } else if (path.startsWith("/Reserve/Attention")) {

  /* ================= ATTENTION ================= */
    try {
      document.querySelector(`[onclick^="agree"]`)?.click();
    } catch (e) {
      console.warn("[check] gagal klik Attention", e);
    }
  }
})();
