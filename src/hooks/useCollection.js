import { useEffect, useState } from "react";
import { db } from "../firebase/init";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getOverlap } from "../utils/EventUtils";

export function useCollection(collectionName, uid) {
  const [events, setEvents] = useState(null)
  const [pending, setPending] = useState(true)

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

  return { events, pending }
}