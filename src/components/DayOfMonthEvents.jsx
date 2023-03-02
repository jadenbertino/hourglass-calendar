import { useDateContext } from "../hooks/useDateContext"
import { useModalContext } from "../hooks/useModalContext"

export default function DayOfMonthEvents({ events, setViewEventId }) {
  const { convertToMeridian } = useDateContext()
  const { setModalContext } = useModalContext()

  function openEvent(id) {
    setViewEventId(id)
    setModalContext('view-event')
  }

  return (
    <>
      {events.map((e, i) => (
        <div className="monthly-event" key={i} onClick={() => openEvent(e.id)}>
          <div className="color-dot"></div>
          <span className="time">{convertToMeridian(e.startTime)}</span>
          <span className="name">{e.name}</span>
        </div>
      ))}
    </>
  )
}