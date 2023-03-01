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
import './WeeklyView.css'

export default function WeeklyView() {
  const { user } = useAuthContext()
  const nav = useNavigate()
  const {
    incrementDateBy,
    decrementDateBy,
    dayName,
    dayOfMonth,
    formattedDate,
    resetDateToToday
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
        incrementDate={() => incrementDateBy(7)}
        decrementDate={() => decrementDateBy(7)}
      />
      <main>
        <Sidebar />
        <div className="weekly-view">
          <div className="day-of-month">
            <div className="wrapper" onClick={resetDateToToday}>
              <h3>{dayName}</h3>
              <h2>{dayOfMonth}</h2>
            </div>
          </div>
          <div className="times-and-events">
            <HoursGrid />
            <DisplayEvents targetDate={formattedDate} allEvents={allEvents} />
          </div>
        </div>
        {modalContext === 'newEvent' && <NewEventModal />}
      </main>
    </>
  )
}