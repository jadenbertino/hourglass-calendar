import { useState } from 'react'
import { collection , addDoc } from "firebase/firestore"
import { db } from "../firebase/init"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import { Modal } from './components'

// styles
import './NewEventModal.css'

export default function NewEventModal({setModalActive}) {
  // form controls
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  
  const { user } = useAuthContext()

  function resetFields() {
    setName('')
    setDate('')
    setStartTime('')
    setEndTime('')
    setNotes('')
  }

  async function createEvent(e) {
    e.preventDefault()
    const event = {
      name,
      notes,
      date,
      startTime,
      endTime,
      uid: user.uid
    };
    await addDoc(collection(db, "events"), event);
    resetFields()
  }

  return (
    <Modal>
      <form className='new-event-form' onSubmit={createEvent}>
        <input
          className='name'
          type="text"
          placeholder='Event Name' 
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          className='date'
          type="date"
          placeholder = 'Date'
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <div className="times-wrapper">
          <input
            className='time'
            type="text"
            placeholder='Start Time'
            onChange={(e) => setStartTime(e.target.value)}
            value={startTime}
          />
          <i className="fa-solid fa-arrow-right"></i>
          <input
            className='time'
            type="text"
            placeholder='End Time'
            onChange={(e) => setEndTime(e.target.value)}
            value={endTime}
          />
        </div>

        <textarea
          className='notes'
          placeholder='Event Notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
        <button className='btn cancel-btn' type="button" onClick={(() => setModalActive(''))}>Cancel</button>
        <button className='btn save-btn'>Save</button>
      </form>
    </Modal>
  )
}