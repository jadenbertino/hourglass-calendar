import { useEffect, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

// styles
import './DailyView.css'

export default function DailyView() {
  const { user } = useAuthContext()
  const { dateContext, setDateContext, formatDate } = useDateContext()
  const {modalContext} = useModalContext()

  const [dayName, setDayName] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')
  const [formattedDate, setFormattedDate] = useState('')

  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate()
  useEffect(() => {
    if (!user) {
      nav('/')
    }
  }, [user])

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  useEffect(() => {
    setDayName(days[dateContext.getDay()])
    setDayOfMonth(dateContext.getDate())
    setFormattedDate(formatDate(dateContext))
  }, [dateContext])

  function incrementDate() {
    const newDate = new Date(dateContext)
    newDate.setDate(newDate.getDate() + 1);
    setDateContext(newDate)
  }

  function decrementDate() {
    const newDate = new Date(dateContext)
    newDate.setDate(newDate.getDate() - 1);
    setDateContext(newDate)
  }

  return (<>
    <Nav>
      <button onClick={decrementDate} className="btn nav-date-btn">
        <i className="fa-solid fa-angle-left"></i>
      </button>
      <button onClick={incrementDate} className="btn nav-date-btn">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </Nav>

    <main>
      <Sidebar/>
      <div className="day-of-month">
        <h3>{dayName}</h3>
        <h2>{dayOfMonth}</h2>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}