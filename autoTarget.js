(function () {
  /* ================= FLAG HELPER ================= */
  function getFlag(name) {
    try {
      const flags = JSON.parse(localStorage.getItem("autoFlags") || "{}");
      return flags[name] === true;
    } catch {
      return false;
    }
  }

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

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  const autoTarget = getFlag("autoTarget");
  const fastTarget = getFlag("autoFastTarget");

  console.log("[exam] flags:", { autoTarget, fastTarget });

  let datesIndex = parseInt(sessionStorage.getItem("datesIndex") || "0", 10);
  let datesIdxFast = parseInt(sessionStorage.getItem("datesIdxFast") || "0", 10);
  let placeIdxFast = parseInt(sessionStorage.getItem("placeIdxFast") || "0", 10);
  let timeIdxFast = parseInt(sessionStorage.getItem("timeIdxFast") || "0", 10);

  /* =====================================================
     DATA
  ===================================================== */
  const dates = userData["Tanggal Ujian"] || [];
  const cities = userData["Lokasi Ujian"] || [];
  const hours = userData["Jam Ujian"] || [];

  /* =====================================================
     CITY + TIME SEARCH
  ===================================================== */
  const findCityAndClick = () => {
    if (!cities.length || !hours.length) {
      console.warn("[exam] cities/hours kosong, fallback search");
      fillFormAndSearch();
      return;
    }

    for (const city of cities) {
      for (const hour of hours) {
        const el =
          document.querySelector(
            `a[href^='JavaScript:onClick=click_next("${city}","${hour}"']`
          ) ||
          document.querySelector(
            `button[onclick^='click_next("${city}","${hour}"']`
          );

        if (el) {
          console.log(`[exam] found ${city} @ ${hour}, click`);
          el.click();
          return;
        }
      }
    }

    console.log("[exam] tidak ada match, fallback search");
    fillFormAndSearch();
  };

  /* =====================================================
     FORM SEARCH (DATE ROTATION)
  ===================================================== */
  const fillFormAndSearch = () => {
    let retryCount = 0;
    const maxRetries = 100;

    const dayInput = document.getElementById("exam_day_d");
    const monthInput = document.getElementById("exam_day_m");
    const yearInput = document.getElementById("exam_day_y");
    const countryCodeInput = document.getElementById("countryCode");
    const searchButton =
      document.querySelector('input[name="search"]') ||
      document.querySelector('button[name="search"]');

    if (!dayInput || !monthInput || !yearInput || !countryCodeInput) {
      console.warn("[exam] form tidak lengkap");
      return;
    }

    if (!dates.length) {
      console.warn("[exam] tanggal kosong");
      return;
    }

    const dateNow = dates[datesIndex] || dates[0];
    const [year, month, day] = dateNow.split("-").map(Number);

    dayInput.value = day;
    monthInput.value = month;
    yearInput.value = year;
    countryCodeInput.value = "IDN";

    const search = () => {
      if (searchButton && !searchButton.disabled) {
        console.log("[exam] submit search:", dateNow);

        datesIndex = (datesIndex + 1) % dates.length;
        sessionStorage.setItem("datesIndex", datesIndex);

        document.form.isReloaded.value = "1";
        document.form.submit();
      } else if (retryCount++ < maxRetries) {
        setTimeout(search, 200);
      } else {
        console.warn("[exam] max retry, reload");
        location.reload();
      }
    };

    search();
  };

  /* =====================================================
     FAST TARGET (DIRECT POST)
  ===================================================== */
  function fastTargetFunc() {
    const datesFast = dates.map((d) => d.replace(/-/g, "/"));
    const placesFast = cities;
    const timeFast = hours;

    if (!datesFast.length || !placesFast.length || !timeFast.length) {
      console.warn("[exam] fast target data tidak lengkap");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = location.origin + "/Reserve/Upload";

    const hidden = (n, v) => {
      const i = document.createElement("input");
      i.type = "hidden";
      i.name = n;
      i.value = v;
      return i;
    };

    form.appendChild(hidden("examMethod", "TestCenter"));
    form.appendChild(hidden("In_examstart", timeFast[timeIdxFast]));
    form.appendChild(hidden("In_place_no", placesFast[placeIdxFast]));
    form.appendChild(hidden("In_exam_day", datesFast[datesIdxFast]));

    timeIdxFast++;
    if (timeIdxFast >= timeFast.length) {
      timeIdxFast = 0;
      placeIdxFast++;
      if (placeIdxFast >= placesFast.length) {
        placeIdxFast = 0;
        datesIdxFast = (datesIdxFast + 1) % datesFast.length;
        sessionStorage.setItem("datesIdxFast", datesIdxFast);
      }
      sessionStorage.setItem("placeIdxFast", placeIdxFast);
    }
    sessionStorage.setItem("timeIdxFast", timeIdxFast);

    document.body.appendChild(form);
    form.submit();
  }

  /* =====================================================
     EXECUTION
  ===================================================== */
  if (fastTarget) {
    console.log("[exam] FAST TARGET ENABLED");
    fastTargetFunc();
  } else if (autoTarget) {
    console.log("[exam] NORMAL TARGET ENABLED");
    findCityAndClick();
  } else {
    console.log("[exam] target disabled");
  }
})();
