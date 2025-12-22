document.getElementById("exam").addEventListener("change", selectExam);
document.addEventListener("DOMContentLoaded", loadSavedData);

const listUjian = {
  "F10-E10J": "JFT",
  "T20-J11J": "PM",
  "T10-J11J": "RESTO",
  "JH0-I11J": "KGINDO",
  "JH0-I12J": "KGJAPAN",
  "NC0-I11J": "PERTANIAN",
  "NC0-I12J": "PETERNAKAN",
  "FS0-J11J": "PERIKANAN",
  "YS0-J11J": "AKUAKULTUR",
  "CH0-J01J": "CIVIL",
  "CH0-J02J": "BUILDING",
  "CH0-J03J": "INFRASTRUCTURE",
  "R40-J11J": "ACCOMODATION",
  "SP0-J11J": "AUTOMOBILE",
  "M50-J11J": "MACHINING",
  "M50-J12J": "ELECTRONIC_ASSEMBLY",
  "M50-J13J": "SURFACE_TREATMENT",
  "M50-J14J": "CARDBOARD",
  "M50-J15J": "PRECAST",
  "M50-J16J": "RDF_FUEL",
  "M50-J17J": "POTTERY",
  "M50-J18J": "PRINTING",
  "M50-J19J": "TEXTILES",
  "M50-J20J": "SEWING",
};

// Membalik key-value listUjian agar bisa dicari berdasarkan kata-kata
const reverseListUjian = Object.entries(listUjian).reduce((acc, [key, value]) => {
  acc[value.toLowerCase()] = key;
  return acc;
}, {});

function loadSavedData() {
  // Ambil userData dari localStorage
  const rawUserData = localStorage.getItem("userData");
  const userData = rawUserData ? JSON.parse(rawUserData) : {};

  if (userData["Jenis Ujian"]) {
    let examSaved = null;
    const jenisUjianLower = userData["Jenis Ujian"].toLowerCase();

    // Cek kecocokan jenis ujian
    for (const [ujianText, ujianCode] of Object.entries(reverseListUjian)) {
      if (jenisUjianLower.includes(ujianText)) {
        examSaved = ujianCode;
        break;
      }
    }

    if (examSaved) {
      const examEl = document.getElementById("exam");
      examEl.value = examSaved;

      // Simpan exam code ke localStorage
      localStorage.setItem("exam", examSaved);

      // Jalankan fungsi selectExam untuk sinkronisasi awal
      selectExam();
    } else {
      console.log("Jenis ujian tidak dikenali.");
    }
  } else {
    // Jika tidak ada userData, coba cek apakah sudah ada exam tersimpan
    const savedExam = localStorage.getItem("exam");
    if (savedExam) {
      document.getElementById("exam").value = savedExam;
    }
    console.log("Jenis ujian tidak ditemukan di userData.");
  }
}

function selectExam() {
  const examEl = document.getElementById("exam");
  const exam = examEl.value;
  const jenisUjian = listUjian[exam] || "";

  // 1. Update userData
  const rawUserData = localStorage.getItem("userData");
  let userData = rawUserData ? JSON.parse(rawUserData) : {};
  userData["Jenis Ujian"] = jenisUjian;

  // Simpan kembali userData ke localStorage
  localStorage.setItem("userData", JSON.stringify(userData));

  // 2. Simpan exam code secara terpisah ke localStorage
  localStorage.setItem("exam", exam);

  console.log(`Exam updated to: ${exam} (${jenisUjian})`);

  // Catatan: chrome.runtime.sendMessage dihapus karena tidak lagi menggunakan background script ekstensi
}
