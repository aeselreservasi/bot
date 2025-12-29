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
     NEXT HANDLER (FINAL)
  ===================================================== */
  function skip() {
    if (!autoInput) {
      console.log("[inputData] autoInput = false, skip");
      return;
    }

    const startedAt = Date.now();
    const MAX_WAIT = 8000;

    const timer = setInterval(() => {
      const nextBtn = document.getElementById("Next");

      if (nextBtn && !nextBtn.disabled) {
        clearInterval(timer);
        console.log("[inputData] Next button ready");

        if (typeof window.fnc_input_check_next === "function") {
          console.log("[inputData] call fnc_input_check_next()");
          window.fnc_input_check_next();
        } else {
          console.log("[inputData] fallback click()");
          nextBtn.click();
        }
      }

      if (Date.now() - startedAt > MAX_WAIT) {
        clearInterval(timer);
        console.warn("[inputData] timeout tunggu tombol Next");
      }
    }, 300);
  }

  /* =====================================================
     DATA UMUM
  ===================================================== */
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
      const day = parts[0];
      const month = parts[1]?.toLowerCase();
      const year = parts[2];

      const y = document.querySelector('select[name="selBYear"]');
      const m = document.querySelector('select[name="selBMonth"]');
      const d = document.querySelector('select[name="selBDay"]');

      if (y) y.value = year;
      if (m && listBulan[month]) m.value = listBulan[month];
      if (d) d.value = day.padStart(2, "0");
    }

    /* ===== jenis kelamin ===== */
    if (userData["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
      document
        .querySelector('input[name="rdoGender"][value="2"]')
        ?.click();
    } else if (
      userData["Jenis Kelamin"]?.toLowerCase().includes("perempuan")
    ) {
      document
        .querySelector('input[name="rdoGender"][value="1"]')
        ?.click();
    }

    /* ===== negara ===== */
    document.querySelector('input[name="rdoNation"]')?.click();
    const nation = document.querySelector('select[name="selNation"]');
    if (nation) nation.value = "Indonesia";
  }

  /* =====================================================
     MAIN LOGIC PER EXAM
  ===================================================== */
  const exam = localStorage.getItem("exam");

  /* ===== JFT ===== */
  if (exam === "F10-E10J") {
    inputDataUmum();

    document.querySelector('input[name="rdoLang"]')?.click();
    const lang = document.querySelector('select[name="selLang"]');
    if (lang) lang.value = "Indonesian";

    document.getElementsByName("chkOccupation").forEach((el) => {
      if (el.value !== "O") el.click();
    });

    document.querySelector('select[name="selTraveling"]')?.value =
      "No, I have not been to Japan before";
    document.querySelector('select[name="selStudy"]')?.value =
      "Over 300 hours";

    document.querySelector('input[name="chkCBT"][value="A"]')?.click();
    document.querySelector('input[name="chkTextbook"][value="A"]')?.click();
    document.querySelector('input[name="chkWebSite"][value="A"]')?.click();
    document.querySelector('select[name="selStatus"]')?.value = "A";

    skip();
    return;
  }

  /* ===== SSW FOOD ===== */
  if (["T20-J11J", "T10-J11J"].includes(exam)) {
    inputDataUmum();

    document.querySelector('select[name="selJob"]')?.value =
      "University student/graduate student";
    document.querySelector('input[name="chkResidence"][value="A"]')?.click();
    document.querySelector('input[name="chkWork"][value="A"]')?.click();
    document
      .querySelector(
        'input[name="rdoTaken"][value="This is the first time."]'
      )
      ?.click();

    document.querySelector('select[name="selLearn"]')?.value =
      "I knew that there were learning texts, but I didn't know where I could find them.";
    document.querySelector('input[name="chkKnows"][value="A"]')?.click();
    document
      .querySelector('input[name="rdoAbility"][value="Have passed"]')
      ?.click();

    skip();
    return;
  }

  /* ===== SSW KAIGO ===== */
  if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(exam)) {
    inputDataUmum();

    document.querySelector('select[name="selAcademic"]')?.value =
      "High school graduate";
    document.querySelector('select[name="SelExp"]')?.value =
      "I don't have any work experience.";
    document.querySelector('select[name="selVisit"]')?.value =
      "No, I have not been to Japan before";
    document.querySelector('select[name="selNursing1"]')?.value =
      "less than 1 month";
    document.querySelector('select[name="selNursing2"]')?.value =
      "self study";
    document.querySelector('select[name="selJpLevel"]')?.value =
      "JFT-Basic";

    skip();
    return;
  }

  /* ===== SSW AGRI ===== */
  if (["NC0-I11J", "NC0-I12J"].includes(exam)) {
    inputDataUmum();

    document.querySelector('select[name="selTraveling"]')?.value = "No";
    document.querySelector('select[name="selStudy"]')?.value =
      "80 hours or less";
    document.querySelector('select[name="selEng"]')?.value = "None";
    document.querySelector('select[name="selAgre"]')?.value = "Agree";
    document.querySelector('select[name="selStatus"]')?.value =
      "I will not take the test in Japan.";

    skip();
    return;
  }

  console.log("[inputData] Exam not found:", exam);
})();
