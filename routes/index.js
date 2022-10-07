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

cron.schedule("20,50 * * * * *", async () => {
  console.log(
    `---- cron test - a ${dayjs().format("YYYY/MM/DD HH:mm ss[sec]")} ----`
  );

  const sourceUrl = `https://www3.nhk.or.jp/news/easy/`;

  const { pageData } = await ssr(sourceUrl);
  //  const pageData = await ssr(`https://www.google.ca/`);
  const $ = cheerio.load(pageData.html);
  const targetPath = $(".news-list-item__image").find("a").attr("href");
  const targetLink = sourceUrl + targetPath.substring(2);
  console.log({ targetLink });

  // -------- discord login

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const discordServerUrl =
    "https://discord.com/login?redirect_to=%2Fchannels%2F930973375147434005%2F931455420210511903";
  const discordChannelUrl =
    "https://discord.com/channels/930973375147434005/939482968051822653";

  await page.goto(discordServerUrl, { waitUntil: "networkidle2" });

  // const token = "...";
  // await page.evaluate((_token) => {
  //   localStorage.setItem("token", _token);
  //   // pass the token as additional argument after the callback function
  // }, token);
  //await page.click('button[type="button"]:nth-of-type(2)');
  await page.type("#uid_5", process.env.DISCORD_EMAIL, { delay: 50 });
  await page.type("#uid_8", process.env.DISCORD_PASSWORD, { delay: 50 });
  //await page.click('#app-mount button[class^="sizeLarge"]');
  await page.click("#app-mount button:nth-of-type(2)");

  const discordChannelSelector =
    "#channels > ul > li:nth-of-type(3) > div > div > a";
  //const discordChannelSelector =
  //("#channels > ul > li.containerDefault-YUSmu3.selected-2TbFuo > div > div > a");
  const discordCommentInputSelector =
    "#app-mount main>form>div>div>div div:nth-of-type(3) > div div:nth-of-type(2) ";

  //await page.waitForSelector(discordChannelSelector);
  await delay(4000);
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
