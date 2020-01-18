const functions = require('firebase-functions');
const admin = require('firebase-admin');

const userN = require('./getUserNames')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://attendance-management-v.firebaseio.com'
});

//admin.initializeApp();

// データベースの参照を作成
const db = admin.firestore();

exports.attendance2db = functions.region('asia-northeast1').https.onRequest((request, response) => {

  const usernames = userN.getUserNames;
  // データベースに保存
  const docRef = db.collection('attendance').add({
    eventID: 151286,
    userID: 'tflare',
    attendance: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })
})
