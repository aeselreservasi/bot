(function () {
  console.log("🚀 Error Recovery Script Active...");

  // 1. Selector Elemen Error
  const fullPlace = document.querySelector(`input[onclick*="history.back()"], button[onclick*="history.back()"]`);
  const menit20 = document.querySelector(`input[onclick*="test_list/"]`);
  const errorsys = document.querySelector(`input[onclick*="blank"]`);

  // 2. Helper Data
  const getVal = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return localStorage.getItem(key);
    }
  };

  const baseUrl = location.origin; // Otomatis mengikuti j6 atau j7
  const autoBegal = getVal("autoBegal");
  const autoFastTarget = getVal("autoFastTarget");
  const autoError = getVal("autoError");
  const autoTarget = getVal("autoTarget");

  // 3. Logika Recovery
  if (errorsys || menit20) {
    console.log("⚠️ System Error/Timeout. Mengalihkan ke Test List...");
    location.replace(`${baseUrl}/Reserve/TestList`);
  } else if (autoBegal === "true" || autoBegal === true) {
    console.log("🛠️ Mode Begal: Mencoba kembali ke Confirm...");
    if (fullPlace) {
      location.replace(`${baseUrl}/Reserve/Confirm`);
    } else {
      location.replace(`${baseUrl}/Reserve/SelectPlace`);
    }
  } else if (autoFastTarget === "true" || autoFastTarget === true) {
    console.log("⚡ Mode Fast Target: Mencoba Upload ulang...");
    if (fullPlace) {
      fastTargetFunc();
    } else {
      location.replace(`${baseUrl}/Reserve/SelectPlace`);
    }
  } else if (autoError || autoTarget) {
    console.log("🔄 Auto Error/Target: Kembali ke SelectPlace...");
    location.replace(`${baseUrl}/Reserve/SelectPlace`);
  }

  // Fungsi Fast Target (Bypass Form)
  function fastTargetFunc() {
    let dIdx = parseInt(sessionStorage.getItem("datesIdxFast") || "0", 10);
    let pIdx = parseInt(sessionStorage.getItem("placeIdxFast") || "0", 10);
    let tIdx = parseInt(sessionStorage.getItem("timeIdxFast") || "0", 10);

    const userData = getVal("userData") || {};
    const dates = (userData["Tanggal Ujian"] || []).map((d) => d.replace(/-/g, "/"));
    const places = userData["Lokasi Ujian"] || [];
    const times = userData["Jam Ujian"] || [];

    if (!dates.length || !places.length || !times.length) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${baseUrl}/Reserve/Upload`;

    const add = (n, v) => {
      const i = document.createElement("input");
      i.type = "hidden";
      i.name = n;
      i.value = v;
      form.appendChild(i);
    };

    add("examMethod", "TestCenter");
    add("In_examstart", times[tIdx]);
    add("In_place_no", places[pIdx]);
    add("In_exam_day", dates[dIdx]);

    // Update Indeks
    tIdx++;
    if (tIdx >= times.length) {
      tIdx = 0;
      pIdx++;
      if (pIdx >= places.length) {
        pIdx = 0;
        dIdx = (dIdx + 1) % dates.length;
      }
    }

    sessionStorage.setItem("timeIdxFast", tIdx);
    sessionStorage.setItem("placeIdxFast", pIdx);
    sessionStorage.setItem("datesIdxFast", dIdx);

    document.body.appendChild(form);
    form.submit();
  }
})();
