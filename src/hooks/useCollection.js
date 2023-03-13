import { useEffect, useState } from "react";
import { db } from "../firebase/init";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useDateContext } from "./useDateContext";

export function useCollection(collectionName, uid) {
  const [events, setEvents] = useState(null)
  const [pending, setPending] = useState(true)
  const { convertToMinutes } = useDateContext()

  useEffect(() => {
    setPending(true)
    let ref = collection(db, collectionName)
    let q = query(ref, where('uid', '==', uid))

    // listen for changes in collection
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))
      setEvents(docs)
      setPending(false)
    })

    return unsub

  }, [collectionName, uid])

  useEffect(() => {
    if (!events) return

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        const startTime1 = convertToMinutes(event1.startTime);
        const endTime1 = startTime1 + 60 // convertToMinutes(event1.endTime);
        const startTime2 = convertToMinutes(event2.startTime);
        const endTime2 = startTime2 + 60 // convertToMinutes(event2.endTime);
  
        if ( // Events overlap
          !(event1.overlap && event1.overlap.includes(event2.id)) && // aren't set as overlapping eachother alr
          (startTime1 >= startTime2 && startTime1 < endTime2) || // startTime1 in between startTime2 and endTime2
          (endTime1 > startTime2 && endTime1 <= endTime2) // endTime1 in between startTime2 and endTime2
        ) {
  
          // mark that the events are overlapping each other
          event1.overlap = event1.overlap ?? [];
          event1.order = event1.order ?? 1
          event2.overlap = event2.overlap ?? [];
          event2.order = event1.order ?? 1

          if (!event1.overlap.includes(event2.id)) event1.overlap.push(event2.id);
          if (!event2.overlap.includes(event1.id)) event2.overlap.push(event1.id);
  
          if (startTime1 < startTime2) {
            event1.order = Math.max(event1.order, event2.order + 1);
          } else {
            event2.order = Math.max(event2.order, event1.order + 1);
          }
        }
      }
    }

    for (const event of events) {
      if (event.overlap) {
        console.log(event.date, event.order, event.startTime, event.endTime)
      }
    }
  }, [events])

  return { events, pending }
}