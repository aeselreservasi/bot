(function () {
  /* =====================================================
     HARD GUARD – USER AKTIF
  ===================================================== */
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    console.warn("[exam] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[exam] user tidak aktif, STOP");
    return;
  }
  const nomorTelp1 = document.querySelector("input[name='tel_1']");
  const nomorTelp2 = document.querySelector("[name='tel_1']");
  const confirm0 = document.getElementById(`next`);
  if (nomorTelp1) {
    nomorTelp1.value = userData["Nomor Telepon"] || "0";
  } else if (nomorTelp2) {
    nomorTelp2.value = userData["Nomor Telepon"] || "0";
  } else {
    console.log("Nomor Telepon not found.");
  }

  if (confirm0.disabled) {
    location.reload();
  } else {
    console.log("Confirm button is enabled.");
  }

  if (JSON.parse(localStorage.getItem("autoConfirm"))) {
    console.log("Auto confirm is enabled.");
    try {
      confirm0.click();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Auto confirm is disabled.");
  }
})();
