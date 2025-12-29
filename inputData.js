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
  let statusStep = parseInt(sessionStorage.getItem(STATUS_STEP_KEY) || "0", 10);

  /* ================= USER GUARD ================= */
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

  /* ================= FLAGS ================= */
  const autoInput = getFlag("autoInput");
  console.log("[inputData] autoInput =", autoInput, "step =", statusStep);

  /* ================= NEXT HANDLER ================= */
  function goNext() {
    if (!autoInput) return;

    const start = Date.now();
    const timer = setInterval(() => {
      const btn = document.getElementById("Next");
      if (btn && !btn.disabled) {
        clearInterval(timer);
        console.log("[inputData] Next ready");

        if (typeof window.fnc_input_check_next === "function") {
          window.fnc_input_check_next();
        } else {
          btn.click();
        }
      }

      if (Date.now() - start > 8000) {
        clearInterval(timer);
        console.warn("[inputData] Next timeout");
      }
    }, 300);
  }

  /* ================= DATA UMUM ================= */
  function inputDataUmum() {
    if (userData["Tanggal Lahir"]) {
      const map = {
        januari: "01", februari: "02", maret: "03", april: "04",
        mei: "05", juni: "06", juli: "07", agustus: "08",
        september: "09", oktober: "10", november: "11", desember: "12",
        january: "01", febrary: "02", march: "03", april: "04",
        may: "05", june: "06", july: "07", august: "08",
        september: "09", october: "10", november: "11", december: "12"
      };

      const p = userData["Tanggal Lahir"].split(" ");
      const d = document.querySelector('select[name="selBDay"]');
      const m = document.querySelector('select[name="selBMonth"]');
      const y = document.querySelector('select[name="selBYear"]');

      if (y) y.value = p[2];
      if (m && map[p[1].toLowerCase()]) m.value = map[p[1].toLowerCase()];
      if (d) d.value = p[0].padStart(2, "0");
    }

    if (userData["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
      document.querySelector('input[name="rdoGender"][value="2"]')?.click();
    } else if (userData["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
      document.querySelector('input[name="rdoGender"][value="1"]')?.click();
    }

    document.querySelector('input[name="rdoNation"]')?.click();
    const nation = document.querySelector('select[name="selNation"]');
    if (nation) nation.value = "Indonesia";
  }

  /* ================= MAIN LOGIC ================= */
  const exam = localStorage.getItem("exam");

  /* ===== STEP 1 ===== */
  if (statusStep === 0) {
    console.log("[inputData] STEP 1");

    inputDataUmum();

    /* ========= JFT ========= */
    if (exam === "F10-E10J") {
      document.querySelector('input[name="rdoLang"]')?.click();
      const lang = document.querySelector('select[name="selLang"]');
      if (lang) lang.value = "Indonesian";

      // ✅ FIX: checkbox spesifik saja
      document.querySelector('input[name="chkOccupation"][value="M"]')?.click();
      document.querySelector('input[name="chkCBT"][value="F"]')?.click();
      document.querySelector('input[name="chkTextbook"][value="D"]')?.click();
      document.querySelector('input[name="chkWebSite"][value="A"]')?.click();

      const travel = document.querySelector('select[name="selTraveling"]');
      if (travel) travel.value = "No, I have not been to Japan before";

      const study = document.querySelector('select[name="selStudy"]');
      if (study) study.value = "Over 300 hours";

      const st = document.querySelector('select[name="selStatus"]');
      if (st) st.value = "A";
    }

    /* ========= SSW FOOD ========= */
    else if (["T20-J11J", "T10-J11J"].includes(exam)) {
      document.querySelector('select[name="selJob"]')?.value =
        "University student/graduate student";
      document.querySelector('input[name="chkResidence"][value="A"]')?.click();
      document.querySelector('input[name="chkWork"][value="A"]')?.click();
      document.querySelector(
        'input[name="rdoTaken"][value="This is the first time."]'
      )?.click();
      document.querySelector('select[name="selLearn"]')?.value =
        "I knew that there were learning texts, but I didn't know where I could find them.";
      document.querySelector('input[name="chkKnows"][value="A"]')?.click();
      document.querySelector(
        'input[name="rdoAbility"][value="Have passed"]'
      )?.click();
    }

    /* ========= KAIGO ========= */
    else if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(exam)) {
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

    /* ========= PERTANIAN ========= */
    else if (["NC0-I11J", "NC0-I12J"].includes(exam)) {
      document.querySelector('select[name="selTraveling"]')?.value = "No";
      document.querySelector('select[name="selStudy"]')?.value =
        "80 hours or less";
      document.querySelector('select[name="selEng"]')?.value = "None";
      document.querySelector('select[name="selAgre"]')?.value = "Agree";
      document.querySelector('select[name="selStatus"]')?.value =
        "I will not take the test in Japan.";
    }

    sessionStorage.setItem(STATUS_STEP_KEY, "1");
    goNext();
    return;
  }

  /* ===== STEP 2 ===== */
  if (statusStep === 1) {
    console.log("[inputData] STEP 2 (next only)");
    sessionStorage.setItem(STATUS_STEP_KEY, "2");
    goNext();
    return;
  }

  console.log("[inputData] STEP >= 2, no action");
})();
