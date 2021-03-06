import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { NarrowDownConnpass } from './narrowDownConnpass';
import { scrapeAsync } from './scrapeAsync';
import { createEventAsync } from './createEventAsync';

admin.initializeApp({
  credential: admin.credential.cert(require('../key/firebase-adminsdk.json')),
  databaseURL: "https://attendance-management-v.firebaseio.com"
});

exports.attendance2db = functions.runWith({memory: '1GB', timeoutSeconds: 120}).region('asia-northeast1').https.onCall(async(data, context) => { // eslint-disable-line

  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
        'while authenticated.')
  }

  const eventID = data.eventID;
  if (!eventID) {
    console.error('data.eventID is not found')
    throw new functions.https.HttpsError('invalid-argument', 'data.eventID is undefined.', data)
  }

  const ec = await createEventAsync(eventID);
  if (!ec) {
    return { message: "createEvent Data already exists" };
  }

  //test
  //const targetUrl = 'https://tflare.com/testscrapeconnpass/';

  const targetUrl = 'https://connpass.com/event/' + eventID + '/participation/';
  //<div class="user_info">
  //<a class="image_link" href="https://connpass.com/user/tflare/open/">
  //div class="user_info"の直接の子の a class="image_link"を指定
  const targetSelector = 'div.user_info > a.image_link';

  const nd = new NarrowDownConnpass();
  await scrapeAsync(targetUrl, targetSelector, nd, Number(eventID));
  return { message: "success" };
})
