import * as puppeteer from 'puppeteer';
import { NarrowDown } from './narrowDown';
import { getUserInfoAsync } from './getUserInfoAsync';
import { Db } from './db';

export async function scrapeAsync(targetUrl: string, targetSelector: string, nd: NarrowDown, eventID: number){
  const browser = await puppeteer.launch({args: [
    '--disable-gpu',
    '--disable-setuid-sandbox',
    '--headless',
    '--no-sandbox',
  ]});

  const page = await browser.newPage();
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const elements = await page.$$(targetSelector);

  let promises = [];
  for (let element of elements){
    promises.push(getUserInfoAsync(element, nd, eventID));
  }

  const db = new Db();
  await Promise.all(promises)
  .then(async (results) => {
      await db.eventUserWriteAsync(results);
  });

  return;
}
