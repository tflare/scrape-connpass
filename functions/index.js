
// 途中

//const userN = require('getUserNames')
//const usernames = userN.getUserNames;

const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);

// データベースの参照を作成
const db = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {
  // データベースに保存
  const docRef = db.collection('attendance').doc('event');
  docRef.set({
    eventID: 151286,
    userID: 'tflare',
    attendance: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
  //var docRef = db.collection('attendance').doc('eventF')

})
