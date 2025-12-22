if (JSON.parse(localStorage.getItem("autoPayMethod"))) {
  console.log("Auto pay method is enabled.");
  document.querySelector(`input[value="zotapay"]`).click();
  try {
    document.querySelector(`input[onclick="nextPay();"]`).click();
  } catch (error) {
    console.log(error);
    document.querySelector(`button[onclick="nextPay();"]`).click();
  }
} else {
  console.log("Auto pay method is disabled.");
}
