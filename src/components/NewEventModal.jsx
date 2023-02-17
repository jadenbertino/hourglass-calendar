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
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')
  const [eventNotes, setEventNotes] = useState('')

  // form validation
  const [validName, setValidName] = useState(true)
  const [validNotes, setValidNotes] = useState(true)
  const [validDate, setValidDate] = useState(true)
  const [validStartTime, setValidStartTime] = useState(true)
  const [validEndTime, setValidEndTime] = useState(true)
  
  const { user } = useAuthContext()

  /*

    form validation

  */

  function resetValidation() {
    setValidName(true)
    setValidNotes(true)
    setValidStartTime(true)
    setValidEndTime(true)
  }

  function validateFormControls(e) {
    e.preventDefault()

    resetValidation()
    let allFieldsAreValid = true
    // name + notes can't be empty
    if (eventName.length === 0) {
      setValidName(false)
      allFieldsAreValid = false
    }
    if (eventNotes.length === 0) {
      setValidNotes(false)
      allFieldsAreValid = false
    }
    // date must be 10 chars (YYYY-MM-DD)
    if (eventDate.length !== 10) {
      setValidDate(false)
      allFieldsAreValid = false
    }
    // start time & end time must be in HH:MM:XM format, thank you chatgpt
    const timeRegex = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s?[AP]M$/i;
    if (!timeRegex.test(eventStartTime)) {
      setValidStartTime(false)
      allFieldsAreValid = false
    }
    if (!timeRegex.test(eventEndTime)) {
      setValidEndTime(false)
      allFieldsAreValid = false
    }

    if (allFieldsAreValid) createEvent()
  }
  /*

    event creation

  */

  function resetFields() {
    setEventName('')
    setEventDate('')
    setEventStartTime('')
    setEventEndTime('')
    setEventNotes('')
  }


  async function createEvent() {
    /*
      Create Event
    */
    const event = {
      eventName,
      eventNotes,
      eventDate,
      eventStartTime,
      eventEndTime,
      uid: user.uid
    };
    await addDoc(collection(db, "events"), event);
    setModalActive('')
  }

  return (
    <Modal>
      <form className='new-event-form' onSubmit={validateFormControls}>
        <input
          className={`name ${validName ? "" : "invalid"}`}
          type="text"
          placeholder='Event Name' 
          onChange={(e) => setEventName(e.target.value)}
          value={eventName}
        />
        <input
          className={`date ${validDate ? "" : "invalid"}`}
          type="date"
          placeholder = 'Date'
          onChange={(e) => setEventDate(e.target.value)}
          value={eventDate}
        />
        <div className="times-wrapper">
          <input
            className={`time ${validStartTime ? "" : "invalid"}`}
            type="text"
            placeholder='Start Time'
            onChange={(e) => setEventStartTime(e.target.value)}
            value={eventStartTime}
          />
          <i className="fa-solid fa-arrow-right"></i>
          <input
            className={`time ${validEndTime ? "" : "invalid"}`}
            type="text"
            placeholder='End Time'
            onChange={(e) => setEventEndTime(e.target.value)}
            value={eventEndTime}
          />
        </div>
        <textarea
          className={`notes ${validNotes ? "" : "invalid"}`}
          placeholder='Event Notes'
          onChange={(e) => setEventNotes(e.target.value)}
          value={eventNotes}
        />
        <button className='btn cancel-btn' type="button" onClick={(() => setModalActive(''))}>Cancel</button>
        <button className='btn save-btn'>Save</button>
      </form>
    </Modal>
  )
}