// GitHub: login.js
(function () {
    // Coba ambil dari window atau unsafeWindow
    const data = window.myAppData || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.myAppData : null);
    
    console.log("%c[Logic] Script mulai berjalan...", "background: #444; color: #fff; padding: 2px 5px;");

    if (!data) {
        console.error("[Logic] ERROR: window.myAppData tidak ditemukan!");
        return;
    }

    console.log("%c[Logic] Mencari elemen login untuk: " + data.id, "color: orange");

    const timer = setInterval(() => {
        const idField = document.querySelector("#inputPrometricID");
        const pwField = document.querySelector("#inputPassword");
        const loginBtn = document.querySelector('button[name="B1"]');

        if (idField && pwField) {
            clearInterval(timer);
            console.log("%c[Logic] Form ditemukan!", "color: #00ff00; font-weight: bold;");

            idField.value = data.id;
            pwField.value = data.pw;

            const ev = { bubbles: true };
            idField.dispatchEvent(new Event("input", ev));
            pwField.dispatchEvent(new Event("input", ev));

            // Klik login jika tidak disabled
            const clickTimer = setInterval(() => {
                if (loginBtn && !loginBtn.disabled) {
                    console.log("[Logic] Tombol aktif, LOGIN.");
                    loginBtn.click();
                    clearInterval(clickTimer);
                }
            }, 500);
        }
    }, 500);
})();
