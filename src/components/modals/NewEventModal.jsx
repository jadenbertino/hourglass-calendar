import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/init';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import Modal from './Modal';

// styles
import './NewEventModal.css';

export default function NewEventModal({ eventToEdit }) {
  const { user } = useAuthContext();
  const { setModalContext } = useModalContext();
  const {
    isMeridian,
    isMilitary,
    parseTime,
    convertToMilitary,
    formatDate,
    dateContext
  } = useDateContext();
  const [event, setEvent] = useState(null);

  // form controls
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(formatDate(dateContext));
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  // form validation
  const [validDate, setValidDate] = useState(true);
  const [validStartTime, setValidStartTime] = useState(true);
  const [validEndTime, setValidEndTime] = useState(true);

  // edit existing event
  useEffect(() => {
    if (eventToEdit) {
      setEvent(eventToEdit);
    }
  }, [eventToEdit]);

  useEffect(() => {
    if (event) {
      setEventName(event.name);
      setEventDate(event.date);
      setEventStartTime(event.startTime);
      setEventEndTime(event.endTime);
      setEventNotes(event.notes);
    }
  }, [event]);

  /*

    form validation

  */

  function resetValidation() {
    setValidStartTime(true);
    setValidEndTime(true);
    setValidDate(true);
  }

  function validateFormControls(e) {
    e.preventDefault();
    resetValidation();

    // can't check state within this function because state updates are scheduled
    // could do a useEffect but this is simpler
    let validDate = true;
    let validStartTime = true;
    let validEndTime = true;

    // date must be 10 chars (YYYY-MM-DD)
    if (eventDate.length !== 10) {
      setValidDate(false);
      validDate = false;
      alert('Please ensure event data is in MM/DD/YYYY format');
    }

    // valid start time
    if (!isMilitary(eventStartTime) && !isMeridian(eventStartTime)) {
      setValidStartTime(false);
      validStartTime = false;
      alert('Please ensure event times are in HH:MM:XM or HH:MM format');
    }

    // valid end time
    if (!isMilitary(eventEndTime) && !isMeridian(eventEndTime)) {
      setValidEndTime(false);
      validEndTime = false;
      // only show alert if first time was valid to avoid duplicates
      if (validStartTime) {
        alert('Please ensure event times are in HH:MM:XM or HH:MM format');
      }
    }

    // start time must be before end time
    if (validStartTime && validEndTime) {
      const { hours: startHours, minutes: startMinutes } =
        parseTime(eventStartTime);
      const { hours: endHours, minutes: endMinutes } = parseTime(eventEndTime);
      if (startHours * 60 + startMinutes >= endHours * 60 + endMinutes) {
        validStartTime = false;
        validEndTime = false;
        setValidStartTime(false);
        setValidEndTime(false);
        alert(
          "Please ensure that event start time is before event end time.\nIf the time doesn't include AM/PM then it is interpreted as military time."
        );
      }
    }

    if (validDate && validStartTime && validEndTime) createEvent();
  }

  /*

    event creation

  */
  async function createEvent() {
    const event = {
      name: eventName,
      notes: eventNotes,
      date: eventDate,
      startTime: convertToMilitary(eventStartTime),
      endTime: convertToMilitary(eventEndTime),
      uid: user.uid
    };
    if (eventToEdit) {
      // edit existing event
      const ref = doc(db, 'events', eventToEdit.id);
      await updateDoc(ref, event);
    } else {
      // create new event
      await addDoc(collection(db, 'events'), event);
    }
    // close modal upon completion
    setModalContext('');
  }

  return (
    <Modal>
      <form className="new-event-form" onSubmit={validateFormControls}>
        <input
          className="name"
          type="text"
          placeholder="Event Name"
          onChange={e => setEventName(e.target.value)}
          required
          autoFocus
          value={eventName}
        />
        <input
          className={`date ${validDate ? '' : 'invalid'}`}
          type="date"
          placeholder="Date"
          onChange={e => setEventDate(e.target.value)}
          required
          value={eventDate}
        />
        <div className="times-wrapper">
          <input
            className={`time ${validStartTime ? '' : 'invalid'}`}
            type="text"
            placeholder="Start Time"
            onChange={e => setEventStartTime(e.target.value)}
            required
            value={eventStartTime}
          />
          <i className="fa-solid fa-arrow-right"></i>
          <input
            className={`time ${validEndTime ? '' : 'invalid'}`}
            type="text"
            placeholder="End Time"
            onChange={e => setEventEndTime(e.target.value)}
            required
            value={eventEndTime}
          />
        </div>
        <textarea
          className="notes"
          placeholder="Event Notes"
          onChange={e => setEventNotes(e.target.value)}
          required
          value={eventNotes}
        />
        <button
          className="btn cancel-btn"
          type="button"
          onClick={() => setModalContext('')}>
          Cancel
        </button>
        <button className="btn save-btn">Save</button>
      </form>
    </Modal>
  );
}
