(function () {
  if (
    // reschedule
    JSON.parse(localStorage.getItem("autoChange")) &&
    !JSON.parse(localStorage.getItem("autoReserve"))
  ) {
    console.log("Auto change is enabled.");
    const change = document.querySelector(`[onclick^='WEB_MoveAddressChange']`);
    if (change) {
      change.click();
    } else {
      console.log("Change button not found.");
    }
  } else if (
    // reserve or cek dalam
    JSON.parse(localStorage.getItem("autoReserve")) &&
    !JSON.parse(localStorage.getItem("autoChange"))
  ) {
    console.log("Auto reserve is enabled.");
    try {
      const reserveManual = document.getElementById("button");
      const reserveManual2 = document.querySelector(`[onclick^='WEB_MoveNewReg']`);
      if (reserveManual) {
        console.log("Reserve Manual 1 Found");
        // reserveManual.click();
      } else if (reserveManual2) {
        console.log("Reserve Manual 2 Found");
        // reserveManual2.click();
      } else {
        console.log("Reserve Button Not Found!");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please enable auto change or auto reserve.");
  }
})();
