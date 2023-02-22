import { useEffect, useState } from 'react'
import {useSignOut} from '../hooks/useSignOut'
import { SignInModal, SignUpModal } from './components'
import { useAuthContext } from '../hooks/useAuthContext'
import { useModalContext } from '../hooks/useModalContext'

// styles
import './Nav.css'

export default function Nav() {
  const [monthAndYear, setMonthAndYear] = useState('')
  const { modalContext, setModalContext } = useModalContext()
  const { user } = useAuthContext()
  const { signout } = useSignOut()

  useEffect(() => {
    const today = new Date()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[today.getMonth()]
    const year = today.getFullYear()
    setMonthAndYear(`${month} ${year}`)
  }, [])

  function handleSignOut() {
    signout()
    setModalContext('')
  }

  return (
    <nav className="container">
      <div className="row">
        <h3>{monthAndYear}</h3>
        <div className="auth">
          {!user ? (
            <>
              <button className="btn" onClick={() => setModalContext('signin')}>Sign In</button>
              <button className="btn" onClick={() => setModalContext('signup')}>Sign Up</button>
              {modalContext === 'signin' && <SignInModal />}
              {modalContext === 'signup' && <SignUpModal />}
            </>
          ) : (
            <>
              <span>Welcome, {user.displayName}</span>
              <button className="btn logout-btn" onClick={handleSignOut}>Log Out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}