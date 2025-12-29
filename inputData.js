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

  /* ================= STEP TRACKING ================= */
  const STATUS_STEP_KEY = "__BOT_STATUS_STEP__";
  let statusStep = parseInt(
    sessionStorage.getItem(STATUS_STEP_KEY) || "0",
    10
  );

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
  console.log("[inputData] autoInput =", autoInput, "step =", statusStep);

  /* =====================================================
     NEXT HANDLER (FINAL)
  ===================================================== */
  function goNext() {
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
     DATA UMUM (STEP 1 SAJA)
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

      document.querySelector('select[name="selBYear"]')?.value = year;
      document.querySelector('select[name="selBMonth"]')?.value =
        listBulan[month];
      document.querySelector('select[name="selBDay"]')?.value =
        day.padStart(2, "0");
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
    document.querySelector('select[name="selNation"]')?.value = "Indonesia";
  }

  /* =====================================================
     MAIN LOGIC (STEP-AWARE)
  ===================================================== */
  const exam = localStorage.getItem("exam");

  /* ================= STEP 1 ================= */
  if (statusStep === 0) {
    console.log("[inputData] STATUS STEP 1 – input data");

    inputDataUmum();

    if (exam === "F10-E10J") {
      document.querySelector('input[name="rdoLang"]')?.click();
      document.querySelector('select[name="selLang"]')?.value =
        "Indonesian";

      document.getElementsByName("chkOccupation").forEach((el) => {
        if (el.value !== "O") el.click();
      });

      document.querySelector('select[name="selTraveling"]')?.value =
        "No, I have not been to Japan before";
      document.querySelector('select[name="selStudy"]')?.value =
        "Over 300 hours";

      document
        .querySelector('input[name="chkCBT"][value="A"]')
        ?.click();
      document
        .querySelector('input[name="chkTextbook"][value="A"]')
        ?.click();
      document
        .querySelector('input[name="chkWebSite"][value="A"]')
        ?.click();
      document.querySelector('select[name="selStatus"]')?.value =
        "A";
    }

    if (["T20-J11J", "T10-J11J"].includes(exam)) {
      document.querySelector('select[name="selJob"]')?.value =
        "University student/graduate student";
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
      document.querySelector('select[name="selLearn"]')?.value =
        "I knew that there were learning texts, but I didn't know where I could find them.";
      document
        .querySelector('input[name="chkKnows"][value="A"]')
        ?.click();
      document
        .querySelector(
          'input[name="rdoAbility"][value="Have passed"]'
        )
        ?.click();
    }

    if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(exam)) {
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
    }

    if (["NC0-I11J", "NC0-I12J"].includes(exam)) {
      document.querySelector('select[name="selTraveling"]')?.value =
        "No";
      document.querySelector('select[name="selStudy"]')?.value =
        "80 hours or less";
      document.querySelector('select[name="selEng"]')?.value = "None";
      document.querySelector('select[name="selAgre"]')?.value =
        "Agree";
      document.querySelector('select[name="selStatus"]')?.value =
        "I will not take the test in Japan.";
    }

    sessionStorage.setItem(STATUS_STEP_KEY, "1");
    goNext();
    return;
  }

  /* ================= STEP 2 ================= */
  if (statusStep === 1) {
    console.log("[inputData] STATUS STEP 2 – next only");
    sessionStorage.setItem(STATUS_STEP_KEY, "2");
    goNext();
    return;
  }

  /* ================= STEP 3+ ================= */
  console.log("[inputData] STATUS STEP >= 2 – no action");
})();
