import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:4321";
const OUTPUT_DIR = path.join(process.cwd(), "docs", "images");

async function checkServer(url) {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`🔍 Prüfe ob der Server unter ${BASE_URL} läuft...`);
  const isRunning = await checkServer(BASE_URL);
  if (!isRunning) {
    console.error(`\n❌ Der Entwicklungsserver läuft nicht unter ${BASE_URL}.`);
    console.error(`👉 Bitte starte in einem separaten Terminal: npm run dev\n`);
    process.exit(1);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("🚀 Starte Puppeteer Browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  try {
    const page = await browser.newPage();

    // A4 Pixel-Maße bei 96 DPI mit 2x Retina-Skalierung für gestochen scharfe Qualität
    const A4_WIDTH = 794;
    const A4_HEIGHT = 1123;

    await page.setViewport({
      width: A4_WIDTH,
      height: A4_HEIGHT,
      deviceScaleFactor: 2,
    });

    console.log("📸 Erstelle Screenshot von ATS-PDF (/print/ats)...");
    await page.goto(`${BASE_URL}/print/ats`, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });
    await page.evaluateHandle("document.fonts.ready");
    const atsBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT },
    });
    await fs.writeFile(path.join(OUTPUT_DIR, "pdf-ats.png"), atsBuffer);

    console.log("📸 Erstelle Screenshot von Design-PDF (/print/design)...");
    await page.goto(`${BASE_URL}/print/design`, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });
    await page.evaluateHandle("document.fonts.ready");
    const designBuffer = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT },
    });
    await fs.writeFile(path.join(OUTPUT_DIR, "pdf-design.png"), designBuffer);

    console.log("🎨 Generiere Side-by-Side Vergleichsbild (pdf-comparison.png)...");
    const atsBase64 = atsBuffer.toString("base64");
    const designBase64 = designBuffer.toString("base64");

    const comparisonHtml = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 48px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            display: flex;
            gap: 48px;
            max-width: 1400px;
          }
          .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .label {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #94a3b8;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 6px 14px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
          .label-ats span { color: #38bdf8; }
          .label-design span { color: #818cf8; }
          .page-frame {
            width: 540px;
            height: 764px; /* Exaktes A4 Verhältnis 1 : 1.414 */
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
            background: #ffffff;
          }
          .page-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="label label-ats">📄 <span>1. ATS-Friendly PDF</span> (1-Spaltig / Maschinenlesbar)</div>
            <div class="page-frame">
              <img src="data:image/png;base64,${atsBase64}" alt="ATS PDF" />
            </div>
          </div>
          <div class="card">
            <div class="label label-design">🎨 <span>2. Design PDF</span> (Visuelles Theme-Layout)</div>
            <div class="page-frame">
              <img src="data:image/png;base64,${designBase64}" alt="Design PDF" />
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const compositePage = await browser.newPage();
    await compositePage.setViewport({
      width: 1300,
      height: 920,
      deviceScaleFactor: 2,
    });
    await compositePage.setContent(comparisonHtml, { waitUntil: "networkidle0" });

    const outputPath = path.join(OUTPUT_DIR, "pdf-comparison.png");
    await compositePage.screenshot({
      path: outputPath,
      type: "png",
    });

    console.log(`\n✅ Fertig! Vergleichsbild erfolgreich gespeichert unter:\n   ${outputPath}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("❌ Fehler beim Generieren der Screenshots:", err);
  process.exit(1);
});
