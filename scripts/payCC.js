if (JSON.parse(localStorage.getItem("autoPayCC"))) {
  document.querySelector(`input[value="card"]`).click();
  try {
    document.querySelector(`input[onclick="nextPay();"]`).click();
  } catch (error) {
    console.log(error);
    document.querySelector(`button[onclick="nextPay();"]`).click();
  }
} else {
  console.log("Auto pay method is disabled.");
}
