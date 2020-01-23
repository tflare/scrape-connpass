import * as puppeteer from 'puppeteer';

export async function getUserNamesAsync(admin: any){
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

  await Promise.all(elements.map(async (element)=>{
    const _dummy2 = await fetchAsync(element, re, admin);
    return _dummy2;
  }));
  return;
}

async function fetchAsync(element: puppeteer.ElementHandle<Element>, re: any[], admin: any) {
  const reOpen = re[0];
  const rePresentation = re[1];
  const reAttendance = re[2];

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
  console.error("error001:url" + url);
  return;
}

function storeDb(username: string, presenter: boolean, admin: { firestore: { (): any; FieldValue: { serverTimestamp: () => any; }; }; }){
  if(!username){return false;}

  // データベースに保存
  const db = admin.firestore();
  db.collection('attendance').add({
    eventID: 151286,
    userID: username,
    attendance: false,//出席フラグ今の段階ではfalseで登録
    presenter: presenter,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  return true;
}

function getUsername(url: any, re: { exec: (arg0: any) => any; }) {
  const result =  re.exec(url);
  if(result){
    //console.log("getusername:" + result[1]);
    return result[1];
  }
  return "";
}
  