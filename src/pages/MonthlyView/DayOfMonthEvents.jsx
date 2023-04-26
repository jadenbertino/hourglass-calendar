import { useEffect, useState } from 'react';
import { convertToMeridian } from '../../utils/DateUtils'
import { useModalContext } from '../../hooks/useModalContext';

export default function DayOfMonthEvents({ events, numVisibleEvents }) {
  const { setModalContext } = useModalContext();
  const [visibleEvents, setVisibleEvents] = useState([])
  const [hiddenEvents, setHiddenEvents] = useState([])

  function viewAllEvents() {
    setModalContext({
      view: 'view-day-of-month',
      payload: events
    })
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
  }, [events, numVisibleEvents])

  return (
    <>
      {visibleEvents && 
        <div className="events-wrapper">
          {visibleEvents.map((e, i) => (
            <div className="monthly-event" key={i} onClick={() => setModalContext({view: "view-event", payload: e.id})}>
              <div className="color-dot"></div>
              <span className="time">{convertToMeridian(e.startTime)}</span>
              <span className="name">{e.name}</span>
            </div>
          ))}
          {hiddenEvents.length ? <p className="hidden-events" onClick={viewAllEvents}>{hiddenEvents.length} more</p> : null}
        </div>
      }
    </>
  );
}