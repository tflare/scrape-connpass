import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getUserNamesAsync } from './getUserNames';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://attendance-management-v.firebaseio.com'
});

//admin.initializeApp();

export const attendance2db = functions.region('asia-northeast1').https.onRequest((request, response) => { // eslint-disable-line

  getUserNamesAsync();

})