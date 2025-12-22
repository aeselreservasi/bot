if (JSON.parse(localStorage.getItem("autoPayCC"))) {
  (function () {
    const AUTO_DONE_KEY = "autoPayCC_done"; // penanda proses selesai di TAB ini

    chrome.storage.local.get(["autoInputCCData"], (result) => {
      const ccData = result.autoInputCCData;

      if (!ccData) {
        console.log("Tidak ada data autoInputCCData di chrome.storage.local");
        return;
      }

      const valueMap = {
        "#txtCreditName": "creditName",
        "#ddlCreditId": "creditId",

        "#txtCreditNumber1": "number1",
        "#txtCreditNumber2": "number2",
        "#txtCreditNumber3": "number3",
        "#txtCreditNumber4": "number4",

        "#ddlLimitEndMonth": "expMonth",
        "#ddlLimitEndYear": "expYear",

        "#txtCreditNumber5": "cvv",
      };

      const fillValues = () => {
        Object.entries(valueMap).forEach(([selector, key]) => {
          const el = document.querySelector(selector);
          if (!el) {
            console.log("Element not found:", selector);
            return;
          }
          const val = ccData[key];
          if (val === undefined) return;

          try {
            el.value = val;
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
          } catch (err) {
            console.log("Error setting value for", selector, err);
          }
        });
      };

      window.addEventListener("load", () => {
        // 1️⃣ Kalau sudah pernah klik KONFIRMASI (step 2), jangan lakukan apa-apa lagi
        if (sessionStorage.getItem(AUTO_DONE_KEY) === "1") {
          console.log("AutoPay already finished in this tab. Skip all actions (including step 3).");
          return;
        }

        const btnSubmit = document.querySelector("#btnSubmit"); // step 1 & mungkin step 3
        const btnPay = document.querySelector("#btnPay"); // cuma muncul di step 2
        const chkAgree = document.querySelector("#chkAgree");

        // 2️⃣ PRIORITAS: kalau ada btnPay → ini STEP 2 (Konfirmasi)
        if (btnPay) {
          console.log("Detected STEP 2 (btnPay present)");

          try {
            if (chkAgree && !chkAgree.checked) {
              chkAgree.click();
            }

            btnPay.click();
            console.log("btnPay clicked (confirmation)");

            // ⚠️ Sangat penting: tandai selesai → setelah ini script MATI total di tab ini
            sessionStorage.setItem(AUTO_DONE_KEY, "1");
          } catch (err) {
            console.log("Error clicking btnPay", err);
          }

          return;
        }

        // 3️⃣ Kalau TIDAK ada btnPay tapi ada btnSubmit → ini STEP 1
        //    (STEP 3 mungkin mirip, tapi tidak akan sampai sini kalau AUTO_DONE_KEY sudah 1)
        if (btnSubmit) {
          console.log("Detected STEP 1 (btnSubmit present, no btnPay)");

          fillValues();

          try {
            if (chkAgree && !chkAgree.checked) {
              chkAgree.click();
            }

            btnSubmit.click();
            console.log("btnSubmit clicked on STEP 1");
          } catch (err) {
            console.log("Error clicking btnSubmit", err);
          }

          // Jangan set AUTO_DONE_KEY di sini, karena masih perlu lanjut STEP 2
          return;
        }

        // 4️⃣ Tidak ada btnPay & tidak ada btnSubmit → mungkin halaman lain / kasus khusus
        console.log("No btnSubmit/btnPay found. Possibly STEP 3 with different markup or other page. Do nothing.");
      });
    });
  })();
} else {
  console.log("Auto Input CC is disabled (localStorage.autoPayCC != true).");
}
