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
  getYear
} from '../../utils/DateUtils';

// components
import DisplayEvents from '../../components/DisplayEvents';
import HoursList from '../../components/HoursList';
import Nav from '../../components/Nav';
import ConfirmDeleteModal from '../../components/modals/ConfirmDeleteModal';
import NewEventModal from '../../components/modals/NewEventModal';
import ViewEvent from '../../components/modals/ViewEvent';
import DisplayWeeklyEvents from './WeeklyEventsMobile';

// styles
import './Weekly.css';

export default function WeeklyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const { dateContext, incrementDateBy, decrementDateBy } = useDateContext();
  const { modalContext } = useModalContext();
  const [weekDates, setWeekDates] = useState([]);
  const [navDate, setNavDate] = useState('');

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user, nav]);

  // change week upon dateContext change
  useEffect(() => {
    const monday = getStartOfWeek(dateContext);
    const newWeekDates = getWeek(monday);
    setWeekDates(newWeekDates);
  }, [dateContext]);

  // update nav display, formatted like so: 13 - 19 June, 2022
  useEffect(() => {
    if (weekDates.length !== 7) return;
    const dateStart = getDayOfMonth(weekDates[0]);
    const dateEnd = getDayOfMonth(weekDates[6]);

    const monthStart = getMonthName(weekDates[0]);
    const monthEnd = getMonthName(weekDates[6]);

    const yearStart = getYear(weekDates[0]);
    const yearEnd = getYear(weekDates[6]);

    const weekStart = `${monthStart} ${dateStart}${
      yearStart !== yearEnd ? ' ' + yearStart : ''
    }`;
    const weekEnd = `${
      monthStart !== monthEnd ? monthEnd + ' ' : ''
    }${dateEnd}, ${yearEnd}`;
    const fullWeek = `${weekStart} - ${weekEnd}`;
    setNavDate(fullWeek);
  }, [weekDates]);

  function getEvent(id) {
    return allEvents.find(e => e.id === id);
  }

  const { events: allEvents } = useCollection('events', user && user.uid);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(7)}
        decrementDate={() => decrementDateBy(7)}
        dateToDisplay={navDate}>
        <div className="row weekly desktop">
          <header className="col date-wrapper">
            {weekDates.map((date, i) => (
              <div
                className={`col-header ${checkIfIsToday(date) ? 'active' : ''}`}
                key={i}>
                <h3 className="day-of-week">{getShortDayName(date)}</h3>
                <h2>{date.getDate()}</h2>
              </div>
            ))}
          </header>
        </div>
      </Nav>
      <main>
        <section id="weekly">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="weekly-view desktop">
                  <HoursList />
                  <div className="events">
                    {weekDates &&
                      allEvents &&
                      weekDates.map((date, i) => (
                        <DisplayEvents
                          events={getEvents(date, allEvents)}
                          key={i}
                        />
                      ))}
                  </div>
                </div>
                <div className="weekly-view mobile">
                  <div className="date-sidebar">
                    {weekDates.map((date, i) => (
                      <div className="date" key={i}>
                        <h3 className="day-name">{getShortDayName(date)}</h3>
                        <h2 className="day-number">{date.getDate()}</h2>
                      </div>
                    ))}
                  </div>
                  <div className="events">
                    {weekDates &&
                      allEvents &&
                      weekDates.map((day, i) => {
                        return (
                          <DisplayWeeklyEvents
                            events={getEvents(day, allEvents)}
                            key={i}
                          />
                        );
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
