import { useEffect, useRef, useState } from 'react'
import './DailyView.css'

export default function DailyView() {
  const [dateObj, setDateObj] = useState(new Date())
  const [dayName, setDayName] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // array of day names

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

  return (
    <div>
      <div className="day-of-month">
        <h3>{dayName}</h3>
        <h2>{dayOfMonth}</h2>
      </div>
      <button onClick={decrementDate} className="btn">BACKWARDS</button>
      <button onClick={incrementDate} className="btn">FORWARD</button>
    </div>
  )
}