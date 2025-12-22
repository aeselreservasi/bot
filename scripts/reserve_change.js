// Helper untuk membaca localStorage yang aman
const getAutoConfig = (key) => {
  const val = localStorage.getItem(key);
  if (val === "true" || val === true) return true;
  return false;
};

const isAutoChange = getAutoConfig("autoChange");
const isAutoReserve = getAutoConfig("autoReserve");

if (isAutoChange && !isAutoReserve) {
  console.log("Auto change is enabled.");
  // Selector untuk tombol 'Ubah'
  const changeBtn = document.querySelector(`[onclick^='WEB_MoveAddressChange']`);
  if (changeBtn) {
    console.log("Clicking Change Button...");
    changeBtn.click();
  } else {
    console.log("Change button not found.");
  }
} else if (isAutoReserve && !isAutoChange) {
  console.log("Auto reserve is enabled.");
  try {
    const reserveManual = document.getElementById("button");
    const reserveManual2 = document.querySelector(`[onclick^='WEB_MoveNewReg']`);

    if (reserveManual) {
      console.log("Reserve Manual 1 Found");
      // reserveManual.click(); // Buka komentar jika ingin auto-klik
    } else if (reserveManual2) {
      console.log("Reserve Manual 2 Found");
      // reserveManual2.click(); // Buka komentar jika ingin auto-klik
    } else {
      console.log("Reserve Button Not Found!");
    }
  } catch (error) {
    console.error("Error in Reserve Logic:", error);
  }
} else {
  console.log("Status: autoChange=" + isAutoChange + ", autoReserve=" + isAutoReserve);
  console.log("Please enable either auto change or auto reserve (not both).");
}
