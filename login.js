// GitHub: login.js
(function () {
    const data = window.myAppData;
    if (!data) return;

    console.log("%c[Logic] Mencari elemen login...", "color: orange");

    // Gunakan interval agar script terus mencari sampai form muncul
    const timer = setInterval(() => {
        const idField = document.querySelector("#inputPrometricID");
        const pwField = document.querySelector("#inputPassword");
        const loginBtn = document.querySelector('button[name="B1"]');

        if (idField && pwField) {
            clearInterval(timer); // Berhenti mencari jika sudah ketemu
            console.log("%c[Logic] Form ditemukan! Mengisi...", "color: #00ff00");

            idField.value = data.id;
            pwField.value = data.pw;

            const ev = { bubbles: true };
            idField.dispatchEvent(new Event("input", ev));
            pwField.dispatchEvent(new Event("input", ev));

            // Tunggu tombol aktif (tidak disabled) baru klik
            const obs = new MutationObserver(() => {
                if (!loginBtn.disabled && data.flags.autoLogin) {
                    console.log("[Logic] Klik Login!");
                    loginBtn.click();
                    obs.disconnect();
                }
            });
            obs.observe(loginBtn, { attributes: true, attributeFilter: ["disabled"] });
            
            // Jaga-jaga jika observer tidak trigger
            setTimeout(() => {
                if (loginBtn && !loginBtn.disabled) loginBtn.click();
            }, 2000);
        }
    }, 500); // Cek setiap 0.5 detik
})();
