// GitHub: script-logic.js
(function () {
  const data = window.myAppData;
  if (!data || !data.is_active) {
    console.warn("Automation tidak aktif untuk user ini.");
    return;
  }

  const idField = document.querySelector("#inputPrometricID");
  const pwField = document.querySelector("#inputPassword");
  const loginBtn = document.querySelector('button[name="B1"]');

  if (idField && pwField) {
    idField.value = data.id;
    pwField.value = data.pw;

    // Trigger event supaya tombol aktif
    const ev = { bubbles: true };
    idField.dispatchEvent(new Event("input", ev));
    pwField.dispatchEvent(new Event("input", ev));

    // Tunggu tombol aktif (tidak disabled) baru klik
    const obs = new MutationObserver(() => {
      if (!loginBtn.disabled && data.flags.autoLogin) {
        loginBtn.click();
        obs.disconnect();
      }
    });
    obs.observe(loginBtn, { attributes: true, attributeFilter: ["disabled"] });
  }
})();
