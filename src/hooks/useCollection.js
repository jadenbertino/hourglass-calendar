import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/init";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export function useCollection(collectionName, _userQuery) {
  const [entries, setEntries] = useState(null)
  const [pending, setPending] = useState(true)
  const userQuery = useRef(_userQuery).current

  useEffect(() => {
    setPending(true)
    // add listener on mount + anytime collection or query changes
    let ref = collection(db, collectionName)
    let q = userQuery ? query(ref, where(...userQuery)) : ref
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}))
      setEntries(docs)
      setPending(false)
    })

    return unsub

  }, [collectionName, userQuery])

  return { entries, pending }
}