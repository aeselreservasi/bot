(function () {
    const currentUrl = window.location.href;
    const currentHost = window.location.hostname;

    // 1. KEAMANAN: Cek apakah kita berada di domain Prometric?
    // Jika tidak, hentikan script agar tidak terjadi redirect liar di GitHub
    if (!currentHost.includes("prometric-jp.com")) {
        console.log("ℹ️ Error Script: Not on Prometric domain. Execution halted.");
        return;
    }

    console.log("🚀 Error Recovery Script Active on Prometric...");

    // 2. Selector Elemen Error
    const fullPlace = document.querySelector(`input[onclick*="history.back()"], button[onclick*="history.back()"]`);
    const menit20 = document.querySelector(`input[onclick*="test_list/"]`);
    const errorsys = document.querySelector(`input[onclick*="blank"]`);

    // 3. Helper Data
    const getVal = (key) => {
        try {
            const val = localStorage.getItem(key);
            return (val === "true" || val === true) ? true : (val === "false" || val === false) ? false : val;
        } catch (e) {
            return false;
        }
    };

    // Pastikan baseUrl selalu mengarah ke J6 atau J7 Prometric yang sedang aktif
    const baseUrl = window.location.origin; 
    
    const autoBegal = getVal("autoBegal");
    const autoFastTarget = getVal("autoFastTarget");
    const autoError = getVal("autoError");
    const autoTarget = getVal("autoTarget");

    // 4. Logika Recovery (Hanya berjalan jika di Prometric)
    if (errorsys || menit20) {
        console.log("⚠️ System Error/Timeout. Mengalihkan ke Test List...");
        window.location.replace(`${baseUrl}/Reserve/TestList`);
    } 
    else if (autoBegal === true) {
        console.log("🛠️ Mode Begal: Mencoba kembali ke Confirm...");
        if (fullPlace) {
            window.location.replace(`${baseUrl}/Reserve/Confirm`);
        } else {
            window.location.replace(`${baseUrl}/Reserve/SelectPlace`);
        }
    } 
    else if (autoFastTarget === true) {
        console.log("⚡ Mode Fast Target: Mencoba Upload ulang...");
        if (fullPlace) {
            if (typeof fastTargetFunc === "function") fastTargetFunc();
        } else {
            window.location.replace(`${baseUrl}/Reserve/SelectPlace`);
        }
    } 
    else if (autoError === true || autoTarget === true) {
        console.log("🔄 Auto Error/Target: Kembali ke SelectPlace...");
        window.location.replace(`${baseUrl}/Reserve/SelectPlace`);
    }

    // Fungsi Fast Target (Bypass Form)
    function fastTargetFunc() {
        console.log("📤 Executing FastTarget Form Submission...");
        let dIdx = parseInt(sessionStorage.getItem("datesIdxFast") || "0", 10);
        let pIdx = parseInt(sessionStorage.getItem("placeIdxFast") || "0", 10);
        let tIdx = parseInt(sessionStorage.getItem("timeIdxFast") || "0", 10);

        const rawData = localStorage.getItem("userData");
        const userData = rawData ? JSON.parse(rawData) : {};
        
        const dates = (userData["Tanggal Ujian"] || []).map((d) => d.replace(/-/g, "/"));
        const places = userData["Lokasi Ujian"] || [];
        const times = userData["Jam Ujian"] || [];

        if (!dates.length || !places.length || !times.length) {
            console.error("❌ Data untuk FastTarget tidak lengkap.");
            return;
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${baseUrl}/Reserve/Upload`;

        const add = (n, v) => {
            const i = document.createElement("input");
            i.type = "hidden";
            i.name = n;
            i.value = v;
            form.appendChild(i);
        };

        add("examMethod", "TestCenter");
        add("In_examstart", times[tIdx]);
        add("In_place_no", places[pIdx]);
        add("In_exam_day", dates[dIdx]);

        // Update Indeks untuk percobaan berikutnya
        tIdx++;
        if (tIdx >= times.length) {
            tIdx = 0;
            pIdx++;
            if (pIdx >= places.length) {
                pIdx = 0;
                dIdx = (dIdx + 1) % dates.length;
            }
        }

        sessionStorage.setItem("timeIdxFast", tIdx);
        sessionStorage.setItem("placeIdxFast", pIdx);
        sessionStorage.setItem("datesIdxFast", dIdx);

        document.body.appendChild(form);
        form.submit();
    }
})();
