import { useEffect, useRef, useState } from 'react';
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

// styles
import DisplayEvents from '../components/DisplayEvents';
import './DailyView.css';

export default function DailyView() {
  const { user } = useAuthContext();
  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  // set date + query events for date
  const {
    incrementDateBy,
    decrementDateBy,
    dayName,
    dayOfMonth,
    formattedDate,
    resetDateToToday
  } = useDateContext();
  const { modalContext } = useModalContext();
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
        <div className="daily-view">
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
