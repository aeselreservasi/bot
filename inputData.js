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

  if (!getFlag("autoInput")) return;

  /* ================= USER GUARD ================= */
  var userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch (e) {
    console.warn("[inputData] userData rusak");
    return;
  }

  if (userData.is_active !== true) return;

  /* ================= ONCE FLAG ================= */
  var FILLED_KEY = "__BOT_STATUS_FILLED__";
  var alreadyFilled = localStorage.getItem(FILLED_KEY) === "1";

  /* ================= NEXT HANDLER ================= */
  function clickNext() {
    var start = Date.now();
    var timer = setInterval(function () {
      var btn = document.getElementById("Next");
      if (btn && !btn.disabled) {
        clearInterval(timer);
        console.log("[inputData] Klik Next");
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

  /* ================= DETEKSI FORM ================= */
  var hasBirthForm = document.querySelector('select[name="selBYear"]') || document.querySelector('input[name="rdoGender"]');

  /* ================= FORM UMUM ================= */
  function inputDataUmum() {
    if (!userData["Tanggal Lahir"]) return;

    var bulan = {
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

    var p = userData["Tanggal Lahir"].split(" ");
    var d = document.querySelector('select[name="selBDay"]');
    var m = document.querySelector('select[name="selBMonth"]');
    var y = document.querySelector('select[name="selBYear"]');

    if (y) y.value = p[2];
    if (m && bulan[p[1].toLowerCase()]) m.value = bulan[p[1].toLowerCase()];
    if (d) d.value = p[0].length === 1 ? "0" + p[0] : p[0];

    if (userData["Jenis Kelamin"]) {
      if (userData["Jenis Kelamin"].toLowerCase().indexOf("laki") !== -1) {
        var g1 = document.querySelector('input[name="rdoGender"][value="2"]');
        if (g1) g1.click();
      } else {
        var g2 = document.querySelector('input[name="rdoGender"][value="1"]');
        if (g2) g2.click();
      }
    }

    var nat = document.querySelector('input[name="rdoNation"]');
    if (nat) nat.click();

    var selNat = document.querySelector('select[name="selNation"]');
    if (selNat) selNat.value = "Indonesia";
  }

  /* ================= MAIN ================= */
  var exam = localStorage.getItem("exam");

  if (!alreadyFilled && hasBirthForm) {
    console.log("[inputData] Isi form pertama");

    inputDataUmum();

    /* JFT */
    if (exam === "F10-E10J") {
      var rLang = document.querySelector('input[name="rdoLang"]');
      if (rLang) rLang.click();

      var selLang = document.querySelector('select[name="selLang"]');
      if (selLang) selLang.value = "Indonesian";

      var occ = document.querySelector('input[name="chkOccupation"][value="M"]');
      if (occ) occ.click();

      var cbt = document.querySelector('input[name="chkCBT"][value="F"]');
      if (cbt) cbt.click();

      var tb = document.querySelector('input[name="chkTextbook"][value="D"]');
      if (tb) tb.click();

      var ws = document.querySelector('input[name="chkWebSite"][value="A"]');
      if (ws) ws.click();
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

    localStorage.setItem(FILLED_KEY, "1");
    clickNext();
    return;
  }

  /* ================= HALAMAN KEDUA ================= */
  console.log("[inputData] Halaman kedua → Next saja");
  localStorage.removeItem(FILLED_KEY);
  clickNext();
})();
