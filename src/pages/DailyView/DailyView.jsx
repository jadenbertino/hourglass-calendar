import { useEffect, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'

// styles
import './DailyView.css'

export default function DailyView() {
  const { dateContext, setDateContext } = useDateContext()
  const [dayName, setDayName] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')
  const {modalContext} = useModalContext()

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    setDayName(days[dateContext.getDay()])
    setDayOfMonth(dateContext.getDate())
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
      <button onClick={decrementDate} className="btn">BACKWARDS</button>
      <button onClick={incrementDate} className="btn">FORWARD</button>
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