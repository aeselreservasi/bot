(function () {
  /* ================= FLAG HELPER ================= */
  function getFlag(name) {
    try {
      var flags = JSON.parse(localStorage.getItem("autoFlags") || "{}");
      return flags[name] === true;
    } catch (e) {
      return false;
    }
  }

  /* ================= STEP TRACK ================= */
  var STATUS_STEP_KEY = "__BOT_STATUS_STEP__";
  var statusStep = parseInt(localStorage.getItem(STATUS_STEP_KEY) || "0", 10);

  /* ================= USER GUARD ================= */
  var userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch (e) {
    console.warn("[inputData] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[inputData] user tidak aktif, STOP");
    return;
  }

  /* ================= FLAGS ================= */
  var autoInput = getFlag("autoInput");
  console.log("[inputData] autoInput =", autoInput, "step =", statusStep);

  /* ================= NEXT HANDLER ================= */
  function goNext() {
    if (!autoInput) return;

    var started = Date.now();
    var timer = setInterval(function () {
      var btn = document.getElementById("Next");

      if (btn && !btn.disabled) {
        clearInterval(timer);
        console.log("[inputData] Next ready");

        if (typeof window.fnc_input_check_next === "function") {
          window.fnc_input_check_next();
        } else {
          btn.click();
        }
      }

      if (Date.now() - started > 8000) {
        clearInterval(timer);
        console.warn("[inputData] Next timeout");
      }
    }, 300);
  }

  /* ================= DATA UMUM ================= */
  function inputDataUmum() {
    if (userData["Tanggal Lahir"]) {
      var bulanMap = {
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
      };

      var parts = userData["Tanggal Lahir"].split(" ");
      var day = parts[0];
      var month = parts[1] ? parts[1].toLowerCase() : "";
      var year = parts[2];

      var y = document.querySelector('select[name="selBYear"]');
      var m = document.querySelector('select[name="selBMonth"]');
      var d = document.querySelector('select[name="selBDay"]');

      if (y) y.value = year;
      if (m && bulanMap[month]) m.value = bulanMap[month];
      if (d) d.value = day.length === 1 ? "0" + day : day;
    }

    if (userData["Jenis Kelamin"] && userData["Jenis Kelamin"].toLowerCase().indexOf("laki") !== -1) {
      var g1 = document.querySelector('input[name="rdoGender"][value="2"]');
      if (g1) g1.click();
    } else if (userData["Jenis Kelamin"] && userData["Jenis Kelamin"].toLowerCase().indexOf("perempuan") !== -1) {
      var g2 = document.querySelector('input[name="rdoGender"][value="1"]');
      if (g2) g2.click();
    }

    var nat = document.querySelector('input[name="rdoNation"]');
    if (nat) nat.click();

    var selNation = document.querySelector('select[name="selNation"]');
    if (selNation) selNation.value = "Indonesia";
  }

  /* ================= MAIN LOGIC ================= */
  var exam = localStorage.getItem("exam");

  /* ===== STEP 1 ===== */
  if (statusStep === 0) {
    console.log("[inputData] STEP 1");
    inputDataUmum();

    /* ========= JFT ========= */
    if (exam === "F10-E10J") {
      var rLang = document.querySelector('input[name="rdoLang"]');
      if (rLang) rLang.click();

      var selLang = document.querySelector('select[name="selLang"]');
      if (selLang) selLang.value = "Indonesian";

      /* checkbox khusus JFT */
      var occ = document.querySelector('input[name="chkOccupation"][value="M"]');
      if (occ) occ.click();

      var cbt = document.querySelector('input[name="chkCBT"][value="F"]');
      if (cbt) cbt.click();

      var tb = document.querySelector('input[name="chkTextbook"][value="D"]');
      if (tb) tb.click();

      var ws = document.querySelector('input[name="chkWebSite"][value="A"]');
      if (ws) ws.click();

      var tr = document.querySelector('select[name="selTraveling"]');
      if (tr) tr.value = "No, I have not been to Japan before";

      var st = document.querySelector('select[name="selStudy"]');
      if (st) st.value = "Over 300 hours";

      var ss = document.querySelector('select[name="selStatus"]');
      if (ss) ss.value = "A";
    } else if (exam === "T20-J11J" || exam === "T10-J11J") {
      /* ========= SSW FOOD ========= */
      var job = document.querySelector('select[name="selJob"]');
      if (job) job.value = "University student/graduate student";

      var r1 = document.querySelector('input[name="chkResidence"][value="A"]');
      if (r1) r1.click();

      var r2 = document.querySelector('input[name="chkWork"][value="A"]');
      if (r2) r2.click();

      var rt = document.querySelector('input[name="rdoTaken"][value="This is the first time."]');
      if (rt) rt.click();

      var sl = document.querySelector('select[name="selLearn"]');
      if (sl) {
        sl.value = "I knew that there were learning texts, but I didn't know where I could find them.";
      }

      var kn = document.querySelector('input[name="chkKnows"][value="A"]');
      if (kn) kn.click();

      var ab = document.querySelector('input[name="rdoAbility"][value="Have passed"]');
      if (ab) ab.click();
    } else if (exam === "JH0-I11J" || exam === "JH0-I12J" || exam === "JH0-J12J") {
      /* ========= KAIGO ========= */
      var ac = document.querySelector('select[name="selAcademic"]');
      if (ac) ac.value = "High school graduate";

      var ex = document.querySelector('select[name="SelExp"]');
      if (ex) ex.value = "I don't have any work experience.";

      var vi = document.querySelector('select[name="selVisit"]');
      if (vi) vi.value = "No, I have not been to Japan before";

      var n1 = document.querySelector('select[name="selNursing1"]');
      if (n1) n1.value = "less than 1 month";

      var n2 = document.querySelector('select[name="selNursing2"]');
      if (n2) n2.value = "self study";

      var lv = document.querySelector('select[name="selJpLevel"]');
      if (lv) lv.value = "JFT-Basic";
    } else if (exam === "NC0-I11J" || exam === "NC0-I12J") {
      /* ========= PERTANIAN ========= */
      var trv = document.querySelector('select[name="selTraveling"]');
      if (trv) trv.value = "No";

      var st2 = document.querySelector('select[name="selStudy"]');
      if (st2) st2.value = "80 hours or less";

      var en = document.querySelector('select[name="selEng"]');
      if (en) en.value = "None";

      var ag = document.querySelector('select[name="selAgre"]');
      if (ag) ag.value = "Agree";

      var ss2 = document.querySelector('select[name="selStatus"]');
      if (ss2) ss2.value = "I will not take the test in Japan.";
    }

    localStorage.setItem(STATUS_STEP_KEY, "1");
    goNext();
    return;
  }

  /* ===== STEP 2 ===== */
  if (statusStep === 1) {
    console.log("[inputData] STEP 2");
    localStorage.removeItem(STATUS_STEP_KEY);
    goNext();
    return;
  }
  console.log("[inputData] STEP >= 2, no action");
})();
