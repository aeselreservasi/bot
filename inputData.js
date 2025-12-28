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

  /* ================= HELPER ================= */

  const setVal = (name, val) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (!el) {
      console.warn(`[BOT] Select ${name} tidak ditemukan`);
      return;
    }
    el.value = String(val);
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

  /* ================= RETRY BULAN (FIX UTAMA) ================= */

  const setMonthWithRetry = (month, retries = 3, delay = 120) => {
    const el = document.querySelector('select[name="selBMonth"]');
    if (!el) {
      console.warn("[BOT] selBMonth tidak ditemukan");
      return;
    }

    const val = String(month).padStart(2, "0");

    el.value = val;
    el.dispatchEvent(new Event("change", { bubbles: true }));

    setTimeout(() => {
      if (el.value !== val && retries > 0) {
        console.warn(`[BOT] Retry set bulan (${retries})`);
        setMonthWithRetry(val, retries - 1, delay);
      }
    }, delay);
  };

  /* ================= INPUT DATA UMUM ================= */

  function inputDataUmum() {
    const tglIso = masterData.tanggal_lahir_iso;

    if (tglIso && tglIso.includes("-")) {
      const [y, m, d] = tglIso.split("-");

      console.log(`[BOT] Input Tanggal: ${y}-${m}-${d}`);

      // Tahun
      setVal("selBYear", y);

      // Bulan (PAKAI RETRY)
      setMonthWithRetry(m);

      // Hari
      setVal("selBDay", d.padStart(2, "0"));
    }

    // Jenis kelamin
    if (masterData.jenis_kelamin) {
      const jk = masterData.jenis_kelamin.toLowerCase();
      clickRadio("rdoGender", jk.includes("laki") ? "2" : "1");
    }

    // Kebangsaan
    clickRadio("rdoNation", "0");
    setVal("selNation", "Indonesia");
  }

  inputDataUmum();

  /* ================= DATA KHUSUS UJIAN ================= */

  if (jenisUjian === "JFT") {
    clickRadio("rdoLang", "0");
    setVal("selLang", "Indonesian");

    clickCheck("chkOccupation", "M");
    setVal("selTraveling", "No, I have not been to Japan before");
    setVal("selStudy", "Over 300 hours");
    clickCheck("chkCBT", "A");
    clickCheck("chkTextbook", "A");
    clickCheck("chkWebSite", "A");
  }

  /* ================= DEBUG (AMAN) ================= */

  setTimeout(() => {
    if (window.document?.form) {
      console.log(
        "[BOT][DOB CHECK]",
        document.form.selBYear.value,
        document.form.selBMonth.value,
        document.form.selBDay.value
      );
    }
  }, 600);

  /* ================= AUTO NEXT ================= */

  if (flags.autoInput) {
    setTimeout(() => {
      const nextBtn =
        document.getElementById("Next") ||
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
