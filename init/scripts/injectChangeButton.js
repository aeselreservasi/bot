// 1
function extractAndInjectButtons() {
  console.log("=== EXTRACT AND INJECT BUTTONS ===");

  // Extract data and add missing buttons
  const examData = extractFromCurrentPageWithButtons();

  // Inject buttons to page
  injectMissingRescheduleButtons(examData);

  console.log("Process completed!");
  return examData;
}

// 2 ===== MAIN EXTRACTION FUNCTIONS =====
function extractFromCurrentPageWithButtons() {
  console.log("=== EXTRACTING FROM CURRENT PAGE WITH BUTTON PROCESSING ===");

  // Extract exam data
  let examData = extractFromCurrentPage();

  if (examData.length === 0) {
    console.log("No exam data found");
    return [];
  }

  // Add missing reschedule buttons to data
  examData = addMissingRescheduleButtons(examData);

  // Show summary
  getRescheduleButtonsInfo(examData);

  return examData;
}
function extractFromCurrentPage() {
  console.log("=== EXTRACTING FROM CURRENT PAGE ===");

  // Method 1: Try DOM method first (more reliable)
  console.log("Trying DOM method...");
  let examData = extractExamDataDOM();

  if (examData.length === 0) {
    console.log("DOM method failed, trying HTML string method...");
    const htmlContent = document.documentElement.outerHTML;

    // Debug the HTML
    debugExtraction(htmlContent);

    // Try string extraction
    examData = extractExamDataFromHTML(htmlContent);
  }

  console.log("Final result:", examData);
  return examData;
}
function extractExamDataDOM(container = document) {
  console.log("Using DOM extraction method...");
  const examData = [];

  // Cari semua wrapper menggunakan DOM
  const wrappers = container.querySelectorAll(".reservation-examinfo-wrapper");
  console.log("Found wrappers:", wrappers.length);

  wrappers.forEach((wrapper, index) => {
    console.log(`Processing wrapper ${index + 1}`);

    const getData = (label) => {
      const infoElements = wrapper.querySelectorAll(".reservation-info");
      for (let info of infoElements) {
        if (info.textContent.trim() === label) {
          const detail = info.nextElementSibling;
          if (detail && detail.classList.contains("reservation-detail")) {
            return detail.textContent.trim().replace(/\s+/g, " ");
          }
        }
      }
      return "";
    };

    // Cari button dengan onclick WEB_Identification
    const button = wrapper.querySelector(
      'button[onclick*="WEB_Identification"]'
    );
    let id = null;
    if (button) {
      const onclickAttr = button.getAttribute("onclick");
      const idMatch = onclickAttr.match(/WEB_Identification\((\d+)/);
      if (idMatch) {
        id = idMatch[1];
      }
    }

    // Cari button ubah jadwal di seluruh reservation-wrapper
    const parentWrapper = wrapper.closest(".reservation-wrapper");
    let rescheduleId = null;
    let hasRescheduleButton = false;
    let rescheduleButtonHTML = null;

    if (parentWrapper) {
      const rescheduleButton = parentWrapper.querySelector(
        'button[onclick*="WEB_MoveAddressChange"]'
      );
      if (rescheduleButton) {
        hasRescheduleButton = true;
        rescheduleButtonHTML = rescheduleButton.outerHTML;
        const onclickAttr = rescheduleButton.getAttribute("onclick");
        const rescheduleMatch = onclickAttr.match(
          /WEB_MoveAddressChange\((\d+)/
        );
        if (rescheduleMatch) {
          rescheduleId = rescheduleMatch[1];
        }
      }
    }

    const code = getData("Kode Ujian");
    const subject = getData("Mata Ujian");
    const date = getData("Tanggal Ujian");
    const time = getData("Jam Mulai");
    const venue = getData("Tempat Ujian");

    console.log("DOM extracted:", {
      code,
      subject,
      date,
      time,
      venue,
      id,
      hasRescheduleButton,
      rescheduleId,
    });

    if (subject) {
      examData.push({
        id: id,
        code: code,
        subject: subject,
        date: date,
        time: time,
        venue: venue,
        status: subject.includes("[終了]") ? "Selesai" : "Aktif",
        hasConfirmation: !!id,
        hasRescheduleButton: hasRescheduleButton,
        rescheduleId: rescheduleId,
        rescheduleButtonHTML: rescheduleButtonHTML,
      });
    }
  });

  return examData;
}
// ===== DEBUGGING HELPER FUNCTIONS =====
function debugExtraction(htmlString) {
  console.log("=== DEBUG EXTRACTION ===");
  console.log("HTML length:", htmlString.length);

  // Check if main containers exist
  const hasReservationWrapper = htmlString.includes("reservation-wrapper");
  const hasExamInfoWrapper = htmlString.includes(
    "reservation-examinfo-wrapper"
  );
  const hasWebIdentification = htmlString.includes("WEB_Identification");
  const hasReschedule = htmlString.includes("WEB_MoveAddressChange");

  console.log("Has reservation-wrapper:", hasReservationWrapper);
  console.log("Has reservation-examinfo-wrapper:", hasExamInfoWrapper);
  console.log("Has WEB_Identification:", hasWebIdentification);
  console.log("Has WEB_MoveAddressChange:", hasReschedule);

  // Count occurrences
  const wrapperCount = (htmlString.match(/reservation-examinfo-wrapper/g) || [])
    .length;
  const idCount = (htmlString.match(/WEB_Identification\(/g) || []).length;
  const rescheduleCount = (htmlString.match(/WEB_MoveAddressChange\(/g) || [])
    .length;

  console.log("Exam info wrapper count:", wrapperCount);
  console.log("WEB_Identification count:", idCount);
  console.log("WEB_MoveAddressChange count:", rescheduleCount);
}
// ===== FUNGSI UTAMA EKSTRAKSI DATA (DENGAN TOMBOL UBAH JADWAL) =====
function extractExamDataFromHTML(htmlString) {
  console.log("Starting extraction...");
  const examData = [];

  // Method 1: Cari langsung reservation-examinfo-wrapper
  const examInfoPattern =
    /<div class="reservation-examinfo-wrapper">([\s\S]*?)<\/div>/g;
  let match;

  while ((match = examInfoPattern.exec(htmlString)) !== null) {
    console.log("Found exam info wrapper");
    const examBlock = match[1];

    // Ekstrak semua data dengan pattern yang lebih fleksibel
    const extractData = (label) => {
      const patterns = [
        new RegExp(
          `<div class="reservation-info">${label}</div>\\s*<div class="reservation-detail"[^>]*>([\\s\\S]*?)</div>`,
          "i"
        ),
        new RegExp(
          `<div class="reservation-info"[^>]*>${label}</div>\\s*<div class="reservation-detail"[^>]*>([\\s\\S]*?)</div>`,
          "i"
        ),
      ];

      for (let pattern of patterns) {
        const match = examBlock.match(pattern);
        if (match) {
          return match[1].trim().replace(/\s+/g, " ");
        }
      }
      return "";
    };

    // Ekstrak ID dari onclick WEB_Identification
    const idMatch = examBlock.match(/WEB_Identification\((\d+)/);

    // Ekstrak data tombol ubah jadwal
    const rescheduleMatch = htmlString.match(
      new RegExp(`WEB_MoveAddressChange\\((\\d+)[^)]*\\)`, "g")
    );
    let rescheduleId = null;
    let hasRescheduleButton = false;

    if (rescheduleMatch) {
      // Cari yang sesuai dengan ID ujian ini atau yang terdekat
      const currentId = idMatch ? idMatch[1] : null;
      for (let match of rescheduleMatch) {
        const reschMatch = match.match(/WEB_MoveAddressChange\((\d+)/);
        if (reschMatch) {
          rescheduleId = reschMatch[1];
          hasRescheduleButton = true;
          // Jika ID cocok dengan ID ujian, gunakan yang ini
          if (currentId && reschMatch[1] === currentId) {
            break;
          }
        }
      }
    }

    // Ekstrak semua field
    const code = extractData("Kode Ujian");
    const subject = extractData("Mata Ujian");
    const date = extractData("Tanggal Ujian");
    const time = extractData("Jam Mulai");
    const venue = extractData("Tempat Ujian");

    console.log("Extracted data:", {
      code,
      subject,
      date,
      time,
      venue,
      id: idMatch?.[1],
      hasRescheduleButton,
      rescheduleId,
    });

    if (subject) {
      examData.push({
        id: idMatch ? idMatch[1] : null,
        code: code,
        subject: subject,
        date: date,
        time: time,
        venue: venue,
        status: subject.includes("[終了]") ? "Selesai" : "Aktif",
        hasConfirmation: !!idMatch,
        hasRescheduleButton: hasRescheduleButton,
        rescheduleId: rescheduleId,
        rescheduleButtonHTML: null,
      });
    }
  }

  console.log("Total found:", examData.length);
  return examData;
}

// 3 ===== FUNGSI UNTUK MENAMBAHKAN TOMBOL UBAH JADWAL =====
function addMissingRescheduleButtons(examData) {
  console.log("=== ADDING MISSING RESCHEDULE BUTTONS ===");

  examData.forEach((exam, index) => {
    // Skip jika sudah ada tombol atau ujian sudah selesai atau tidak ada ID
    if (exam.hasRescheduleButton || exam.status === "Selesai" || !exam.id) {
      return;
    }

    console.log(
      `Adding reschedule button for exam ${exam.code} (ID: ${exam.id})`
    );

    // Buat HTML tombol ubah jadwal berdasarkan pattern yang ada
    const rescheduleButtonHTML = `<button class="btn btn-outline-primary btn-sm" type="button" onclick="WEB_MoveAddressChange(${exam.id}, 0, 1, 16, 1, false , 0.0000);">Ubah</button>`;

    // Update data
    exam.hasRescheduleButton = true;
    exam.rescheduleId = exam.id;
    exam.rescheduleButtonHTML = rescheduleButtonHTML;
    exam.buttonAdded = true; // Flag untuk menandai bahwa tombol ini ditambahkan
  });

  return examData;
}
function getRescheduleButtonsInfo(examData) {
  console.log("=== RESCHEDULE BUTTONS INFO ===");

  const summary = {
    total: examData.length,
    hasButton: examData.filter((e) => e.hasRescheduleButton).length,
    noButton: examData.filter(
      (e) => !e.hasRescheduleButton && e.status === "Aktif" && e.id
    ).length,
    finished: examData.filter((e) => e.status === "Selesai").length,
    noId: examData.filter((e) => !e.id).length,
  };

  console.table(summary);

  // Show details
  console.log("\n--- Ujian tanpa tombol ubah jadwal ---");
  examData
    .filter((e) => !e.hasRescheduleButton && e.status === "Aktif" && e.id)
    .forEach((exam) =>
      console.log(`${exam.code}: ${exam.subject} (ID: ${exam.id})`)
    );

  return summary;
}

// 4 ===== FUNGSI UNTUK INJECT TOMBOL KE HALAMAN =====
function injectMissingRescheduleButtons(examData) {
  console.log("=== INJECTING MISSING RESCHEDULE BUTTONS TO PAGE ===");

  const wrappers = document.querySelectorAll(".reservation-examinfo-wrapper");

  examData.forEach((exam, index) => {
    if (!exam.buttonAdded || exam.status === "Selesai") {
      return;
    }

    // Cari wrapper yang sesuai berdasarkan kode ujian
    const matchingWrapper = Array.from(wrappers).find((wrapper) => {
      const codeElement = Array.from(
        wrapper.querySelectorAll(".reservation-info")
      ).find((info) => info.textContent.trim() === "Kode Ujian");

      if (codeElement) {
        const detail = codeElement.nextElementSibling;
        return detail && detail.textContent.trim() === exam.code;
      }
      return false;
    });

    if (matchingWrapper) {
      // Cari reservation-wrapper parent
      const parentWrapper = matchingWrapper.closest(".reservation-wrapper");
      if (parentWrapper) {
        let buttonWrapper = parentWrapper.querySelector(
          ".reservation-exambutton-wrapper"
        );

        // Jika tidak ada button wrapper, buat
        if (!buttonWrapper) {
          buttonWrapper = document.createElement("div");
          buttonWrapper.className = "reservation-exambutton-wrapper";
          parentWrapper.appendChild(buttonWrapper);
        }

        // Cari section ubah jadwal
        let rescheduleSection = Array.from(buttonWrapper.children).find(
          (child) => {
            const info = child.querySelector
              ? child.querySelector(".reservation-info")
              : null;
            return info && info.textContent.includes("Penjadwalan Ulang");
          }
        );

        // Jika tidak ada, buat section baru
        if (!rescheduleSection) {
          rescheduleSection = document.createElement("div");
          rescheduleSection.innerHTML = `
                        <div class="reservation-info">Penjadwalan Ulang dan Perubahan Tempat Ujian</div>
                        <div class="reservation-detail">
                            ${exam.rescheduleButtonHTML}
                        </div>
                    `;
          buttonWrapper.appendChild(rescheduleSection);
          console.log(`Injected reschedule button for ${exam.code}`);
        } else {
          // Update yang sudah ada jika kosong
          const detailElement = rescheduleSection.querySelector(
            ".reservation-detail"
          );
          if (
            detailElement &&
            (!detailElement.querySelector("button") ||
              detailElement.textContent.trim() === "")
          ) {
            detailElement.innerHTML = exam.rescheduleButtonHTML;
            console.log(`Updated reschedule button for ${exam.code}`);
          }
        }
      }
    }
  });
}

// ===== FUNGSI UTILITAS TOMBOL =====
function createRescheduleButton(examId, customParams = {}) {
  const defaultParams = {
    param1: 0,
    param2: 1,
    param3: 16,
    param4: 1,
    param5: false,
    param6: 0.0,
  };

  const params = { ...defaultParams, ...customParams };

  return `<button class="btn btn-outline-primary btn-sm" type="button" onclick="WEB_MoveAddressChange(${examId}, ${params.param1}, ${params.param2}, ${params.param3}, ${params.param4}, ${params.param5}, ${params.param6});">Ubah</button>`;
}

function extractFromElement(selector) {
  console.log("=== EXTRACTING FROM ELEMENT ===", selector);
  const element = document.querySelector(selector);

  if (!element) {
    console.error("Element tidak ditemukan:", selector);
    return [];
  }

  // Try DOM method first
  console.log("Trying DOM method on element...");
  let examData = extractExamDataDOM(element);

  if (examData.length === 0) {
    console.log("DOM method failed, trying HTML string method...");
    const htmlContent = element.outerHTML;
    debugExtraction(htmlContent);
    examData = extractExamDataFromHTML(htmlContent);
  }

  console.log("Final result:", examData);
  return examData;
}

function testExtraction() {
  console.log("=== TESTING EXTRACTION ===");

  // Test if elements exist
  const wrappers = document.querySelectorAll(".reservation-examinfo-wrapper");
  console.log("Found reservation-examinfo-wrapper elements:", wrappers.length);

  if (wrappers.length > 0) {
    console.log(
      "Sample wrapper HTML:",
      wrappers[0].outerHTML.substring(0, 500)
    );
  }

  const buttons = document.querySelectorAll(
    'button[onclick*="WEB_Identification"]'
  );
  const rescheduleButtons = document.querySelectorAll(
    'button[onclick*="WEB_MoveAddressChange"]'
  );
  console.log("Found WEB_Identification buttons:", buttons.length);
  console.log("Found WEB_MoveAddressChange buttons:", rescheduleButtons.length);

  // Try extraction
  const examData = extractFromCurrentPage();

  if (examData.length > 0) {
    console.table(examData);
    return examData;
  } else {
    console.log("No data found. Trying manual inspection...");

    // Manual inspection
    wrappers.forEach((wrapper, i) => {
      console.log(`\n--- Wrapper ${i + 1} ---`);
      const infos = wrapper.querySelectorAll(".reservation-info");
      infos.forEach((info) => {
        const detail = info.nextElementSibling;
        if (detail && detail.classList.contains("reservation-detail")) {
          console.log(`${info.textContent}: ${detail.textContent.trim()}`);
        }
      });
    });
  }

  return [];
}

function findExamElements() {
  console.log("=== FINDING EXAM ELEMENTS ===");

  const selectors = [
    ".reservation-examinfo-wrapper",
    ".reservation-wrapper",
    ".reservation-info",
    ".reservation-detail",
    'button[onclick*="WEB_Identification"]',
    'button[onclick*="WEB_MoveAddressChange"]',
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    console.log(`${selector}: ${elements.length} found`);
  });
}

// ===== QUICK COMMANDS FOR CONSOLE =====
/*
Jalankan di console:

1. Test apakah elemen ada:
   findExamElements();

2. Test ekstraksi biasa:
   testExtraction();

3. Ekstrak data dengan tombol:
   const data = extractFromCurrentPageWithButtons();
   
4. Ekstrak dan inject tombol ke halaman:
   extractAndInjectButtons();
   
5. Lihat info tombol ubah jadwal:
   const data = extractFromCurrentPage();
   getRescheduleButtonsInfo(data);

6. Buat tombol manual:
   const buttonHTML = createRescheduleButton(12345);
   console.log(buttonHTML);

7. Debug lengkap:
   debugExtraction(document.documentElement.outerHTML);
*/

// ===== AUTO-RUN FOR TESTING =====
// Uncomment line di bawah untuk auto-run saat script dimuat
// setTimeout(() => testExtraction(), 1000);
extractAndInjectButtons();
