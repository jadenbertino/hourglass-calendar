import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useModalContext } from '../../hooks/useModalContext';

// components
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

// styles
import './Locked.css';

export default function Locked() {
  const nav = useNavigate();
  const { user } = useAuthContext();
  const { modalContext, setModalView } = useModalContext();

  // if signed in then redirect to daily view
  useEffect(() => {
    if (user) {
      nav('/daily');
    }
  }, [user, nav]);

  return (
    <>
      <main>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="content-locked">
                <i className="fa-solid fa-lock"></i>
                <h1>Please sign in to access this content</h1>
                <div className="btns-wrapper">
                  <button
                    className="btn"
                    onClick={() => setModalView('signin')}>
                    Sign In
                  </button>
                  <button
                    className="btn"
                    onClick={() => setModalView('signup')}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {modalContext.view === 'signin' && <SignInModal />}
      {modalContext.view === 'signup' && <SignUpModal />}
    </>
  );
}
