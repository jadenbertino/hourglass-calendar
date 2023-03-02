import { useDateContext } from "../hooks/useDateContext"

export default function DayOfMonthEvents({ events }) {
  const { convertToMeridian } = useDateContext()
  return (
    <>
      {events.map((e, i) => (
        <div className="monthly-event" key={i}>
          <div className="color-dot"></div>
          <span className="time">{convertToMeridian(e.startTime)}</span>
          <span className="name">{e.name}</span>
        </div>
      ))}
    </>
  )
}