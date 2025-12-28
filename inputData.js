(function () {
  // 1. Ambil data dari window.__BOT_DATA__ (sesuai injector terbaru)
  const cust = window.__BOT_DATA__;
  if (!cust) return console.error("[BOT] Data user tidak ditemukan.");

  const flags = cust.auto_flags || {};
  const jenisUjian = cust.jenis_ujian_kode; // Menggunakan kode langsung dari server (JFT, PM, dll)
  
  console.log(`%c[Logic] inputData Page. Ujian: ${jenisUjian}`, "color: #00dbde");

  // Helper untuk mengisi select dan trigger event change
  const setSelect = (name, value) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (el) {
      el.value = value;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  // Helper untuk klik radio/checkbox
  const safeClick = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.click();
  };

  function inputDataUmum() {
    // Tanggal Lahir
    if (cust.tanggal_lahir) {
      const listBulan = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
        januari: "01", februari: "02", maret: "03", mei: "05", juni: "06", juli: "07", agustus: "08", desember: "12"
      };

      let [dateInput, monthInput, yearInput] = cust.tanggal_lahir.split(" ");
      setSelect("selBYear", yearInput);
      setSelect("selBMonth", listBulan[monthInput.toLowerCase()]);
      setSelect("selBDay", dateInput.toString().padStart(2, "0"));
    }

    // Jenis Kelamin
    if (cust.jenis_kelamin?.toLowerCase().includes("laki")) {
      safeClick('input[name="rdoGender"][value="2"]');
    } else {
      safeClick('input[name="rdoGender"][value="1"]');
    }

    // Bangsa & Bahasa
    safeClick('input[name="rdoNation"]');
    setSelect("selNation", "Indonesia");
  }

  // LOGIKA PENGISIAN BERDASARKAN JENIS UJIAN
  // Kita gunakan jenisUjian (JFT, PM, RESTO, dll) bukan ID exam yang panjang
  
  inputDataUmum(); // Jalankan data umum untuk semua jenis ujian

  if (jenisUjian === "JFT") {
    safeClick('input[name="rdoLang"]');
    setSelect("selLang", "Indonesian");
    document.getElementsByName("chkOccupation").forEach(el => { if (el.value !== "O") el.click(); });
    setSelect("selTraveling", "No, I have not been to Japan before");
    setSelect("selStudy", "Over 300 hours");
    safeClick('input[name="chkCBT"][value="A"]');
    safeClick('input[name="chkTextbook"][value="A"]');
    safeClick('input[name="chkWebSite"][value="A"]');
    setSelect("selStatus", "A");

  } else if (jenisUjian === "PM" || jenisUjian === "RESTO") {
    setSelect("selJob", "University student/graduate student");
    safeClick('input[name="chkResidence"][value="A"]');
    safeClick('input[name="chkWork"][value="A"]');
    safeClick('input[name="rdoTaken"][value="This is the first time."]');
    setSelect("selLearn", "I knew that there were learning texts, but I didn't know where I could find them.");
    safeClick('input[name="chkKnows"][value="A"]');
    safeClick('input[name="rdoAbility"][value="Have passed"]');

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
    setSelect("selStatus", "I will not take the test in Japan.");
  }

  // AKHIR: Klik Next jika autoInput aktif
  if (flags.autoInput) {
    console.log("[BOT] Auto Klik Next...");
    setTimeout(() => {
      const nextBtn = document.getElementById("Next");
      if (nextBtn) nextBtn.click();
    }, 1000);
  }
})();
