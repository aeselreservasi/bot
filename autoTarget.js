(function () {
  /* =====================================================
     HARD GUARD – USER AKTIF
  ===================================================== */
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    console.warn("[exam] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[exam] user tidak aktif, STOP");
    return;
  }
  const autoTarget = JSON.parse(localStorage.getItem("autoTarget")) || false;
  const fastTarget = JSON.parse(localStorage.getItem("autoFastTarget")) || false;
  let datesIndex = parseInt(sessionStorage.getItem("datesIndex") || "0", 10);
  let datesIdxFast = parseInt(sessionStorage.getItem("datesIdxFast") || "0", 10);
  let placeIdxFast = parseInt(sessionStorage.getItem("placeIdxFast") || "0", 10);
  let timeIdxFast = parseInt(sessionStorage.getItem("timeIdxFast") || "0", 10);

  // Ambil data
  const dates = userData["Tanggal Ujian"] || [];
  const cities = userData["Lokasi Ujian"] || [];
  const hours = userData["Jam Ujian"] || [];

  const findCityAndClick = () => {
    // Jika data kota/jam kosong
    if (!cities.length || !hours.length) {
      console.warn("Cities or hours data is empty. Proceeding with form search.");
      fillFormAndSearch();
      return;
    }
    for (const city of cities) {
      // Mengulang mencari tiap kota
      for (const hour of hours) {
        // Mengulang mencari tiap jam
        const element = document.querySelector(`a[href^='JavaScript:onClick=click_next("${city}","${hour}"']`);
        const element2 = document.querySelector(`button[onclick^='click_next("${city}","${hour}"']`);

        if (element) {
          console.log(`Found element for city: ${city}, hour: ${hour}. Clicking...`);
          element.click();
          return;
        } else if (element2) {
          console.log(`Found element2 for city: ${city}, hour: ${hour}. Clicking...`);
          element2.click();
          return;
        } else {
          console.log(`Element not found for city: ${city}, hour: ${hour}.`);
        }
      }
    }

    console.log("No matching element found. Attempting fallback.");
    fillFormAndSearch();
  };
  const fillFormAndSearch = () => {
    let retryCount = 0;
    const maxRetries = 100; // Batasi hingga 100 percobaan (10 detik)
    const dayInput = document.getElementById("exam_day_d");
    const monthInput = document.getElementById("exam_day_m");
    const yearInput = document.getElementById("exam_day_y");
    const countryCodeInput = document.getElementById("countryCode");
    const searchButton = document.querySelector('input[name="search"]');
    const searchButton2 = document.querySelector('button[name="search"]');
    if (!dayInput || !monthInput || !yearInput || !countryCodeInput) {
      console.log("One or more required form elements are missing.");
      return;
    }
    if (!dates.length) {
      console.log("Dates data is empty.");
      return;
    }
    let dateNow = dates[datesIndex] || dates[0];
    const [year, month, day] = dateNow.split("-").map(Number);
    dayInput.value = day;
    monthInput.value = month;
    yearInput.value = year;
    countryCodeInput.value = "IDN";
    const search = () => {
      if ((searchButton && !searchButton.disabled) || (searchButton2 && !searchButton2.disabled)) {
        console.log(`Submitting search for date: ${dateNow}`);
        datesIndex = (datesIndex + 1) % dates.length;
        sessionStorage.setItem("datesIndex", datesIndex);
        document.form.isReloaded.value = "1";
        document.form.submit();
      } else if (retryCount < maxRetries) {
        console.log(`Retrying search button... Attempt ${retryCount + 1}`);
        retryCount++;
        setTimeout(search, 200);
      } else {
        console.log("Max retries reached. Reloading page.");
        location.reload();
      }
    };
    search();
  };

  function fastTargetFunc() {
    const datesFast = (userData["Tanggal Ujian"] || []).map((date) => date.replace(/-/g, "/"));
    const placesFast = userData["Lokasi Ujian"] || [];
    const timeFast = userData["Jam Ujian"] || [];

    if (datesFast.length === 0 || placesFast.length === 0 || timeFast.length === 0) {
      console.log("Data ujian tidak lengkap.");
      return;
    }

    const formFast = document.createElement("form");
    formFast.method = "POST";
    formFast.action = "https://j6.prometric-jp.com/Reserve/Upload";
    const createHiddenInput = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    };
    formFast.appendChild(createHiddenInput("examMethod", "TestCenter"));
    formFast.appendChild(createHiddenInput("In_examstart", timeFast[timeIdxFast]));
    formFast.appendChild(createHiddenInput("In_place_no", placesFast[placeIdxFast]));
    formFast.appendChild(createHiddenInput("In_exam_day", datesFast[datesIdxFast]));
    // Update indeks dengan urutan yang benar
    timeIdxFast++;
    if (timeIdxFast >= timeFast.length) {
      timeIdxFast = 0;
      placeIdxFast++;
      if (placeIdxFast >= placesFast.length) {
        placeIdxFast = 0;
        datesIdxFast++;
        if (datesIdxFast >= datesFast.length) {
          datesIdxFast = 0; // Reset ke awal jika semua kombinasi telah dicoba
        }
        sessionStorage.setItem("datesIdxFast", datesIdxFast);
      }
      sessionStorage.setItem("placeIdxFast", placeIdxFast);
    }
    sessionStorage.setItem("timeIdxFast", timeIdxFast);

    document.body.appendChild(formFast);
    formFast.submit();
  }

  // Eksekusi utama
  if (fastTarget) {
    fastTargetFunc();
  } else {
    if (autoTarget) {
      console.log("Fast Target is disabled.");
      findCityAndClick();
    } else {
      console.log("Normal Target is disabled.");
    }
  }
})();
