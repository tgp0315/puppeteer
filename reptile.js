const fs = require("fs");
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
    devtools: true
  });
  const page = await browser.newPage();
  await page.goto("https://www.guazi.com/hz/buy/");
  // 获取 标题
  const title = await page.title();
  // console.log(title);//【杭州二手车】杭州二手车交易市场_杭州二手车报价_杭州二手车市场-杭州瓜子二手车
  // 获取汽车品牌
  const BARNDS_INFO_SELECTOR = ".dd-all.clearfix.js-brand.js-option-hid-info";
  const brands = await page.evaluate(el => {
    const ulList = Array.from($(el).find("ul li p a"));
    const ctn = ulList.map(v => {
      return v.innerText.replace(/\s/g, '');
    });
    return ctn;
  }, BARNDS_INFO_SELECTOR)
  // console.log("汽车品牌",JSON.stringify(brands));
  let writerStream = fs.createWriteStream("car_brands.json");
  writerStream.write(JSON.stringify(brands, undefined, 2), "UTF-8");
  writerStream.end();
  // 获取车源列表
  const CAR_LIST = "ul.carlist";
  const carlist = await page.evaluate(el => {
    const carboxs = Array.from($(el).find("li a"));
    const ctn = carboxs.map(v => {
      const title = $(v).find("h2.t").text();
      const subTitle = $(v).find("div.t-i").text().split("|");
      const price = $(v).find("div.t-price p").text();
      const url = $(v).find("a").attr("href");
      console.log(url);
      return {
        title: title,
        year: subTitle[0],
        milemeter: subTitle[1],
        price: price,
        url: url
      }
    })
    return ctn;
  }, CAR_LIST)
  console.log(carlist);
  // 将车辆信息写入文件
  writerStream = fs.createWriteStream('car_info_list.json');
  writerStream.write(JSON.stringify(carlist, undefined, 2), 'UTF8');
  writerStream.end();
})()