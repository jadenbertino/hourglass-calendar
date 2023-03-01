import './DisplayEvents.css'

import { useDateContext } from "../hooks/useDateContext"
import { useModalContext } from '../hooks/useModalContext'
import { useEffect, useState } from "react"
import ViewEvent from './ViewEvent'
import NewEventModal from './NewEventModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'

export default function DisplayEvents({ allEvents, targetDate }) {
  const { convertToHours, convertToMeridian } = useDateContext()
  const hourGridLines = new Array(24).fill(null)
  const [events, setEvents] = useState([])
  const [viewId, setViewId] = useState('')
  const [viewEvent, setViewEvent] = useState({})
  const { modalContext, setModalContext } = useModalContext()
  
  // always have up to date copy of events for that day
  useEffect(() => {
    allEvents && setEvents(allEvents.filter(
      event => event.date === targetDate).sort(
        (eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime))
    )
  }, [targetDate, allEvents])

  // click event => change view id => view event
  
  function getEvent(id) {
    return allEvents.find(e => e.id === id)
  }
  
  function openEvent(id) {
    setViewId(id)
    setModalContext('view-event')
  }

  return (
    <div className="calendar-column">

      {hourGridLines.map((_, i) => (
        <div className="divider" key={i}></div>
      ))}

      {events && events.map((event, i)=> {
        const start = convertToHours(event.startTime)
        const end = convertToHours(event.endTime)
        const eventStyles = {
          'top': `${start * 50}px`,
          'height': `${(end - start) * 50}px`
        }
        const size = end - start <= 1 ? 'small' :
          end - start <= 2 ? 'medium' : 'large'
        
        return (
          <div key={i} style={eventStyles} className={`event ${size}`} id={event.id} onClick={() => openEvent(event.id)}>
            <h3 className="title">{event.name}</h3>
            {size !== 'small' && <>
              <p className="time">{convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}</p>
              <p className="notes">{event.notes}</p>
            </>}
          </div>
        )
      })}

      {modalContext === 'view-event' && 
        <ViewEvent event={() => getEvent(viewId)}/>
      }
      {modalContext === 'edit-event' &&
        <NewEventModal allEvents={allEvents} eventId={viewId} />
      }
      {modalContext === 'confirm-delete' &&
        <ConfirmDeleteModal id={viewId} />
      }
    </div>
  )
}