// ==UserScript==
// @name         Data Manager Userscript
// @namespace    https://github.com/USERNAME/data-manager
// @version      1.0.0
// @description  Upload, edit, store, and manage JSON data directly from any webpage
// @author       YOU
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://raw.githubusercontent.com/aeselreservasi/bot/refs/heads/main/core.js
// @require      https://raw.githubusercontent.com/aeselreservasi/bot/refs/heads/main/utils.js
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  /*
   * Entry point userscript
   * Semua logic ada di core.js
   * File ini hanya loader + safety wrapper
   */

  console.log("[Data Manager] Userscript loaded");

  // Safety: pastikan core.js sudah termuat
  if (typeof loadSavedData !== "function") {
    console.error("[Data Manager] core.js gagal dimuat");
    return;
  }

  // Optional: toggle UI pakai shortcut
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      const ui = document.getElementById("userscript-data-ui");
      if (ui) {
        ui.style.display = ui.style.display === "none" ? "block" : "none";
      }
    }
  });

})();
