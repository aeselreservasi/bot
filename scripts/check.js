if (!JSON.parse(localStorage.getItem("autoCheck"))) {
  console.log("Auto check is disabled.");
} else if (
  location.href === "https://j6.prometric-jp.com/Reserve/Policy" ||
  location.href === "https://j7.prometric-jp.com/Reserve/Policy"
) {
  // Check the checkbox and click the next button
  document.getElementById("chkPL").click();
  window.open("https://www.example.com/", "_blank");
  try {
    document
      .querySelector(`input[onclick="checkPolicy('./PrivateChk')"]`)
      .click();
  } catch (error) {
    console.log(error);
    document
      .querySelector(`[onclick^="checkPolicy"]`)
      .click();
  }
} else if (
  location.href === "https://j6.prometric-jp.com/Reserve/PrivateChk" ||
  location.href === "https://j7.prometric-jp.com/Reserve/PrivateChk"
) {
  // Click the next button
  // window.open("https://www.example.com/", "_blank");
  try {
    document
      .querySelector(`input[onclick="javascript:Next('./Attention')"]`)
      .click();
  } catch (error) {
    console.log(error);
    document
      .querySelector(`button[onclick="javascript:Next('./Attention')"]`)
      .click();
  }
} else if (
  location.href === "https://j6.prometric-jp.com/Reserve/Attention" ||
  location.href === "https://j7.prometric-jp.com/Reserve/Attention"
) {
  try {
    document.querySelector(`input[onclick="agree('ExamSelect')"]`).click();
  } catch (error) {
    console.log(error);
    document.querySelector(`button[onclick="agree('ExamSelect')"]`).click();
  }
}
