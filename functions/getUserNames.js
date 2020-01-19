const puppeteer = require('puppeteer');

async function getUserNames(){
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  //const targetUrl = 'https://connpass.com/event/******/participation/';
  // ******に必要なものを入れてください。
  const targetUrl = 'https://tflare.com/testscrapeconnpass/';

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  // 管理者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/open/">
  const reOpen = /^https:\/\/connpass.com\/user\/(.*?)\/open\/$/;
  // 発表者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/presentation/">
  const rePresentation = /^https:\/\/connpass.com\/user\/(.*?)\/presentation\/$/;
  // 参加者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/">
  const reAttendance = /^https:\/\/connpass.com\/user\/(.*?)\/$/;
  const re = [reOpen, rePresentation, reAttendance]

  const elements = await page.$$('div.user_info > a.image_link');

  const users = await Promise.all(
    elements.map(
      (element) => { return fetch(element, re); }
    )
  )

  return users;
}
module.exports.getUserNames = getUserNames;

async function fetch(element, re) {
  reOpen = re[0];
  rePresentation = re[1];
  reAttendance = re[2];

  const href = await element.getProperty('href');
  const url = await href.jsonValue();

  const resultUser = getUsername(url, reOpen);

  if(resultUser){
    return resultUser;
  }

  const resultPresentation = getUsername(url, rePresentation);
  if(resultPresentation){
    return resultPresentation;
  }

  const resultAttendance = getUsername(url, reAttendance);
  if(resultAttendance){
    return resultAttendance;
  }
    
  // "Unintended behavior to come here"
  console.error("error001:item" + item);
  return "";
}


function getUsername(url, re) {
  const result =  re.exec(url);
  if(result){
    console.log("getusername:" + result[1]);
    return result[1];
  }
  return "";
}
  