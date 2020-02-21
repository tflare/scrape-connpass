import * as puppeteer from 'puppeteer';
import { NarrowDown } from './narrowDown';
import { UserInfo } from './userInfo';

export async function getUserInfoAsync(element: puppeteer.ElementHandle<Element>, nd: NarrowDown, eventID: number) {
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

  if(!isDbRegist){
    return;
  }

  const user: UserInfo = {eventID: eventID, userID: nd.data, displayName: displayName, presenter: nd.option}
  return user;

}
