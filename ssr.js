const puppeteer = require("puppeteer");

async function ssr(url, selector) {
  console.info("rendering the page in ssr mode");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
    if (selector) await page.waitForSelector(selector);
  } catch (err) {
    console.error(err);
    throw new Error(`page.goto/waitForSelector timed out.`);
  }

  const html = await page.content();
  await browser.close();

  return { html };
}

module.exports = ssr;
