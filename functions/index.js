"use strict";
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const userN = require('./getUserNames')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://attendance-management-v.firebaseio.com'
});

//admin.initializeApp();

exports.attendance2db = functions.region('asia-northeast1').https.onRequest((request, response) => {

  userN.getUserNamesAsync(admin);

})

