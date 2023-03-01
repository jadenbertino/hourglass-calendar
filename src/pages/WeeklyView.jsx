import { useEffect, useState, useRef } from 'react';
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
import './Views.css'

export default function WeeklyView() {
  const { user } = useAuthContext()
  const nav = useNavigate()
  const {
    dateContext,
    getShortDayName,
    incrementDateBy,
    decrementDateBy,
    formattedDate,
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
    setWeek(getWeek(dateContext))
  }, [dateContext])

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
            <HoursGrid />
            <DisplayEvents targetDate={formattedDate} allEvents={allEvents} />
          </div>
        </section>
        {modalContext === 'newEvent' && <NewEventModal />}
      </main>
    </>
  )
}