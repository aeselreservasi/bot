(function () {
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
  const fullPlace = document.querySelector(`input[onclick="window.top.history.back();"]`);
  const fullplace2 = document.querySelector(`button[onclick="window.top.history.back();"]`);
  const menit20 = document.querySelector(`input[onclick="top_page('https://www.prometric-jp.com/ssw/test_list/');"]`);
  const errorsys = document.querySelector(`input[onclick="window.open('about:blank','_self').close();"]`);

  const baseUrl = location.href.includes("j7.prometric-jp.com") ? "https://j7.prometric-jp.com" : "https://j6.prometric-jp.com";

  if (errorsys || menit20) {
    // error system
    console.log(errorsys);
    console.log(menit20);
  } else if (JSON.parse(localStorage.getItem("autoBegal"))) {
    // back to confirm
    try {
      if (fullPlace || fullplace2) {
        location.replace(`${baseUrl}/Reserve/Confirm`);
      } else {
        location.replace(`${baseUrl}/Reserve/SelectPlace`);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (JSON.parse(localStorage.getItem("autoFastTarget"))) {
    // fast target
    try {
      if (fullPlace || fullplace2) {
        fastTargetFunc();
      } else {
        location.replace(`${baseUrl}/Reserve/SelectPlace`);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (
    // back to selectplace
    JSON.parse(localStorage.getItem("autoError")) ||
    JSON.parse(localStorage.getItem("autoTarget"))
  ) {
    try {
      if (fullPlace || fullplace2) {
        location.replace(`${baseUrl}/Reserve/SelectPlace`);
      } else {
        location.replace(`${baseUrl}/Reserve/SelectPlace`);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Auto error/begal/fast target is disabled.");
  }

  function fastTargetFunc() {
    let datesIdxFast = parseInt(sessionStorage.getItem("datesIdxFast") || "0", 10);
    let placeIdxFast = parseInt(sessionStorage.getItem("placeIdxFast") || "0", 10);
    let timeIdxFast = parseInt(sessionStorage.getItem("timeIdxFast") || "0", 10);
    const userDataFast = JSON.parse(localStorage.getItem("userData")) || {};
    const datesFast = (userDataFast["Tanggal Ujian"] || []).map((date) => date.replace(/-/g, "/"));
    const placesFast = userDataFast["Lokasi Ujian"] || [];
    const timeFast = userDataFast["Jam Ujian"] || [];

    // Pastikan array tidak kosong sebelum mengakses indeks
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
})();
