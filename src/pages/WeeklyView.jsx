import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDateContext } from '../hooks/useDateContext';
import { useModalContext } from '../hooks/useModalContext';

// components
import DisplayEvents from '../components/DisplayEvents';
import HoursList from '../components/HoursList';
import Nav from '../components/Nav';
import NewEventModal from '../components/NewEventModal';
import Sidebar from '../components/Sidebar';

// styles
import './Views.css';

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
    getWeek
  } = useDateContext();
  const { modalContext } = useModalContext();
  const [week, setWeek] = useState([]);

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  useEffect(() => {
    setWeek(getWeek(dateContext));
  }, [dateContext]);

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events: allEvents } = useCollection('events', query);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(7)}
        decrementDate={() => decrementDateBy(7)}
      />
      <main>
        <Sidebar />
        <section id="weekly-view">
          <header className="date-wrapper">
            {week.map((date, i) => (
              <div className="date" onClick={resetDateToToday} key={i}>
                <h3 className="day-of-week">{getShortDayName(date)}</h3>
                <h2 className="day-of-month">{date.getDate()}</h2>
              </div>
            ))}
          </header>
          <div className="times-and-events">
            <HoursList />
            <div className="events">
              {week && week.map((date, i) => (
                <DisplayEvents targetDate={formatDate(date)} allEvents={allEvents} key={i} />
              ))}
            </div>
          </div>
        </section>
        {modalContext === 'newEvent' && <NewEventModal />}
      </main>
    </>
  );
}
