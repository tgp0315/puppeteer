const puppeteer = require("puppeteer");
const fs = require("fs");
(async () => {
  const browser = await puppeteer.launch({args: ["--no-sandbox", "--start-maximized"], headless: false, devtools: true});
  const page = await browser.newPage();
  await page.setViewport({
    width: 2000,
    height: 800
  })
  await page.goto("https://music.163.com/#");
  await page.type(".txt.j-flag", "可不可以", {delay: 500});
  // 回车
  await page.keyboard.press("Enter");
  // 获取歌曲列表
  await page.waitFor(2000);
  let iframe = await page.frames().find(f => f.name() === "contentFrame");
  // console.log(iframe)
  const SONG_LIST = await iframe.$(".srchsongst");
  // console.log(SONG_LIST);
  //获取歌曲 可不可以 的地址
  const selectedSongHref = await iframe.evaluate(e => {
    // console.log(e.childNodes);
    const songList = Array.from(e.childNodes);
    const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, "") === "可不可以");
    return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
  }, SONG_LIST)
  // console.log(selectedSongHref);
  //进入页面
  await page.goto(selectedSongHref);
  // 获取歌曲页面嵌套的iframe
  await page.waitFor(2000);
  iframe = await page.frames().find(f => f.name() === "contentFrame");
  // 点击展开按钮
  const unfoldButton = await iframe.$("#flag_ctrl");
  await unfoldButton.click();
  // 获取歌词
  const LYRIC_SELECTOR = await iframe.$("#lyric-content");
  const lyriCtn = await iframe.evaluate(e => {
    return e.innerText;
  }, LYRIC_SELECTOR);
  // console.log(lyriCtn)
  // 写入文件
  let writerStream = fs.createWriteStream("歌词.text");
  writerStream.write(lyriCtn, "UTF-8");
  writerStream.end();
  // 获取评论数量
  const commentCount = await iframe.$eval(".sub.s-fc3", e => e.innerText);
  console.log(commentCount)
  // 获取评论
  const commentList = await iframe.$eval(".itm", e => {
    const ctn = e.map(v => {
      return v.innerText.replace(/\s/g, "");
    });
    return ctn;
  });
  console.log(commentList);
})()