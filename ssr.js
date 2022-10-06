const puppeteer = require("puppeteer");

async function ssr(url, selector) {
  console.info(`rendering the page in ssr mode : ${url}`);
  const browser = await puppeteer.launch({
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`, // Full path only
      `--load-extension=${extensionPath}`,
      // '--disable-extensions',
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
    // timeout: 0
  });
  console.log("test1");
  const page = await browser.newPage();
  console.log("test3");
  try {
    await page.goto(url, { timeout: 10, waitUntil: "load " });
    if (selector) {
      console.log(`awaiting for selector : ${selector}`);
      await page.waitForSelector(selector);
    }
    console.log("test2");
  } catch (err) {
    console.error(err);
    throw new Error(`page.goto/waitForSelector timed out.`);
  }

  //const html = await page.content();

  console.log("page loaded!");

  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });

  console.log({ pageData });
  await browser.close();

  return { pageData };
}

module.exports = ssr;
