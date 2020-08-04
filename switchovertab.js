const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: false,
    devtools: true
  });
  const page = await browser.newPage();
  await page.goto("https://www.ly.com", {
    waitUntil: 'networkidle2'
  });
  const searchText = await page.$("#pt__search_text");
  await searchText.type("苏州", {
    delay: 500
  });
  await page.waitFor(1000);
  await page.click("#pt__search_btn");
  await page.waitFor(2000);
  //方法一  browser.pages() 可获取所有 打开的page对象，可以通过遍历或筛选找到自己想获取的page对象
  // const newPage = (await browser.pages())[2];
  // console.log(newPage);
  // 方法二 通过browser.waitForTarget获取target
  const target = await browser.waitForTarget(t => t.url().includes("https://so.ly.com/hot"));
  // console.log(target);
  const newPage = await target.page();
  const newPageEle = await newPage.$("div.search_list > ul > li:nth-child(1) div > a");
  // await newPageEle.click();
  const newPageText = await newPage.$eval("div.search_list > ul > li:nth-child(1) div > a", ele => ele.innerText);
  console.log(newPageText)
})()