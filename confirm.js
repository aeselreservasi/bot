const user = JSON.parse(localStorage.getItem("userData"));
const nomorTelp1 = document.querySelector("input[name='tel_1']");
const nomorTelp2 = document.querySelector("[name='tel_1']");
const confirm0 = document.getElementById(`next`);
// const confirm1 = document.querySelector(`input[name="next"]`);
// const confirm2 = document.querySelector(`button[name="next"]`);
// const confirm3 = document.querySelector(`button[name="Next"]`);
if (nomorTelp1) {
  nomorTelp1.value = user["Nomor Telepon"] || "0";
} else if (nomorTelp2) {
  nomorTelp2.value = user["Nomor Telepon"] || "0";
} else {
  console.log("Nomor Telepon not found.");
}

if (
  confirm0.disabled
  // confirm1.disabled ||
  // confirm2.disabled ||
  // confirm3.disabled
) {
  location.reload();
} else {
  console.log("Confirm button is enabled.");
}

if (JSON.parse(localStorage.getItem("autoConfirm"))) {
  console.log("Auto confirm is enabled.");
  try {
    confirm0.click();
    // if (confirm1) {
    //   confirm1.click();
    // } else if (confirm2) {
    //   confirm2.click();
    // } else if (confirm3) {
    //   confirm3.click();
    // } else {
    //   console.log("Confirm button not found.");
    // }
  } catch (error) {
    console.log(error);
    // location.reload();
  }
} else {
  console.log("Auto confirm is disabled.");
}
