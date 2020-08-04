const puppeteer = require("puppeteer");
// console.log(puppeteer);
class upload {
  constructor() {
    this.init()
  }
  async init() {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--start-maximized"],
      headless: false,
      devtools: true
    })
    const page = await browser.newPage();
    await page.goto("https://www.baidu.com");
    const soutuBtn = await page.waitForSelector("span.soutu-btn");
    await soutuBtn.click();
    const inputBtn = await page.waitForSelector("input.upload-pic");
    await page.waitFor(2000);
    await inputBtn.uploadFile("C:\\Users\\TAL\\Desktop\\1596509812(1).jpg");
    await page.waitFor(2000);
    await page.close();
  }
}
new upload();