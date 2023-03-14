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
      setEvents(getOverlap(docs))
      setPending(false)
    })

    return unsub

  }, [collectionName, uid])

  function getOverlap(events) {
    if (!events) return
    
    const newEvents = events.slice();
    newEvents.forEach(e => {
      e.overlap = [e.id]
      e.order = 1
    })
    
    // set overlapping events
    for (let i = 0; i < newEvents.length; i++) {
      for (let j = i + 1; j < newEvents.length; j++) {
        const event1 = newEvents[i];
        const event2 = newEvents[j];
        if (event1.date !== event2.date) continue // can only overlap if on the same date
        if (event1.overlap.includes(event2.id)) continue // alr marked as overlapping => skip

        const startTime1 = convertToMinutes(event1.startTime);
        const endTime1 = startTime1 + 60 // convertToMinutes(event1.endTime);
        const startTime2 = convertToMinutes(event2.startTime);
        const endTime2 = startTime2 + 60 // convertToMinutes(event2.endTime);
  
        if ( // Events overlap
          (startTime1 >= startTime2 && startTime1 < endTime2) || // startTime1 in between startTime2 and endTime2
          (endTime1 > startTime2 && endTime1 <= endTime2) // endTime1 in between startTime2 and endTime2
        ) {
          // mark that the events are overlapping each other
          event1.overlap.push(event2.id);
          event2.overlap.push(event1.id);
  
          // if (startTime1 < startTime2) {
          //   event1.order = Math.max(event1.order, event2.order + 1);
          // } else {
          //   event2.order = Math.max(event2.order, event1.order + 1);
          // }
        }
      }
    }

    // set order of overlapping events
    for (const event of newEvents) {
      event.overlap.sort((id1, id2) => {
        const event1 = newEvents.find(e => e.id === id1)
        const event2 = newEvents.find(e => e.id === id2)
        const start1 = convertToMinutes(event1.startTime)
        const start2 = convertToMinutes(event2.startTime)
        return start1 - start2
      })
      event.order = event.overlap.indexOf(event.id) + 1
    }


    return newEvents
  }

  return { events, pending }
}