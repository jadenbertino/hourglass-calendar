
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDateContext } from '../hooks/useDateContext';
import { useModalContext } from '../hooks/useModalContext';

// components
import HoursGrid from '../components/HoursGrid';
import Nav from '../components/Nav';
import NewEventModal from '../components/NewEventModal';
import Sidebar from '../components/Sidebar';
import DisplayEvents from '../components/DisplayEvents';

// styles
import './Views.css';

export default function DailyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const {
    dateContext,
    incrementDateBy,
    decrementDateBy,
    formattedDate,
    resetDateToToday,
    getShortDayName
  } = useDateContext();
  const { modalContext } = useModalContext();

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events: allEvents } = useCollection('events', query);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(1)}
        decrementDate={() => decrementDateBy(1)}
      />
      <main>
        <Sidebar />
        <section id="daily-view">
          <header className="date-wrapper">
            <div className="date" onClick={resetDateToToday}>
              <h3 className="day-of-week">{getShortDayName(dateContext)}</h3>
              <h2 className="day-of-month">{dateContext.getDate()}</h2>
            </div>
          </header>
          <div className="times-and-events">
            <HoursGrid />
            <DisplayEvents targetDate={formattedDate} allEvents={allEvents} />
          </div>
        </section>
        {modalContext === 'newEvent' && <NewEventModal />}
      </main>
    </>
  );
}

/*
  <= 30m
    title only
    padding
  <= 60m
    title only
    padding
  <= 120m
    
*/
