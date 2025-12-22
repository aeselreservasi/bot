const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios"); // Gunakan axios untuk ambil WebSocket URL

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let isRecovering = false;
const processingPages = new Set();

// =====================
// HELPER FUNCTIONS
// =====================
async function waitForElementAndClick(page, selector, name, timeout = 10000) {
  try {
    // Tunggu elemen tersedia dan terlihat
    await page.waitForSelector(selector, { timeout, visible: true });
    const clicked = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el && !el.disabled) {
        el.scrollIntoView();
        el.click();
        return true;
      }
      return false;
    }, selector);
    if (clicked) console.log(`✅ ${name} Berhasil diklik!`);
    return clicked;
  } catch (e) {
    return false;
  }
}

async function injectScript(page, filePath) {
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    if (!fs.existsSync(absolutePath)) return false;

    // PASTIKAN BODY SUDAH ADA SEBELUM INJECT
    const bodyExists = await page.evaluate(() => document.body !== null);
    if (!bodyExists) return false;

    const scriptContent = fs.readFileSync(absolutePath, "utf8");
    // Gunakan addScriptTag atau evaluate dengan proteksi
    await page.evaluate((content) => {
      const script = document.createElement("script");
      script.textContent = content;
      document.body.appendChild(script);
    }, scriptContent);

    console.log(`💉 Injected: ${filePath}`);
    return true;
  } catch (err) {
    return false;
  }
}

// =====================
// CORE ROUTING ENGINE
// =====================
async function handleRouting(page, config) {
  const url = page.url();
  if (!page || page.isClosed() || url === "about:blank" || !url.includes("prometric-jp.com")) return;

  const pageId = page.mainFrame()._id;
  if (processingPages.has(pageId)) return;
  processingPages.add(pageId);

  try {
    // 1. TUNGGU BODY TERSEDIA (Mencegah error 'removeAttribute' of null)
    await page.waitForFunction(() => document.body !== null, { timeout: 5000 }).catch(() => {});

    // 2. SINKRONISASI DATA (Hanya jika body sudah ada)
    await page
      .evaluate((cfg) => {
        if (!document.body) return;
        Object.entries(cfg).forEach(([k, v]) => {
          localStorage.setItem(k, typeof v === "object" ? JSON.stringify(v) : v);
        });
      }, config)
      .catch(() => {});

    // --- LOGIKA URL ---

    // ERROR HANDLER
    if (url.includes("/Error")) {
      if (!isRecovering) {
        isRecovering = true;
        console.log("🚨 Halaman Error. Menunggu stabil sebelum recovery...");
        await delay(2000); // Beri jeda agar loading selesai
        await injectScript(page, "./scripts/error.js");
        setTimeout(() => {
          isRecovering = false;
        }, 8000);
      }
    }

    // LOGIN
    else if (url.includes("/Reserve/Login")) {
      await page.waitForSelector("input[name='id_number']", { timeout: 5000 }).catch(() => {});
      await page.evaluate(() => document.body.removeAttribute("data-login-status")).catch(() => {});
      await injectScript(page, "./scripts/login.js");

      if (config.autoLogin === "true") {
        try {
          await page.waitForFunction(() => document.body.getAttribute("data-login-status") === "READY", { timeout: 5000 });
          await waitForElementAndClick(page, 'button[name="B1"]', "Login Button", 5000);
        } catch (e) {}
      }
    }

    // SELECT PLACE (WAR)
    else if (url.includes("/Reserve/SelectPlace")) {
      if (config.autoTarget === "true" || config.autoFastTarget === "true") {
        // Tunggu sampai dropdown tahun muncul (tanda halaman sudah render)
        await page.waitForSelector("#exam_day_y", { timeout: 7000 }).catch(() => {});
        await page.evaluate(() => document.body.removeAttribute("data-fill-status")).catch(() => {});

        await injectScript(page, "./init/autoTarget.js");
        await injectScript(page, "./init/chkDate.js");

        try {
          await page.waitForFunction(() => document.body.getAttribute("data-fill-status") === "READY_TO_CLICK", { timeout: 5000, polling: 200 });
          const btns = ["#serchplacebutton", "input[name='search']"];
          for (const sel of btns) {
            if (await waitForElementAndClick(page, sel, "Search", 3000)) break;
          }
        } catch (e) {}
      }
    }

    // TEST LIST & OTHERS
    else if (url.includes("/Reserve/TestList")) {
      await page.waitForSelector("body", { timeout: 5000 }).catch(() => {});
      await injectScript(page, "./scripts/reserve_change.js");
      await injectScript(page, "./init/checkDalam.js");
    }

    // SCRIPT LAINNYA (Policy, ExamSelect, etc.)
    else if (url.includes("/Reserve/Policy") || url.includes("/Reserve/Attention")) {
      await injectScript(page, "./scripts/check.js");
    }
  } catch (e) {
    console.error("❌ Routing Error:", e.message);
  } finally {
    // Beri nafas agar tidak spamming inject
    await delay(1000);
    processingPages.delete(pageId);
  }
}

// =====================
// INITIALIZER
// =====================
(async () => {
  try {
    const port = fs.readFileSync("current_port.txt", "utf8").trim();
    const response = await axios.get(`http://127.0.0.1:${port}/json/list`);
    const wsUrl = response.data[0].webSocketDebuggerUrl;

    const browser = await puppeteer.connect({
      browserWSEndpoint: wsUrl,
      product: "firefox",
      defaultViewport: null,
    });

    console.log("🕵️ Orchestrator Bot Online!");

    // Variabel pengunci agar tidak menjalankan fungsi bersamaan (race condition)
    let isOrchestrating = false;

    const orchestrate = async () => {
      if (isOrchestrating) return; // Skip jika proses sebelumnya belum selesai
      isOrchestrating = true;

      try {
        const pages = await browser.pages();

        // Cari dashboard popup.html
        const dashboard = pages.find((p) => p.url().includes("popup.html"));

        let config = {};
        if (dashboard && !dashboard.isClosed()) {
          // Tambahkan pengecekan readyState agar tidak mengganggu loading
          const dashState = await dashboard.evaluate(() => document.readyState).catch(() => "loading");

          if (dashState === "complete") {
            config = await dashboard
              .evaluate(() => {
                let d = {};
                for (let i = 0; i < localStorage.length; i++) {
                  d[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
                }
                return d;
              })
              .catch(() => ({}));
          }
        }

        for (const page of pages) {
          if (page.isClosed()) continue;

          const url = page.url();
          if (url.includes("prometric-jp.com")) {
            const readyState = await page.evaluate(() => document.readyState).catch(() => "loading");
            if (readyState === "complete") {
              // Jalankan fungsi routing Anda
              // handleRouting(page, config);
            }
          }
        }
      } catch (e) {
        console.log("Status: Menunggu halaman stabil...");
      } finally {
        isOrchestrating = false; // Buka kunci
      }
    };

    // Gunakan interval saja, hapus browser.on("targetchanged") jika menyebabkan loop
    setInterval(orchestrate, 2000);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
})();
