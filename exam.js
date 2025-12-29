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

  /* =====================================================
     FLAGS
  ===================================================== */
  let exam = localStorage.getItem("exam");
  if (exam) {
    if (exam === "JH0-I12J") {
      exam = "JH0-J12J";
    }
    const examEl = document.querySelector(`#select1 > option[value=${exam}]`);
    if (examEl) {
      examEl.selected = true;
      if (JSON.parse(localStorage.getItem("autoExam"))) {
        document.getElementById("test").click();
      } else {
        console.log("Auto exam is disabled.");
      }
    } else {
      console.log("Invalid exam selected.");
    }
  } else {
    console.log("No exam selected.");
  }
})();
