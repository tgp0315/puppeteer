const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({args: ["--no-sandbox"], headless: false, devtools: true});
  const page = await browser.newPage();
  //设置浏览器页面大小
  // await page.setViewport({
  //   width: 1376,
  //   height: 768
  // })
  //打开网址
  await page.goto("https://www.baidu.com", { waitUntil: "networkidle0"})
  // 截图保存到本地
  await page.screenshot({
    path: "savve.png"
    // format: "A4"
  })
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    }
  })
  await page.setViewport(dimensions);
  // console.log(dimensions);
  //获取html 
  //获取上下文句柄
  const htmlHandle = await page.$("html");
  // console.log(htmlHandle);
  // 执行计算
  const html = await page.evaluate(body => body.outerHTML, htmlHandle);
  await page.on("console", msg => console.log("Page log", msg.text()));
  await page.evaluate(() => console.log(`${location}`));
  await htmlHandle.dispose();
  //聚焦搜索框
  // await page.click(".quickdelete-wrap .s_ipt");
  // await page.focus(".quickdelete-wrap .s_ipt")
  // 输入搜索关键字
  await page.type(".quickdelete-wrap .s_ipt", "辣子鸡", {
    delay: 1000
  })
  // 点击搜索按钮
  await page.click(".bg.s_btn_wr .s_btn");
  // 回车
  // await page.press("Enter");
})()