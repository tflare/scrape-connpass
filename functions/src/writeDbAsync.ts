import * as puppeteer from 'puppeteer';
import { Db } from './db';
import { NarrowDown } from './narrowDown';

export async function writeDbAsync(element: puppeteer.ElementHandle<Element>, nd: NarrowDown) {

  const href = await element.getProperty('href');
  const url = await href.jsonValue();
  
  const isDbRegist = nd.narrowdown(url)

  if(isDbRegist){
    const db = new Db('attendance');
    const eventID = 151286;
    db.write(eventID, nd.data, nd.option);
  }

  return;
}

