import puppeteer from "puppeteer";

export async function generatePdfFromUrl(
  url: string,
  format: "a4" | "letter" = "a4"
): Promise<Uint8Array> {
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
    await page.goto(url, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });

    // Emulate print media & wait for all fonts to be rendered
    await page.emulateMediaType("print");
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      format: format === "letter" ? "Letter" : "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
