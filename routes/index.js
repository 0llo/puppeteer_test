var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
const cron = require("node-cron");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const ssr = require("./../ssr.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

console.log("---- index.js ----");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

cron.schedule("20 */2 * * * *", async () => {
  console.log(
    `-------- cron ${dayjs().format("YYYY/MM/DD HH:mm ss[sec]")} --------`
  );

  const sourceUrl = `https://www3.nhk.or.jp/news/easy/`;

  let pageTitle = "nothing";

  const { pageData } = await ssr(sourceUrl);
  //  const pageData = await ssr(`https://www.google.ca/`);
  let $ = cheerio.load(pageData.html);
  const targetPath = $(".news-list-item__image").find("a").attr("href");
  const targetLink = sourceUrl + targetPath.substring(2);
  console.log("nhkLink", targetLink);

  // -------- discord login

  console.log("process.env.em - 1", process.env.DISCORD_EMAIL);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const discordServerUrl =
    "https://discord.com/login?redirect_to=%2Fchannels%2F930973375147434005%2F931455420210511903";
  const discordChannelUrl =
    "https://discord.com/channels/930973375147434005/939482968051822653";

  console.log("process.env.em - 2", process.env.DISCORD_EMAIL);
  await page.goto(discordServerUrl, { waitUntil: "networkidle2" });
  pageTitle = await page.title();
  console.log({ pageTitle });

  const discordChannelSelector =
    "#channels > ul > li:nth-of-type(3) > div > div > a";
  //const discordChannelSelector =
  //("#channels > ul > li.containerDefault-YUSmu3.selected-2TbFuo > div > div > a");
  const discordCommentInputSelector =
    "#app-mount main>form>div>div>div div:nth-of-type(3) > div div:nth-of-type(2) ";

  // const token = "...";
  // await page.evaluate((_token) => {
  //   localStorage.setItem("token", _token);
  //   // pass the token as additional argument after the callback function
  // }, token);
  //await page.click('button[type="button"]:nth-of-type(2)');
  console.log("process.env.em - 3", process.env.DISCORD_EMAIL);
  await page.type("#uid_5", process.env.DISCORD_EMAIL, { delay: 50 });
  await page.type("#uid_8", process.env.DISCORD_PASSWORD, { delay: 50 });
  //await page.click('#app-mount button[class^="sizeLarge"]');
  await page.click("#app-mount button:nth-of-type(2)");
  console.log("process.env.em - 4", process.env.DISCORD_EMAIL);
  await delay(4000);

  pageTitle = await page.title();
  console.log({ pageTitle });

  const pageData2 = await page.evaluate(() => {
    return {
      html: document.documentElement.innerHTML,
    };
  });
  $ = cheerio.load(pageData2.html);
  console.log(
    "discordChannelSelector",
    $(discordChannelSelector).find("a").attr("href")
  );

  //await page.waitForSelector(discordChannelSelector);
  console.log("test1");
  await page.click(discordChannelSelector);
  console.log("test2");

  //await page.goto(discordChannelUrl, { waitUntil: "networkidle2" });
  //await page.waitForSelector(discordCommentInputSelector);
  await delay(4000);
  await page.type(discordCommentInputSelector, "/bump", { delay: 50 });
  await delay(2000);
  await page.keyboard.press("Enter");
  await delay(2000);
  await page.keyboard.press("Enter");

  await browser.close();

  console.log("puppeteer done");

  //await page.goto(discordServerUrl, { waitUntil: "networkidle2" });
});

console.log("---- END index.js ----");

module.exports = router;
