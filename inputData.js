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
    console.warn("[inputData] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[inputData] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS
  ===================================================== */
  const autoInput = getFlag("autoInput");
  console.log("[inputData] autoInput =", autoInput);

  /* =====================================================
     HELPERS
  ===================================================== */
  function skip() {
    if (!autoInput) {
      console.log("[inputData] autoInput = false, skip");
      return;
    }
    const nextBtn = document.getElementById("Next");
    if (nextBtn) nextBtn.click();
  }

  function inputDataUmum() {
    /* ===== tanggal lahir ===== */
    if (userData["Tanggal Lahir"]) {
      const listBulan = {
        january: "01",
        febrary: "02",
        march: "03",
        april: "04",
        may: "05",
        june: "06",
        july: "07",
        august: "08",
        september: "09",
        october: "10",
        november: "11",
        december: "12",
        januari: "01",
        februari: "02",
        maret: "03",
        april: "04",
        mei: "05",
        juni: "06",
        juli: "07",
        agustus: "08",
        september: "09",
        oktober: "10",
        november: "11",
        desember: "12",
      };

      const parts = userData["Tanggal Lahir"].split(" ");
      const dateInput = parts[0];
      const monthInput = parts[1];
      const yearInput = parts[2];

      const yearEl = document.querySelector('select[name="selBYear"]');
      const monthEl = document.querySelector('select[name="selBMonth"]');
      const dayEl = document.querySelector('select[name="selBDay"]');

      if (yearEl) yearEl.value = yearInput;
      if (monthEl && listBulan[monthInput.toLowerCase()]) {
        monthEl.value = listBulan[monthInput.toLowerCase()];
      }
      if (dayEl) dayEl.value = dateInput.toString().padStart(2, "0");
    }

    /* ===== jenis kelamin ===== */
    if (userData["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
      const el = document.querySelector(
        'input[name="rdoGender"][value="2"]'
      );
      if (el) el.click();
    } else if (
      userData["Jenis Kelamin"]?.toLowerCase().includes("perempuan")
    ) {
      const el = document.querySelector(
        'input[name="rdoGender"][value="1"]'
      );
      if (el) el.click();
    }

    /* ===== bangsa & bahasa ===== */
    const nationRadio = document.querySelector('input[name="rdoNation"]');
    if (nationRadio) nationRadio.click();

    const nationSelect = document.querySelector('select[name="selNation"]');
    if (nationSelect) nationSelect.value = "Indonesia";
  }

  /* =====================================================
     MAIN LOGIC
  ===================================================== */
  const exam = localStorage.getItem("exam");

  /* ===== JFT ===== */
  if (exam === "F10-E10J") {
    inputDataUmum();

    const langRadio = document.querySelector('input[name="rdoLang"]');
    if (langRadio) langRadio.click();

    const langSel = document.querySelector('select[name="selLang"]');
    if (langSel) langSel.value = "Indonesian";

    document.getElementsByName("chkOccupation").forEach((el) => {
      if (el.value !== "O") el.click();
    });

    const travel = document.querySelector('select[name="selTraveling"]');
    if (travel) travel.value = "No, I have not been to Japan before";

    const study = document.querySelector('select[name="selStudy"]');
    if (study) study.value = "Over 300 hours";

    document
      .querySelector('input[name="chkCBT"][value="A"]')
      ?.click();
    document
      .querySelector('input[name="chkTextbook"][value="A"]')
      ?.click();
    document
      .querySelector('input[name="chkWebSite"][value="A"]')
      ?.click();

    const status = document.querySelector('select[name="selStatus"]');
    if (status) status.value = "A";

    skip();
    return;
  }

  /* ===== SSW FOOD ===== */
  if (["T20-J11J", "T10-J11J"].includes(exam)) {
    inputDataUmum();

    const job = document.querySelector('select[name="selJob"]');
    if (job) job.value = "University student/graduate student";

    document
      .querySelector('input[name="chkResidence"][value="A"]')
      ?.click();
    document
      .querySelector('input[name="chkWork"][value="A"]')
      ?.click();
    document
      .querySelector(
        'input[name="rdoTaken"][value="This is the first time."]'
      )
      ?.click();

    const learn = document.querySelector('select[name="selLearn"]');
    if (learn)
      learn.value =
        "I knew that there were learning texts, but I didn't know where I could find them.";

    document
      .querySelector('input[name="chkKnows"][value="A"]')
      ?.click();
    document
      .querySelector(
        'input[name="rdoAbility"][value="Have passed"]'
      )
      ?.click();

    skip();
    return;
  }

  /* ===== SSW KAIGO ===== */
  if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(exam)) {
    inputDataUmum();

    const academic = document.querySelector(
      'select[name="selAcademic"]'
    );
    if (academic) academic.value = "High school graduate";

    const exp = document.querySelector('select[name="SelExp"]');
    if (exp) exp.value = "I don't have any work experience.";

    const visit = document.querySelector('select[name="selVisit"]');
    if (visit) visit.value = "No, I have not been to Japan before";

    const nursing1 = document.querySelector(
      'select[name="selNursing1"]'
    );
    if (nursing1) nursing1.value = "less than 1 month";

    const nursing2 = document.querySelector(
      'select[name="selNursing2"]'
    );
    if (nursing2) nursing2.value = "self study";

    const level = document.querySelector('select[name="selJpLevel"]');
    if (level) level.value = "JFT-Basic";

    skip();
    return;
  }

  /* ===== SSW AGRI ===== */
  if (["NC0-I11J", "NC0-I12J"].includes(exam)) {
    inputDataUmum();

    const travel = document.querySelector('select[name="selTraveling"]');
    if (travel) travel.value = "No";

    const study = document.querySelector('select[name="selStudy"]');
    if (study) study.value = "80 hours or less";

    const eng = document.querySelector('select[name="selEng"]');
    if (eng) eng.value = "None";

    const agree = document.querySelector('select[name="selAgre"]');
    if (agree) agree.value = "Agree";

    const status = document.querySelector('select[name="selStatus"]');
    if (status)
      status.value = "I will not take the test in Japan.";

    skip();
    return;
  }

  console.log("[inputData] Exam not found:", exam);
})();
