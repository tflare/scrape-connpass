const puppeteer = require('puppeteer');

async function getUserNamesAsync(admin){
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

  _ = await Promise.all(elements.map(async (element)=>{
    const dummy = await fetchAsync(element, re, admin);
    return dummy;
  }));
  return;
}
module.exports.getUserNamesAsync = getUserNamesAsync;

async function fetchAsync(element, re, admin) {
  reOpen = re[0];
  rePresentation = re[1];
  reAttendance = re[2];

  const href = await element.getProperty('href');
  const url = await href.jsonValue();

  const openUser = getUsername(url, reOpen);
  // 管理者には来ない人もいるので、attendanceUserで取得する。
  if(openUser){
    return;
  }

  const presentationUser = getUsername(url, rePresentation);
  const registPresentation = storeDb(presentationUser, true, admin);
  if(registPresentation){
    return;
  }

  const attendanceUser = getUsername(url, reAttendance);
  const registAttendance = storeDb(attendanceUser, false, admin);
  if(registAttendance){
    return;
  }

    
  // "Unintended behavior to come here"
  console.error("error001:item" + item);
  return;
}

function storeDb(username, presenter, admin){
  if(!username){return false;}

  // データベースに保存
  const db = admin.firestore();
  const docRef = db.collection('attendance').add({
    eventID: 151286,
    userID: username,
    attendance: false,//出席フラグ今の段階ではfalseで登録
    presenter: presenter,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  return true;
}

function getUsername(url, re) {
  const result =  re.exec(url);
  if(result){
    console.log("getusername:" + result[1]);
    return result[1];
  }
  return "";
}
  