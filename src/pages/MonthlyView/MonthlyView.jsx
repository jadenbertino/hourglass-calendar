import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';

// components
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEvent from '../../components/modals/ViewEvent';
import Nav from '../../components/Nav';
import DayOfMonthEvents from './DayOfMonthEvents';
import HiddenEventsModal from '../../components/modals/MonthlyHiddenEvents';

// styles
import '../Views.css';

export default function MonthlyView() {
  const { user } = useAuthContext();
  const { modalContext } = useModalContext();
  const {
    checkIfIsToday,
    dateContext,
    getMonth,
    getEvents,
    getMonthName,
    getYear,
    incrementMonth,
    decrementMonth,
    getStartOfMonth,
    getStartOfWeek
  } = useDateContext();
  const [viewEvents, setViewEvents] = useState({});
  const daySizeRef = useRef(null); // to set number of events displayed per day
  const [numVisibleEvents, setNumVisibleEvents] = useState(0);
  const [navDate, setNavDate] = useState('');
  const [monthDates, setMonthDates] = useState(null);
  const [firstDate, setFirstDate] = useState(null);
  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // set date + query events for date
  const { events } = useCollection('events', user && user.uid);

  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  function getEvent(id) {
    return events.find(e => e.id === id);
  }

  // edit firstDate and monthDates anytime dateContext changes
  useEffect(() => {
    const startOfMonth = getStartOfMonth(dateContext);
    const firstDateToShow = getStartOfWeek(startOfMonth);
    setFirstDate(firstDateToShow);
    setMonthDates(getMonth(firstDateToShow));
  }, [dateContext]);

  // change navDate anytime firstDate changes
  useEffect(() => {
    if (!monthDates) return;
    const monthCounter = {};
    for (let date of monthDates) {
      const monthName = getMonthName(date);
      monthCounter[monthName] = (monthCounter[monthName] || 0) + 1;
    }

    let mostFrequentMonth;
    let maxCount = -Infinity;

    for (const [monthName, monthCount] of Object.entries(monthCounter)) {
      if (monthCount > maxCount) {
        mostFrequentMonth = monthName;
        maxCount = monthCount;
      }
    }

    // year of most frequent month
    let mostFrequentYear;
    for (let date of monthDates) {
      const monthName = getMonthName(date);
      if (monthName === mostFrequentMonth) {
        mostFrequentYear = getYear(date);
        break;
      }
    }

    setNavDate(`${mostFrequentMonth} ${mostFrequentYear}`);
  }, [firstDate]);

  // set number of events to display per day
  useEffect(() => {
    const daySize = daySizeRef.current;
    if (!daySize) return;

    const observer = new ResizeObserver(entries => {
      const { height } = entries[0].contentRect; // height of .day
      const eventsHeight = height - 34 + 4; // 34 is height of .day-number, but add 4 to cancel out last event margin
      const numEvents = Math.floor(eventsHeight / 22); // 22 is height of each event
      setNumVisibleEvents(numEvents);
    });
    observer.observe(daySize);

    return () => observer.unobserve(daySize);
  }); // for some reason the daySizeRef wasn't triggering an update so I run this on every render ig

  return (
    <>
      <div className="sticky-wrapper monthly-view">
        <Nav
          incrementDate={incrementMonth}
          decrementDate={decrementMonth}
          dateToDisplay={navDate}>
          <div className="row">
            <div className="col date-wrapper monthly">
              {weekdayNames &&
                weekdayNames.map((dayname, i) => (
                  <h3 className="col-header" key={i}>
                    {dayname}
                  </h3>
                ))}
            </div>
          </div>
        </Nav>
      </div>
      <main>
        <section className="monthly">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="monthly-events">
                  {events &&
                    monthDates &&
                    monthDates.map((date, i) => (
                      <div
                        className="day"
                        key={i}
                        ref={i === 0 ? daySizeRef : null}>
                        <div className="day-wrapper">
                          <p
                            className={`day-number ${
                              checkIfIsToday(date) ? 'active' : ''
                            } ${date.getDate() === 1 ? 'month-start' : ''}`}>
                            {date.getDate() !== 1
                              ? date.getDate()
                              : `${getMonthName(date).slice(
                                  0,
                                  3
                                )} ${date.getDate()}`}
                          </p>
                          <DayOfMonthEvents
                            events={getEvents(date, events)}
                            setViewEvents={setViewEvents}
                            numVisibleEvents={numVisibleEvents}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                {modalContext.view === 'new-event' && <NewEventModal />}
                {modalContext.view === 'view-event' && (
                  <ViewEvent event={getEvent(modalContext.payload)} />
                )}
                {modalContext.view === 'edit-event' && (
                  <NewEventModal eventToEdit={getEvent(modalContext.payload)} />
                )}
                {modalContext.view === 'confirm-delete' && (
                  <ConfirmDeleteModal id={modalContext.payload} />
                )}
                {modalContext.view === 'view-day-of-month' && (
                  <HiddenEventsModal events={viewEvents} />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
