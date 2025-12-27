// GitHub: reserve_change.js
(function() {
    const data = window.myAppData || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.myAppData : null);
    if (!data) return;

    const flags = data.flags; // Mengambil flags dari Supabase
    console.log("%c[Logic] TestList Page Detected. Flags:", "color: #00dbde", flags);

    const checkElement = setInterval(() => {
        // 1. Logika untuk RESCHEDULE (Change)
        if (flags.autoChange && !flags.autoReserve) {
            const changeBtn = document.querySelector(`[onclick^='WEB_MoveAddressChange']`);
            if (changeBtn) {
                console.log("[Logic] Mengklik tombol Change...");
                clearInterval(checkElement);
                changeBtn.click();
            }
        } 
        
        // 2. Logika untuk RESERVASI BARU
        else if (flags.autoReserve && !flags.autoChange) {
            const reserveBtn = document.getElementById("button") || document.querySelector(`[onclick^='WEB_MoveNewReg']`);
            if (reserveBtn) {
                console.log("[Logic] Mengklik tombol Reservasi Baru...");
                clearInterval(checkElement);
                reserveBtn.click();
            }
        }
    }, 500);
})();
