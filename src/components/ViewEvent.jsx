import './ViewEvent.css'

import Modal from './Modal'
import { useState, useEffect } from 'react'
import { useDateContext } from '../hooks/useDateContext'
import { useModalContext } from '../hooks/useModalContext'

export default function ViewEvent({allEvents, viewId}) {
  const [event, setEvent] = useState(null)
  const { convertToMeridian, formatReadableDate } = useDateContext()
  const { setModalContext } = useModalContext()
  useEffect(() => {
    allEvents && setEvent(allEvents.find(event => event.id === viewId))
  }, [allEvents, viewId])

  return (
    <Modal>
      {event && 
        <div className="view-event">
          <h2 className="name">{event.name}</h2>
          <p className="date">{formatReadableDate(event.date)}</p>
          <i className="dot">•</i>
          <p className="time">{convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}</p>
          <p className="notes">{event.notes}</p>
          <div className="modal-actions">
            <button className="modal-icon delete-event">
              <i className="fa-solid fa-trash"></i>
            </button>
            <button className="modal-icon edit-event" onClick={() => setModalContext('edit-event')}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button className="modal-icon close-modal" onClick={() => setModalContext('')}>
              <i className="fa-solid fa-x"></i>
            </button>
          </div>
        </div>
      }
    </Modal>
  )
}