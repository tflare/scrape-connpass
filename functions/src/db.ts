import * as admin from 'firebase-admin';
export class Db {

  attendanceWrite(eventID: number, username: string, displayName: string, presenter: boolean) {
    if(!username){return false;}

     // データベースに保存
    const db = admin.firestore();
     db.collection('attendance').add({
      eventID: eventID,
      displayName: displayName,
      attendance: false,//出席フラグ今の段階ではfalseで登録
      presenter: presenter,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
      console.error("Error writing eventWrite: ", error);
    });

    return true;
  }

  async checkEvent(eventID: number){
    let event = false;
    try {
        event = await this.getValues('event', String(eventID));
    } catch {
        console.log("ERROR:checkEvent" );
    }

    console.log("event", event);
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
