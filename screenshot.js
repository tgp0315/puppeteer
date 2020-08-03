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
  await page.goto("https://www.jianshu.com/u/40909ea33e50")
  // metrics获取页面打开过程的性能参数
  const metrics = await page.metrics()
  console.log(metrics);
  await page.screenshot({
    path: "jianshu.png",
    type: "png",
    // quality: 100,//只对jpg有效
    fullPage: true,
    //指定区域截图，clip和fullPage两者只能设置一个
    // clip: {
    //   x: 0,
    //   y: 0,
    //   width: 1000,
    //   height: 40
    // }
  })
  await browser.close();
})()