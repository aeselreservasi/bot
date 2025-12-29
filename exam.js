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
    console.warn("[exam] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[exam] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  const autoExam = getFlag("autoExam");

  console.log("[exam] autoExam =", autoExam);

  /* =====================================================
     EXAM SELECTION
  ===================================================== */
  let exam = localStorage.getItem("exam");

  if (!exam) {
    console.log("[exam] No exam selected");
    return;
  }

  // mapping khusus
  if (exam === "JH0-I12J") {
    exam = "JH0-J12J";
  }

  const examEl = document.querySelector(
    `#select1 > option[value="${exam}"]`
  );

  if (!examEl) {
    console.warn("[exam] Invalid exam:", exam);
    return;
  }

  examEl.selected = true;

  /* =====================================================
     SUBMIT
  ===================================================== */
  if (autoExam) {
    const btn = document.getElementById("test");
    if (btn) {
      console.log("[exam] autoExam ENABLED, submit");
      btn.click();
    } else {
      console.warn("[exam] submit button not found");
    }
  } else {
    console.log("[exam] autoExam disabled");
  }
})();
