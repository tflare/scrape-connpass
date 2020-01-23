import * as puppeteer from 'puppeteer';
import { Db } from './db';
import { UseridRegExp } from './useridRegExp';

export async function getUserNamesAsync(targetUrl: string){
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

  const re = new UseridRegExp();

  const elements = await page.$$('div.user_info > a.image_link');
  await Promise.all(elements.map(
    async (element: puppeteer.ElementHandle<Element>) => await fetchAsync(element, re))
    )

  return;
}

async function fetchAsync(element: puppeteer.ElementHandle<Element>, re: UseridRegExp) {

  const href = await element.getProperty('href');
  const url = await href.jsonValue();

  const openUsername = getUsername(url, re.open);
  // 管理者には来ない人もいるので、attendanceUserで取得する。
  if(openUsername){
    return;
  }

  const db = new Db('attendance');
  const eventID = 151286;
  const presentationUsername = getUsername(url, re.presentation);
  const registPresentation = db.write(eventID, presentationUsername, true);
  if(registPresentation){
    return;
  }

  const attendanceUsername = getUsername(url, re.attendance);
  const registAttendance = db.write(eventID, attendanceUsername, false);
  if(registAttendance){
    return;
  }

    
  // "Unintended behavior to come here"
  console.error("error001:url" + url);
  return;
}

function getUsername(url: any, re: RegExp){
  const result =  re.exec(url);
  if(result){
    //console.log("getusername:" + result[1]);
    return result[1];
  }
  return "";
}

