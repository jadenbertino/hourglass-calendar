import './ConfirmDeleteModal.css'

import Modal from "./Modal"
import { db } from "../firebase/init"
import { deleteDoc, doc } from "firebase/firestore"
import { useModalContext } from "../hooks/useModalContext"

export default function ConfirmDeleteModal({id}) {
  const { setModalContext } = useModalContext()

  async function handleDelete() {
    const ref = doc(db, 'events', id)
    await deleteDoc(ref)
    setModalContext('')
  }

  return (
    <Modal>
      <div className="confirm-delete-modal">
        <h2>Are you sure you want to delete this event?</h2>
        <div className="btns-wrapper">
          <button className="btn cancel-delete" onClick={() => setModalContext('view-event')}>Cancel</button>
          <button className="btn confirm-delete" onClick={handleDelete}>Confirm</button>
        </div>
      </div>
    </Modal>
  )
}