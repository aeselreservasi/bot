const cust = JSON.parse(localStorage.getItem("userData"));
function skip() {
  if (JSON.parse(localStorage.getItem("autoInput"))) {
    // Next
    document.getElementById("Next").click();
  }
}
function inputDataUmum() {
  // tanggal lahir
  if (cust["Tanggal Lahir"]) {
    const listBulan = {
      january: "01",
      febrary: "02",
      march: "03",
      may: "05",
      june: "06",
      july: "07",
      august: "08",
      october: "10",
      december: "12",
      januari: "01",
      februari: "02",
      maret: "03",
      april: "04",
      mei: "05",
      juni: "06",
      juli: "07",
      agustus: "08",
      september: "09",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let [dateInput, monthInput, yearInput] = cust["Tanggal Lahir"]?.split(" ");
    const yearEl = document.querySelector(`select[name="selBYear"]`);
    const monthEl = document.querySelector(`select[name="selBMonth"]`);
    const dayEl = document.querySelector(`select[name="selBDay"]`);
    yearEl.value = yearInput;
    monthEl.value = listBulan[monthInput.toLowerCase()];
    dayEl.value = dateInput.toString().padStart(2, "0");
  }
  // jenis kelamin
  if (cust["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
    document.querySelector(`input[name="rdoGender"][value="2"]`).click();
  } else if (cust["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
    document.querySelector(`input[name="rdoGender"][value="1"]`).click();
  }
  // bangsa & bahasa
  document.querySelector(`input[name="rdoNation"]`).click();
  document.querySelector(`select[name="selNation"]`).value = "Indonesia";
}

// input for JFT
if (localStorage.getItem("exam") === "F10-E10J") {
  inputDataUmum();
  // bahasa yang digunakan
  document.querySelector(`input[name="rdoLang"]`).click();
  document.querySelector(`select[name="selLang"]`).value = "Indonesian";
  // minat ssw
  document.getElementsByName("chkOccupation").forEach((el) => {
    if (el.value !== "O") {
      el.click();
    }
  });
  // pernah ke jepang/belum
  document.querySelector('select[name="selTraveling"]').value =
    "No, I have not been to Japan before";
  // belajar bahasa
  document.querySelector('select[name="selStudy"]').value = "Over 300 hours";
  // ujian?
  document.querySelector('input[name="chkCBT"][value="A"]').click();
  // media belajar
  document.querySelector('input[name="chkTextbook"][value="A"]').click();
  // chkWebsite
  document.querySelector('input[name="chkWebSite"][value="A"]').click();
  // status
  document.querySelector('select[name="selStatus"]').value = "A";
  // Next
  document.getElementById("Next").click();
  skip();
} else if (["T20-J11J", "T10-J11J"].includes(localStorage.getItem("exam"))) {
  inputDataUmum();
  // input for SSW Pengolahan Makanan dan Food Service
  // pekerjaan
  document.querySelector(`select[name="selJob"]`).value =
    "University student/graduate student";
  // pernah ke jepang/belum
  document.querySelector('input[name="chkResidence"][value="A"]').click();
  // pernah bekerja di jepang/belum
  document.querySelector('input[name="chkWork"][value="A"]').click();
  // ujian berapa kali
  document
    .querySelector('input[name="rdoTaken"][value="This is the first time."]')
    .click();
  // bahan ajar darimana
  document.querySelector(`select[name="selLearn"]`).value =
    "I knew that there were learning texts, but I didn't know where I could find them.";
  // tahu ujian darimana
  document.querySelector('input[name="chkKnows"][value="A"]').click();
  // lulus jft
  document
    .querySelector('input[name="rdoAbility"][value="Have passed"]')
    .click();
  // Next
  document.getElementById("Next").click();
  skip();
} else if (["JH0-I11J", "JH0-I12J", "JH0-J12J"].includes(localStorage.getItem("exam"))) {
  inputDataUmum();
  // input for SSW KAIGO
  document.querySelector("select[name='selAcademic']").value =
    "High school graduate";
  document.querySelector("select[name='SelExp']").value =
    "I don't have any work experience.";
  document.querySelector("select[name='selVisit']").value =
    "No, I have not been to Japan before";
  document.querySelector("select[name='selNursing1']").value =
    "less than 1 month";
  document.querySelector("select[name='selNursing2']").value = "self study";
  document.querySelector("select[name='selJpLevel']").value = "JFT-Basic";
  // Next
  document.getElementById("Next").click();
  skip();
} else if (["NC0-I11J", "NC0-I12J"].includes(localStorage.getItem("exam"))) {
  inputDataUmum();
  // input for SSW Pertanian dan Peternakan
  // pernah ke jepang/belum
  document.querySelector('select[name="selTraveling"]').value = "No";
  // belajar ssw berapa lama
  document.querySelector('select[name="selStudy"]').value = "80 hours or less";
  // pengalaman ternak/tani
  document.querySelector('select[name="selEng"]').value = "None";
  document.querySelector('select[name="selAgre"]').value = "Agree";
  // status
  document.querySelector('select[name="selStatus"]').value =
    "I will not take the test in Japan.";
  // Next
  document.getElementById("Next").click();
  skip();
} else if (["SP0-J11J"].includes(localStorage.getItem("exam"))) {
  // input data for SSW automobile OTOMOTIF
  // Tanggal Lahir
  if (cust["Tanggal Lahir"]) {
    const bulan = {
      january: "1",
      febrary: "2",
      march: "3",
      may: "5",
      june: "6",
      july: "7",
      august: "8",
      october: "10",
      december: "12",
      januari: "1",
      februari: "2",
      maret: "3",
      april: "4",
      mei: "5",
      juni: "6",
      juli: "7",
      agustus: "8",
      september: "9",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let [date, month, year] = cust["Tanggal Lahir"]?.split(" ");
    const yearEl = document.querySelector(`select[name="selBYear"]`);
    const monthEl = document.querySelector(`select[name="selBMonth"]`);
    const dayEl = document.querySelector(`select[name="selBDay"]`);
    yearEl.value = year;
    monthEl.value = bulan[month.toLowerCase()];
    dayEl.value = date.replace(/^0+/, "");
  }
  // Gender
  if (cust["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
    document.getElementById(`question2`).value = "Male";
  } else if (cust["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
    document.getElementById(`question2`).value = "Female";
  }
  // Kebangsaan "indonesia"
  document.querySelector("input[name='question3'][value='Indonesia']").click();
  //Pernah di jepang
  document.getElementById("question4").value =
    "No, I have not been to Japan before";
  // Sekolah automobile?
  document.getElementById("question5").value = "Did not going";
  // Pengalaman otomotif
  document.getElementById("question6").value = "Inexperience";
  // Next
  document.getElementById("Next").click();
  skip();
} else if (["YS0-J11J", "FS0-J11J", "CH0-J01J", "CH0-J02J", "CH0-J03J"].includes(localStorage.getItem("exam"))) {
  //Input data AKUAKULTUR & PERIKANAN & KONTRUKSI
  //Tanggal Lahir
  if (cust["Tanggal Lahir"]) {
    const bulan = {
      january: "1",
      febrary: "2",
      march: "3",
      may: "5",
      june: "6",
      july: "7",
      august: "8",
      october: "10",
      december: "12",
      januari: "1",
      februari: "2",
      maret: "3",
      april: "4",
      mei: "5",
      juni: "6",
      juli: "7",
      agustus: "8",
      september: "9",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let [date, month, year] = cust["Tanggal Lahir"]?.split(" ");
    const yearEl = document.querySelector(`select[name="selBYear"]`);
    const monthEl = document.querySelector(`select[name="selBMonth"]`);
    const dayEl = document.querySelector(`select[name="selBDay"]`);
    yearEl.value = year;
    monthEl.value = bulan[month.toLowerCase()];
    dayEl.value = date.replace(/^0+/, "");
  }
  //Gender
  if (cust["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
    document.getElementById(`question2`).value = "Male";
  } else if (cust["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
    document.getElementById(`question2`).value = "Female";
  }
  //Kebangsaan "indonesia"
  document.querySelector("input[name='question3'][value='Indonesia']").click();
  //Next
  document.getElementById("Next").click();
  skip();
} else if (["R40-J11J"].includes(localStorage.getItem("exam"))) {
  // input data akomodasi
  if (cust["Tanggal Lahir"]) {
    const bulan = {
      january: "1",
      febrary: "2",
      march: "3",
      may: "5",
      june: "6",
      july: "7",
      august: "8",
      october: "10",
      december: "12",
      januari: "1",
      februari: "2",
      maret: "3",
      april: "4",
      mei: "5",
      juni: "6",
      juli: "7",
      agustus: "8",
      september: "9",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let [date, month, year] = cust["Tanggal Lahir"]?.split(" ");
    const yearEl = document.querySelector(`select[name="selBYear"]`);
    const monthEl = document.querySelector(`select[name="selBMonth"]`);
    const dayEl = document.querySelector(`select[name="selBDay"]`);
    yearEl.value = year;
    monthEl.value = bulan[month.toLowerCase()];
    dayEl.value = date.replace(/^0+/, "");
  }
  //Gender
  if (cust["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
    document.getElementById(`question2`).value = "Male";
  } else if (cust["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
    document.getElementById(`question2`).value = "Female";
  }
  //Kebangsaan "indonesia"
  document.querySelector("input[name='question3'][value='Indonesia']").click();
  // LEVEL BAHASA "JFT"
  document.getElementById("question4").value = "JFT-Basic";
  //Next
  document.getElementById("Next").click();
  skip();
} else if ([
  "M50-J11J",
  "M50-J12J",
  "M50-J13J",
  "M50-J14J",
  "M50-J15J",
  "M50-J16J",
  "M50-J17J",
  "M50-J18J",
  "M50-J19J",
  "M50-J20J"
].includes(localStorage.getItem("exam"))) {
  if (cust["Tanggal Lahir"]) {
    const bulan = {
      january: "1",
      febrary: "2",
      march: "3",
      may: "5",
      june: "6",
      july: "7",
      august: "8",
      october: "10",
      december: "12",
      januari: "1",
      februari: "2",
      maret: "3",
      april: "4",
      mei: "5",
      juni: "6",
      juli: "7",
      agustus: "8",
      september: "9",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let [date, month, year] = cust["Tanggal Lahir"]?.split(" ");
    const yearEl = document.querySelector(`select[name="selBYear"]`);
    const monthEl = document.querySelector(`select[name="selBMonth"]`);
    const dayEl = document.querySelector(`select[name="selBDay"]`);
    yearEl.value = year;
    monthEl.value = bulan[month.toLowerCase()];
    dayEl.value = date.replace(/^0+/, "");
  }
  //Gender
  if (cust["Jenis Kelamin"]?.toLowerCase().includes("laki")) {
    document.getElementById(`question2`).value = "Male";
  } else if (cust["Jenis Kelamin"]?.toLowerCase().includes("perempuan")) {
    document.getElementById(`question2`).value = "Female";
  }
  //Kebangsaan "indonesia"
  document.querySelector("input[name='question3'][value='Indonesia']").click();
  //Not In Japan
  document.querySelector('input[name="question4"][value = "Not in Japan"]').click();
  //Pengalaman
  document.getElementById("question5").value = "1 year to less than 2 years";
  //Lulusan
  document.querySelector('input[name="question6"][value = "Graduate school"]').click();
  //Next
  document.getElementById("Next").click();
  skip();
}

else {
  console.log("Exam not found.");
}
