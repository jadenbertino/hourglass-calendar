import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';

// components
import DisplayEvents from '../../components/DisplayEvents';
import HoursList from '../../components/HoursList';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEvent from '../../components/modals/ViewEvent';
import Nav from '../../components/Nav';
import DayOfMonthEvents from './DayOfMonthEvents';

// styles
import '../Views.css';
import AllEventsModal from './AllEventsModal';

export default function MonthlyView() {
  const [weekDates, setWeekDates] = useState(null);
  const [monthDates, setMonthDates] = useState(null);
  const { user } = useAuthContext();
  const { modalContext } = useModalContext();
  const {
    incrementDateBy,
    decrementDateBy,
    convertToHours,
    formatDate,
    dateContext,
    getMonth,
    getMonthName,
    getWeek,
    resetDateToToday,
    getShortDayName
  } = useDateContext();
  const [viewEventId, setViewEventId] = useState('');
  const [viewEvents, setViewEvents] = useState({});
  const daySizeRef = useRef(null);
  const [numVisibleEvents, setNumVisibleEvents] = useState(0);

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events } = useCollection('events', query);

  useEffect(() => {
    const daySize = daySizeRef.current;
    if (!daySize) return;

    const observer = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect;
      const eventsHeight = height - 26 + 4; // 26 is height of date header, 4 accounts for bottom magin of events
      const numEvents = Math.floor(eventsHeight / 22); // 22 is height of each event
      setNumVisibleEvents(numEvents);
    });
    observer.observe(daySize);

    return () => observer.unobserve(daySize);
  }); // for some reason the daySizeRef wasn't triggering an update so I run this on every render ig

  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  function getEvents(date) {
    const formattedDate = formatDate(date);
    return events
      .filter(event => event.date === formattedDate)
      .sort(
        (eventA, eventB) =>
          convertToHours(eventA.startTime) - convertToHours(eventB.startTime)
      );
  }

  function getEvent(id) {
    return events.find(e => e.id === id);
  }

  useEffect(() => {
    setWeekDates(getWeek(dateContext));
    setMonthDates(getMonth(dateContext));
  }, [dateContext]);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(28)}
        decrementDate={() => decrementDateBy(28)}
      />
      <main>
        <section id="monthly">
          <div className="container">
            <div className="row">
              <div className="col">
                <header className="date-wrapper weekday-names">
                  {weekDates &&
                    weekDates.map((date, i) => (
                      <h3
                        className="date day-name"
                        key={i}>
                        {getShortDayName(date)}
                      </h3>
                    ))}
                </header>
                <div className="monthly-events">
                  {events &&
                    monthDates &&
                    monthDates.map((date, i) => (
                      <div
                        className="day"
                        key={i}
                        ref={i === 0 ? daySizeRef : null}>
                        <div className="day-wrapper">
                          <p className="day-number">
                            {date.getDate() !== 1
                              ? date.getDate()
                              : `${getMonthName(date)} ${date.getDate()}`}
                          </p>
                          <DayOfMonthEvents
                            events={getEvents(date)}
                            setViewEventId={setViewEventId}
                            setViewEvents={setViewEvents}
                            numVisibleEvents={numVisibleEvents}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                {modalContext === 'newEvent' && <NewEventModal />}
                {modalContext === 'view-event' && (
                  <ViewEvent event={getEvent(viewEventId)} />
                )}
                {modalContext === 'edit-event' && (
                  <NewEventModal eventToEdit={getEvent(viewEventId)} />
                )}
                {modalContext === 'confirm-delete' && (
                  <ConfirmDeleteModal id={viewEventId} />
                )}
                {modalContext === 'view-day-of-month' && (
                  <AllEventsModal events={viewEvents} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
