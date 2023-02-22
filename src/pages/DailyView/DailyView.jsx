import { useEffect, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import './DailyView.css'

export default function DailyView() {
  const [dateObj, setDateObj] = useState(new Date())
  const [dayName, setDayName] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')
  const {modalContext} = useModalContext()

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    setDayName(days[dateObj.getDay()])
    setDayOfMonth(dateObj.getDate())
  }, [dateObj])

  function incrementDate() {
    const newDate = new Date(dateObj)
    newDate.setDate(newDate.getDate() + 1);
    setDateObj(newDate)
  }

  function decrementDate() {
    const newDate = new Date(dateObj)
    newDate.setDate(newDate.getDate() - 1);
    setDateObj(newDate)
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