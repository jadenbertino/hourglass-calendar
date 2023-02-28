import { useEffect, useRef, useState } from 'react'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

// components
import Nav from '../../components/Nav'
import Sidebar from '../../components/Sidebar'
import NewEventModal from '../../components/NewEventModal'
import HoursGrid from '../../components/HoursGrid'

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
  const { incrementDateBy, decrementDateBy, dayName, dayOfMonth, formattedDate, resetDateToToday } = useDateContext()
  const {modalContext} = useModalContext()
  const query = useRef([`uid == ${user && user.uid}`]).current
  const { events: allEvents } = useCollection("events", query)

  return (<>
    <Nav>
      <button className="btn change-date-btn" onClick={() => decrementDateBy(1)}>
        <i className="fa-solid fa-angle-left"></i>
      </button>
      <button className="btn change-date-btn" onClick={() => incrementDateBy(1)}>
        <i className="fa-solid fa-angle-right"></i>
      </button>
      <button className="btn reset-date-btn" onClick={resetDateToToday}>
        Today
      </button>
    </Nav>
    
    <main>
      <Sidebar/>
      <div className="daily-view">
        <div className="day-of-month">
          <div className="wrapper" onClick={resetDateToToday}>
            <h3>{dayName}</h3>
            <h2>{dayOfMonth}</h2>
          </div>
        </div>
        <div className="times-and-events">
          <HoursGrid />
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