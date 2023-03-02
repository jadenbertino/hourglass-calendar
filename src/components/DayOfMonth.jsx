import { useDateContext } from "../hooks/useDateContext"

export default function DayOfMonth({ events }) {
  const { convertToMeridian } = useDateContext()
  return (
    <>
      {events.map((e, i) => (
        <div className="event" key={i}>
          {convertToMeridian(e.startTime)} • {e.name}
        </div>
      ))}
    </>
  )
}