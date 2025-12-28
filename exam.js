(function () {
  const masterData = window.__BOT_DATA__;
  if (!masterData) return console.error("[BOT] Data tidak ditemukan.");

  const jenisUjianKode = masterData.jenis_ujian_kode;

  // Mapping kode JFT ke value option
  const listUjian = {
    JFT: "F10-E10J",
    PM: "T20-J11J", // Sesuaikan dengan value asli di web
    RESTO: "T10-J11J",
    KGINDO: "JH0-I11J",
    KGJAPAN: "JH0-J12J",
    PERTANIAN: "NC0-I11J",
    PETERNAKAN: "NC0-I12J",
  };

  let examValue = listUjian[jenisUjianKode];
  if (!examValue) return console.warn("[BOT] Mapping tidak ditemukan untuk:", jenisUjianKode);

  console.log(`[BOT] Mencari dropdown untuk value: ${examValue}...`);

  let attempts = 0;
  const maxAttempts = 15; // Coba terus selama 7.5 detik

  const trySelect = setInterval(() => {
    attempts++;

    // Gunakan selector yang lebih fleksibel (tanpa tanda >)
    const selectEl = document.getElementById("select1");
    const optionEl = selectEl?.querySelector(`option[value="${examValue}"]`);

    if (optionEl) {
      clearInterval(trySelect); // Berhenti mencoba jika sudah ketemu

      selectEl.value = examValue; // Pilih value

      // Trigger event agar website merespon pilihan tersebut
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      console.log(`[BOT] Berhasil memilih ${examValue} pada percobaan ke-${attempts}`);

      // Cek Auto Klik
      const autoFlags = masterData.auto_flags || {};
      if (autoFlags.autoExam) {
        setTimeout(() => {
          const btn = document.getElementById("test");
          if (btn) {
            console.log("[BOT] Klik tombol Next...");
            btn.click();
          }
        }, 800);
      }
    } else {
      if (attempts >= maxAttempts) {
        clearInterval(trySelect);
        console.error(`[BOT] Gagal menemukan option ${examValue} setelah ${maxAttempts} kali percobaan.`);
      }
    }
  }, 500); // Cek setiap 0.5 detik
})();
