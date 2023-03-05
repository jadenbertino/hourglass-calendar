import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSignOut } from '../hooks/useSignOut';
import SignInModal from './modals/SignInModal';
import SignUpModal from './modals/SignUpModal';

// context
import { useAuthContext } from '../hooks/useAuthContext';
import { useDateContext } from '../hooks/useDateContext';
import { useModalContext } from '../hooks/useModalContext';

// styles
import { useNavigate } from 'react-router-dom';
import './Nav.css';

export default function Nav({ decrementDate, incrementDate }) {
  const [monthAndYear, setMonthAndYear] = useState('');
  const { modalContext, setModalContext } = useModalContext();
  const { dateContext, resetDateToToday, getWeek, getMonth } = useDateContext();
  const { user } = useAuthContext();
  const { signout } = useSignOut();
  const path = useLocation().pathname;
  const [view, setView] = useState(path);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const nav = useNavigate();
  const loc = useLocation().pathname

  useEffect(() => {
    // Formats like so: February 2023
    const startMonth = monthNames[dateContext.getMonth()];
    const year = dateContext.getFullYear();
    let month;

    if (loc === '/daily') {
      month = startMonth;
    }

    else if (loc === "/weekly") {
      const endMonth = monthNames[getWeek(dateContext)[6].getMonth()];
      month =
      startMonth === endMonth
        ? startMonth
        : `${startMonth.slice(0, 3)} — ${endMonth.slice(0, 3)}`;
    }

    else if (loc === "/monthly") {
      // display month with most number of days
      // 35 days per view so guaranteed to show two months
      const monthDates = getMonth(dateContext)
      const monthCounter = {}
      for (let date of monthDates) {
        const monthName = monthNames[date.getMonth()]
        monthCounter[monthName] = monthCounter[monthName] + 1 || 1
      }

      let mostFrequentMonth;
      let maxCount = -Infinity;

      for (const [monthName, monthCount] of Object.entries(monthCounter)) {
        if (monthCount > maxCount) {
          mostFrequentMonth = monthName
          maxCount = monthCount
        }
      }
      month = mostFrequentMonth;
    }

    setMonthAndYear(`${month} ${year}`);

  }, [dateContext]);

  function handleSignOut() {
    signout();
    setModalContext('');
  }

  useEffect(() => {
    nav(view);
  }, [view]);

  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col">

            <div className="date">
              <div className="nav-date-btns">
                <button
                  className="btn reset-date-btn"
                  onClick={resetDateToToday}>
                  Today
                </button>
                <button className="btn change-date-btn" onClick={decrementDate}>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <button className="btn change-date-btn" onClick={incrementDate}>
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
              <div
                className="month-and-year-wrapper"
                onClick={resetDateToToday}>
                <h3>{monthAndYear}</h3>
              </div>
            </div>
            {!user ? (
              <div className="auth">
                <button
                  className="btn"
                  onClick={() => setModalContext('signin')}>
                  Sign In
                </button>
                <button
                  className="btn"
                  onClick={() => setModalContext('signup')}>
                  Sign Up
                </button>
                {modalContext === 'signin' && <SignInModal />}
                {modalContext === 'signup' && <SignUpModal />}
              </div>
            ) : (
              <div className="set-view-and-signout">
                <button
                  className="btn new-event-btn"
                  onClick={() => setModalContext('newEvent')}>
                  <i className="fa-solid fa-plus"></i>
                  New Event
                </button>
                <form className="set-view-form">
                  <select value={view} onChange={e => setView(e.target.value)}>
                    <option value="/daily">Daily</option>
                    <option value="/weekly">Weekly</option>
                    <option value="/monthly">Monthly</option>
                  </select>
                </form>
                <button className="btn logout-btn" onClick={handleSignOut}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
