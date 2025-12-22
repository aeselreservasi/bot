// Fixed version using localStorage
document.addEventListener("DOMContentLoaded", () => {
  const settingsKeys = [
    "autoLogin",
    "autoReserve",
    "autoChange",
    "autoCheck",
    "autoExam",
    "autoInput",
    "autoTarget",
    "autoPayMethod",
    "autoPayCC",
    "autoConfirm",
    "autoError",
    "autoBegal",
    "autoFastTarget",
  ];

  // Fungsi untuk mengambil data dari localStorage (Helper)
  const getStoredSettings = () => {
    const settings = {};
    settingsKeys.forEach((key) => {
      // Ambil nilai, default ke false jika tidak ada
      const val = localStorage.getItem(key);
      settings[key] = val === "true";
    });
    return settings;
  };

  // Utility function to update checkbox states berdasarkan localStorage
  const updateCheckboxStates = (storedValues) => {
    settingsKeys.forEach((key) => {
      const elementId = key.replace("auto", "").toLowerCase();
      const checkbox = document.getElementById(elementId);
      if (checkbox) {
        checkbox.checked = storedValues[key] || false;
      }
    });
  };

  // 1. LOAD DATA AWAL
  const initialSettings = getStoredSettings();
  updateCheckboxStates(initialSettings);

  // 2. LISTENER PERUBAHAN CHECKBOX (Event Delegation)
  document.body.addEventListener("change", (event) => {
    if (event.target.matches("input[type=checkbox]")) {
      const { name, checked } = event.target;

      // Simpan ke localStorage (sebagai string)
      localStorage.setItem(name, checked);
      console.log(`Saved to localStorage -> ${name}: ${checked}`);

      // Catatan: chrome.runtime.sendMessage dihapus karena sudah tidak pakai API ekstensi
    }
  });

  // 3. LISTENER TOMBOL "Check All"
  document.getElementById("checkAll").addEventListener("click", () => {
    settingsKeys.forEach((key) => {
      // Update UI
      const elementId = key.replace("auto", "").toLowerCase();
      const checkbox = document.getElementById(elementId);
      if (checkbox) checkbox.checked = true;

      // Update Storage
      localStorage.setItem(key, "true");
    });
    console.log("All settings set to true in localStorage");
  });

  // 4. LISTENER TOMBOL "Reset"
  document.getElementById("reset").addEventListener("click", () => {
    settingsKeys.forEach((key) => {
      // Update UI
      const elementId = key.replace("auto", "").toLowerCase();
      const checkbox = document.getElementById(elementId);
      if (checkbox) checkbox.checked = false;

      // Update Storage
      localStorage.setItem(key, "false");
    });
    console.log("All settings reset to false in localStorage");
  });
});
