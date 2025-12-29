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

  /* ================= STEP TRACK ================= */
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
     NEXT HANDLER
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
          nextBtn.click();
        }
      }

      if (Date.now() - startedAt > MAX_WAIT) {
        clearInterval(timer);
        console.warn("[inputData] timeout tunggu Next");
      }
    }, 300);
  }

  /* =====================================================
     DATA UMUM (STEP 1 SAJA)
  ===================================================== */
  function inputDataUmum() {
    /* ===== tanggal lahir ===== */
    if (userData["Tanggal Lahir"]) {
      const bulanMap = {
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
      if (m && bulanMap[month]) m.value = bulanMap[month];
      if (d) d.value = day.padStart(2, "0");
    }

    /* ===== jenis kelamin ===== */
    if (userData["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
      const g = document.querySelector(
        'input[name="rdoGender"][value="2"]'
      );
      if (g) g.click();
    } else if (
      userData["Jenis Kelamin"]?.toLowerCase().includes("perempuan")
    ) {
      const g = document.querySelector(
        'input[name="rdoGender"][value="1"]'
      );
      if (g) g.click();
    }

    /* ===== negara ===== */
    const nat = document.querySelector('input[name="rdoNation"]');
    if (nat) nat.click();

    const nationSel = document.querySelector(
      'select[name="selNation"]'
    );
    if (nationSel) nationSel.value = "Indonesia";
  }

  /* =====================================================
     MAIN LOGIC (STEP AWARE)
  ===================================================== */
  const exam = localStorage.getItem("exam");

  /* ================= STEP 1 ================= */
  if (statusStep === 0) {
    console.log("[inputData] STATUS STEP 1");

    inputDataUmum();

    if (exam === "F10-E10J") {
      const lang = document.querySelector('select[name="selLang"]');
      if (lang) lang.value = "Indonesian";
      const rLang = document.querySelector('input[name="rdoLang"]');
      if (rLang) rLang.click();

      document.getElementsByName("chkOccupation").forEach((el) => {
        if (el.value !== "O") el.click();
      });

      const travel = document.querySelector(
        'select[name="selTraveling"]'
      );
      if (travel)
        travel.value = "No, I have not been to Japan before";

      const study = document.querySelector('select[name="selStudy"]');
      if (study) study.value = "Over 300 hours";

      const st = document.querySelector('select[name="selStatus"]');
      if (st) st.value = "A";
    }

    if (["T20-J11J", "T10-J11J"].includes(exam)) {
      const job = document.querySelector('select[name="selJob"]');
      if (job)
        job.value = "University student/graduate student";
    }

    if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(exam)) {
      const ac = document.querySelector(
        'select[name="selAcademic"]'
      );
      if (ac) ac.value = "High school graduate";
    }

    if (["NC0-I11J", "NC0-I12J"].includes(exam)) {
      const travel = document.querySelector(
        'select[name="selTraveling"]'
      );
      if (travel) travel.value = "No";
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

  console.log("[inputData] STATUS STEP >= 2 – no action");
})();
