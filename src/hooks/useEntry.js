import { db } from "../firebase/init"
import { doc, getDoc } from "firebase/firestore"

import { useEffect, useState } from "react"

export function useEntry(id) {
  const [entry, setEntry] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    async function getEntryById(entryID) {
      setPending(true)

      const docRef = doc(db, 'entries', entryID)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        setPending(false)
        return
      }
      
      setEntry(docSnap.data())
      setPending(false)
    }
    getEntryById(id)
  }, [])


  return {entry, pending}
}