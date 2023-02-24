import './DisplayEvents.css'

import { useDateContext } from "../hooks/useDateContext"
import { useEffect, useState } from "react"

export default function DisplayEvents({targetDate, allEvents}) {
  const { convertToHours, convertToMeridian } = useDateContext()
  const hourGridLines = new Array(24).fill(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    allEvents && setEvents(allEvents.filter(
      event => event.date === targetDate).sort(
        (eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime))
    )
  }, [targetDate, allEvents])
  
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
            <div key={i} style={eventStyles} className={`event ${size}`} id={event.id}>
              <h3 className="title">{event.name}</h3>
              {size !== 'small' && <>
                <p className="time">{convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}</p>
                <p className="notes">{event.notes}</p>
              </>}
            </div>
          )
        })}
      </div>
  )
}