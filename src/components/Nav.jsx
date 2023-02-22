import { useEffect, useState } from 'react'
import {useSignOut} from '../hooks/useSignOut'
import { SignInModal, SignUpModal } from './components'
import { useAuthContext } from '../hooks/useAuthContext'

import './Nav.css'

export default function Nav() {
  const [monthAndYear, setMonthAndYear] = useState('')
  const [modalActive, setModalActive] = useState('')
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
    setModalActive('')
  }

  return (
    <nav className="container">
      <div className="row">
        <h3>{monthAndYear}</h3>
        <div className="auth">
          {!user ? (
            <>
              <button className="btn" onClick={() => setModalActive('signin')}>Sign In</button>
              {modalActive === 'signin' && <SignInModal setModalActive={setModalActive} />}
              <button className="btn" onClick={() => setModalActive('signup')}>Sign Up</button>
              {modalActive === 'signup' && <SignUpModal setModalActive={setModalActive} />}
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