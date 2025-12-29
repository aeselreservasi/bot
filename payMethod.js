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
if (JSON.parse(localStorage.getItem("autoPayMethod"))) {
  console.log("Auto pay method is enabled.");
  document.querySelector(`input[value="zotapay"]`).click();
  try {
    document.querySelector(`input[onclick="nextPay();"]`).click();
  } catch (error) {
    console.log(error);
    document.querySelector(`button[onclick="nextPay();"]`).click();
  }
} else {
  console.log("Auto pay method is disabled.");
}
})();
