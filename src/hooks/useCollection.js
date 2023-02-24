import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/init";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export function useCollection(collectionName, userQueries) {
  const [events, setEvents] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    setPending(true)
    // add listener on mount + anytime collection or query changes
    let ref = collection(db, collectionName)
    for (let q of userQueries) {
      ref = query(ref, where(...q.split(' ')))
    }
    const unsub = onSnapshot(ref, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))
      setEvents(docs)
      setPending(false)
    })

    return unsub

  }, [collectionName, userQueries])

  return { events, pending }
}