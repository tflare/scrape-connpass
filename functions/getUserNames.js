const puppeteer = require('puppeteer');

async function getUserNames(){

  const isDebug = process.env.NODE_ENV !== 'production'
  const launchOptions = {
    headless: isDebug ? false : true,
    args: ['--no-sandbox']
  }

  const puppeteer = require('puppeteer')
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  page.setViewport({ width: 1280, height: 1024 });
  
  //const targetUrl = 'https://connpass.com/event/151286/participation/';
  const targetUrl = 'https://tflare.com';

  await page.goto('targetUrl', { waitUntil: 'domcontentloaded', timeout: 20000 });
  
  // 管理者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/open/">
  const reOpen = /^https:\/\/connpass.com\/user\/(.*?)\/open\/$/;
  // 発表者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/presentation/">
  const rePresentation = /^https:\/\/connpass.com\/user\/(.*?)\/presentation\/$/;
  // 参加者 <div class="user_info"><a class="image_link" href="https://connpass.com/user/tflare/">
  const reAttendance = /^https:\/\/connpass.com\/user\/(.*?)\/$/;
  const re = [reOpen, rePresentation, reAttendance]

  const elements = await page.$$('div.user_info');
  const users = await Promise.all(elements.map(async (element) => {
    return await fetch(element, re)

  }));

  return users;
}

async function fetch(element, re) {
  reOpen, rePresentation, reAttendance = re;
  const item = await element.$$('a.image_link');
  const aTag = await item.$('a');
  const href = await aTag.getProperty('href');
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
  return "";
}


function getUsername(url, re) {
  const resultOpen =  re.exec(url);
  if(resultOpen){
    return resultOpen[1];
  }
  // "Unintended behavior to come here"
  return "";
}
  