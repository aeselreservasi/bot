// Mendapatkan elemen dari DOM
const dateForm = document.getElementById("dateForm");
const dateList = document.getElementById("dateList");
const resetButton = document.getElementById("resetButton");
const targetForm = document.getElementById("targetForm");
const cityList = document.getElementById("cityList");
const jamList = document.getElementById("jamList");

// Helper untuk mengambil data dari localStorage
function getUserData() {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : {};
}

// Helper untuk menyimpan data ke localStorage
function saveUserData(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
  // Catatan: chrome.runtime.sendMessage dihapus karena kita tidak lagi menggunakan arsitektur ekstensi
}

// Fungsi untuk menambahkan data tanggal
dateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const dateInput = document.getElementById("date").value;

  if (!dateInput) {
    alert("Silakan pilih tanggal.");
    return;
  }

  let userData = getUserData();
  let tanggalUjian = userData["Tanggal Ujian"] || [];

  if (tanggalUjian.includes(dateInput)) {
    alert("Data tanggal ini sudah ada.");
    dateForm.reset();
    return;
  }

  tanggalUjian.push(dateInput);
  userData["Tanggal Ujian"] = tanggalUjian;

  saveUserData(userData);
  renderDate(tanggalUjian);
  dateForm.reset();
});

// Fungsi untuk menambahkan data tempat & jam ujian
targetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cityInput = document.getElementById("city").value;
  const timeInput = document.getElementById("time").value;

  if (!cityInput && !timeInput) {
    alert("Silakan masukkan target tempat/jam ujian.");
    return;
  }

  let userData = getUserData();
  let kotaUjian = userData["Lokasi Ujian"] || [];
  let jamUjian = userData["Jam Ujian"] || [];

  const isKotaDuplicate = kotaUjian.some((kota) => kota === cityInput);
  const isJamDuplicate = jamUjian.some((jam) => jam === timeInput);

  if ((cityInput && isKotaDuplicate) || (timeInput && isJamDuplicate)) {
    alert(`kota/jam yang dimasukkan sudah ada`);
    targetForm.reset();
    return;
  }

  if (cityInput) {
    kotaUjian.push(cityInput);
    userData["Lokasi Ujian"] = kotaUjian;
  }
  if (timeInput) {
    jamUjian.push(timeInput);
    userData["Jam Ujian"] = jamUjian;
  }

  saveUserData(userData);
  renderCity(kotaUjian);
  renderJam(jamUjian);
  targetForm.reset();
});

// Fungsi untuk menghapus semua data
resetButton.addEventListener("click", () => {
  let userData = getUserData();
  userData["Tanggal Ujian"] = [];
  userData["Lokasi Ujian"] = [];
  userData["Jam Ujian"] = [];

  saveUserData(userData);
  renderDate([]);
  renderCity([]);
  renderJam([]);
});

// Fungsi untuk memuat data dari storage saat halaman dibuka
function loadData() {
  let userData = getUserData();
  renderDate(userData["Tanggal Ujian"] || []);
  renderCity(userData["Lokasi Ujian"] || []);
  renderJam(userData["Jam Ujian"] || []);
}

// Fungsi untuk menampilkan data tanggal dalam daftar
function renderDate(dates) {
  dateList.innerHTML = "";
  if (Array.isArray(dates)) {
    dates.forEach((date, index) => {
      const listItem = createListItem(`Target ${index + 1}: ${date}`, () => {
        let userData = getUserData();
        userData["Tanggal Ujian"].splice(index, 1);
        saveUserData(userData);
        renderDate(userData["Tanggal Ujian"]);
      });
      dateList.appendChild(listItem);
    });
  }
}

// Fungsi untuk menampilkan data jam dalam daftar
function renderJam(hours) {
  jamList.innerHTML = "";
  if (Array.isArray(hours)) {
    hours.forEach((hour, index) => {
      const listItem = createListItem(`Target ${index + 1}: ${hour}`, () => {
        let userData = getUserData();
        userData["Jam Ujian"].splice(index, 1);
        saveUserData(userData);
        renderJam(userData["Jam Ujian"]);
      });
      jamList.appendChild(listItem);
    });
  }
}

// Fungsi untuk menampilkan data kota dalam daftar
function renderCity(cities) {
  if (!Array.isArray(cities)) return;

  const kotaMap = {
    IOJ02: "Jakarta Timur",
    IOJ03: "Surabaya",
    IOJ04: "Bandung Andir",
    IOJ05: "Yogyakarta UII",
    IOJ06: "Medan",
    IOJ07: "Jakarta Pademangan",
    IOJ08: "Semarang Banyumanik",
    IOJ09: "Denpasar",
    IOJ10: "Jakarta Satrio Tower A",
    IOJ11: "Manado",
    IOJ12: "Jakarta Satrio Tower B",
    IOJ13: "Jakarta Plaza Central",
    IOJ14: "Yogyakarta Ngaglik",
    IOJ15: "Semarang Tembalang",
    IOJ16: "Bandung Astanaanyar",
  };

  const mappedCities = cities.map((city) => kotaMap[city] || city);
  cityList.innerHTML = "";

  mappedCities.forEach((city, index) => {
    const listItem = createListItem(`Target ${index + 1}: ${city}`, () => {
      let userData = getUserData();
      userData["Lokasi Ujian"].splice(index, 1);
      saveUserData(userData);
      renderCity(userData["Lokasi Ujian"]);
    });
    cityList.appendChild(listItem);
  });
}

// Helper untuk membuat elemen <li> (Mengurangi duplikasi kode render)
function createListItem(text, onDelete) {
  const listItem = document.createElement("li");
  Object.assign(listItem.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "5px",
    backgroundColor: "#333",
  });

  const spanText = document.createElement("span");
  spanText.textContent = text;
  spanText.style.width = "90%";

  const deleteButton = document.createElement("span");
  deleteButton.textContent = "X";
  Object.assign(deleteButton.style, {
    color: "red",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
  });

  deleteButton.addEventListener("click", onDelete);

  listItem.appendChild(spanText);
  listItem.appendChild(deleteButton);
  return listItem;
}

// Fungsi untuk menambahkan semua jam
function addAllTimes() {
  const timeOptions = document.querySelectorAll("#time option");
  let userData = getUserData();
  let jamUjian = userData["Jam Ujian"] || [];

  timeOptions.forEach((option) => {
    if (option.value && !jamUjian.includes(option.value)) {
      jamUjian.push(option.value);
    }
  });

  userData["Jam Ujian"] = jamUjian;
  saveUserData(userData);
  renderJam(jamUjian);
}

// Fungsi untuk menambahkan semua kota
function addAllCities() {
  const cityOptions = document.querySelectorAll("#city option");
  let userData = getUserData();
  let kotaUjian = userData["Lokasi Ujian"] || [];

  cityOptions.forEach((option) => {
    if (option.value && !kotaUjian.includes(option.value)) {
      kotaUjian.push(option.value);
    }
  });

  userData["Lokasi Ujian"] = kotaUjian;
  saveUserData(userData);
  renderCity(kotaUjian);
}

// Event Listeners untuk tombol bulk
document.getElementById("addAllTimesButton").addEventListener("click", addAllTimes);
document.getElementById("addAllCitiesButton").addEventListener("click", addAllCities);

// Muat data saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadData);
