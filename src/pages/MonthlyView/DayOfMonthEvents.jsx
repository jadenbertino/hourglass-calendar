import { useEffect, useState } from 'react';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';

export default function DayOfMonthEvents({ events, setViewEventId, numVisibleEvents, setViewEvents }) {
  const { convertToMeridian } = useDateContext();
  const { setModalContext } = useModalContext();
  const [visibleEvents, setVisibleEvents] = useState([])
  const [hiddenEvents, setHiddenEvents] = useState([])

  function openEvent(id) {
    setViewEventId(id);
    setModalContext('view-event');
  }

  function viewAllEvents() {
    setModalContext('view-day-of-month')
    setViewEvents(events)
  }

  useEffect(() => {
    if (numVisibleEvents === 0) {
      setVisibleEvents([])
      setHiddenEvents([])
      return
    }

    if (events.length <= numVisibleEvents) {
      setVisibleEvents(events)
      setHiddenEvents([])
    }
    
    // overflow events
    else {
      setVisibleEvents(events.slice(0, numVisibleEvents - 1))
      setHiddenEvents(events.slice(numVisibleEvents - 1))
    }
  }, [events])

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


  // const visibleEvents = !events || numVisibleEvents === 0 ? null :
  //   events.length <= numVisibleEvents ? events : events.slice(0, numVisibleEvents - 1)
  // const hiddenEvents = !events || numVisibleEvents === 0 ? null :
  //   events.length > numVisibleEvents ? events.slice(numVisibleEvents - 1) : null
  // numVisibleEvents !== 0 && events.length <= numVisibleEvents ? events : events.slice(0, numVisibleEvents - 1)

  // const hiddenEvents = events.slice(numVisibleEvents !== 0 ? numVisibleEvents - 1 : events.length)

  return (
    <>
      {visibleEvents && visibleEvents.map((e, i) => (
        <div className="monthly-event" key={i} onClick={() => openEvent(e.id)}>
          <div className="color-dot"></div>
          <span className="time">{convertToMeridian(e.startTime)}</span>
          <span className="name">{e.name}</span>
        </div>
      ))}
      {hiddenEvents.length ? <p onClick={viewAllEvents}>{hiddenEvents.length} more</p> : null}
    </>
  );
}