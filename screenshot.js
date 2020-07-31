const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"], 
    headless: false, 
    timeout: 150000,
    // 如果访问https页面，此属性会忽略https错误
    ignoreHTTPSErrors: true,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36");
  await page.setViewport({
    width: 2000,
    height: 1000
  })
  await page.goto("https://www.toutiao.com/")
  const metrics = await page.metrics()
  console.log(metrics);
  await page.screenshot({
    path: "toutiao.png",
    type: "png"
  })
})()