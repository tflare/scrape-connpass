import * as puppeteer from 'puppeteer';
import { NarrowDown } from './narrowDown';
import { writeDbAsync } from './writeDbAsync';

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
  await Promise.all(elements.map(
    async (element: puppeteer.ElementHandle<Element>) => await writeDbAsync(element, nd, eventID))
    )

  return;
}
