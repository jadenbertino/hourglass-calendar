import { useEffect, useState } from 'react'
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

  const { incrementDateBy, decrementDateBy, dayName, dayOfMonth, formattedDate } = useDateContext()
  const {modalContext} = useModalContext()
  const { entries: events } = useCollection("events", [
    ["date", "==", formattedDate], 
    ["uid", "==", user && user.uid]
  ])

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
      <div className="container daily-view">
        <div className="row">
          <div className="day-of-month">
            <h3>{dayName}</h3>
            <h2>{dayOfMonth}</h2>
          </div>
          <div className="events">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi expedita quae ratione repellendus. Consectetur minima a quos libero, fugit nihil dignissimos hic possimus nemo! Praesentium ipsum enim ea pariatur impedit!</p>
          </div>
        </div>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}