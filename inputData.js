(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) return;

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode;

  console.log(
    "%c[Logic] Memproses Form JFT-Basic",
    "color:#00dbde;font-weight:bold"
  );

  // =========================
  // WAIT FORM
  // =========================
  const waitForForm = (cb, timeout = 5000) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if (document.forms && document.forms.form) {
        clearInterval(timer);
        cb(document.forms.form);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        console.error("[BOT] Form tidak muncul (timeout)");
      }
    }, 100);
  };

  // =========================
  // HELPERS (FORM-SCOPED)
  // =========================
  const setSelect = (form, name, val) => {
    const el = form[name];
    if (!el) {
      console.warn(`[BOT] Select ${name} tidak ditemukan`);
      return;
    }
    el.value = String(val);
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const clickRadio = (form, name, val) => {
    const el = [...form.querySelectorAll(`input[name="${name}"]`)]
      .find(r => r.value === val);
    if (el && !el.checked) el.click();
  };

  const clickCheck = (form, name, val) => {
    const el = [...form.querySelectorAll(`input[name="${name}"]`)]
      .find(c => c.value === val);
    if (el && !el.checked) el.click();
  };

  // =========================
  // INPUT DATA
  // =========================
  const inputDataUmum = (form) => {
    const [y, m, d] = masterData.tanggal_lahir_iso
      .split("-")
      .map(Number);

    console.log(`[BOT] Input Tanggal: ${y}-${m}-${d}`);

    setSelect(form, "selBYear", y);
    setTimeout(() => {
      setSelect(form, "selBMonth", m.padStart(2, "0"));
      setTimeout(() => {
        setSelect(form, "selBDay", d.padStart(2, "0"));
      }, 100);
    }, 100);

    if (masterData.jenis_kelamin) {
      clickRadio(
        form,
        "rdoGender",
        masterData.jenis_kelamin.toLowerCase().includes("laki") ? "2" : "1"
      );
    }

    clickRadio(form, "rdoNation", "0");
    setSelect(form, "selNation", "Indonesia");
  };

  const inputDataUjian = (form) => {
    if (jenisUjian === "JFT") {
      clickRadio(form, "rdoLang", "0");
      setSelect(form, "selLang", "Indonesian");

      clickCheck(form, "chkOccupation", "M");
      setSelect(form, "selTraveling", "No, I have not been to Japan before");
      setSelect(form, "selStudy", "Over 300 hours");
      clickCheck(form, "chkCBT", "A");
      clickCheck(form, "chkTextbook", "A");
      clickCheck(form, "chkWebSite", "A");
    }
  };

  const clickNext = () => {
    if (!flags.autoInput) return;

    setTimeout(() => {
      const nextBtn = document.getElementById("Next");
      if (nextBtn) {
        console.log("[BOT] Klik Berikutnya...");
        nextBtn.click();
      }
    }, 1200);
  };

  // =========================
  // RUN
  // =========================
  waitForForm((form) => {
    inputDataUmum(form);
    inputDataUjian(form);
    clickNext();
  });
})();
