function checkDalam() {
  document.Form = document.form;
  document.Form.web_appli_div.value = 1;
  document.Form.action = "./PrivateChk";
  if (
    // reserve or cek dalam
    JSON.parse(localStorage.getItem("autoReserve")) &&
    !JSON.parse(localStorage.getItem("autoChange"))
  ) {
    console.log("Auto reserve is enabled.");
    document.Form.submit()
    // Untuk cek manual
    // const reserveCheck = document.getElementById("button");
    // const reserve2 = document.querySelector(`[onclick^='WEB_MoveNewReg']`);
    // if (reserveCheck || reserve2) {
    //   return;
    // } else {
    //   console.log("Reserve button not found.");
    //   document.Form.submit();
    // }
  } else {
    console.log("Please enable auto reserve.");
  }
}
checkDalam();
