import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useDateContext } from '../../hooks/useDateContext';
import { useModalContext } from '../../hooks/useModalContext';
import {
  checkIfIsToday,
  getDayOfMonth,
  getEvents,
  getMonthName,
  getShortDayName,
  getStartOfWeek,
  getWeek,
  getYear,
} from '../../utils/DateUtils';
import { getEventById } from '../../utils/EventUtils';

// components
import DisplayDayEvents from '../../components/DisplayDayEvents';
import HoursList from '../../components/HoursList';
import Nav from '../../components/Nav';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEventModal from '../../components/modals/ViewEventModal';
import DisplayWeeklyEvents from './WeeklyEventsMobile';

// styles
import './Weekly.css';

function getNavDisplay(weekDates) {
  // formats into a string like so: 13 - 19 June, 2022
  if (weekDates.length !== 7) return;
  const dateStart = getDayOfMonth(weekDates[0]);
  const dateEnd = getDayOfMonth(weekDates[6]);

  const monthStart = getMonthName(weekDates[0]);
  const monthEnd = getMonthName(weekDates[6]);

  const yearStart = getYear(weekDates[0]);
  const yearEnd = getYear(weekDates[6]);

  const weekStart = `${monthStart} ${dateStart}${yearStart !== yearEnd ? ' ' + yearStart : ''}`;
  const weekEnd = `${monthStart !== monthEnd ? monthEnd + ' ' : ''}${dateEnd}, ${yearEnd}`;
  const fullWeek = `${weekStart} - ${weekEnd}`;
  
  return fullWeek
}

export default function WeeklyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { dateContext, incrementDateBy, decrementDateBy } = useDateContext();
  const { modalContext } = useModalContext();
  const [weekDates, setWeekDates] = useState([]);
  const [navDate, setNavDate] = useState('');
  const { events: allEvents } = useCollection('events', user && user.uid);

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user, nav]);

  useEffect(() => {
    const monday = getStartOfWeek(dateContext);
    const weekDates = getWeek(monday);
    setWeekDates(weekDates);
    const navDisplay = getNavDisplay(weekDates)
    setNavDate(navDisplay);
  }, [dateContext]);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(7)}
        decrementDate={() => decrementDateBy(7)}
        dateToDisplay={navDate}
      >
        <div className='row weekly desktop'>
          <header className='col date-wrapper'>
            {weekDates.map((date, i) => (
              <div className={`col-header ${checkIfIsToday(date) ? 'active' : ''}`} key={i}>
                <h3 className='day-of-week'>{getShortDayName(date)}</h3>
                <h2>{date.getDate()}</h2>
              </div>
            ))}
          </header>
        </div>
      </Nav>
      <main>
        <section id='weekly'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='weekly-view desktop'>
                  <HoursList />
                  <div className='events'>
                    {weekDates &&
                      allEvents &&
                      weekDates.map((date, i) => (
                        <DisplayDayEvents events={getEvents(date, allEvents)} key={i} />
                      ))}
                  </div>
                </div>
                <div className='weekly-view mobile'>
                  <div className='date-sidebar'>
                    {weekDates.map((date, i) => (
                      <div className='date' key={i}>
                        <h3 className='day-name'>{getShortDayName(date)}</h3>
                        <h2 className='day-number'>{date.getDate()}</h2>
                      </div>
                    ))}
                  </div>
                  <div className='events'>
                    {weekDates &&
                      allEvents &&
                      weekDates.map((day, i) => {
                        return <DisplayWeeklyEvents events={getEvents(day, allEvents)} key={i} />;
                      })}
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
