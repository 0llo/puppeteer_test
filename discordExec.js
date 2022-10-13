const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function discordExec() {
  const browser = await puppeteer.launch();
  console.log("puppeteer launched! - discordExec");
  // if it's not launched, you hace to do "node node_modules/puppeteer/install.js"
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setDefaultTimeout(0);

  const discordServerUrl =
    "https://discord.com/login?redirect_to=%2Fchannels%2F930973375147434005%2F931455420210511903";
  const discordChannelUrl =
    "https://discord.com/channels/930973375147434005/939482968051822653";

  const discordChannelSelector =
    "#channels > ul > li:nth-of-type(3) > div > div > a";
  //const discordChannelSelector =
  //("#channels > ul > li.containerDefault-YUSmu3.selected-2TbFuo > div > div > a");
  const discordCommentInputSelector =
    "#app-mount main>form>div>div>div div:nth-of-type(3) > div div:nth-of-type(2) ";

  try {
    console.log("goto discordServer");
    //await page.goto(discordServerUrl, { waitUntil: "networkidle2" });
    await page.goto(discordServerUrl);
    const pageTitle = await page.title();
    console.log({ step: "step1", pageTitle });
  } catch (err) {
    console.error(err);
    throw new Error(`page.goto/waitForSelector timed out.`);
  }

  try {
    await page.type("#uid_5", process.env.DISCORD_EMAIL, { delay: 100 });
    await page.type("#uid_8", process.env.DISCORD_PASSWORD, { delay: 100 });
  } catch (err) {
    console.error(err);
    throw new Error(`cannot type values or cannot find the selector`);
  }
  //await page.click('#app-mount button[class^="sizeLarge"]');

  try {
    await page.click("#app-mount button:nth-of-type(2)");
    await delay(8000);
    pageTitle = await page.title();
    console.log({ step: "step2", pageTitle });
  } catch (err) {
    console.error(err);
    throw new Error(`cannot click the button or not moving to next step`);
  }

  try {
    const pageData2 = await page.evaluate(() => {
      return {
        html: document.documentElement.innerHTML,
      };
    });
    $ = cheerio.load(pageData2.html);
    console.log("#channels", $("#channels").find("a"));
  } catch (err) {
    console.error(err);
    throw new Error(`cannot evaluate the page(step2) to exploit channel URL`);
  }

  try {
    //await page.waitForNavigation();
    await page.waitForSelector(discordChannelSelector);
    console.log("test1");
    await page.click(discordChannelSelector);
    console.log("test2");
  } catch (err) {
    console.error(err);
    throw new Error(`cannot select the channel DOM`);
  }

  //await page.goto(discordChannelUrl, { waitUntil: "networkidle2" });
  try {
    await page.waitForSelector(discordCommentInputSelector);
  } catch (err) {
    console.error(err);
    throw new Error(`cannot find the input Dom in the channel`);
  }
  await page.type(discordCommentInputSelector, "/dice6", { delay: 100 });
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  await browser.close();

  console.log("puppeteer done");

  const pageData = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });

  await browser.close();

  return { pageData };
}

module.exports = discordExec;
