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
    console.warn("[error] userData rusak");
    return;
  }

  if (userData.is_active !== true) {
    console.warn("[error] user tidak aktif, STOP");
    return;
  }

  /* =====================================================
     FLAGS (SYNCED)
  ===================================================== */
  const autoBegal = getFlag("autoBegal");
  const autoFastTarget = getFlag("autoFastTarget");
  const autoError = getFlag("autoError");
  const autoTarget = getFlag("autoTarget");

  console.log("[error] flags:", {
    autoBegal,
    autoFastTarget,
    autoError,
    autoTarget,
  });

  /* =====================================================
     DOM CHECK
  ===================================================== */
  const fullPlace =
    document.querySelector(`input[onclick="window.top.history.back();"]`) ||
    document.querySelector(`button[onclick="window.top.history.back();"]`);

  const menit20 = document.querySelector(
    `input[onclick="top_page('https://www.prometric-jp.com/ssw/test_list/');"]`
  );

  const errorSys = document.querySelector(
    `input[onclick="window.open('about:blank','_self').close();"]`
  );

  const baseUrl = location.origin;

  /* =====================================================
     ERROR SYSTEM / 20 MIN BLOCK
  ===================================================== */
  if (errorSys || menit20) {
    console.warn("[error] system / 20min block detected");
    return;
  }

  /* =====================================================
     BEGAL → BACK TO CONFIRM
  ===================================================== */
  if (autoBegal) {
    console.log("[error] autoBegal ENABLED");

    location.replace(
      fullPlace
        ? `${baseUrl}/Reserve/Confirm`
        : `${baseUrl}/Reserve/SelectPlace`
    );
    return;
  }

  /* =====================================================
     FAST TARGET
  ===================================================== */
  if (autoFastTarget) {
    console.log("[error] autoFastTarget ENABLED");

    if (fullPlace) {
      fastTargetFunc();
    } else {
      location.replace(`${baseUrl}/Reserve/SelectPlace`);
    }
    return;
  }

  /* =====================================================
     AUTO ERROR / TARGET
  ===================================================== */
  if (autoError || autoTarget) {
    console.log("[error] autoError/autoTarget ENABLED");
    location.replace(`${baseUrl}/Reserve/SelectPlace`);
    return;
  }

  console.log("[error] no auto recovery enabled");

  /* =====================================================
     FAST TARGET FUNC (UNCHANGED LOGIC)
  ===================================================== */
  function fastTargetFunc() {
    let datesIdxFast = parseInt(
      sessionStorage.getItem("datesIdxFast") || "0",
      10
    );
    let placeIdxFast = parseInt(
      sessionStorage.getItem("placeIdxFast") || "0",
      10
    );
    let timeIdxFast = parseInt(
      sessionStorage.getItem("timeIdxFast") || "0",
      10
    );

    const data = userData;
    const datesFast = (data["Tanggal Ujian"] || []).map((d) =>
      d.replace(/-/g, "/")
    );
    const placesFast = data["Lokasi Ujian"] || [];
    const timeFast = data["Jam Ujian"] || [];

    if (!datesFast.length || !placesFast.length || !timeFast.length) {
      console.warn("[error] fast target data tidak lengkap");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${location.origin}/Reserve/Upload`;

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
})();
