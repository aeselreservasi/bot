(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) return console.error("[BOT] Data __BOT_DATA__ tidak ditemukan.");

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode;
  console.log("%c[Logic] Memproses Form JFT-Basic", "color: #00dbde; font-weight: bold;");

  // --- Helper Fungsi ---
  const setVal = (name, val) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (el && val) {
      el.value = val;
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const clickRadio = (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el) el.click();
  };

  const clickCheck = (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (el && !el.checked) el.click();
  };

  // --- 1. Tanggal Lahir (Menggunakan format ISO: 1997-07-29) ---
  function inputDataUmum() {
    const tglIso = masterData.tanggal_lahir_iso;
    if (tglIso && tglIso.includes("-")) {
      const [y, m, d] = tglIso.split("-");
      console.log(`[BOT] Input Tanggal: ${y}-${m}-${d}`);
      setVal("selBYear", y);
      setVal("selBMonth", m);
      setVal("selBDay", d);
    }

    // --- 2. Jenis Kelamin (Laki-laki=2, Perempuan=1) ---
    if (masterData.jenis_kelamin) {
      const jk = masterData.jenis_kelamin.toLowerCase();
      if (jk.includes("laki")) clickRadio("rdoGender", "2");
      else clickRadio("rdoGender", "1");
    }

    // --- 3. Kebangsaan & Bahasa ---
    // Klik radio pendamping dropdown terlebih dahulu
    clickRadio("rdoNation", "0");
    setVal("selNation", "Indonesia");
  }
  inputDataUmum();
  if (jenisUjian === "JFT") {
    clickRadio("rdoLang", "0");
    setVal("selLang", "Indonesian");

    // --- 4. Survey JFT (Default Logic) ---
    // Checklist: Tidak akan mengikuti ujian keterampilan satu pun
    clickCheck("chkOccupation", "M");

    // Dropdown: Belum pernah ke Jepang
    setVal("selTraveling", "No, I have not been to Japan before");

    // Dropdown: Belum pernah belajar 300 jam
    setVal("selStudy", "Over 300 hours");

    // Checklist CBT: Belum pernah
    clickCheck("chkCBT", "A");

    // Checklist Media: Irodori
    clickCheck("chkTextbook", "A");

    // Checklist Website: Belum pernah
    clickCheck("chkWebSite", "A");
  } else if (jenisUjian === "PM" || jenisUjian === "RESTO") {
    setVal("selJob", "University student/graduate student");
    clickRadio("chkResidence", "A");
    clickRadio("chkWork", "A");
    clickRadio("rdoTaken", "This is the first time.");
    setVal("selLearn", "I knew that there were learning texts, but I didn't know where I could find them.");
    clickRadio("chkKnows", "A");
    clickRadio("rdoAbility", "Have passed");
  } else if (jenisUjian === "KGINDO" || jenisUjian === "KGJAPAN") {
    setVal("selAcademic", "High school graduate");
    setVal("SelExp", "I don't have any work experience.");
    setVal("selVisit", "No, I have not been to Japan before");
    setVal("selNursing1", "less than 1 month");
    setVal("selNursing2", "self study");
    setVal("selJpLevel", "JFT-Basic");
  } else if (jenisUjian === "PERTANIAN" || jenisUjian === "PETERNAKAN") {
    setVal("selTraveling", "No");
    setVal("selStudy", "80 hours or less");
    setVal("selEng", "None");
    setVal("selAgre", "Agree");
    setVal("selStatus", "I will not take the test in Japan.");
  }
  // --- 5. Tombol Berikutnya ---
  if (flags.autoInput) {
    setTimeout(() => {
      // Mencari tombol 'Next' atau 'Berikutnya'
      const nextBtn = document.getElementById("Next") || document.querySelector('input[name="Next"]') || document.querySelector('input[value="Berikutnya"]');

      if (nextBtn) {
        console.log("[BOT] Klik Berikutnya...");
        nextBtn.click();
      } else {
        console.warn("[BOT] Tombol Next tidak ditemukan.");
      }
    }, 1000); // Delay 1 detik agar form sempat memproses event change
  }
})();
