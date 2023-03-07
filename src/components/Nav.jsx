import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

export default function Nav({ children, decrementDate, incrementDate }) {
  const { modalContext, setModalContext } = useModalContext();
  const { dateContext, resetDateToToday, getWeek, getMonth } = useDateContext();
  const { user } = useAuthContext();
  const { signout } = useSignOut();
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
  const loc = useLocation().pathname;

  return (
    <div className="nav-wrapper">
      <nav>
        <div className="container">
          <div className="row">
            <div className="col">
              <button className="btn hamburger">
                <i className="fa-solid fa-bars"></i>
              </button>
              <div className="change-views">
                <Link to="/daily">
                  <button className="btn change-view-btn">Day</button>
                </Link>
                <Link to="/weekly">
                  <button className="btn change-view-btn">Week</button>
                </Link>
                <Link to="/monthly">
                  <button className="btn change-view-btn">Month</button>
                </Link>
              </div>
              <button
                className="btn new-event-btn"
                onClick={() => setModalContext('newEvent')}>
                <i className="fa-solid fa-plus"></i>
                <span className="new-event-text">New Event</span>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="date" onClick={resetDateToToday}>
                {children}
              </div>
              <div className="nav-date-btns">
                <button className="btn change-date-btn" onClick={decrementDate}>
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <button
                  className="btn reset-date-btn"
                  onClick={resetDateToToday}>
                  Today
                </button>
                <button className="btn change-date-btn" onClick={incrementDate}>
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
