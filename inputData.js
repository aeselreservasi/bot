(function () {
  // 1. Ambil data dari injector
  const masterData = window.__BOT_DATA__;
  if (!masterData) {
    console.error("[BOT] Data __BOT_DATA__ tidak ditemukan.");
    return;
  }

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode; // Contoh: "JFT", "PM", "KGINDO"
  
  console.log(`%c[Logic] inputData untuk: ${jenisUjian}`, "color: #00dbde; font-weight: bold;");

  // Helper Fungsi
  const setVal = (name, val) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (el) {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  const clickEl = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.click();
  };

  function inputDataUmum() {
    if (masterData.tanggal_lahir) {
      const listBulan = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
        januari: "01", februari: "02", maret: "03", mei: "05", juni: "06", juli: "07", agustus: "08", desember: "12"
      };
      // Asumsi format: "DD Month YYYY" (Contoh: "15 Januari 1995")
      let [d, m, y] = masterData.tanggal_lahir.split(" ");
      setVal("selBYear", y);
      setVal("selBMonth", listBulan[m.toLowerCase()]);
      setVal("selBDay", d.toString().padStart(2, "0"));
    }

    if (masterData.jenis_kelamin?.toLowerCase().includes("laki")) {
      clickEl('input[name="rdoGender"][value="2"]');
    } else {
      clickEl('input[name="rdoGender"][value="1"]');
    }

    clickEl('input[name="rdoNation"]');
    setVal("selNation", "Indonesia");
  }

  // JALANKAN PENGISIAN
  inputDataUmum();

  // Switch Case berdasarkan jenis_ujian_kode dari database
  if (jenisUjian === "JFT") {
    clickEl('input[name="rdoLang"]');
    setVal("selLang", "Indonesian");
    document.getElementsByName("chkOccupation").forEach((el) => { if (el.value !== "O") el.click(); });
    setVal("selTraveling", "No, I have not been to Japan before");
    setVal("selStudy", "Over 300 hours");
    clickEl('input[name="chkCBT"][value="A"]');
    clickEl('input[name="chkTextbook"][value="A"]');
    clickEl('input[name="chkWebSite"][value="A"]');
    setVal("selStatus", "A");

  } else if (jenisUjian === "PM" || jenisUjian === "RESTO") {
    setVal("selJob", "University student/graduate student");
    clickEl('input[name="chkResidence"][value="A"]');
    clickEl('input[name="chkWork"][value="A"]');
    clickEl('input[name="rdoTaken"][value="This is the first time."]');
    setVal("selLearn", "I knew that there were learning texts, but I didn't know where I could find them.");
    clickEl('input[name="chkKnows"][value="A"]');
    clickEl('input[name="rdoAbility"][value="Have passed"]');

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

  // KLIK NEXT
  if (flags.autoInput) {
    setTimeout(() => {
      const nextBtn = document.getElementById("Next");
      if (nextBtn) {
        console.log("[BOT] Klik Next...");
        nextBtn.click();
      }
    }, 1000);
  }
})();
