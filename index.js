const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({args: ["--no-sandbox"], headless: false, devtools: true});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1800,
    height: 800
  });
  await page.goto("https://www.jd.com/?cu=true&utm_source=baidu-pinzhuan&utm_medium=cpc&utm_campaign=t_288551095_baidupinzhuan&utm_term=0f3d30c8dba7459bb52f2eb5eba8ac7d_0_8562bb9bba4142fbb4a1f4c31721a451", {waitUntil: 'networkidle2'})
  await page.waitFor(1000);
  await page.on("console", msg => console.log("Page log", msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`))
  await page.once("load", () => console.log("page loaded!"));
  function logRequest(interceptedRequest) {
    console.log('A request was made:', interceptedRequest.url());
  }
  //获取请求
  await page.on("request", logRequest);
  // 获取响应
  await page.on("response", function(data) {
    console.log(data);
  });
  // alert的值
  await page.on("dialog", async dialog => {
    console.log(111111, dialog.message());
    // await dialog.dismiss();
  })
  // alert
  await page.evaluate(() => alert("1"));
  await page.waitFor(1000);
  //删除监听请求
  await page.removeListener('request', logRequest);
  await page.screenshot({path: "jd.png"})
  await page.pdf({path: "jd.pdf", format: 'A4'});
})()