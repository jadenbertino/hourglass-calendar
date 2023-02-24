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
            <div>12am</div>
            <div>1am</div>
            <div>2am</div>
            <div>3am</div>
            <div>4am</div>
            <div>5am</div>
            <div>6am</div>
            <div>7am</div>
            <div>8am</div>
            <div>9am</div>
            <div>10am</div>
            <div>11am</div>
            <div>12pm</div>
            <div>1pm</div>
            <div>2pm</div>
            <div>3pm</div>
            <div>4pm</div>
            <div>5pm</div>
            <div>6pm</div>
            <div>7pm</div>
            <div>8pm</div>
            <div>9pm</div>
            <div>10pm</div>
            <div>11pm</div>
          </div>
          <div className="events">
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
            <div className="divider"></div>
          </div>
        </div>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}