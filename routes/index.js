var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
const cron = require("node-cron");
const cheerio = require("cheerio");
// const puppeteer = require("puppeteer");

const ssr = require("./../ssr.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

console.log("---- index.js ----");

cron.schedule("20,50 3 * * * *", async () => {
  console.log(
    `---- cron test - a ${dayjs().format("YYYY/MM/DD HH:mm ss[sec]")} ----`
  );

  const { html } = await ssr(`https://www3.nhk.or.jp/news/easy/`);
  //const $ = cheerio.load(html);
  //const targetLink = $(".news-list-item__image");
  console.log({ html });
});

console.log("---- END index.js ----");

module.exports = router;
