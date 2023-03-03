import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';

export default function DayOfMonthEvents({ events, setViewEventId, numVisibleEvents }) {
  const { convertToMeridian } = useDateContext();
  const { setModalContext } = useModalContext();

  function openEvent(id) {
    setViewEventId(id);
    setModalContext('view-event');
  }
  
  /*
  NUM EVENTS TO SHOW PER DAY
  - get total height of day container (dayHeight)
  - dayHeight -= 26 (to account for date header)
  - (dayHeight + eventMargin) // (eventHeight + eventMargin) = numVisibleEvents
  - if events.length > numVisibleEvents
    - mainEvents = events.slice(0, numVisibileEvents - 1)
    - hiddenEvents = events.slice(numVisibleEvents - 1)
  - else 
    - render events
  */
  
  const visibleEvents = events.length <= numVisibleEvents ? events : events.slice(0, numVisibleEvents - 1)
  const hiddenEvents = events.slice(numVisibleEvents !== 0 ? numVisibleEvents - 1 : events.length)

  return (
    <>
      {visibleEvents && visibleEvents.map((e, i) => (
        <div className="monthly-event" key={i} onClick={() => openEvent(e.id)}>
          <div className="color-dot"></div>
          <span className="time">{convertToMeridian(e.startTime)}</span>
          <span className="name">{e.name}</span>
        </div>
      ))}
      {hiddenEvents.length ? <p>{hiddenEvents.length} more</p> : null}
    </>
  );
}