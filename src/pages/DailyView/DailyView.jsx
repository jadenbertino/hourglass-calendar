import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import {
  convertToHours,
  formatDate,
  getDayOfMonth,
  getDayOfWeek,
  getMonthName,
} from '../../utils/DateUtils';
import { getEventById } from '../../utils/EventUtils';

// components
import DisplayDayEvents from '../../components/DisplayDayEvents';
import HoursList from '../../components/HoursList';
import Nav from '../../components/Nav';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEventModal from '../../components/modals/ViewEventModal';

// styles
import './Daily.css';

export default function DailyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { dateContext, incrementDateBy, decrementDateBy } = useDateContext();
  const { modalContext } = useModalContext();
  const [todayEvents, setTodayEvents] = useState([]);
  const { events: allEvents } = useCollection('events', user && user.uid);
  const [navDate, setNavDate] = useState('');

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user, nav]);

  useEffect(() => {
    // change date on nav
    const weekday = getDayOfWeek(dateContext);
    const dayOfMonth = getDayOfMonth(dateContext);
    const month = getMonthName(dateContext);
    setNavDate(`${weekday}, ${month} ${dayOfMonth}`);
  }, [dateContext]);

  useEffect(() => {
    // get today's events
    if (!allEvents) return;
    setTodayEvents(allEvents
      .filter((event) => event.date === formatDate(dateContext))
      .sort((eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime)
      )
    );
  }, [allEvents, dateContext])

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(1)}
        decrementDate={() => decrementDateBy(1)}
        dateToDisplay={navDate}
      />
      
      <main>
        <section id='daily'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='times-and-events'>
                  <HoursList />
                  <div className='events'>
                    <DisplayDayEvents events={todayEvents} />
                  </div>
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
    </>
  );
}
