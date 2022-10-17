var express = require("express");
var router = express.Router();
const dayjs = require("dayjs");
const cron = require("node-cron");
const cheerio = require("cheerio");

const ssr = require("./../ssr.js");
const discordExec = require("./../discordExec.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

console.log("---- index.js ----");

cron.schedule("20 */6 * * * *", async () => {
  console.log(
    `-------- cron ${dayjs().format("YYYY/MM/DD HH:mm ss[sec]")} --------`
  );

  const sourceUrl = `https://www3.nhk.or.jp/news/easy/`;

  let pageTitle = "nothing";

  const { pageData3 } = await discordExec();
  const { pageData } = await ssr(sourceUrl);
  //  const pageData = await ssr(`https://www.google.ca/`);
  let $ = cheerio.load(pageData.html);
  const targetPath = $(".news-list-item__image").find("a").attr("href");
  const targetLink = sourceUrl + targetPath.substring(2);
  console.log("nhkLink", targetLink);

  // -------- discord login

  console.log("-- END cron --");
});

console.log("---- END index.js ----");

module.exports = router;
