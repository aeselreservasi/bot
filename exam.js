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

  const targetValue = listUjian[jenisUjianKode];
  if (!targetValue) return console.warn("[BOT] Tidak ada mapping untuk:", jenisUjianKode);

  console.log(`[BOT] Menunggu elemen ${targetValue} muncul...`);

  // Fungsi utama untuk memilih
  const performSelection = (selectEl, optionEl) => {
    console.log("[BOT] Elemen ditemukan! Mencoba memilih...");

    // 1. Pilih value-nya
    selectEl.value = targetValue;
    optionEl.selected = true;

    // 2. Kirim berbagai event agar sistem web sadar ada perubahan
    const events = ["change", "input", "blur"];
    events.forEach((evtName) => {
      selectEl.dispatchEvent(new Event(evtName, { bubbles: true }));
    });

    // 3. Cek apakah perlu klik otomatis (Next)
    const autoFlags = masterData.auto_flags || {};
    if (autoFlags.autoExam) {
      setTimeout(() => {
        const btn = document.getElementById("test");
        if (btn) {
          console.log("[BOT] Klik tombol Next (ID: test)");
          btn.click();
        }
      }, 1000); // Jeda 1 detik agar pilihan benar-benar tersimpan di sistem web
    }
  };

  // LOGIKA RETRY (Mencoba terus sampai ketemu)
  let checkCount = 0;
  const maxChecks = 40; // 40 kali x 250ms = 10 detik maksimal menunggu

  const intervalId = setInterval(() => {
    checkCount++;
    const selectEl = document.getElementById("select1");
    const optionEl = selectEl?.querySelector(`option[value="${targetValue}"]`);

    if (optionEl) {
      clearInterval(intervalId);
      performSelection(selectEl, optionEl);
    } else if (checkCount >= maxChecks) {
      clearInterval(intervalId);
      console.error(`[BOT] Gagal total: Dropdown ${targetValue} tidak muncul setelah 10 detik.`);

      // EMERGENCY: Jika gagal, paksa muat ulang halaman atau beri tahu pengguna
      // location.reload();
    }
  }, 250); // Cek setiap seperempat detik agar sangat responsif
})();
