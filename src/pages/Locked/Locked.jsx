import {useAuthContext} from "../../hooks/useAuthContext"
import { useModalContext } from '../../hooks/useModalContext';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// components
import SignInModal from "../../components/SignInModal";
import SignUpModal from "../../components/SignUpModal";
import Nav from "../../components/Nav";

// styles
import './Locked.css'

export default function Locked() {
  const nav = useNavigate()
  const { user } = useAuthContext()
  const { modalContext, setModalContext } = useModalContext()
  
  // if signed in then redirect to daily view
  useEffect(() => {
    if (user) {
      nav('/daily')
    }
  }, [user])
  
  return (<>
    <Nav />
    <main>
      <div className="content-locked">
        <i className="fa-solid fa-lock"></i>
        <h1>Please sign in to access this content</h1>
        <div className="btns-wrapper">
          <button className="btn" onClick={() => setModalContext('signin')}>Sign In</button>
          <button className="btn" onClick={() => setModalContext('signup')}>Sign Up</button>
        </div>
      </div>
    </main>
    {modalContext === 'signin' && <SignInModal/>}
    {modalContext === 'signup' && <SignUpModal/>}
  </>)
}