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
import Nav from '../../components/Nav';

// styles
import ViewEvent from '../../components/modals/ViewEvent';
import '../Views.css';

export default function DailyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const {
    dateContext,
    incrementDateBy,
    decrementDateBy,
    formatDate,
    resetDateToToday,
    getShortDayName,
    convertToHours
  } = useDateContext();
  const { modalContext } = useModalContext();
  const [viewEventId, setViewEventId] = useState('');
  const [todayEvents, setTodayEvents] = useState([]);
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events: allEvents } = useCollection('events', query);

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  function getEvent(id) {
    return allEvents.find(e => e.id === id);
  }

  useEffect(() => {
    allEvents &&
      setTodayEvents(
        allEvents
          .filter(event => event.date === formatDate(dateContext))
          .sort(
            (eventA, eventB) =>
              convertToHours(eventA.startTime) -
              convertToHours(eventB.startTime)
          )
      );
  }, [dateContext, allEvents]);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(1)}
        decrementDate={() => decrementDateBy(1)}>
        <div className="container">
          <div className="row">
            <div className="col">
              <header className="date-wrapper day">
                <div className="date">
                  <h3 className="day-of-week">
                    {getShortDayName(dateContext)}
                  </h3>
                  <h2>{dateContext.getDate()}</h2>
                </div>
              </header>
            </div>
          </div>
        </div>
      </Nav>
      <main>
        <section id="daily">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="times-and-events">
                  <HoursList />
                  <div className="events">
                    <DisplayEvents
                      events={todayEvents}
                      setViewEventId={setViewEventId}
                    />
                  </div>
                </div>
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

/*
  <= 30m
    title only
    padding
  <= 60m
    title only
    padding
  <= 120m
    
*/
