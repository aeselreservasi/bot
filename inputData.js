(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) {
    console.error("[BOT] Data __BOT_DATA__ tidak ditemukan.");
    return;
  }

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode;

  console.log(
    "%c[Logic] Memproses Form JFT-Basic",
    "color:#00dbde;font-weight:bold"
  );

  // =========================
  // Helper Functions
  // =========================

  const setSelect = (name, value) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (!el) {
      console.warn(`[BOT] Select ${name} tidak ditemukan`);
      return;
    }
    el.value = String(value);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const clickRadio = (name, value) => {
    const el = document.querySelector(
      `input[type="radio"][name="${name}"][value="${value}"]`
    );
    if (el && !el.checked) el.click();
  };

  const clickCheck = (name, value) => {
    const el = document.querySelector(
      `input[type="checkbox"][name="${name}"][value="${value}"]`
    );
    if (el && !el.checked) el.click();
  };

  // =========================
  // 1. DATA UMUM
  // =========================

  function inputDataUmum() {
    // ---- Tanggal Lahir (CRITICAL FIX) ----
    const iso = masterData.tanggal_lahir_iso;
    if (iso && iso.includes("-")) {
      const [y, m, d] = iso.split("-").map(Number);

      console.log(`[BOT] Input Tanggal: ${y}-${m}-${d}`);

      // WAJIB urut + delay agar ValidDate() lolos
      setSelect("selBYear", y);

      setTimeout(() => {
        setSelect("selBMonth", m);

        setTimeout(() => {
          setSelect("selBDay", d);
        }, 100);
      }, 100);
    }

    // ---- Jenis Kelamin ----
    if (masterData.jenis_kelamin) {
      const jk = masterData.jenis_kelamin.toLowerCase();
      clickRadio("rdoGender", jk.includes("laki") ? "2" : "1");
    }

    // ---- Kebangsaan ----
    clickRadio("rdoNation", "0");
    setSelect("selNation", "Indonesia");
  }

  inputDataUmum();

  // =========================
  // 2. DATA KHUSUS UJIAN
  // =========================

  if (jenisUjian === "JFT") {
    clickRadio("rdoLang", "0");
    setSelect("selLang", "Indonesian");

    // Survey JFT
    clickCheck("chkOccupation", "M"); // Tidak ikut ujian skill
    setSelect("selTraveling", "No, I have not been to Japan before");
    setSelect("selStudy", "Over 300 hours");
    clickCheck("chkCBT", "A");
    clickCheck("chkTextbook", "A");
    clickCheck("chkWebSite", "A");
  } else if (jenisUjian === "PM" || jenisUjian === "RESTO") {
    setSelect("selJob", "University student/graduate student");
    clickRadio("chkResidence", "A");
    clickRadio("chkWork", "A");
    clickRadio("rdoTaken", "This is the first time.");
    setSelect(
      "selLearn",
      "I knew that there were learning texts, but I didn't know where I could find them."
    );
    clickRadio("chkKnows", "A");
    clickRadio("rdoAbility", "Have passed");
  } else if (jenisUjian === "KGINDO" || jenisUjian === "KGJAPAN") {
    setSelect("selAcademic", "High school graduate");
    setSelect("SelExp", "I don't have any work experience.");
    setSelect("selVisit", "No, I have not been to Japan before");
    setSelect("selNursing1", "less than 1 month");
    setSelect("selNursing2", "self study");
    setSelect("selJpLevel", "JFT-Basic");
  } else if (jenisUjian === "PERTANIAN" || jenisUjian === "PETERNAKAN") {
    setSelect("selTraveling", "No");
    setSelect("selStudy", "80 hours or less");
    setSelect("selEng", "None");
    setSelect("selAgre", "Agree");
    setSelect("selStatus", "A");
  }

  // =========================
  // 3. NEXT BUTTON
  // =========================

  if (flags.autoInput) {
    setTimeout(() => {
      const nextBtn =
        document.getElementById("Next") ||
        document.querySelector('button[name="Next"]') ||
        document.querySelector('input[name="Next"]');

      if (nextBtn) {
        console.log("[BOT] Klik Berikutnya...");
        nextBtn.click();
      } else {
        console.warn("[BOT] Tombol Next tidak ditemukan");
      }
    }, 1200);
  }
})();
