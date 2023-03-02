import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCollection } from "../hooks/useCollection";
import { useDateContext } from "../hooks/useDateContext";
import { useModalContext } from "../hooks/useModalContext";

// components
import DisplayEvents from "../components/DisplayEvents";
import HoursList from "../components/HoursList";
import Nav from "../components/Nav";
import NewEventModal from "../components/NewEventModal";
import Sidebar from "../components/Sidebar";
import DayOfMonthEvents from "../components/DayOfMonthEvents";
import ViewEvent from "../components/ViewEvent";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

// styles
import "./Views.css";

export default function MonthlyView() {
  const [weekDates, setWeekDates] = useState(null);
  const [monthDates, setMonthDates] = useState(null);
  const { user } = useAuthContext();
  const { modalContext } = useModalContext();
  const {
    incrementDateBy,
    decrementDateBy,
    convertToHours,
    formatDate,
    dateContext,
    getMonth,
    getWeek,
    resetDateToToday,
    getShortDayName,
  } = useDateContext();
  const [viewEventId, setViewEventId] = useState('')

  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      nav("/");
    }
  }, [user]);

  function getEvents(date) {
    const formattedDate = formatDate(date);
    return events
      .filter((event) => event.date === formattedDate)
      .sort(
        (eventA, eventB) =>
          convertToHours(eventA.startTime) - convertToHours(eventB.startTime)
      );
  }

  function getEvent(id) {
    return events.find(e => e.id === id)
  }

  useEffect(() => {
    setWeekDates(getWeek(dateContext));
    setMonthDates(getMonth(dateContext));
  }, [dateContext]);

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events } = useCollection("events", query);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(30)}
        decrementDate={() => decrementDateBy(30)}
      />
      <main>
        <Sidebar />
        <section id="monthly">
          <header className="date-wrapper weekday-names">
            {weekDates &&
              weekDates.map((date, i) => (
                <h3
                  className="date day-name"
                  onClick={resetDateToToday}
                  key={i}
                >
                  {getShortDayName(date)}
                </h3>
              ))}
          </header>
          <div className="monthly-events">
            {events &&
              monthDates &&
              monthDates.map((date, i) => (
                <div className="day" key={i}>
                  <div className="day-wrapper">
                    <p className="day-number">{date.getDate()}</p>
                    <DayOfMonthEvents events={getEvents(date)} setViewEventId={setViewEventId} />
                  </div>
                </div>
              ))}
          </div>
        </section>
        {modalContext === "newEvent" && <NewEventModal />}
        {modalContext === 'view-event' && 
          <ViewEvent event={getEvent(viewEventId)} />
        }
        {modalContext === 'edit-event' &&
          <NewEventModal eventToEdit={getEvent(viewEventId)} />
        }
        {modalContext === 'confirm-delete' && 
          <ConfirmDeleteModal id={viewEventId} />
        } 
      </main>
    </>
  );
}
