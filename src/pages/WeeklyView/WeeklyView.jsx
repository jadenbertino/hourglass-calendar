import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import { useWindowSize } from '../../hooks/useWindowSize'

// components
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEvent from '../../components/modals/ViewEvent';
import Nav from '../../components/Nav';
import DisplayWeeklyEvents from './DisplayWeeklyEvents';
import HoursList from '../../components/HoursList';
import DisplayEvents from '../../components/DisplayEvents';

// styles
import '../Views.css';

export default function WeeklyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const {
    dateContext,
    getShortDayName,
    incrementDateBy,
    decrementDateBy,
    formatDate,
    resetDateToToday,
    convertToHours,
    getWeek,
    getDayOfWeek,
    getMonthName,
    getDayOfMonth,
    getYear
  } = useDateContext();
  const {width: windowWidth} = useWindowSize()
  console.log(windowWidth)
  const { modalContext } = useModalContext();
  const [week, setWeek] = useState([]);
  const [viewEventId, setViewEventId] = useState('');
  const [navDate, setNavDate] = useState('');

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  // change dates
  useEffect(() => {
    setWeek(getWeek(dateContext));
  }, [dateContext]);

  // update nav display
  useEffect(() => {
    if (week.length !== 7) return;
    // 13 - 19 June, 2022
    const dateStart = getDayOfMonth(week[0]);
    const dateEnd = getDayOfMonth(week[6]);

    const monthStart = getMonthName(week[0]);
    const monthEnd = getMonthName(week[6]);

    const yearStart = getYear(week[0]);
    const yearEnd = getYear(week[6]);

    const weekStart = `${monthStart} ${dateStart}${
      yearStart !== yearEnd ? ' ' + yearStart : ''
    }`;
    const weekEnd = `${
      monthStart !== monthEnd ? monthEnd + ' ' : ''
    }${dateEnd}, ${yearEnd}`;
    const fullWeek = `${weekStart} - ${weekEnd}`;
    setNavDate(fullWeek);
  }, [week]);

  function getEvents(date) {
    const formattedDate = formatDate(date);
    return allEvents
      .filter(event => event.date === formattedDate)
      .sort(
        (eventA, eventB) =>
          convertToHours(eventA.startTime) - convertToHours(eventB.startTime)
      );
  }

  function getEvent(id) {
    return allEvents.find(e => e.id === id);
  }

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events: allEvents } = useCollection('events', query);

  return (
    <>
      <div className="sticky">
        <Nav
          incrementDate={() => incrementDateBy(7)}
          decrementDate={() => decrementDateBy(7)}>
          <h3>{navDate}</h3>
        </Nav>
        <div className="container">
          <div className="row">
            <div className="col">
                <header className="date-wrapper weekly">
                  {week.map((date, i) => (
                    <div className="date" key={i}>
                      <h3 className="day-of-week">{getShortDayName(date)}</h3>
                      <h2>{date.getDate()}</h2>
                    </div>
                  ))}
                </header>
            </div>
          </div>
        </div>
      </div>
      <main>
        <section id="weekly">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="weekly-events">
                  <HoursList />
                  <div className="events">
                    {week &&
                      allEvents &&
                      week.map((date, i) => (
                        <DisplayEvents
                          events={getEvents(date)}
                          key={i}
                          setViewEventId={setViewEventId}
                        />
                      ))}
                  </div>
                </div>
                {/* <div className="weekly-events mobile">
                  <div className="date-sidebar">
                    {week.map((date, i) => (
                      <div className="date" key={i}>
                        <h3 className="day-name">{getShortDayName(date)}</h3>
                        <h2>{date.getDate()}</h2>
                      </div>
                    ))}
                  </div>
                  <DisplayWeeklyEvents weekDates={week}/>
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </main>
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
    </>
  );
}
