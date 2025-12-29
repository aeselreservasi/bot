// GitHub: login.js (FINAL – standard helper)
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

  /* ================= GUARD DOUBLE RUN ================= */
  if (window.__LOGIN_SCRIPT_RAN__) return;
  window.__LOGIN_SCRIPT_RAN__ = true;

  /* ================= FLAGS ================= */
  const autoLogin = getFlag("autoLogin");

  console.log("[Login] autoLogin =", autoLogin);

  if (!autoLogin) {
    console.log("[Login] autoLogin = false, skip");
    return;
  }

  /* =====================================================
     AMBIL USER DATA
  ===================================================== */
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    console.error("[Login] userData rusak");
    return;
  }

  const prometricId = userData["ID Prometrik"];
  const password = userData["Password"];

  if (!prometricId || !password) {
    console.error("[Login] ID / Password tidak lengkap");
    return;
  }

  console.log("[Login] Siap login untuk:", prometricId);

  /* =====================================================
     TUNGGU FORM LOGIN
  ===================================================== */
  const startedAt = Date.now();
  const MAX_WAIT = 15000;

  const timer = setInterval(() => {
    if (Date.now() - startedAt > MAX_WAIT) {
      console.warn("[Login] timeout tunggu form login");
      clearInterval(timer);
      return;
    }

    const idField = document.querySelector("#inputPrometricID");
    const pwField = document.querySelector("#inputPassword");
    const loginBtn = document.querySelector('button[name="B1"]');

    if (!idField || !pwField) return;

    clearInterval(timer);
    console.log("%c[Login] Form login ditemukan", "color:lime");

    /* =====================================================
       ISI FORM
    ===================================================== */
    idField.value = prometricId;
    pwField.value = password;

    idField.dispatchEvent(new Event("input", { bubbles: true }));
    pwField.dispatchEvent(new Event("input", { bubbles: true }));
    idField.dispatchEvent(new Event("change", { bubbles: true }));
    pwField.dispatchEvent(new Event("change", { bubbles: true }));

    /* =====================================================
       KLIK LOGIN SAAT AKTIF
    ===================================================== */
    const clickTimer = setInterval(() => {
      if (loginBtn && !loginBtn.disabled) {
        console.log("[Login] Tombol aktif, klik login");
        loginBtn.click();
        clearInterval(clickTimer);
      }
    }, 300);
  }, 300);
})();
