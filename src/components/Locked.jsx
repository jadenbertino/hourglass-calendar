import { useModalContext } from '../hooks/useModalContext';

// styles
import './Locked.css';

export default function Locked({ setModalActive }) {
  const { setModalContext } = useModalContext()

  return (
    <div className="content-locked">
      <i className="fa-solid fa-lock"></i>
      <h1>Please sign in to access this content</h1>
      <div className="btns-wrapper">
        <button className="btn" onClick={() => setModalContext('signin')}>Sign In</button>
        <button className="btn" onClick={() => setModalContext('signup')}>Sign Up</button>
      </div>
    </div>
  );
}
