import axios from "axios";
import { Db } from './db';
import { Connpass } from './connpass';

export async function eventCreate(eventID: string) {

  const db = new Db();
  const eventPresence = await db.checkEvent(Number(eventID));
  if(eventPresence){
    return false;
  }

  const res = await axios.get<Connpass>('https://connpass.com/api/v1/event/?event_id=' + eventID);

  const event = res.data.events[0];

  db.eventWrite(
    event.event_id,
    event.title,
    event.started_at,
    event.ended_at,
    event.accepted,
    event.waiting
  );

  return true;
}
