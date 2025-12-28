(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) return;

  const flags = masterData.auto_flags || {};
  const jenisUjian = masterData.jenis_ujian_kode;
  
  const setVal = (name, val) => {
    const el = document.querySelector(`select[name="${name}"]`);
    if (el) {
      // Hilangkan nol di depan jika website tidak menemukannya (misal: "01" jadi "1")
      const optionExists = el.querySelector(`option[value="${val}"]`);
      if (!optionExists && val.startsWith("0")) {
        val = val.substring(1); 
      }
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  function inputDataUmum() {
    if (masterData.tanggal_lahir) {
      console.log("[BOT] Memproses Tanggal Lahir:", masterData.tanggal_lahir);

      // Regex untuk split berdasarkan spasi, strip, atau garis miring
      let parts = masterData.tanggal_lahir.split(/[- /]/);
      let d, m, y;

      // Deteksi format: YYYY-MM-DD atau DD-MM-YYYY
      if (parts[0].length === 4) {
        [y, m, d] = parts;
      } else {
        [d, m, y] = parts;
      }

      const listBulan = {
        january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
        july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
        januari: "01", februari: "02", maret: "03", mei: "05", juni: "06", juli: "07", agustus: "08", september: "09", oktober: "10", november: "11", desember: "12",
        jan: "01", feb: "02", mar: "03", apr: "04", mei: "05", jun: "06", jul: "07", ags: "08", sep: "09", okt: "10", nov: "11", des: "12"
      };

      // Konversi bulan jika inputnya adalah teks (Januari/Jan)
      let monthVal = isNaN(m) ? listBulan[m.toLowerCase()] : m.toString().padStart(2, "0");
      let dayVal = d.toString().padStart(2, "0");

      console.log(`[BOT] Setting: Year=${y}, Month=${monthVal}, Day=${dayVal}`);

      setVal("selBYear", y);
      setVal("selBMonth", monthVal);
      setVal("selBDay", dayVal);
    }

    // Gender & Nation
    const isLaki = masterData.jenis_kelamin?.toLowerCase().includes("laki");
    const genderVal = isLaki ? "2" : "1";
    document.querySelector(`input[name="rdoGender"][value="${genderVal}"]`)?.click();
    
    document.querySelector(`input[name="rdoNation"]`)?.click();
    setVal("selNation", "Indonesia");
  }

  // --- Jalankan Logic ---
  inputDataUmum();

  // Mapping Survey (JFT/PM/dll) sesuai kode sebelumnya
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
  // ... (tambahkan else if untuk jenis ujian lain jika perlu)

  // Klik Next
  if (flags.autoInput) {
    setTimeout(() => {
      console.log("[BOT] Mencoba klik Next...");
      document.getElementById("Next")?.click();
    }, 1500); // Beri waktu lebih lama agar validasi form selesai
  }
})();
