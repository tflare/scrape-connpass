import * as admin from 'firebase-admin';
export class Db {

  attendanceWrite(eventID: number, username: string, presenter: boolean) {
    if(!username){return false;}

     // データベースに保存
    const db = admin.firestore();
     db.collection('attendance').add({
      eventID: eventID,
      userID: username,
      attendance: false,//出席フラグ今の段階ではfalseで登録
      presenter: presenter,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return true;
  }

}
