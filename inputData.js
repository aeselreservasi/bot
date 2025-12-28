(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) return console.error("[BOT] Data __BOT_DATA__ tidak ditemukan.");

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode;
  
  const setVal = (name, val) => {
    if (!val) return; // Jangan set jika nilai kosong
    const el = document.querySelector(`select[name="${name}"]`);
    if (el) {
      const optionExists = el.querySelector(`option[value="${val}"]`);
      if (!optionExists && val.toString().startsWith("0")) {
        val = val.toString().substring(1); 
      }
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  function inputDataUmum() {
    // 1. PENGAMAN TANGGAL LAHIR
    if (masterData.tanggal_lahir) {
      console.log("[BOT] Memproses Tanggal Lahir:", masterData.tanggal_lahir);
      let parts = masterData.tanggal_lahir.split(/[- /]/);
      
      if (parts.length >= 3) {
        let d, m, y;
        if (parts[0].length === 4) { [y, m, d] = parts; } 
        else { [d, m, y] = parts; }

        const listBulan = {
          january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
          july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
          januari: "01", februari: "02", maret: "03", april: "04", mei: "05", juni: "06", juli: "07", agustus: "08", september: "09", oktober: "10", november: "11", desember: "12",
          jan: "01", feb: "02", mar: "03", apr: "04", mei: "05", jun: "06", jul: "07", ags: "08", sep: "09", okt: "10", nov: "11", des: "12"
        };

        let monthVal = "";
        if (isNaN(m)) {
          // Jika m adalah teks, pastikan tidak undefined sebelum toLowerCase
          monthVal = m ? listBulan[m.toLowerCase()] : "";
        } else {
          monthVal = m.toString().padStart(2, "0");
        }

        if (y && monthVal && d) {
          setVal("selBYear", y);
          setVal("selBMonth", monthVal);
          setVal("selBDay", d.toString().padStart(2, "0"));
        }
      } else {
        console.warn("[BOT] Format tanggal lahir salah atau tidak lengkap.");
      }
    }

    // 2. PENGAMAN JENIS KELAMIN
    if (masterData.jenis_kelamin) {
      const isLaki = masterData.jenis_kelamin.toLowerCase().includes("laki");
      const genderVal = isLaki ? "2" : "1";
      const genderEl = document.querySelector(`input[name="rdoGender"][value="${genderVal}"]`);
      if (genderEl) genderEl.click();
    } else {
      console.warn("[BOT] Data jenis_kelamin kosong.");
    }

    // 3. BANGSA
    document.querySelector(`input[name="rdoNation"]`)?.click();
    setVal("selNation", "Indonesia");
  }

  // JALANKAN
  inputDataUmum();

  // Mapping Survey (Hanya jika elemen ada)
  if (jenisUjian === "JFT") {
    document.querySelector(`input[name="rdoLang"]`)?.click();
    setVal("selLang", "Indonesian");
    document.getElementsByName("chkOccupation").forEach(el => { if(el.value !== "O") el.click(); });
    setVal("selTraveling", "No, I have not been to Japan before");
    setVal("selStudy", "Over 300 hours");
    document.querySelector('input[name="chkCBT"][value="A"]')?.click();
    document.querySelector('input[name="chkTextbook"][value="A"]')?.click();
    document.querySelector('input[name="chkWebSite"][value="A"]')?.click();
    setVal("selStatus", "A");
  }

  // KLIK NEXT
  if (flags.autoInput) {
    setTimeout(() => {
      const btn = document.getElementById("Next");
      if (btn) {
        console.log("[BOT] Klik Next...");
        btn.click();
      }
    }, 1500);
  }
})();
