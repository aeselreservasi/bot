(function () {
  const getVal = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return localStorage.getItem(k);
    }
  };

  const userData = getVal("userData") || {};
  const idValue = userData["ID Prometrik"] || "";
  const passValue = userData["Password"] || "";

  const idInp = document.querySelector("input[name='id_number']");
  const passInp = document.querySelector("input[name='password']");

  if (idInp && passInp && idValue && passValue) {
    idInp.value = idValue;
    passInp.value = passValue;

    // Trigger event agar tombol login menyala
    ["input", "change", "blur"].forEach((evt) => {
      idInp.dispatchEvent(new Event(evt, { bubbles: true }));
      passInp.dispatchEvent(new Event(evt, { bubbles: true }));
    });

    if (idInp.value === idValue) {
      console.log("✅ Form login terisi.");
      document.body.setAttribute("data-login-status", "READY");
    }
  }
})();
