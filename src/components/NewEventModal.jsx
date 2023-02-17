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
  console.log(eventDate)

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
    setValidDate(true)
  }

  function parseTime(str) {
    /*
      str is in HH:MM:XM or HH:XM format, 
      with an optional space in between time & meridian

      remove any whitespace
      extract hours minutes meridian from string
      convert into date object
    */
    try {
      str = str.replace(/\s/g, "");
      const time = {
        'hours': Number(str.slice(0,2)),
        'minutes': str.includes(":") ? Number(str.match(/:(.{2})/)[1]) : 0
      }

      // pm? => add 12 to hours
      if (time.hours !== 12 && str.match(/[a-z]+/gi).join('').toUpperCase() === 'PM') {
        time.hours += 12
      }

      // note that the TIME is what you want, date will be inaccurate
      const date = new Date();
      date.setHours(time.hours)
      date.setMinutes(time.minutes)
      return date

    } catch {
      console.log('invalid time string')
    }
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

    // start time & end time must be in HH:MM:XM format, regex from chatgpt
    const timeRegex = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s?[AP]M$/i;
    if (!timeRegex.test(eventStartTime)) {
      setValidStartTime(false)
      allFieldsAreValid = false
    }
    if (!timeRegex.test(eventEndTime)) {
      setValidEndTime(false)
      allFieldsAreValid = false
    }

    // start time must be before end time
    const startTime = parseTime(eventStartTime)
    const endTime = parseTime(eventEndTime)
    if (!startTime || !endTime || startTime.getTime() > endTime.getTime()) {
      allFieldsAreValid = false;
      setValidStartTime(false)
      setValidEndTime(false)
    }

    if (allFieldsAreValid) createEvent()
  }

  /*

    event creation

  */

  function resetFields() {
    setEventName('')
    setEventNotes('')
    setEventDate('')
    setEventStartTime('')
    setEventEndTime('')
  }


  async function createEvent() {
    /*
      Create Event
    */
    const event = {
      name: eventName,
      notes: eventNotes,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
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