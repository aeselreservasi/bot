// Ambil data utama
const masterDataRaw = localStorage.getItem("bot_master_data");

if (!masterDataRaw) {
  console.log("bot_master_data tidak ditemukan.");
} else {
  const masterData = JSON.parse(masterDataRaw);
  const jenisUjianKode = masterData.jenis_ujian_kode; // contoh: "JFT"

  if (!jenisUjianKode) {
    console.log("jenis_ujian_kode kosong.");
  } else {

    // Reverse lookup: cari exam value dari listUjian
    let exam = Object.keys(listUjian).find(
      key => listUjian[key] === jenisUjianKode
    );

    if (!exam) {
      console.log("Mapping exam tidak ditemukan untuk:", jenisUjianKode);
    } else {

      // Legacy fix (jika masih dibutuhkan)
      if (exam === "JH0-I12J") {
        exam = "JH0-J12J";
      }

      const examEl = document.querySelector(
        `#select1 > option[value="${exam}"]`
      );

      if (examEl) {
        examEl.selected = true;

        const autoFlags = masterData.auto_flags || {};
        if (autoFlags.autoExam) {
          document.getElementById("test")?.click();
        } else {
          console.log("Auto exam dimatikan.");
        }

      } else {
        console.log("Option exam tidak ditemukan di select:", exam);
      }
    }
  }
}
