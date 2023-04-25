import { useEffect, useState } from 'react';
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
    getDayOfMonth,
    convertToHours,
    getMonthName,
    getDayOfWeek
  } = useDateContext();
  const { modalContext } = useModalContext();
  const [todayEvents, setTodayEvents] = useState([]);
  const { events: allEvents } = useCollection('events', user && user.uid);
  const [navDate, setNavDate] = useState('')

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user, nav]);

  function getEvent(id) {
    return allEvents.find(e => e.id === id);
  }

  useEffect(() => {
    // change date on nav
    const weekday = getDayOfWeek(dateContext)
    const dayOfMonth = getDayOfMonth(dateContext)
    const month = getMonthName(dateContext)
    setNavDate(`${weekday}, ${month} ${dayOfMonth}`)

    // get today's events
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
  }, [dateContext, allEvents, convertToHours, formatDate, getDayOfMonth, getDayOfWeek, getMonthName]);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(1)}
        decrementDate={() => decrementDateBy(1)}
        dateToDisplay={navDate}/>
      <main>
        <section id="daily">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="times-and-events">
                  <HoursList />
                  <div className="events">
                    <DisplayEvents events={todayEvents}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
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
    </>
  );
}