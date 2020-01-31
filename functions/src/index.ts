import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NarrowDownConnpass } from './narrowDownConnpass';
import { scrapeAsync } from './scrapeAsync';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://attendance-management-v.firebaseio.com'
});

//admin.initializeApp();

export const attendance2db = functions.region('asia-northeast1').https.onRequest((request, response) => { // eslint-disable-line

    //const targetUrl = 'https://connpass.com/event/******/participation/';
  // ******に必要なものを入れてください。
  const targetUrl = 'https://tflare.com/testscrapeconnpass/';

  //<div class="user_info">
  //<a class="image_link" href="https://connpass.com/user/tflare/open/">
  //div class="user_info"の直接の子の a class="image_link"を指定
  const targetSelector = 'div.user_info > a.image_link';

  const nd = new NarrowDownConnpass();
  scrapeAsync(targetUrl, targetSelector, nd);

})