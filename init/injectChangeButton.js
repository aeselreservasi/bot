(function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("init/scripts/injectChangeButton.js"); // Mendapatkan URL absolut ke script
  script.type = "application/javascript";
  script.onload = function () {
    this.remove(); // Hapus script setelah disisipkan untuk menjaga kebersihan DOM
  };
  (document.head || document.documentElement).appendChild(script);
})();
