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
  const [validDate, setValidDate] = useState(true)
  const [validStartTime, setValidStartTime] = useState(true)
  const [validEndTime, setValidEndTime] = useState(true)
  
  const { user } = useAuthContext()

  /*

    form validation

  */

  function resetValidation() {
    setValidStartTime(true)
    setValidEndTime(true)
    setValidDate(true)
  }
  
  function isNotValidTimeFormat(time) {
    // start time & end time must be in HH:MM:XM or military (HH:MM) format
    const meridianRegex = /^(1[0-2]|0?[1-9])(:[0-5][0-9])?\s?[AP]M$/i;
    const militaryRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return !meridianRegex.test(time) && !militaryRegex.test(time)
  }

  function parseTime(str) {
    /*
      str is in HH:MM:XM or HH:XM format, 
      with an optional space in between time & meridian
    */
    try {
      // remove whitespace
      str = str.replace(/\s/g, "");
      const hoursRegex = /^\d+(?=:|[a-zA-Z])/;

      const time = {
        'hours': Number(str.match(hoursRegex)[0]),
        // grab 2 digits after the colon or set to 0 if no colon
        'minutes': str.includes(":") ? Number(str.match(/:(.{2})/)[1]) : 0
      }
      
      // pm? => add 12 to hours
      if (time.hours !== 12 && str.toLowerCase().includes('pm')) {
        time.hours += 12
      }

      // hours is 12am? => subtract 12 hours
      if (time.hours === 12 && str.toLowerCase().includes('am')) {
        time.hours -= 12
      }

      // military time must be < 24:00
      if (time.hours >= 24) {
        throw new Error('Time cannot be past 24hrs')
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

    // can't check state within this function because state updates are scheduled
    // could do a useEffect but this is simpler
    let allFieldsAreValid = true

    // date must be 10 chars (YYYY-MM-DD)
    if (eventDate.length !== 10) {
      setValidDate(false)
      allFieldsAreValid = false
      alert('Please ensure event data is in MM/DD/YYYY format')
    }

    if (isNotValidTimeFormat(eventStartTime)) {
      setValidStartTime(false)
      allFieldsAreValid = false
      alert("Please ensure event times are in HH:MM:XM or HH:MM format")
    }

    if (isNotValidTimeFormat(eventEndTime)) {
      setValidEndTime(false)
      allFieldsAreValid = false
      // don't duplicate alert
      if (!isNotValidTimeFormat(eventStartTime)) {
        alert("Please ensure event times are in HH:MM:XM or HH:MM format")
      }
    }

    // start time must be before end time
    const startTime = parseTime(eventStartTime)
    const endTime = parseTime(eventEndTime)
    if (startTime && endTime && startTime.getTime() > endTime.getTime()) {
      setValidStartTime(false)
      setValidEndTime(false)
      allFieldsAreValid = false
      alert("Please ensure that event start time is before event end time.\nIf the time doesn't include AM/PM then it is interpreted as military time.")
    }
    
    if (allFieldsAreValid) createEvent()
  }

  /*

    event creation

  */

  async function createEvent() {
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
          className='name'
          type="text"
          placeholder='Event Name' 
          onChange={(e) => setEventName(e.target.value)}
          required
          value={eventName}
        />
        <input
          className={`date ${validDate ? "" : "invalid"}`}
          type="date"
          placeholder = 'Date'
          onChange={(e) => setEventDate(e.target.value)}
          required
          value={eventDate}
        />
        <div className="times-wrapper">
          <input
            className={`time ${validStartTime ? "" : "invalid"}`}
            type="text"
            placeholder='Start Time'
            onChange={(e) => setEventStartTime(e.target.value)}
            required
            value={eventStartTime}
          />
          <i className="fa-solid fa-arrow-right"></i>
          <input
            className={`time ${validEndTime ? "" : "invalid"}`}
            type="text"
            placeholder='End Time'
            onChange={(e) => setEventEndTime(e.target.value)}
            required
            value={eventEndTime}
          />
        </div>
        <textarea
          className='notes'
          placeholder='Event Notes'
          onChange={(e) => setEventNotes(e.target.value)}
          required
          value={eventNotes}
        />
        <button className='btn cancel-btn' type="button" onClick={(() => setModalActive(''))}>Cancel</button>
        <button className='btn save-btn'>Save</button>
      </form>
    </Modal>
  )
}