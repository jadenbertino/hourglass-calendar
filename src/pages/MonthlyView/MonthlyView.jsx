import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import {
  checkIfIsToday,
  getEvents,
  getMonth,
  getMonthName,
  getStartOfMonth,
  getStartOfWeek,
  getYear,
} from '../../utils/DateUtils';
import { getEventById } from '../../utils/EventUtils';

// components
import Nav from '../../components/Nav';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEventModal from '../../components/modals/ViewEventModal';
import DayOfMonthEvents from './DayOfMonthEvents';
import HiddenEventsModal from './MonthlyHiddenEventsModal';

// styles
import './Monthly.css';

const SHORT_WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getMostFrequentMonth(dates) {
  let mostFrequentMonth;
  let maxCount = -Infinity;
  const monthCounter = {};
  for (const date of dates) {
    const monthName = getMonthName(date);
    monthCounter[monthName] = (monthCounter[monthName] || 0) + 1;
  }
  for (const [monthName, monthCount] of Object.entries(monthCounter)) {
    if (monthCount > maxCount) {
      mostFrequentMonth = monthName;
      maxCount = monthCount;
    }
  }
  return mostFrequentMonth
}

export default function MonthlyView() {
  const { user } = useAuthContext();
  const { modalContext } = useModalContext();
  const { dateContext, incrementMonth, decrementMonth } = useDateContext();
  const nav = useNavigate();

  const { events: allEvents } = useCollection('events', user && user.uid);
  const [monthDates, setMonthDates] = useState(null);
  const [navDate, setNavDate] = useState('');
  
  // to set number of events displayed per day
  const daySizeRef = useRef(null); 
  const [numVisibleEvents, setNumVisibleEvents] = useState(0);

  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user, nav]);

  useEffect(() => {
    const startOfMonth = getStartOfMonth(dateContext);
    const firstDateToShow = getStartOfWeek(startOfMonth);
    const monthDates = getMonth(firstDateToShow);
    setMonthDates(monthDates);

    const mostFrequentMonth = getMostFrequentMonth(monthDates)
    const mostFrequentYear = getYear(monthDates.find(date => getMonthName(date) === mostFrequentMonth))
    setNavDate(`${mostFrequentMonth} ${mostFrequentYear}`);
  }, [dateContext, setMonthDates]);

  // set number of events to display per day
  useEffect(() => {
    const daySize = daySizeRef.current;
    if (!daySize) return;

    const observer = new ResizeObserver((entries) => {
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
      <div className='sticky-wrapper monthly-view'>
        <Nav incrementDate={incrementMonth} decrementDate={decrementMonth} dateToDisplay={navDate}>
          <div className='row'>
            <div className='col date-wrapper monthly'>
              {SHORT_WEEKDAY_NAMES.map((dayname, i) => (
                <h3 className='col-header' key={i}>
                  {dayname}
                </h3>
              ))}
            </div>
          </div>
        </Nav>
      </div>
      <main>
        <section className='monthly'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='monthly-events'>
                  {allEvents && monthDates && monthDates.map((date, i) => (
                      <div className='day' key={i} ref={i === 0 ? daySizeRef : null}>
                        <div className='day-wrapper'>
                          <p
                            className={`day-number ${checkIfIsToday(date) ? 'active' : ''} ${
                              date.getDate() === 1 ? 'month-start' : ''
                            }`}
                          >
                            {date.getDate() !== 1
                              ? date.getDate()
                              : `${getMonthName(date).slice(0, 3)} ${date.getDate()}`}
                          </p>
                          <DayOfMonthEvents
                            events={getEvents(date, allEvents)}
                            numVisibleEvents={numVisibleEvents}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {modalContext.view === 'new-event' && <NewEventModal />}
      {modalContext.view === 'view-event' && (
        <ViewEventModal event={getEventById(allEvents, modalContext.payload)} />
      )}
      {modalContext.view === 'edit-event' && (
        <NewEventModal eventToEdit={getEventById(allEvents, modalContext.payload)} />
      )}
      {modalContext.view === 'confirm-delete' && <ConfirmDeleteModal id={modalContext.payload} />}
      {modalContext.view === 'view-day-of-month' && <HiddenEventsModal />}
    </>
  );
}
