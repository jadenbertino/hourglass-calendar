import { useEffect, useRef, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

// styles
import './DailyView.css'
import DisplayEvents from '../../components/DisplayEvents'

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


  const hours = new Array(24).fill(null)

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
          <DisplayEvents targetDate={formattedDate} allEvents={allEvents} />
        </div>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}


/*
  <= 30m
    title only
    padding
  <= 60m
    title only
    padding
  <= 120m
    
*/