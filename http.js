const puppeteer = require('puppeteer');
const chalk = require("chalk");
const fs = require("fs");
class bootstrap {
  constructor() {
    this.init();
  }
  log() {
    return {
      success: text => {
        console.log(chalk.green(text));
      },
      warn: text => {
        console.log(chalk.yellow(text));
      },
      error: text => {
        console.log(chalk.red(text));
      }
    };
  }
  async init() {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
    });
    const page = await browser.newPage();
    page.on('console', m => {
      // console.log(m.text());
    });
    await page.setRequestInterception(true);
    page.on('request', async req => {
      if (req.resourceType() === 'xhr') {
        console.log(req.url());
        await req.respond({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          contentType: 'application/json; charset=utf-8',
          body: JSON.stringify({
            code: 0,
            data: 'hello puppeteer'
          }),
        });
        // await req.continue();
      } else {
        await req.continue();
      }
    });
    page.on('response', async res => {
      if (res.url().indexOf('/header') >= 0) {
        console.log(res.status());
        // 原本接口返回的数据 {"code":0,"data":"hello ajanuw"}
        console.log(await res.text());
        // await browser.close();
      }
      if (res.status() !== 200) {
        let msg = "未知错误";
        const error = await res.json();
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          msg = error.response.data.message;
        }
        this.log.error(`请求错误:url->${url},msg->${msg}`);
      } else {
        this.log.success(`请求成功:url->${url}`);
      }
    });
    page.on('requestfinished', req => {
      console.log(`请求完成: ${req.url()}`);
    });
    page.on('requestfailed', req => {
      console.log(`请求失败: ${req.url()}`);
    });
    const tableTh = await page.$$(".tableWrap .el-table__body-wrapper tr");
    if (tableTh.length <= 0) {
      this.log.error("视图渲染失败");
    } else {
      this.log.success("视图渲染成功");
    }
    //检测导出
    await page.click(".btnWrap .btnOutput");
    await page.waitFor(1000);
    if (fs.existsSync("/aaaaa.xlsx")) {
      this.log.success("导出文件成功");
      fs.unlinkSync("/aaaaa.xlsx");
    } else {
      this.log.error("导出文件失败");
    }
    //检测重置
    await page.click(".btnWrap .btnReset");
    await page.waitFor(1000);
    const resetTableTh = await page.$$(
      ".tableWrap .el-table__body-wrapper th"
    );
    if (resetTableTh.length != 0) {
      this.log.error("列表重置功能异常");
    } else {
      this.log.success("列表重置功能成功");
    }
    await page.goto('http://127.0.0.1:5500/index.html');
  }
}

new bootstrap();