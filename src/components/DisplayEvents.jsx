import './DisplayEvents.css'

import { useDateContext } from "../hooks/useDateContext"
import { useModalContext } from '../hooks/useModalContext'
import { useEffect, useState } from "react"
import ViewEvent from './ViewEvent'

export default function DisplayEvents({targetDate, allEvents}) {
  const { convertToHours, convertToMeridian } = useDateContext()
  const hourGridLines = new Array(24).fill(null)
  const [events, setEvents] = useState([])
  const [viewId, setViewId] = useState('')
  const { modalContext, setModalContext } = useModalContext()

  useEffect(() => {
    allEvents && setEvents(allEvents.filter(
      event => event.date === targetDate).sort(
        (eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime))
    )
  }, [targetDate, allEvents])
  
  function openEvent(e, id) {
    // e.target.style.zIndex = "5"
    setViewId(id)
    setModalContext('view-event')
  }

  return (
    <div className="events">
      {hourGridLines.map((_, index) => (
        <div className="divider" key={index}></div>
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
          <div key={i} style={eventStyles} className={`event ${size}`} id={event.id} onClick={(e) => openEvent(e, event.id)}>
            <h3 className="title">{event.name}</h3>
            {size !== 'small' && <>
              <p className="time">{convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}</p>
              <p className="notes">{event.notes}</p>
            </>}
          </div>
        )
      })}
      {modalContext === 'view-event' && 
        <ViewEvent allEvents={allEvents} viewId={viewId}/>
      }
    </div>
  )
}