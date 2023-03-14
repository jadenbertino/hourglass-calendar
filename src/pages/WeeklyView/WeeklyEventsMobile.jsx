import { useDateContext } from "../../hooks/useDateContext"
import { useModalContext } from "../../hooks/useModalContext";

export default function DisplayWeeklyEvents({ events }) {
  const { convertToMeridian } = useDateContext()
  const { setModalContext } = useModalContext()

  return (
    <div className="weekday">
      {events.map((e, i) => (
        <div className="mobile-event" key={i} onClick={() => setModalContext({view: "view-event", payload: e.id})}>
          <h4>{e.name}</h4>
          <p>{convertToMeridian(e.startTime)}</p>
        </div>
      ))}
    </div>
  )
}