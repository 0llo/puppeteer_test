const puppeteer = require("puppeteer");

async function ssr(url, selector) {
  console.info(`rendering the page in ssr mode : ${url}`);
  const browser = await puppeteer.launch();
  console.log("puppeteer launched!");
  // if it's not launched, you hace to do "node node_modules/puppeteer/install.js"
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    if (selector) {
      console.log(`awaiting for selector : ${selector}`);
      await page.waitForSelector(selector);
    }
  } catch (err) {
    console.error(err);
    throw new Error(`page.goto/waitForSelector timed out.`);
  }

  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });

  await browser.close();

  return { pageData };
}

module.exports = ssr;
