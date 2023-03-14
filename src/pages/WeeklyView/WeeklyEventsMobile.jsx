import { useDateContext } from "../../hooks/useDateContext"
import { useModalContext } from "../../hooks/useModalContext";

export default function DisplayWeeklyEvents({ events, setViewEventId }) {
  const { convertToMeridian } = useDateContext()
  const {setModalView} = useModalContext()

  // click event => change view id => view event
  function openEvent(id) {
    setViewEventId(id);
    setModalView('view-event');
  }

  return (
    <div className="weekday">
      {events.map((e, i) => (
        <div className="mobile-event" key={i} onClick={() => openEvent(e.id)}>
          <h4>{e.name}</h4>
          <p>{convertToMeridian(e.startTime)}</p>
        </div>
      ))}
    </div>
  )
}