import * as puppeteer from 'puppeteer';
import { Db } from './db';
import { NarrowDown } from './narrowDown';

export async function writeDbAsync(element: puppeteer.ElementHandle<Element>, nd: NarrowDown, eventID: number) {
  const href = await element.getProperty('href');
  const url = await href.jsonValue();

  const img = await element.$('img')
  if(img === null){
    console.error("img is null")
    return;
  }
  const alt = await img.getProperty('alt');

  const displayName = await alt.jsonValue();
  if(typeof(displayName) !== "string"){
    console.error("displayName is not string")
    return;
  }

  const isDbRegist = nd.narrowdown(url)

  if(isDbRegist){
    const db = new Db();
    db.attendanceWrite(eventID, nd.data, displayName, nd.option);
  }

  return;
}

