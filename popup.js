// ===== AESEL POPUP SCRIPT =====
(function () {
  if (document.getElementById("aesel-popup-overlay")) return;

  const POPUP_URL = "https://aeselreservasi.github.io/bot/popup.html";

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "aesel-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.65);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Container
  const container = document.createElement("div");
  container.style.cssText = `
    position: relative;
    width: 420px;
    height: 600px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  `;

  // Iframe
  const iframe = document.createElement("iframe");
  iframe.src = POPUP_URL;
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
  `;

  // Close Button
  const closeBtn = document.createElement("div");
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Close";
  closeBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    z-index: 1000000;
  `;

  closeBtn.onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  container.appendChild(closeBtn);
  container.appendChild(iframe);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
})();
