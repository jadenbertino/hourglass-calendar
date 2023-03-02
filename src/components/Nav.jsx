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
  const { dateContext, resetDateToToday } = useDateContext();
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

  useEffect(() => {
    // Formats like so: February 2023
    const month = monthNames[dateContext.getMonth()];
    const year = dateContext.getFullYear();
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
    <nav className="container">
      <div className="date">
        <div className="month-and-year-wrapper" onClick={resetDateToToday}>
          <h3>{monthAndYear}</h3>
        </div>
        <div className="nav-date-btns">
          <button className="btn change-date-btn" onClick={decrementDate}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button className="btn change-date-btn" onClick={incrementDate}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
          <button className="btn reset-date-btn" onClick={resetDateToToday}>
            Today
          </button>
        </div>
      </div>
      {!user ? (
        <div className="auth">
          <button className="btn" onClick={() => setModalContext('signin')}>
            Sign In
          </button>
          <button className="btn" onClick={() => setModalContext('signup')}>
            Sign Up
          </button>
          {modalContext === 'signin' && <SignInModal />}
          {modalContext === 'signup' && <SignUpModal />}
        </div>
      ) : (
        <div className="set-view-and-signout">
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
    </nav>
  );
}
