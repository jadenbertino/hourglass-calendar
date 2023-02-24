import { useEffect, useRef, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

// styles
import './DailyView.css'

export default function DailyView() {
  const { user } = useAuthContext()
  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate()
  useEffect(() => {
    if (!user) {
      nav('/')
    }
  }, [user])
  
  // set date + query events for date
  const { incrementDateBy, decrementDateBy, dayName, convertToMeridian, dayOfMonth, formattedDate, convertToHours } = useDateContext()
  const {modalContext} = useModalContext()
  const query = useRef([`uid == ${user && user.uid}`]).current
  const { events: allEvents } = useCollection("events", query)
  const [events, setEvents] = useState([]) 
  useEffect(() => {
    allEvents && setEvents(allEvents.filter(
      event => event.date === formattedDate).sort(
        (eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime))
    )
  }, [formattedDate, allEvents])

  const hours = new Array(24).fill(null)
  const hourGridLines = new Array(24).fill(null)

  return (<>
    <Nav>
      <button onClick={() => decrementDateBy(1)} className="btn">
        <i className="fa-solid fa-angle-left"></i>
      </button>
      <button onClick={() => incrementDateBy(1)} className="btn">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </Nav>

    <main>
      <Sidebar/>
      <div className="daily-view">
        <div className="day-of-month">
          <div className="spacer"></div>
          <div className="wrapper">
            <h3>{dayName}</h3>
            <h2>{dayOfMonth}</h2>
          </div>
        </div>
        <div className="times-and-events">
          <div className="times">
            {hours.map((_, i) => {
              const hourName = i % 12 === 0 ? 12 : i % 12;
              const meridian = i < 12 ? 'am' : 'pm';
              return <div key={i}>{hourName}{meridian}</div>
            })}
          </div>
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
              return (
                <div key={i} style={eventStyles} className="event">
                  <h3 className="name">{event.name}</h3>
                  <p className="time">{convertToMeridian(event.startTime)} - {convertToMeridian(event.endTime)}</p>
                  <p className="notes">{event.notes}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}