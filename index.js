
// 途中

const puppeteer = require('puppeteer')

const scraper = scrapeConnpass;

for (const username of scraper) {
  username

}

async function scrapeConnpass(){

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  page.setViewport({ width: 1280, height: 1024 });
  
  //const targetUrl = 'https://connpass.com/event/151286/participation/';
  const targetUrl = 'https://tflare.com';

  await page.goto('targetUrl', { waitUntil: 'domcontentloaded', timeout: 20000 });　　
  
  const users = [];
  
  // 管理者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/open/">
  const reOpen = /^https:\/\/connpass.com\/user\/(?<username>.*?)\/open\/$/;
  // 発表者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/presentation/">
  const rePresentation = /^https:\/\/connpass.com\/user\/(?<username>.*?)\/presentation\/$/;
  // 参加者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/">
  const reAttendance = /^https:\/\/connpass.com\/user\/(?<username>.*?)\/$/;
  
  const elements = await page.$$('div.user_info');
  for (const element of elements) {
    const item = await page.$$('a.image_link');
    const aTag = await item.$('a');
    const href = await aTag.getProperty('href');
    const url = await href.jsonValue();
  
    const resultUser = userPush(users, reOpen);
    if(resultUser){
      continue;
    }
  
    const resultPresentation = userPush(users, rePresentation);
    if(resultPresentation){
      continue;
    }
  
    const resultAttendance = userPush(users, reAttendance);
    if(resultAttendance){
      continue;
    }
  
    // error
    new Error("Unintended behavior to come here")
  
  }
  return users;
}

function userPush(users, reOpen) {
  const resultOpen =  reOpen.exec(url);
  if(resultOpen){
    reUsername = resultOpen[groups].username
    users.push({username: reUsername});
    return true;
  }
  return false;
}
  