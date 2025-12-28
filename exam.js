(function () {
  // 1. Ambil data dari variabel global yang disiapkan injector
  const masterData = window.__BOT_DATA__;

  if (!masterData) {
    console.error("[BOT] Data __BOT_DATA__ tidak ditemukan di window.");
    return;
  }

  const jenisUjianKode = masterData.jenis_ujian_kode;
  console.log("[BOT] Menjalankan mapping untuk ujian:", jenisUjianKode);

  // Pastikan listUjian tersedia (biasanya didefinisikan di awal skrip ini atau global)
  // Jika belum ada, Anda harus mendefinisikannya di sini.
  const listUjian = window.listUjian || {
    "F10-E10J": "JFT",
    "T20-J11J": "PM",
    "T10-J11J": "RESTO",
    "JH0-I11J": "KGINDO",
    "JH0-I12J": "KGJAPAN",
    "NC0-I11J": "PERTANIAN",
    "NC0-I12J": "PETERNAKAN",
  };

  // 2. Reverse lookup: cari value option berdasarkan kode ujian
  let examValue = Object.keys(listUjian).find((key) => listUjian[key] === jenisUjianKode);

  if (!examValue) {
    console.warn("[BOT] Mapping exam tidak ditemukan untuk:", jenisUjianKode);
    return;
  }

  // Legacy fix untuk Caregiver
  if (examValue === "JH0-I12J") {
    examValue = "JH0-J12J";
  }

  // 3. Eksekusi pemilihan di Dropdown
  const examEl = document.querySelector(`#select1 > option[value="${examValue}"]`);

  if (examEl) {
    examEl.selected = true;
    console.log("[BOT] Berhasil memilih:", examValue);

    // Memicu event change agar website tahu ada perubahan (penting untuk web modern)
    examEl.parentElement.dispatchEvent(new Event("change", { bubbles: true }));

    // 4. Cek Auto Flags untuk Klik Tombol Next
    const autoFlags = masterData.auto_flags || {};
    if (autoFlags.autoExam) {
      console.log("[BOT] Auto klik tombol 'test'...");
      setTimeout(() => {
        document.getElementById("test")?.click();
      }, 500); // Beri jeda sedikit agar sistem web merespon
    } else {
      console.log("[BOT] Auto exam dimatikan.");
    }
  } else {
    console.error("[BOT] Elemen dropdown tidak ditemukan untuk value:", examValue);
  }
})();
