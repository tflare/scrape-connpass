import * as admin from 'firebase-admin';
import { UserInfo } from './type/userInfo';

export class Db {

  async eventUserWriteAsync(userInfoList: (UserInfo | undefined)[]) {

    const db = admin.firestore();

    try {
      let batch = db.batch();
      const nowTime = admin.firestore.FieldValue.serverTimestamp()

      for (let userInfo of userInfoList){
        if(!userInfo){
          continue;
        }
        const userRef = db.collection('event').doc(String(userInfo.eventID)).collection('users').doc(userInfo.userID)

        batch.set(userRef,{
          eventID: userInfo.eventID,
          displayName: userInfo.displayName,
          attendance: false,//出席フラグ今の段階ではfalseで登録
          presenter: userInfo.presenter,
          createdAt: nowTime,
          updatedAt: nowTime
        });
      }

      await batch.commit();
      return;

    } catch (error) {
      console.error("Error writing attendanceWrite Try catch: ", error);
    }
  }

  async checkEvent(eventID: number){
    let event = false;
    try {
        event = await this.getValues('event', String(eventID));
    } catch {
        console.log("ERROR:checkEvent" );
    }

    return event;
  }

  getValues(collectionName: string, docName: string) {
    const db = admin.firestore();
    return db.collection(collectionName).doc(docName).get().then(function (doc) {
        if (doc.exists) return true;
        return Promise.reject("No such document");
    });
  }

  eventWrite(eventID: number, title: string, startedAt: string, endedAt: string, accepted: number, waiting: number) {

     // データベースに保存
    const db = admin.firestore();
    db.collection('event').doc(String(eventID)).set({
      title: title,
      startedAt: admin.firestore.Timestamp.fromMillis(Date.parse(startedAt)),
      endedAt: admin.firestore.Timestamp.fromMillis(Date.parse(endedAt)),
      accepted: accepted,
      waiting: waiting,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
      console.error("Error writing eventWrite: ", error);
    });

    return true;
  }

}
